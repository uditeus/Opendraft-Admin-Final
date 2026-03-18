import * as React from "react";

import type { ChatMessage, ChatPlanData, ChatThread, ComposerSurveyState, SurveyQuestion } from "@/components/chat/types";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  listProjects,
  createProject,
  deleteProject,
  appendMessage,
  listMessages,
  upsertDocument,
  getDocument,
  getProject,
  chatWithAI
} from "@/lib/supabase/api";
import {
  isCopyRequest,
  generateDocx,
  extractDocumentTitle
} from "@/lib/chat/docxService";
import { parseOpendraftResponse } from "@/lib/chat/opendraftParser";

export type WorkspaceDocPage = {
  id: string;
  title: string;
  content: string;
};

export type WorkspaceState = {
  pages: WorkspaceDocPage[];
  activePageId: string;
  highlightEnabled: boolean;
};

type ChatStore = {
  threads: ChatThread[];
  activeThreadId: string;
  setActiveThreadId: (id: string) => void;
  deleteThread: (id: string) => Promise<void>;
  patchThread: (id: string, updates: { title?: string, favorite?: boolean }) => Promise<void>;

  /**
   * Creates a new project in Supabase and returns the ID.
   */
  createThread: (playbookId?: string, title?: string) => Promise<string>;

  /**
   * Sends a message to Supabase and updates local state.
   */
  sendMessage: (threadId: string, role: "user" | "assistant", content: string) => Promise<void>;

  /**
   * Sends user message to AI via Edge Function and adds response.
   */
  submitMessage: (threadId: string, content: string, mode?: string, attachments?: any[]) => Promise<{ text: string, threadId: string }>;

  /**
   * Legacy updater for local state changes (e.g. streaming). 
   * CAUTION: Does not persist to Supabase automatically unless specific actions are taken.
   */
  updateThread: (id: string, updater: (t: ChatThread) => ChatThread) => void;

  upsertPlanMessage: (threadId: string, plan: ChatPlanData) => void;

  workspaces: Record<string, WorkspaceState | undefined>;
  getOrCreateWorkspace: (threadId: string) => WorkspaceState;
  setWorkspace: (threadId: string, updater: (ws: WorkspaceState) => WorkspaceState) => void;

  loadThreadData: (threadId: string) => Promise<void>;

  // Composer Survey
  activeSurvey: ComposerSurveyState | null;
  startSurvey: (questions: SurveyQuestion[], context?: any) => void;
  setSurveyAnswer: (questionId: string, answer: string | string[]) => void;
  nextSurveyPage: () => void;
  prevSurveyPage: () => void;
  closeSurvey: () => void;
  submitSurvey: (payload: { chatId: string, originalPrompt: string }) => Promise<void>;

  /**
   * Stop current generation for a thread.
   */
  stopGeneration: (threadId: string) => void;

  /**
   * Update feedback for a message.
   */
  updateMessageFeedback: (threadId: string, messageId: string, feedback: 'like' | 'dislike' | null) => Promise<void>;

  /**
   * Regenerate the last assistant response (removes it and re-submits the last user message).
   */
  regenerateLastResponse: (threadId: string) => Promise<void>;

  /**
   * Edit a user message and resend from that point (truncates messages after it).
   */
  editAndResend: (threadId: string, messageId: string, newContent: string) => Promise<void>;

  showRecents: boolean;
  setShowRecents: (show: boolean) => void;
};

const ChatStoreContext = React.createContext<ChatStore | null>(null);

function nowId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function ensureWorkspace(prev: Record<string, WorkspaceState | undefined>, threadId: string): WorkspaceState {
  const existing = prev[threadId];
  if (existing) return existing;
  const pageId = nowId();
  return {
    pages: [{ id: pageId, title: "Página 1", content: "" }],
    activePageId: pageId,
    highlightEnabled: false,
  };
}

