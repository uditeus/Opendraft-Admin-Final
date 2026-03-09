import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { apps as playbooksData } from "@/pages/apps/appsData";
import { AppIcon, createAppIcon } from "@/components/icons/AppIcon";

const FileText = createAppIcon("FileText");
const Lightbulb = createAppIcon("Lightbulb");
const CalendarClock = createAppIcon("CalendarClock");
const Search = createAppIcon("Search");

import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatThreadView } from "@/components/chat/ChatThreadView";
import { ChatTooltip } from "@/components/design-system/chat-tooltip";
import { Button } from "@/components/ui/button";
import type { ChatPlanData, QuestionnaireData } from "@/components/chat/types";
import { useChatStore } from "@/components/chat/store";
import { UserAvatarDropdown } from "@/components/chat/UserAvatarDropdown";
import { getHourlyHeadline } from "@/components/chat/time-prompts";
import { QUICK_PROMPTS, PILL_CONFIG } from "@/components/chat/quick-prompts";
import { QUESTIONNAIRES } from "@/components/chat/questionnaire-data";
import { useI18n } from "@/i18n/i18n";
import { cn } from "@/lib/utils";
import { GLOBAL_IMAGE_URL } from "@/lib/constants";
const defaultAvatar = GLOBAL_IMAGE_URL;
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { sounds } from "@/lib/audio/sounds";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { RenameProjectDialog } from "./RenameProjectDialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DocumentPreviewColumn } from "./DocumentPreviewColumn";
import { ChatOptionsDropdown } from "./ChatOptionsDropdown";
import { SelectionToolbar } from "./SelectionToolbar";
import { SuggestionPills } from "./SuggestionPills";
import { parseOpendraftResponse, getDisplaySuggestions } from "@/lib/chat/opendraftParser";

const seedAssistantPt = `Claro — posso ajudar com isso.\n\nAqui vai um exemplo com **Markdown**, listas e código:\n\n- Item 1\n- Item 2\n\n\`inline code\`\n\n\`\`\`ts\nexport function hello(name: string) {\n  return \`Olá, \${name}!\`\n}\n\`\`\``;

const seedAssistantEn = `Sure — I can help with that.\n\nHere is an example with **Markdown**, lists, and code:\n\n- Item 1\n- Item 2\n\n\`inline code\`\n\n\`\`\`ts\nexport function hello(name: string) {\n  return \`Hello, \${name}!\`\n}\n\`\`\``;

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function detectGuides(text: string): Array<"objective" | "audience" | "offer" | "angle" | "structure"> {
  const t = text.toLowerCase();
  const has = (re: RegExp) => re.test(t);
  const out = new Set<Array<"objective" | "audience" | "offer" | "angle" | "structure">[number]>();

  if (has(/\b(objetivo|meta|quero|preciso|converter|vender|resultado)\b/)) out.add("objective");
  if (has(/\b(p[úu]blico|persona|para\s+\w+|iniciante|b2b|b2c)\b/)) out.add("audience");
  if (has(/\b(oferta|desconto|cupom|pre[çc]o|plano|b[ôo]nus|garantia)\b/)) out.add("offer");
  if (has(/\b([âa]ngulo|posicionamento|tom|dor|benef[íi]cio|promessa)\b/)) out.add("angle");
  if (has(/\b(estrutura|aida|pas|hook|cta|headline|checklist|passo a passo)\b/)) out.add("structure");

  return Array.from(out);
}

function isCopyIntent(prompt: string): boolean {
  const t = prompt.toLowerCase();
  if (!t) return false;
  const has = (re: RegExp) => re.test(t);
  return (
    has(/\bcopy\b/) ||
    has(/escreve\s+uma?\s+copy/) ||
    has(/escrever\s+uma?\s+copy/) ||
    has(/anúncio|anuncio|headline|roteiro|script/) ||
    (has(/venda|converter|anúncios?/) && has(/texto|mensagem|copy/))
  );
}

