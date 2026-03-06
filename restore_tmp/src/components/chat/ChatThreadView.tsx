import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/components/chat/types";
import { AssistantActions } from "@/components/chat/thread/AssistantActions";
import { UserActions } from "@/components/chat/thread/UserActions";
import { Bubble } from "@/components/chat/thread/Bubble";
import { ChatStatusIndicator } from "@/components/chat/ChatStatusIndicator";
import { PlanCard } from "@/components/chat/thread/PlanCard";
import { planToClipboardText } from "@/components/chat/thread/planToClipboardText";
import { useCopyState } from "@/components/chat/thread/useCopyState";
import { AppIcon } from "@/components/icons/AppIcon";
import { useChatStore } from "@/components/chat/store";
import { Button } from "@/components/ui/button";
import { ChatTooltip } from "@/components/design-system/chat-tooltip";
import { FocusMode } from "@/components/chat/FocusMode";
import { VariationsView, parseVariations } from "@/components/chat/VariationsView";
import { PresentationMode } from "@/components/chat/PresentationMode";
import { FeedbackDialog } from "@/components/chat/FeedbackDialog";
import { Response as ChatResponse } from "@/components/chat/Response";
import { DocumentCard } from "@/components/chat/generative-ui/DocumentCard";
import { SuggestionPills } from "@/components/chat/SuggestionPills";
import { getDisplayContent, parseOpendraftResponse } from "@/lib/chat/opendraftParser";
import { sounds } from "@/lib/audio/sounds";