export function ChatStoreProvider({ children }: { children: React.ReactNode }) {
  const { user, session, loading } = useAuth();
  const [threads, setThreads] = React.useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = React.useState<string>("");
  const [workspaces, setWorkspaces] = React.useState<Record<string, WorkspaceState | undefined>>({});
  const abortControllersRef = React.useRef<Record<string, AbortController>>({});

  const [showRecents, setInternalShowRecents] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const val = localStorage.getItem("opendraft_show_recents");
    return val === "true";
  });

  const setShowRecents = React.useCallback((show: boolean) => {
    setInternalShowRecents(show);
    localStorage.setItem("opendraft_show_recents", String(show));
  }, []);

  const stopGeneration = React.useCallback((threadId: string) => {
    const controller = abortControllersRef.current[threadId];
    if (controller) {
      controller.abort();
      delete abortControllersRef.current[threadId];
      // Also update typing state locally
      setThreads(prev => prev.map(t => {
        if (t.id !== threadId) return t;
        return {
          ...t,
          isTyping: false,
          messages: t.messages.map(m => {
            // Find the last assistant message and mark it as aborted
            if (m.role === 'assistant' && !m.metadata?.thoughtTimeMs) {
              return { ...m, metadata: { ...m.metadata, aborted: true } };
            }
            return m;
          })
        };
      }));
    }
  }, []);

  const deleteThread = React.useCallback(async (id: string) => {
    // Optimistic update
    setThreads(prev => prev.filter(t => t.id !== id));
    if (activeThreadId === id) {
      setActiveThreadId("");
    }

    try {
      await deleteProject(id);
    } catch (err) {
      console.error("Failed to delete project:", err);
      // Could revert here if needed, but simplistic for now
    }
  }, [activeThreadId]);

  const updateMessageFeedback = React.useCallback(async (threadId: string, messageId: string, feedback: 'like' | 'dislike' | null) => {
    setThreads(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      return {
        ...t,
        messages: t.messages.map(m => {
          if (m.id !== messageId) return m;
          return { ...m, metadata: { ...m.metadata, feedback } };
        })
      };
    }));

    // Persist to Supabase
    try {
      const { updateMessageMetadata } = await import("@/lib/supabase/api");
      // We need the latest metadata from the store state or re-calculate it.
      // Since we just updated it, we can fetch it but it's cleaner to just update the specific field in Supabase.
      // However updateMessageMetadata takes the WHOLE metadata object.
      // Let's find the message in the current threads state.
      setThreads(currentThreads => {
        const thread = currentThreads.find(t => t.id === threadId);
        const message = thread?.messages.find(m => m.id === messageId);
        if (message) {
          updateMessageMetadata(messageId, message.metadata);
        }
        return currentThreads;
      });
    } catch (err) {
      console.error("Failed to update feedback:", err);
    }
  }, []);

  // Load projects on mount / user change
  React.useEffect(() => {
    if (loading) return; // Don't clear state while auth is still re-validating

    if (!user) {
      setThreads([]);
      return;
    }

    listProjects(user.id).then(({ data, error }) => {
      if (data) {
        setThreads(prev => {
          // Merge DB data with any local optimistic state
          const mapped: ChatThread[] = (data as any[]).map((p) => {
            const existing = prev.find(t => t.id === p.id);
            return {
              id: p.id,
              title: p.title,
              messages: existing?.messages ?? [],
              // If it's already loaded OR currently loading, keep it as true/current
              messagesLoaded: existing?.messagesLoaded || false,
              favorite: p.is_favorite,
              updatedAt: p.updated_at,
            };
          });

          // Preserve any optimistic (new) threads not yet in DB
          const dbIds = new Set((data as any[]).map(p => p.id));
          const optimisticThreads = prev.filter(t => !dbIds.has(t.id));

          // Combine: optimistic first (they are the most recent), then DB results
          return [...optimisticThreads, ...mapped];
        });
      }
    });
  }, [user, loading]);

  // ... (State definitions)

  const getOrCreateWorkspace = React.useCallback(
    (threadId: string) => {
      let result: WorkspaceState | undefined;
      setWorkspaces((prev) => {
        const ws = ensureWorkspace(prev, threadId);
        result = ws;
        return prev[threadId] ? prev : { ...prev, [threadId]: ws };
      });
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return result!;
    },
    [setWorkspaces],
  );

  const setWorkspace = React.useCallback((threadId: string, updater: (ws: WorkspaceState) => WorkspaceState) => {
    setWorkspaces((prev) => {
      const base = ensureWorkspace(prev, threadId);
      const updated = updater(base);

      // Debounced save to Supabase? 
      // For now, let's just save. In production we need debounce.
      // We'll save the content of the active page (assuming single page document for V1 persistence)
      if (user) {
        const activePage = updated.pages.find(p => p.id === updated.activePageId);
        if (activePage) {
          upsertDocument(threadId, user.id, activePage.content);
        }
      }

      return { ...prev, [threadId]: updated };
    });
  }, [user]);

  // --- Survey Actions ---
  const [activeSurvey, setActiveSurvey] = React.useState<ComposerSurveyState | null>(null);

  const startSurvey = React.useCallback((questions: SurveyQuestion[], context?: any) => {
    setActiveSurvey({
      id: nowId(),
      questions,
      answers: {},
      currentQuestionIndex: 0,
      isOpen: true,
      isSubmitting: false,
      context
    });
  }, []);

  const setSurveyAnswer = React.useCallback((questionId: string, answer: string | string[]) => {
    setActiveSurvey((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        answers: { ...prev.answers, [questionId]: answer },
      };
    });
  }, []);

  const nextSurveyPage = React.useCallback(() => {
    setActiveSurvey((prev) => {
      if (!prev) return null;
      const nextIndex = prev.currentQuestionIndex + 1;
      if (nextIndex >= prev.questions.length) return prev;
      return { ...prev, currentQuestionIndex: nextIndex };
    });
  }, []);

  const prevSurveyPage = React.useCallback(() => {
    setActiveSurvey((prev) => {
      if (!prev) return null;
      const nextIndex = prev.currentQuestionIndex - 1;
      if (nextIndex < 0) return prev;
      return { ...prev, currentQuestionIndex: nextIndex };
    });
  }, []);

  const closeSurvey = React.useCallback(() => {
    setActiveSurvey(null);
  }, []);


  // Re-define interface to match implementation if I change it.
  // I will KEEP submitSurvey but make it just clear state for now, 
  // and I will update the implementation plan to handle submission in Composer.


  const loadThreadData = React.useCallback(async (threadId: string) => {
    if (!user) return;

    try {
      console.log("loadThreadData: Fetching for", threadId);
      const [messagesRes, projectRes, docRes] = await Promise.all([
        listMessages(threadId),
        getProject(threadId),
        getDocument(threadId)
      ]);

      if (messagesRes.error) console.error("listMessages error:", messagesRes.error);
      if (projectRes.error) console.error("getProject error:", projectRes.error);

      const messages = messagesRes.data || [];
      const project = projectRes.data;
      const doc = docRes.data;

      setThreads(prev => {
        let currentThreads = prev;
        const index = prev.findIndex(t => t.id === threadId);

        if (index === -1) {
          // If not in local state, add it now. 
          // Even if project fetch failed (null), we want to show a shell so UI doesn't hang.
          const p = project as any;
          const newThread: ChatThread = {
            id: threadId,
            title: p?.title || "Nova conversa",
            messages: [],
            messagesLoaded: true, // Mark as loaded so UI shows the empty state or allows interaction
            favorite: p?.is_favorite || false
          };
          currentThreads = [newThread, ...prev];
        }

        const loadedMessages = (messages as any[]).map(m => ({
          id: m.id,
          role: m.role as any,
          content: m.content,
          createdAt: new Date(m.created_at).getTime(),
          type: m.metadata?.type,
          data: m.metadata?.data,
          metadata: m.metadata,
        }));

        console.log(`loadThreadData: Found ${loadedMessages.length} messages for ${threadId}`);

        return currentThreads.map(t => {
          if (t.id !== threadId) return t;

          const hasTempMessages = t.messages.some(m => m.id.startsWith('temp-'));
          const isProbablyStreaming = t.isTyping || hasTempMessages;

          // If we are currently active (streaming or have unsaved local messages),
          // only update if DB has MORE messages than we have (excluding temp).
          // Actually, just don't overwrite if streaming.
          if (isProbablyStreaming) {
            console.log("loadThreadData: Streaming active, skipping message overwrite for", threadId);
            return { ...t, messagesLoaded: true };
          }

          const dbMessagesCount = loadedMessages.length;
          const localMessagesCount = t.messages.length;

          // Special case: if DB has no messages but we have local ones, 
          // they might be in the process of being saved.
          if (dbMessagesCount === 0 && localMessagesCount > 0) {
            return { ...t, messagesLoaded: true };
          }

          // Merge local temp messages that might not be in the DB yet
          const merged: any[] = [...loadedMessages];
          const tempMessages = t.messages.filter(m => m.id.startsWith('temp-'));
          tempMessages.forEach(temp => {
            const alreadyExists = merged.some(m => m.role === temp.role && m.content === temp.content);
            if (!alreadyExists) merged.push(temp);
          });

          return {
            ...t,
            messages: merged,
            messagesLoaded: true
          };
        });
      });

      if (doc) {
        const d = doc as any;
        setWorkspaces(prev => {
          const pageId = nowId();
          const existing = prev[threadId];
          const page1Id = existing?.pages[0]?.id || pageId;

          return {
            ...prev,
            [threadId]: {
              pages: [{ id: page1Id, title: "Página 1", content: d.content }],
              activePageId: page1Id,
              highlightEnabled: existing?.highlightEnabled ?? false
            }
          };
        });
      }
    } catch (err) {
      console.error("loadThreadData CRITICAL error:", err);
      // Fallback mark as loaded
      setThreads(prev => prev.map(t => t.id === threadId ? { ...t, messagesLoaded: true } : t));
    }
  }, [user]);

  /* Helper for ID generation */
  const generateId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : nowId();

  const submitMessage = React.useCallback(async (threadId: string, content: string, mode: string = "default", attachments: any[] = [], options?: { skipOptimisticUser?: boolean }) => {
    console.log("submitMessage called", { threadId, content, mode, attachments, options }); // DEBUG
    if (!user) throw new Error("User not authenticated");

    let actualThreadId = threadId;
    let isNewThread = false;

    // 0. Optimistic Creation: If no threadId, generate one and update store IMMEDIATELY
    if (!actualThreadId) {
      isNewThread = true;
      actualThreadId = generateId(); // Use UUID for DB compatibility

      // Create optimistic thread object
      const newThread: ChatThread = {
        id: actualThreadId,
        title: "Nova conversa", // Will be updated later
        messages: [],
        messagesLoaded: true,
        favorite: false
      };

      // Update Local State IMMEDIATELY
      setThreads((prev) => [newThread, ...prev]);
      setActiveThreadId(actualThreadId);

      // Ensure workspace exists
      getOrCreateWorkspace(actualThreadId);
    }

    // 1. Optimistic User Message (Show immediately) 
    // Also move this thread to the top of the list (like ChatGPT/Claude)
    const userMsgId = "temp-" + nowId();
    if (!options?.skipOptimisticUser) {
      setThreads(prev => {
        const updated = prev.map(t => {
          if (t.id !== actualThreadId) return t;
          return {
            ...t,
            messagesLoaded: true, // Crucial: protect this thread from loadThreadData overwrite
            messages: [...t.messages, {
              id: userMsgId,
              role: "user" as const,
              content,
              createdAt: Date.now(),
              attachments: attachments as any
            }]
          };
        });
        // Move active thread to the top
        const idx = updated.findIndex(t => t.id === actualThreadId);
        if (idx > 0) {
          const [moved] = updated.splice(idx, 1);
          return [moved, ...updated];
        }
        return updated;
      });
    }

    // 2. Optimistic Assistant Message (Empty initially)
    const isCopy = isCopyRequest(content) || mode === "write";
    const initialSteps: any[] = isCopy ? [
      { id: "analyze", label: "Analisando solicitação", status: "done" },
      { id: "content", label: "Redigindo conteúdo", status: "running" },
    ] : [];

    const assistantMsgId = "temp-" + nowId();
    setThreads(prev => prev.map(t => {
      if (t.id !== actualThreadId) return t;
      return {
        ...t,
        messages: [...t.messages, {
          id: assistantMsgId,
          role: "assistant" as const,
          content: "", // Start empty for streaming
          createdAt: Date.now(),
          metadata: isCopy ? { taskSteps: initialSteps } : {}
        }]
      };
    }));

    // NOW perform the network creation if needed
    if (isNewThread) {
      try {
        console.log("submitMessage: Creating project", actualThreadId);
        const { data: pData, error: pError } = await createProject(user.id, "Nova conversa", "chat", undefined, actualThreadId);
        if (pError) throw pError;
      } catch (err) {
        console.error("Failed to create project in background:", err);
        throw err;
      }
    }

    // NOTE: The Edge Function saves BOTH user and assistant messages server-side.
    // We do NOT save from the frontend to avoid duplicates.
    // The frontend uses optimistic UI (temp IDs) until the post-stream DB reload.

    // 3. Prepare History for Context
    const thread = threads.find(t => t.id === actualThreadId);
    const history = isNewThread ? [] : (thread ? (thread.messages as any[]).map(m => ({ role: m.role, content: m.content })) : []);

    // Add current user message to history
    history.push({ role: "user", content });

    // Set typing true IMMEDIATELY to protect optimistic messages
    setThreads(prev => prev.map(t => t.id === actualThreadId ? { ...t, isTyping: true, typingMode: mode } : t));

    try {
      // 4. Call Streaming API (Background)
      /* @ts-ignore */
      import("@/lib/chat/sendMessage").then(({ sendMessage }) => {
        const controller = new AbortController();
        abortControllersRef.current[actualThreadId] = controller;
        const startTime = Date.now();
        let firstChunkReceived = false;
        let thoughtTimeMsForDb: number | undefined;

        sendMessage(
          actualThreadId,
          history,
          mode, // mode
          (chunk) => {
            if (!firstChunkReceived) {
              firstChunkReceived = true;
              const thoughtTimeMs = Date.now() - startTime;
              thoughtTimeMsForDb = thoughtTimeMs;
              // Update assistant message with metadata
              setThreads(prev => prev.map(t => {
                if (t.id !== actualThreadId) return t;
                return {
                  ...t,
                  messages: t.messages.map(m => {
                    if (m.id === assistantMsgId) {
                      return { ...m, metadata: { ...m.metadata, thoughtTimeMs } };
                    }
                    return m;
                  })
                };
              }));
            }

            // Update UI with chunk
            setThreads(prev => prev.map(t => {
              if (t.id !== actualThreadId) return t;
              return {
                ...t,
                messages: t.messages.map(m => {
                  if (m.id === assistantMsgId) {
                    return { ...m, content: (m.content || "") + chunk };
                  }
                  return m;
                })
              };
            }));
          },
          controller.signal,
          session?.access_token || undefined
        ).then(async (fullText) => {
          // Stream complete - set typing false
          delete abortControllersRef.current[actualThreadId];
          setThreads(prev => prev.map(t => t.id === actualThreadId ? { ...t, isTyping: false } : t));

          // Parse for suggestions and other structured data
          const structured = parseOpendraftResponse(fullText);
          if (structured) {
            setThreads(prev => prev.map(t => {
              if (t.id !== actualThreadId) return t;
              return {
                ...t,
                messages: t.messages.map(m => {
                  if (m.id === assistantMsgId) {
                    return {
                      ...m,
                      metadata: {
                        ...m.metadata,
                        suggestions: structured.suggestions,
                        // Could also map other fields like stage, tasks etc if needed
                      }
                    };
                  }
                  return m;
                })
              };
            }));
          }

          // DOCX generation is now handled entirely by the backend skills system
          // the chat stream response will now correctly include the right document & taskSteps metadata

          // Wait a moment for the DB write to complete, then reload from DB
          try {
            await new Promise(r => setTimeout(r, 1500));
            console.log("Post-stream: Reloading messages from DB for thread", actualThreadId);
            const { listMessages } = await import("@/lib/supabase/api");
            const { data: dbMessages, error: loadError } = await listMessages(actualThreadId);

            if (loadError) {
              console.error("Post-stream: Failed to reload messages:", loadError);
            } else {
              let finalMessages = dbMessages || [];
              const { appendMessage: dbAppend } = await import("@/lib/supabase/api");

              // We look at the last few messages in the DB to avoid matching old identical messages.
              // If edge functions saved them, they will be the most recent ones.
              const recentDBMessages = finalMessages.slice(-3); // check last 3 to be safe
              const dbHasNewUser = recentDBMessages.some((m: any) => m.role === 'user' && m.content === content);
              const dbHasNewAssistant = recentDBMessages.some((m: any) => m.role === 'assistant' && m.content === fullText);

              if (!dbHasNewUser) {
                console.warn("Post-stream: User message missing from DB. Saving fallback.");
                await dbAppend(actualThreadId, user.id, "user", content, { mode });
              }
              if (!dbHasNewAssistant) {
                console.warn("Post-stream: Assistant message missing from DB. Saving fallback.");
                await dbAppend(actualThreadId, user.id, "assistant", fullText, { thoughtTimeMs: thoughtTimeMsForDb, mode });
              }

              // Reload if we added anything to ensure we have the correct IDs and order
              if (!dbHasNewUser || !dbHasNewAssistant) {
                const { data: reloaded } = await listMessages(actualThreadId);
                if (reloaded) finalMessages = reloaded;
              }

              console.log(`Post-stream: Final loaded ${finalMessages.length} messages`);
              setThreads(prev => prev.map(t => {
                if (t.id !== actualThreadId) return t;
                return {
                  ...t,
                  messages: (finalMessages as any[]).map(dbm => ({
                    id: dbm.id,
                    role: dbm.role as any,
                    content: dbm.content,
                    createdAt: new Date(dbm.created_at).getTime(),
                    metadata: {
                      ...dbm.metadata,
                      thoughtTimeMs: dbm.metadata?.thoughtTimeMs || (dbm.role === 'assistant' ? thoughtTimeMsForDb : undefined)
                    },
                    type: dbm.metadata?.type,
                    data: dbm.metadata?.data
                  }))
                };
              }));
            }
          } catch (err) {
            console.error("Post-stream: Exception during DB reload:", err);
          }
        }).catch((err) => {
          if (err.name === 'AbortError') {
            console.log("Generation aborted by user");
            return;
          }
          console.error("Streaming Error:", err);
          const errorDetail = err?.message || String(err);
          console.error("Error detail:", errorDetail);
          // Update assistant message to show error & stop typing
          setThreads(prev => prev.map(t => {
            if (t.id !== actualThreadId) return t;
            return {
              ...t,
              isTyping: false,
              messages: t.messages.map(m => {
                if (m.id === assistantMsgId) {
                  return {
                    ...m,
                    content: (m.content || "") + `\n\n[Erro: ${errorDetail}]`
                  };
                }
                return m;
              })
            };
          }));
        });
      });

      // 5. Generate Title if needed
      const currentThread = threads.find(t => t.id === actualThreadId);
      const titleNeedsFixing = currentThread && (
        currentThread.title === "Nova conversa" ||
        currentThread.title === "Mensagem Simples" ||
        currentThread.title.toLowerCase().includes("título") ||
        currentThread.title.toLowerCase().includes("curto:") ||
        currentThread.title.startsWith('"')
      );

      if (isNewThread || titleNeedsFixing) {
        console.log("submitMessage: Triggering title generation for", actualThreadId);
        /* @ts-ignore */
        import("@/lib/supabase/api").then(({ generateTitle, updateProject }) => {
          generateTitle(actualThreadId, content).then((title) => {
            console.log("submitMessage: Raw title received:", title);
            if (title) {
              const cleanTitle = title
                .replace(/^.*[:：]\s*/, "") // Remove tudo antes dos dois pontos
                .replace(/^["'«»“”„’‘]|["'«»“”„’‘\. ]+$/g, "") // Remove aspas e pontos
                .trim();

              console.log("submitMessage: Cleaned title:", cleanTitle);

              if (cleanTitle && cleanTitle.length > 1) {
                // Persist to DB
                updateProject(actualThreadId, { title: cleanTitle })
                  .then(({ error }) => {
                    if (error) console.error("submitMessage: Failed to persist title:", error);
                    else console.log("submitMessage: Title persisted to DB");
                  });

                // Update Local UI
                setThreads(prev => prev.map(t => t.id === actualThreadId ? { ...t, title: cleanTitle } : t));
              }
            }
          });
        });
      }

      // Return immediately for navigation
      return { text: "", threadId: actualThreadId };

    } catch (err) {
      console.error("Setup Error:", err);
      throw err;
    }
  }, [user, session, threads, getOrCreateWorkspace]);


  const submitSurvey = React.useCallback(async ({ chatId, originalPrompt }: { chatId: string, originalPrompt: string }) => {
    if (!activeSurvey) return;

    // Format Q&A
    const qaPairs = activeSurvey.questions.map(q => {
      const ans = activeSurvey.answers[q.id];
      const ansText = Array.isArray(ans) ? ans.join(", ") : ans;
      return "P: " + q.title + "\nR: " + (ansText || "(sem resposta)");
    }).join("\n---\n");

    const finalContent = originalPrompt + "\n\n[Contexto do usuário via Questionário]:\n" + qaPairs;

    // Close survey
    setActiveSurvey(null);

    // Call submitMessage to actually send and create thread if needed
    // This will trigger the ChatApp redirect logic via activeThreadId change
    await submitMessage(chatId, finalContent);

  }, [activeSurvey, submitMessage]);

  const createThread = React.useCallback(async (playbookId?: string, title: string = "Nova conversa") => {
    const newId = nowId();
    // We can optimistically add it or just return ID and let the first message create it?
    // The store seems to handle lazy creation if activeThreadId is set but not in threads list??
    // Actually submitMessage checks "if (!actualThreadId)".
    // If I redirect to /chat/:id, and then user types, submitMessage will take that ID?
    // WorkspacePage sets activeThreadId from URL.

    // Let's return the ID.
    return newId;
  }, []);

  const sendMessage = React.useCallback(async (threadId: string, role: "user" | "assistant", content: string) => {
    if (!user) return;

    // Optimistic update
    const tempId = nowId();
    setThreads(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      return {
        ...t,
        messages: [...t.messages, { id: tempId, role, content, createdAt: Date.now() }]
      };
    }));

    await appendMessage(threadId, user.id, role, content);

    // Re-fetch or update ID? For now optimistic is fine. 
    // Ideally we replace the temp message with the real one.
  }, [user]);

  const updateThread = React.useCallback((id: string, updater: (t: ChatThread) => ChatThread) => {
    setThreads((prev) => prev.map((t) => (t.id === id ? updater(t) : t)));
  }, []);

  const patchThread = React.useCallback(async (id: string, updates: { title?: string, favorite?: boolean }) => {
    // 1. Optimistic Update
    setThreads(prev => prev.map(t => {
      if (t.id !== id) return t;
      return {
        ...t,
        title: updates.title !== undefined ? updates.title : t.title,
        favorite: updates.favorite !== undefined ? updates.favorite : t.favorite,
      };
    }));

    // 2. Persist
    try {
      const { updateProject } = await import("@/lib/supabase/api");
      const payload: any = {};
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.favorite !== undefined) payload.is_favorite = updates.favorite;

      await updateProject(id, payload);
    } catch (err) {
      console.error("Failed to patch thread:", err);
      // Revert? For now, we assume success or user sees error if they reload.
    }
  }, []);

  const upsertPlanMessage = React.useCallback(
    (threadId: string, plan: ChatPlanData) => {
      // For now, this is local only. 
      // To persist, we'd need to save a message with metadata.
      updateThread(threadId, (t) => {
        const idx = [...t.messages].reverse().findIndex((m) => m.role === "assistant" && m.type === "plan");
        const realIdx = idx === -1 ? -1 : t.messages.length - 1 - idx;
        const planMessage: ChatMessage = {
          id: nowId(),
          role: "assistant",
          type: "plan",
          data: plan,
          content: "",
          createdAt: Date.now(),
        };

        if (realIdx === -1) {
          return { ...t, messages: [...t.messages, planMessage] };
        }

        const next = [...t.messages];
        next[realIdx] = { ...planMessage, id: next[realIdx].id };
        return { ...t, messages: next };
      });
    },
    [updateThread],
  );

  // --- Regenerate Last Response ---
  const regenerateLastResponse = React.useCallback(async (threadId: string) => {
    // Find the thread
    const thread = threads.find(t => t.id === threadId);
    if (!thread || thread.messages.length === 0) return;

    // Find the last user message
    const msgs = [...thread.messages];
    let lastUserIdx = -1;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === 'user') { lastUserIdx = i; break; }
    }
    if (lastUserIdx === -1) return;

    const userContent = msgs[lastUserIdx].content;

    // Save old assistant message content as a version
    const lastAssistantMsg = msgs.find((m, i) => i > lastUserIdx && m.role === 'assistant');

    // Remove all messages after and including the last assistant response
    const trimmed = msgs.slice(0, lastUserIdx + 1);
    setThreads(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      return { ...t, messages: trimmed };
    }));

    // Re-submit without adding a new user message bubble
    await submitMessage(threadId, userContent, 'default', [], { skipOptimisticUser: true });
  }, [threads, submitMessage]);

  // --- Edit & Resend ---
  const editAndResend = React.useCallback(async (threadId: string, messageId: string, newContent: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (!thread) return;

    const msgIdx = thread.messages.findIndex(m => m.id === messageId);
    if (msgIdx === -1) return;

    // Truncate everything after this message
    const trimmed = thread.messages.slice(0, msgIdx);
    setThreads(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      return { ...t, messages: trimmed };
    }));

    // Re-submit with edited content
    await submitMessage(threadId, newContent, 'default');
  }, [threads, submitMessage]);

  /* Duplicates removed */

  const value = React.useMemo<ChatStore>(
    () => ({
      threads,
      activeThreadId,
      setActiveThreadId,
      deleteThread,
      createThread,
      sendMessage,
      submitMessage,
      updateThread,
      patchThread,
      upsertPlanMessage,
      workspaces,
      getOrCreateWorkspace,
      setWorkspace,
      loadThreadData,
      activeSurvey,
      startSurvey,
      setSurveyAnswer,
      nextSurveyPage,
      prevSurveyPage,
      closeSurvey,
      submitSurvey,
      stopGeneration,
      updateMessageFeedback,
      regenerateLastResponse,
      editAndResend,
      showRecents,
      setShowRecents,
    }),
    [
      threads,
      activeThreadId,
      setActiveThreadId,
      deleteThread,
      createThread,
      sendMessage,
      submitMessage,
      updateThread,
      patchThread,
      upsertPlanMessage,
      workspaces,
      getOrCreateWorkspace,
      setWorkspace,
      loadThreadData,
      activeSurvey,
      startSurvey,
      setSurveyAnswer,
      nextSurveyPage,
      prevSurveyPage,
      closeSurvey,
      submitSurvey,
      stopGeneration,
      updateMessageFeedback,
      regenerateLastResponse,
      editAndResend,
      showRecents,
      setShowRecents
    ],
  );

  return <ChatStoreContext.Provider value={value}>{children}</ChatStoreContext.Provider>;
}

export function useChatStore() {
  const ctx = React.useContext(ChatStoreContext);
  if (!ctx) throw new Error("useChatStore must be used within ChatStoreProvider");
  return ctx;
}
