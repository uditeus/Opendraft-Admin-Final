import React from "react";
import { useLocation } from "react-router-dom";
import { AppIcon } from "@/components/icons/AppIcon";
import { ChatTooltip } from "@/components/design-system/chat-tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChatThread } from "@/components/chat/types";
import { useI18n } from "@/i18n/i18n";

export function ChatSidebar({
  threads,
  activeId,
  onNew,
  onSelect,
  onOpenSearch,
  className,
}: {
  threads: ChatThread[];
  activeId: string;
  onNew: () => void;
  onSelect: (id: string) => void;
  onOpenSearch?: () => void;
  className?: string;
}) {
  const { tt } = useI18n();
  const location = useLocation();
  const [isRecentOpen, setIsRecentOpen] = React.useState(false);

  // Auto-close when navigating (changing page)
  React.useEffect(() => {
    setIsRecentOpen(false);
  }, [location.pathname]);

  return (
    <aside
      className={cn(
        "flex h-full w-[300px] shrink-0 flex-col border-r border-border bg-[hsl(var(--chat-sidebar))] text-[hsl(var(--chat-sidebar-foreground))]",
        className,
      )}
    >
      <div className="flex items-center gap-2 p-4">
        <Button
          variant="chatGhost"
          className="h-10 flex-1 justify-start rounded-xl px-3 text-sm font-medium"
          onClick={onNew}
        >
          <AppIcon name="SquarePen" className="mr-2 h-4 w-4" />
          {tt("Nova conversa", "New chat")}
        </Button>
        <ChatTooltip label={tt("Nova conversa", "New chat")}>
          <Button variant="chatIcon" size="chatIcon" className="rounded-xl" aria-label={tt("Nova conversa", "New chat")} onClick={onNew}>
            <AppIcon name="Plus" className="h-5 w-5" />
          </Button>
        </ChatTooltip>
      </div>



      <div className="mt-2 flex-1 overflow-auto px-2 pb-4 chat-scroll">
        {/* Collapsible Recentes Section */}
        <div className="px-2">
          <button
            onClick={() => setIsRecentOpen(!isRecentOpen)}
            className="flex w-full items-center justify-between rounded-lg px-2 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <span>{tt("Recentes", "Recent")}</span>
            <AppIcon
              name="ChevronRight"
              className={cn(
                "h-4 w-4 transition-transform duration-200 opacity-70 group-hover:opacity-100",
                isRecentOpen && "rotate-90"
              )}
            />
          </button>

          <div className={cn(
            "grid transition-all duration-300 ease-in-out",
            isRecentOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
          )}>
            <div className="overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto min-h-0 space-y-1 pr-1">
                {threads.map((t) => {
                  const active = t.id === activeId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => onSelect(t.id)}
                      className={cn(
                        "chat-focus flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                        active ? "bg-[hsl(var(--chat-active))]" : "hover:bg-[hsl(var(--chat-hover))]",
                      )}
                    >
                      <AppIcon name="MessageSquare" className="h-4 w-4 shrink-0 opacity-70" />
                      <span className="truncate">{t.title}</span>
                    </button>
                  );
                })}
                {threads.length === 0 && (
                  <div className="px-3 py-2 text-xs text-muted-foreground italic">
                    {tt("Nenhuma conversa recente", "No recent chats")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-[hsl(var(--chat-hover))] cursor-pointer transition-colors">
          <div className="h-9 w-9 rounded-full bg-[hsl(var(--chat-active))]" />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{tt("Conta", "Account")}</div>
            <div className="truncate text-xs text-muted-foreground">{tt("Preferências", "Preferences")}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