export function ChatThreadView({
  threadId,
  messages,
  isTyping,
  typingMode,
  onApprovePlan,
  onRegeneratePlan,
}: {
  threadId: string;
  messages: ChatMessage[];
  isTyping?: boolean;
  typingMode?: string;
  onApprovePlan?: () => void;
  onRegeneratePlan?: () => void;
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const endRef = React.useRef<HTMLDivElement | null>(null);
  const { copiedId, copy } = useCopyState();
  const [showScrollButton, setShowScrollButton] = React.useState(false);
  const { regenerateLastResponse, editAndResend, submitMessage } = useChatStore();

  // Edit state
  const [editingMessageId, setEditingMessageId] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState("");

  // Focus mode state
  const [focusContent, setFocusContent] = React.useState<string | null>(null);

  // Presentation mode state
  const [presentationContent, setPresentationContent] = React.useState<string | null>(null);

  // Inline editing state for assistant messages
  const [inlineEdits, setInlineEdits] = React.useState<Record<string, string>>({});

  // Feedback state
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);
  const [feedbackMessageId, setFeedbackMessageId] = React.useState<string | null>(null);
  const [feedbackType, setFeedbackType] = React.useState<'like' | 'dislike' | null>(null);

  const lastMessage = messages[messages.length - 1];
  const lastAssistantMessage = [...messages].reverse().find(m => m.role === "assistant");

  React.useEffect(() => {
    // Only auto-scroll if we are ALREADY at the bottom or if it's a new message from user
    const container = containerRef.current;
    if (container) {
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 200;
      if (isAtBottom || messages[messages.length - 1]?.role === 'user') {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  }, [messages.length, isTyping]);

  // Audio effect for incoming message
  const wasTypingRef = React.useRef(false);
  React.useEffect(() => {
    if (isTyping && !wasTypingRef.current) {
      sounds.playReceived();
    }
    wasTypingRef.current = !!isTyping;
  }, [isTyping]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    // Show button if we are more than 300px from the bottom
    const fromBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
    setShowScrollButton(fromBottom > 300);
  };

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const startEditing = (m: ChatMessage) => {
    setEditingMessageId(m.id);
    setEditText(m.content);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditText("");
  };

  const confirmEdit = () => {
    if (editingMessageId && editText.trim()) {
      editAndResend(threadId, editingMessageId, editText.trim());
      setEditingMessageId(null);
      setEditText("");
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full flex-1 overflow-y-auto chat-scroll"
      >
        <div className="flex flex-col pt-4 pb-24 chat-container">
          {messages.map((m) => (
            <Bubble
              key={m.id}
              role={m.role}
              actions={
                m.role === "assistant" ? (
                  <AssistantActions
                    threadId={threadId}
                    messageId={m.id}
                    copied={copiedId === m.id}
                    isGenerating={isTyping && m === lastMessage}
                    thoughtTimeMs={m.metadata?.thoughtTimeMs}
                    feedback={m.metadata?.feedback}
                    aborted={m.metadata?.aborted}
                    onFeedback={(type) => {
                      setFeedbackMessageId(m.id);
                      setFeedbackType(type);
                      setFeedbackOpen(true);
                    }}
                    onCopy={() =>
                      copy(
                        m.id,
                        m.type === "plan" && m.data ? planToClipboardText(m.data) : m.content,
                      )
                    }
                  />
                ) : (
                  <UserActions
                    onCopy={() => copy(m.id, m.content)}
                    copied={copiedId === m.id}
                    createdAt={m.createdAt}
                    onRegenerate={() => regenerateLastResponse(threadId)}
                  />
                )
              }
            >
              {m.role === "assistant" ? (
                <>
                  <ChatStatusIndicator
                    message={m}
                    isTyping={isTyping && m === lastMessage}
                    typingMode={typingMode}
                    userPrompt={(() => {
                      const idx = messages.indexOf(m);
                      for (let i = idx - 1; i >= 0; i--) {
                        if (messages[i].role === "user") return messages[i].content;
                      }
                      return undefined;
                    })()}
                  />
                  {m.type === "plan" && m.data ? (
                    <PlanCard plan={m.data} onApprove={onApprovePlan} onRegenerate={onRegeneratePlan} />
                  ) : (
                    <>
                      {(() => {
                        const rawContent = inlineEdits[m.id] || m.content;
                        if (!rawContent && m.metadata?.document) return null;

                        // Check if it's a structured response to extract suggestions if store didn't do it yet
                        const structured = parseOpendraftResponse(rawContent);
                        const suggestions = m.metadata?.suggestions || structured?.suggestions;

                        const displayContent = getDisplayContent(rawContent);
                        const variations = parseVariations(displayContent);
                        if (variations) {
                          return <VariationsView variations={variations} />;
                        }
                        return (
                          <ChatResponse>{displayContent}</ChatResponse>
                        );
                      })()}
                      {m.metadata?.document && (
                        <DocumentCard document={m.metadata.document} />
                      )}

                      {/* Suggestion Pills moved to ChatApp for docking above composer */}
                    </>
                  )}
                </>
              ) : (
                <div className="whitespace-pre-wrap text-[15px] leading-6 text-foreground">
                  {m.content}
                </div>
              )}
            </Bubble>
          ))}

          <div ref={endRef} className="h-4" />
        </div>
      </div>

      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2"
          >
            <button
              onClick={scrollToBottom}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 shadow-elev-2 backdrop-blur hover:bg-background transition-all active:scale-95",
                "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Rolar para o fim"
            >
              <AppIcon name="ChevronDown" size={20} strokeWidth={2.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Focus Mode Overlay */}
      <FocusMode
        content={focusContent || ""}
        open={focusContent !== null}
        onClose={() => setFocusContent(null)}
      />

      {/* Presentation Mode Overlay */}
      <PresentationMode
        content={presentationContent || ""}
        open={presentationContent !== null}
        onClose={() => setPresentationContent(null)}
      />

      {/* Feedback Modal (Claude-style) */}
      <FeedbackDialog
        open={feedbackOpen}
        onOpenChange={(open) => {
          setFeedbackOpen(open);
          if (!open) {
            setFeedbackMessageId(null);
            setFeedbackType(null);
          }
        }}
        type={feedbackType}
        threadId={threadId}
        messageId={feedbackMessageId || ""}
      />
    </div>
  );
}
