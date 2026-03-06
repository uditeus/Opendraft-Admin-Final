import * as React from "react";
import { AppIcon } from "@/components/icons/AppIcon";

import { ChatTooltip } from "@/components/design-system/chat-tooltip";
import { Button } from "@/components/ui/button";
import ShimmeringText from "@/components/ui/shimmering-text";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/components/chat/store";

export function AssistantActions({
  threadId,
  messageId,
  onCopy,
  copied,
  isGenerating,
  thoughtTimeMs,
  feedback,
  aborted,
  onFeedback,
}: {
  threadId: string;
  messageId: string;
  onCopy: () => void;
  copied: boolean;
  isGenerating?: boolean;
  thoughtTimeMs?: number;
  feedback?: 'like' | 'dislike' | null;
  aborted?: boolean;
  onFeedback?: (type: 'like' | 'dislike') => void;
}) {
  const { updateMessageFeedback } = useChatStore();
  const [showButtons, setShowButtons] = React.useState(!isGenerating);

  React.useEffect(() => {
    if (isGenerating || aborted) {
      setShowButtons(false);
    } else {
      // Small delay of 1s after generation finishes
      const timer = setTimeout(() => setShowButtons(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isGenerating, aborted]);

  return (
    <div className="mt-2 min-h-[32px]">
      <div className={React.useMemo(() => `flex items-center gap-1 transition-opacity duration-300 ${showButtons ? "opacity-100" : "opacity-0 pointer-events-none"}`, [showButtons])}>
        <ChatTooltip label={copied ? "Copiado" : "Copiar"} side="bottom">
          <Button
            variant="chatGhost"
            size="chatIconSm"
            aria-label={copied ? "Copiado" : "Copiar"}
            onClick={onCopy}
            className="text-muted-foreground/50 hover:text-foreground"
          >
            {copied ? <AppIcon name="Check" className="h-[14px] w-[14px]" /> : <AppIcon name="Copy" className="h-[14px] w-[14px]" />}
          </Button>
        </ChatTooltip>

        <ChatTooltip label="Resposta satisfatória" side="bottom">
          <Button
            variant="chatGhost"
            size="chatIconSm"
            aria-label="Resposta satisfatória"
            onClick={() => onFeedback?.('like')}
            className={cn(
              "active:scale-[0.98] transition-colors",
              feedback === 'like' ? "text-foreground opacity-100" : "text-muted-foreground/50"
            )}
          >
            <AppIcon name="ThumbsUp" className={cn("h-[14px] w-[14px]", feedback === 'like' && "fill-current")} />
          </Button>
        </ChatTooltip>
        <ChatTooltip label="Resposta insatisfatória" side="bottom">
          <Button
            variant="chatGhost"
            size="chatIconSm"
            aria-label="Resposta insatisfatória"
            onClick={() => onFeedback?.('dislike')}
            className={cn(
              "active:scale-[0.98] transition-colors",
              feedback === 'dislike' ? "text-foreground opacity-100" : "text-muted-foreground/50"
            )}
          >
            <AppIcon name="ThumbsDown" className={cn("h-[14px] w-[14px]", feedback === 'dislike' && "fill-current")} />
          </Button>
        </ChatTooltip>

        <span className="sr-only">{messageId}</span>
      </div>
    </div>
  );
}