function buildPlan(prompt: string): ChatPlanData {
  const p = prompt.trim();
  return {
    angle: pick([
      "Benefício direto",
      "Dor + alívio",
      "Prova + segurança",
      "Clareza + simplicidade",
    ]),
    structure: pick(["Hook → Dor → Oferta → Prova → CTA", "PAS", "AIDA", "Lista (3 pontos)"]),
    audience: /\b(b2b)\b/i.test(p)
      ? "Profissionais (B2B)"
      : /\b(m[ãa]es?)\b/i.test(p)
        ? "Mães"
        : "Público-alvo não especificado (sugestão: definir persona)",
    offer: /\b(cupom|desconto|pre[çc]o|plano|b[ôo]nus)\b/i.test(p)
      ? "Oferta mencionada no prompt"
      : "Oferta a definir (benefício + condição)",
    objective: /\b(vender|converter|leads?|cadastro)\b/i.test(p)
      ? "Conversão"
      : "Objetivo a definir (ex.: clarear proposta)",
    channel: /\b(instagram|ig)\b/i.test(p) ? "Instagram" : undefined,
  };
}


function getExt(name: string) {
  return name.slice((Math.max(0, name.lastIndexOf(".")) || Infinity) + 1).toUpperCase();
}

export function ChatApp() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    activeThreadId,
    setActiveThreadId,
    loadThreadData,
    threads,
    createThread,
    updateThread,
    upsertPlanMessage,
    sendMessage,
    submitMessage,
    deleteThread,
    patchThread
  } = useChatStore();
  const { tt } = useI18n();
  const { user } = useAuth();

  React.useEffect(() => {
    if (id) {
      if (id !== activeThreadId) setActiveThreadId(id);
      const thread = threads.find(t => t.id === id);
      if (!thread || !thread.messagesLoaded) loadThreadData(id);
    } else if (activeThreadId) {
      if (window.location.pathname === "/new" || window.location.pathname === "/chat") {
        setActiveThreadId("");
      }
    }
  }, [id, activeThreadId, threads, setActiveThreadId, loadThreadData]);

  const effectiveId = id || activeThreadId;
  const activeThread = threads.find(t => t.id === effectiveId);
  const messages = activeThread?.messages ?? [];
  const isLoaded = activeThread?.messagesLoaded ?? false;

  const isAtNewRoute = !id && (window.location.pathname === "/new" || window.location.pathname === "/chat");
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const [selectedAgent, setSelectedAgent] = React.useState<null | "write" | "explore" | "plan" | "analyze">(null);
  const [selectedStyle, setSelectedStyle] = React.useState<string | null>(null);
  const [questionnaire, setQuestionnaire] = React.useState<QuestionnaireData | null>(null);
  const [attachments, setAttachments] = React.useState<File[]>([]);
  const [hourlyHeadline, setHourlyHeadline] = React.useState("");
  const [currentHour, setCurrentHour] = React.useState(new Date().getHours());
  const [activePill, setActivePill] = React.useState<null | "write" | "ideas" | "plan" | "analyze">(null);
  const [selectedPlaybook, setSelectedPlaybook] = React.useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activationOrder, setActivationOrder] = React.useState<("style" | "pill" | "playbook" | "agent")[]>([]);

  React.useEffect(() => {
    const userName = user?.user_metadata?.name || user?.user_metadata?.full_name || null;
    setHourlyHeadline(getHourlyHeadline(userName));
  }, [user]);

  // Handle playbook selection from URL
  React.useEffect(() => {
    const playbookId = searchParams.get("playbook");
    if (playbookId && isAtNewRoute) {
      const playbook = playbooksData.find(p => p.id === playbookId);
      if (playbook) {
        setSelectedPlaybook(playbookId);
        // Clear param after consuming it to prevent re-selection on every render/navigation
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("playbook");
        setSearchParams(newParams, { replace: true });
      }
    }
  }, [searchParams, isAtNewRoute, setSearchParams]);

  // Sync activationOrder when states change
  React.useEffect(() => {
    setActivationOrder(prev => {
      const order = [...prev];

      // Update pill
      if (activePill && !order.includes("pill")) order.push("pill");
      else if (!activePill && order.includes("pill")) order.splice(order.indexOf("pill"), 1);

      // Update style
      if (selectedStyle && !order.includes("style")) order.push("style");
      else if (!selectedStyle && order.includes("style")) order.splice(order.indexOf("style"), 1);

      // Update playbook
      if (selectedPlaybook && !order.includes("playbook")) order.push("playbook");
      else if (!selectedPlaybook && order.includes("playbook")) order.splice(order.indexOf("playbook"), 1);

      // Update agent
      if (selectedAgent && !order.includes("agent")) order.push("agent");
      else if (!selectedAgent && order.includes("agent")) order.splice(order.indexOf("agent"), 1);

      return order;
    });
  }, [activePill, selectedStyle, selectedPlaybook, selectedAgent]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const newHour = new Date().getHours();
      if (newHour !== currentHour) {
        setCurrentHour(newHour);
        const userName = user?.user_metadata?.name || user?.user_metadata?.full_name || null;
        setHourlyHeadline(getHourlyHeadline(userName));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [currentHour, user]);

  const isEmpty = isAtNewRoute && !activeThreadId;

  // Dynamic Page Title
  React.useEffect(() => {
    if (activeThread?.title) {
      document.title = `${activeThread.title} - Opendraft`;
    } else {
      document.title = "Opendraft";
    }
  }, [activeThread?.title]);

  const approvePlan = React.useCallback(() => navigate(`/workspace/${activeThreadId}`), [navigate, activeThreadId]);
  const regeneratePlan = React.useCallback(() => {
    const plan = buildPlan(draft || activeThread?.title || "");
    upsertPlanMessage(activeThreadId, plan);
  }, [activeThread?.title, draft, activeThreadId, upsertPlanMessage]);

  const send = () => {
    const text = draft.trim();
    if ((!text && attachments.length === 0) || typing) return;
    setDraft("");
    setAttachments([]);

    let questionnaireId: string | undefined;
    for (const cat of Object.keys(QUICK_PROMPTS) as Array<keyof typeof QUICK_PROMPTS>) {
      const found = QUICK_PROMPTS[cat].find(p => text.trim().startsWith(p.prompt.substring(0, 60).trim()));
      if (found && QUESTIONNAIRES[found.id]) {
        questionnaireId = found.id;
        break;
      }
    }
    if (questionnaireId) { setQuestionnaire(QUESTIONNAIRES[questionnaireId]); return; }

    setTyping(true);
    if (selectedAgent === "plan" || selectedAgent === "write") {
      const runLegacy = async () => {
        let currentId = effectiveId;
        if (!currentId) {
          currentId = await createThread();
          setActiveThreadId(currentId);
          navigate(`/chat/${currentId}`, { replace: true });
        }
        const plan = buildPlan(text);
        upsertPlanMessage(currentId, plan);
        sendMessage(currentId, "user", text).then(() => setTyping(false));
      };
      runLegacy();
    } else {
      const run = async () => {
        try {
          const mode = selectedPlaybook || activePill || "default";
          const result = await submitMessage(effectiveId, text, mode, attachments);
          setSelectedPlaybook(null);
          if (!id && result?.threadId) {
            navigate(`/chat/${result.threadId}`, { replace: true });
          }
        } catch (err) {
          toast.error("Erro ao enviar: " + (err instanceof Error ? err.message : String(err)));
        } finally {
          setTyping(false);
        }
      };
      run();
    }
  };

  const sendSuggestion = (text: string) => {
    if (typing) return;
    setTyping(true);
    const mode = selectedPlaybook || activePill || "default";
    submitMessage(effectiveId, text, mode, []).then(result => {
      setSelectedPlaybook(null);
      if (!id && result?.threadId) {
        navigate(`/chat/${result.threadId}`, { replace: true });
      }
    }).catch(err => {
      toast.error("Erro ao enviar sugestão: " + (err instanceof Error ? err.message : String(err)));
    }).finally(() => {
      setTyping(false);
    });
  };

  const quickActions = React.useMemo(() => [
    { id: "write" as const, label: PILL_CONFIG.write.label, Icon: createAppIcon("Pen01Icon"), prompts: QUICK_PROMPTS.write.map(p => ({ title: p.title, prompt: p.prompt })) },
    { id: "ideas" as const, label: PILL_CONFIG.ideas.label, Icon: Lightbulb, prompts: QUICK_PROMPTS.ideas.map(p => ({ title: p.title, prompt: p.prompt })) },
    { id: "plan" as const, label: PILL_CONFIG.plan.label, Icon: CalendarClock, prompts: QUICK_PROMPTS.plan.map(p => ({ title: p.title, prompt: p.prompt })) },
    { id: "analyze" as const, label: PILL_CONFIG.analyze.label, Icon: Search, prompts: QUICK_PROMPTS.analyze.map(p => ({ title: p.title, prompt: p.prompt })) },
  ], []);

  if (id && !isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs text-muted-foreground animate-pulse">Carregando mensagens...</p>
        </div>
      </div>
    );
  }

  const lastDocMessage = [...messages].reverse().find(m => m.metadata?.document || m.metadata?.taskSteps);
  const activeDocument = lastDocMessage?.metadata?.document;
  const showDocumentColumn = !!lastDocMessage;

  return (
    <div className="h-full w-full">
      {isEmpty ? (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-background">
          <div className="pointer-events-auto absolute right-4 top-4">
            <UserAvatarDropdown />
          </div>
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4">
              <div className="pointer-events-auto relative w-full max-w-[760px]">
                {/* Plan Status Pill */}
                <div
                  onClick={() => navigate("/upgrade")}
                  className="mb-8 flex items-center gap-2 rounded-[10px] bg-black/[0.03] dark:bg-white/[0.03] px-4 py-1.5 text-sm cursor-pointer w-fit mx-auto"
                >
                  <span className="text-zinc-400 dark:text-zinc-500">plano Gratuito</span>
                  <span className="text-zinc-300 dark:text-zinc-700">•</span>
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium underline underline-offset-4 decoration-zinc-300/50 dark:decoration-zinc-700/50">Fazer Upgrade</span>
                </div>

                <motion.h1
                  key={hourlyHeadline || "O que vamos construir hoje?"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="mb-8 text-center text-[40px] font-normal leading-[1.1] tracking-[0.01em] text-foreground font-serif"
                >
                  {hourlyHeadline || "O que vamos construir hoje?"}
                </motion.h1>
                <div className="w-full">
                  <ChatComposer
                    value={draft} onChange={setDraft} onSubmit={send} disabled={typing} uiVariant="hero" dropdownSide="bottom"
                    selectedAgent={selectedAgent} onSelectAgent={setSelectedAgent} showShiftHint={false}
                    contextPill={activePill ? { label: PILL_CONFIG[activePill].label, Icon: quickActions.find(q => q.id === activePill)!.Icon, onClear: () => setActivePill(null) } : null}
                    playbookContext={selectedPlaybook ? { label: playbooksData.find(p => p.id === selectedPlaybook)?.name || "Playbook", onClear: () => setSelectedPlaybook(null) } : null}
                    attachments={attachments} onRemoveAttachment={(idx) => setAttachments(p => p.filter((_, i) => i !== idx))}
                    onAttach={(f) => setAttachments(p => [...p, ...f])} selectedStyle={selectedStyle} onSelectStyle={setSelectedStyle}
                    activePill={activePill} onSelectPill={setActivePill as any} activationOrder={activationOrder}
                    questionnaire={questionnaire} onQuestionnaireCancel={() => setQuestionnaire(null)}
                    onQuestionnaireComplete={(answers) => {
                      let context = "\n\n[Respostas ao Questionário]:\n" + Object.entries(answers).map(([s, v]) => `- ${s.toUpperCase()}: ${v.join(", ")}`).join("\n");
                      const enriched = draft + context;
                      setQuestionnaire(null); setDraft(""); setTyping(true);
                      submitMessage(activeThreadId, enriched, "default", attachments).then(r => r?.threadId && navigate(`/chat/${r.threadId}`, { replace: true })).finally(() => setTyping(false));
                    }}
                  />
                  <div className="mt-4 min-h-[180px]">
                    <AnimatePresence mode="wait">
                      {!activePill && draft.length === 0 ? (
                        <motion.div
                          key="actions"
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={{
                            visible: { transition: { staggerChildren: 0.05 } },
                            exit: { opacity: 0, transition: { duration: 0.2 } }
                          }}
                          className="flex flex-wrap items-center justify-center gap-3"
                        >
                          {quickActions.map(({ id, label, Icon }) => (
                            <motion.div
                              key={id}
                              variants={{
                                hidden: { opacity: 0, x: -10, y: 10 },
                                visible: { opacity: 1, x: 0, y: 0, transition: { type: "spring", stiffness: 400, damping: 30 } },
                              }}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="group h-10 rounded-full px-5 bg-[hsl(var(--chat-composer))] border-border/60 dark:border-none text-foreground/70 hover:bg-[hsl(var(--chat-hover))] hover:text-foreground shadow-sm"
                                onClick={() => setActivePill(id)}
                              >
                                <Icon className="h-4.5 w-4.5 text-muted-foreground group-hover:text-foreground" />
                                <span className="text-[13px] font-medium ml-2">{label}</span>
                              </Button>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : activePill ? (
                        <motion.div
                          key="prompts"
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={{
                            visible: { transition: { staggerChildren: 0.04 } },
                            exit: { opacity: 0, transition: { duration: 0.22 } }
                          }}
                          className="w-full"
                        >
                          <ul className="flex flex-col">
                            {quickActions.find(q => q.id === activePill)?.prompts.map(({ title, prompt }) => (
                              <motion.li
                                key={title}
                                variants={{
                                  hidden: { opacity: 0, x: -10, y: 10 },
                                  visible: { opacity: 1, x: 0, y: 0, transition: { type: "spring", stiffness: 400, damping: 30 } },
                                }}
                                className="w-full"
                              >
                                <Button
                                  variant="ghost"
                                  className="group w-full justify-start px-7 py-2.5 text-foreground/60 hover:text-foreground hover:bg-transparent active:bg-transparent text-[14px] font-normal transition-all"
                                  onClick={() => setDraft(prompt)}
                                >
                                  <span className="truncate group-hover:font-medium">{title}</span>
                                </Button>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex h-full w-full flex-col overflow-hidden">


          <div className="relative flex h-full w-full overflow-hidden">
            {/* COLUMN 1: CHAT PANEL (LEFT) */}
            <div className={cn(
              "relative flex h-full flex-col overflow-hidden transition-all duration-500 bg-background",
              showDocumentColumn ? "w-1/2 shrink-0 border-r border-border/10" : "flex-1"
            )}>
              {/* Thread Header (Always visible in Chat) */}
              <div className="h-10 shrink-0 bg-background flex items-center px-4 justify-between border-b border-border/5">
                <ChatOptionsDropdown
                  isFavorite={!!activeThread?.favorite}
                  onToggleFavorite={() => patchThread(effectiveId, { favorite: !activeThread?.favorite })}
                  onRename={() => setRenameDialogOpen(true)}
                  onDelete={() => { if (window.confirm("Excluir?")) { deleteThread(effectiveId); navigate('/new'); } }}
                  onArchive={() => toast.info("Em breve")}
                  align="start"
                >
                  <div className="flex items-center gap-2 min-w-0 cursor-pointer hover:bg-muted/40 px-3 py-1 rounded-lg transition-all active:scale-[0.98]" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[14px] font-semibold text-foreground/90 truncate">
                      {activeThread?.title || "Conversa"}
                    </span>
                    <AppIcon name="ChevronDown" className="h-3.5 w-3.5 text-muted-foreground/45" />
                  </div>
                </ChatOptionsDropdown>

                <div className="flex items-center gap-1">
                  <ChatTooltip label={tt("Compartilhar", "Share")}>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copiado!"); }}>
                      <AppIcon name="Share2" className="h-3.5 w-3.5" />
                    </Button>
                  </ChatTooltip>
                </div>
                <RenameProjectDialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen} projectId={effectiveId} currentTitle={activeThread?.title || ""} />
              </div>

              <div className="flex-1 overflow-hidden">
                <ChatThreadView threadId={effectiveId} messages={messages} isTyping={activeThread?.isTyping || typing} typingMode={activeThread?.typingMode} onApprovePlan={approvePlan} onRegeneratePlan={regeneratePlan} />
              </div>
              <div className="sticky bottom-0 z-10 w-full bg-background/80 pb-4 pt-2 backdrop-blur-xl">
                <div className="pointer-events-none absolute -top-16 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
                <div className="relative">                  {/* IA Continuity Suggestions */}
                  {(() => {
                    const lastMessage = messages[messages.length - 1];
                    if (!lastMessage || lastMessage.role !== "assistant" || activeThread?.isTyping || typing) return null;

                    const suggestions = getDisplaySuggestions(lastMessage.content, lastMessage.metadata?.suggestions);
                    if (!suggestions || suggestions.length === 0) return null;

                    return (
                      <div className="chat-container pb-4">
                        <SuggestionPills
                          suggestions={suggestions}
                          onSelect={(text) => sendSuggestion(text)}
                          visible={true}
                        />
                      </div>
                    );
                  })()}

                  <ChatComposer
                    value={draft} onChange={setDraft} onSubmit={send} disabled={activeThread?.isTyping || typing}
                    placeholder={messages.length === 0 ? "Como posso ajudar?" : "Pergunte algo"}
                    uiVariant="hero" dropdownSide="top" selectedAgent={selectedAgent} onSelectAgent={setSelectedAgent} showShiftHint={true}
                    contextPill={activePill ? { label: PILL_CONFIG[activePill].label, Icon: quickActions.find(q => q.id === activePill)!.Icon, onClear: () => setActivePill(null) } : null}
                    playbookContext={selectedPlaybook ? { label: playbooksData.find(p => p.id === selectedPlaybook)?.name || "Playbook", onClear: () => setSelectedPlaybook(null) } : null}
                    attachments={attachments} onRemoveAttachment={(idx) => setAttachments(p => p.filter((_, i) => i !== idx))}
                    onAttach={(f) => setAttachments(p => [...p, ...f])} selectedStyle={selectedStyle} onSelectStyle={setSelectedStyle}
                    activePill={activePill} onSelectPill={setActivePill as any} activationOrder={activationOrder}
                  />
                </div>
              </div>
            </div>

            {/* COLUMN 2: DOCUMENT PREVIEW (RIGHT) */}
            <AnimatePresence mode="wait">
              {showDocumentColumn && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="flex-1 min-w-0 h-full overflow-hidden bg-background"
                >
                  <DocumentPreviewColumn
                    document={activeDocument || { title: activeThread?.title || "Documento", fileName: "escrevendo...", url: "" }}
                    content={lastDocMessage?.content || ""}
                    onAction={(action, text) => {
                      if (action === "edit") {
                        setDraft(`Altere este trecho: "${text}"\n\nInstrução: `);
                      }
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
      <SelectionToolbar
        onAction={(action, text) => {
          if (action === "edit") {
            setDraft(`Altere este trecho: "${text}"\n\nInstrução: `);
          }
        }}
      />
    </div>
  );
}
