import * as React from "react";
import { AppIcon } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/i18n";

export function ChatTopbar({ className }: { className?: string }) {
  const { tt } = useI18n();

  // V1: visual-only (sem trocar modelo ainda)
  return (
    <header
      className={cn(
        "sticky top-0 z-10",
        "border-b border-border/60",
        "bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
    >
      <div className="chat-container">
        <div className="flex h-12 items-center justify-between">
          <button
            type="button"
            className={cn(
              "chat-focus inline-flex items-center gap-2 rounded-lg px-2 py-1",
              "text-sm font-medium text-foreground/90",
              // sem hover (como no print)
              "hover:bg-transparent",
            )}
            aria-label={tt("Selecionar modelo (visual)", "Select model (visual)")}
          >
            <span className="truncate">Manus 1.6 Lite</span>
            <AppIcon name="ChevronDown" className="h-4 w-4 opacity-70" aria-hidden />
          </button>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "gap-2 rounded-full",
                // sem hover chamativo
                "hover:bg-transparent",
              )}
              onClick={() => {}}
              aria-label={tt("Iniciar teste gratuito", "Start free trial")}
            >
              <AppIcon name="Sparkles" className="h-4 w-4 opacity-80" />
              <span className="text-sm">{tt("Iniciar teste gratuito", "Start free trial")}</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-transparent"
              onClick={() => {}}
              aria-label={tt("Compartilhar", "Share")}
            >
              <AppIcon name="Share2" className="h-4 w-4 opacity-80" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-transparent"
              onClick={() => {}}
              aria-label={tt("Mais opções", "More options")}
            >
              <AppIcon name="MoreHorizontal" className="h-4 w-4 opacity-80" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
