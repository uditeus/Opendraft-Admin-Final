import React from "react";
import { AppIcon, createAppIcon } from "@/components/icons/AppIcon";

const PencilEdit02Icon = createAppIcon("PencilEdit02Icon");
const LibrariesIcon = createAppIcon("LibrariesIcon");

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ChatTooltip } from "@/components/design-system/chat-tooltip";
import { SettingsDialog } from "@/components/chat/SettingsDialog";
import { useI18n } from "@/i18n/i18n";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShareDialog } from "@/components/chat/ShareDialog";
import { RenameModal } from "@/components/chat/RenameModal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useChatStore } from "@/components/chat/store";
import { toast } from "sonner";
import { ChatOptionsDropdown } from "./ChatOptionsDropdown";

import logoMark from "@/assets/opendraft-mark-new.png";

export const CHAT_SIDEBAR_WIDTH_PX = 300;
export const CHAT_SIDEBAR_COLLAPSED_WIDTH_PX = 52;

// Keep icon/button sizing perfectly consistent between expanded and mini sidebar.
const MINI_BUTTON_CLASS = "h-10 w-10";
// Slightly larger than 16px (Manus-like): ~18px
const MINI_ICON_CLASS = "h-[18px] w-[18px]";

type NavItem = {
  id: "new_draft" | "library" | "playbooks";
  labelPt: string;
  labelEn: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const items: NavItem[] = [
  { id: "new_draft", labelPt: "Novo draft", labelEn: "New draft", Icon: PencilEdit02Icon },
  { id: "library", labelPt: "Biblioteca", labelEn: "Library", Icon: LibrariesIcon },
  { id: "playbooks", labelPt: "Playbooks", labelEn: "Playbooks", Icon: createAppIcon("Cards02Icon") },
];

export function ChatSidebarDrawer({
  open,
  onOpenChange,
  collapsed = false,
  onOpenSearch,
  onToggleCollapsed,
  recents = [],
  activeRecentId,
  onSelectRecent,
  userName = "Usuário",
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collapsed?: boolean;
  onOpenSearch?: () => void;
  onToggleCollapsed?: () => void;
  recents?: Array<{ id: string; title: string, favorite?: boolean }>;
  activeRecentId?: string;
  onSelectRecent?: (id: string) => void;
  userName?: string;
  className?: string;
}) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { tt } = useI18n();
  const location = useLocation();
  const store = useChatStore();

  const [renameModalOpen, setRenameModalOpen] = React.useState(false);
  const [itemToRename, setItemToRename] = React.useState<{ id: string; title: string } | null>(null);

  const handleRename = (id: string, currentTitle: string) => {
    setItemToRename({ id, title: currentTitle });
    setRenameModalOpen(true);
  };

  const confirmRename = async (newTitle: string) => {
    if (!itemToRename) return;
    try {
      await store.patchThread(itemToRename.id, { title: newTitle });
      toast.success("Renomeado com sucesso");
    } catch {
      toast.error("Erro ao renomear");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir?")) return;
    try {
      await store.deleteThread(id);
      toast.success("Excluído com sucesso");
      if (activeRecentId === id) {
        navigate("/new");
      }
    } catch {
      toast.error("Erro ao excluir");
    }
  };

  const handleToggleFavorite = async (id: string, currentFavorite: boolean) => {
    try {
      await store.patchThread(id, { favorite: !currentFavorite });
      toast.success(currentFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos");
    } catch {
      toast.error("Erro ao atualizar");
    }
  };

  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [draftsOpen, setDraftsOpen] = React.useState(() => {
    const saved = localStorage.getItem("sidebarDraftsOpen");
    return saved !== null ? saved === "true" : true;
  });

  React.useEffect(() => {
    localStorage.setItem("sidebarDraftsOpen", String(draftsOpen));
  }, [draftsOpen]);

  const [settingsInitialSection, setSettingsInitialSection] = React.useState<
    React.ComponentProps<typeof SettingsDialog>["initialSection"]
  >("configuracoes");

  const isItemActive = (id: string) => {
    if (id === "new_draft") {
      return location.pathname === "/new" || location.pathname === "/chat" || location.pathname === "/";
    }
    if (id === "library") return location.pathname.startsWith("/library");
    if (id === "playbooks") return location.pathname.startsWith("/playbooks");
    return false;
  };

  const tLabel = React.useCallback((item: NavItem) => tt(item.labelPt, item.labelEn), [tt]);

  const collapsedContent = (
    <aside className="flex h-full flex-col items-center px-1.5 py-3">
      <div className="flex w-full flex-col items-center">
        <ChatTooltip
          label={tt("Expandir barra lateral", "Expand sidebar")}
          side="right"
          align="center"
          sideOffset={10}
        >
          <button
            type="button"
            className={cn(
              "group chat-focus relative grid place-items-center rounded-full transition-colors",
              MINI_BUTTON_CLASS,
              "bg-transparent text-sidebar-foreground/70 hover:bg-[hsl(var(--chat-hover))] hover:text-sidebar-foreground",
            )}
            aria-label={tt("Expandir barra lateral", "Expand sidebar")}
            onClick={onToggleCollapsed}
          >
            <AppIcon name="LayoutLeftIcon" className={MINI_ICON_CLASS} />
          </button>
        </ChatTooltip>
      </div>

      <div className="mt-2 flex w-full flex-col items-center">
        {items.map((item) => {
          const { id, Icon } = item;
          const label = tLabel(item);
          const active = isItemActive(id);
          return (
            <ChatTooltip
              key={id}
              label={label}
              side="right"
              align="center"
              sideOffset={10}
            >
              <button
                type="button"
                className={cn(
                  "chat-focus grid place-items-center rounded-full transition-colors",
                  MINI_BUTTON_CLASS,
                  "text-sidebar-foreground/90 hover:bg-[hsl(var(--chat-hover))] hover:text-sidebar-foreground",
                  active && "bg-[hsl(var(--chat-hover))] text-sidebar-foreground"
                )}
                aria-label={label}
                onClick={() => {
                  if (id === "new_draft") return navigate("/new");
                  if (id === "library") return navigate("/library");
                  if (id === "playbooks") return navigate("/playbooks");
                }}
              >
                <Icon className={cn(MINI_ICON_CLASS, "opacity-90")} />
              </button>
            </ChatTooltip>
          );
        })}
      </div>

      {/* bottom: settings */}
      <div className="mt-auto flex w-full flex-col items-center">
        <ChatTooltip label={tt("Configurações", "Settings")} side="right" align="center" sideOffset={10}>
          <button
            type="button"
            className={cn(
              "chat-focus grid place-items-center rounded-full transition-colors",
              MINI_BUTTON_CLASS,
              "text-sidebar-foreground/90 hover:bg-[hsl(var(--chat-hover))] hover:text-sidebar-foreground",
            )}
            aria-label={tt("Abrir configurações", "Open settings")}
            onClick={() => {
              setSettingsInitialSection("configuracoes");
              setSettingsOpen(true);
            }}
          >
            <AppIcon name="Settings" className={cn(MINI_ICON_CLASS, "opacity-90")} />
          </button>
        </ChatTooltip>
      </div>
    </aside>
  );

  const content = (
    <aside className="flex h-full flex-col">
      {/* Brand */}
      <div className={cn("pt-2 pb-1", collapsed ? "px-2" : "px-3")}>
        <div className="flex items-center justify-between gap-2">
          {collapsed ? (
            <ChatTooltip label={tt("Expandir barra lateral", "Expand sidebar")} side="right" align="center" sideOffset={10}>
              <button
                type="button"
                className={cn(
                  "chat-focus group grid h-10 w-10 place-items-center rounded-full",
                  "bg-transparent text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-[hsl(var(--chat-hover))]",
                )}
                aria-label={tt("Expandir barra lateral", "Expand sidebar")}
                onClick={onToggleCollapsed}
              >
                <AppIcon name="LayoutLeftIcon" className={MINI_ICON_CLASS} />
              </button>
            </ChatTooltip>
          ) : (
            <>
              {/* Expanded: Logo + Brand */}
              <div
                className={cn(
                  "flex min-w-0 flex-1 items-center px-3 py-2 gap-2.5",
                  "text-sidebar-foreground",
                )}
              >
                <img
                  src="https://i.imgur.com/wlz2FUz.png"
                  alt="Opendraft Logo"
                  className="h-[18px] w-auto brightness-0 dark:invert opacity-95"
                />
                <span className="truncate text-lg font-semibold tracking-tighter text-black dark:text-white">Opendraft</span>
              </div>

              {/* Close icon on right */}
              {onToggleCollapsed ? (
                <ChatTooltip label={tt("Encolher barra lateral", "Collapse sidebar")}>
                  <button
                    type="button"
                    className={cn(
                      "chat-focus grid h-10 w-10 place-items-center rounded-xl",
                      "bg-transparent text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors",
                    )}
                    aria-label={tt("Encolher barra lateral", "Collapse sidebar")}
                    onClick={onToggleCollapsed}
                  >
                    <AppIcon name="LayoutLeftIcon" className={MINI_ICON_CLASS} />
                  </button>
                </ChatTooltip>
              ) : null}
            </>
          )}
        </div>
      </div>

      <div className={cn("pt-0", collapsed ? "px-2" : "px-3")}>
        <div className="space-y-1">
          {items.map((item) => {
            const { id, Icon } = item;
            const label = tLabel(item);
            const active = isItemActive(id);
            return (
              <button
                key={id}
                type="button"
                className={cn(
                  "chat-focus text-sm",
                  collapsed
                    ? cn(
                      "mx-auto grid place-items-center rounded-full transition-colors",
                      MINI_BUTTON_CLASS,
                      "text-sidebar-foreground/90 hover:bg-[hsl(var(--chat-hover))] hover:text-sidebar-foreground",
                      active && "bg-[hsl(var(--chat-hover))] text-sidebar-foreground",
                    )
                    : cn(
                      "group flex w-full items-center gap-[11px] rounded-lg px-3 py-2 text-left transition-colors",
                      "text-sidebar-foreground/90 hover:bg-[hsl(var(--chat-hover))] hover:text-sidebar-foreground",
                      active && "bg-[hsl(var(--chat-hover))] text-sidebar-foreground font-medium",
                    ),
                )}
                aria-label={collapsed ? label : undefined}
                title={collapsed ? label : undefined}
                onClick={() => {
                  if (id === "new_draft") return navigate("/new");
                  if (id === "library") return navigate("/library");
                  if (id === "playbooks") return navigate("/playbooks");
                }}
              >
                <Icon className={cn(MINI_ICON_CLASS, "shrink-0 opacity-90")} />
                {!collapsed ? (
                  <>
                    <span className="min-w-0 flex-1 truncate">{label}</span>
                  </>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recents */}
      {store.showRecents && (
        <div className="mt-3 flex min-h-0 flex-1 flex-col px-3 relative">
          <button
            type="button"
            className={cn(
              "chat-focus flex w-full items-center justify-between rounded-md px-3 py-1.5 transition-colors",
              "text-[13px] font-medium text-sidebar-foreground/50 hover:text-sidebar-foreground/70",
            )}
            onClick={() => setDraftsOpen((v) => !v)}
            aria-expanded={draftsOpen}
            aria-controls="sidebar-recents"
          >
            <span>{tt("Recentes", "Recents")}</span>
            <AppIcon name="ChevronRight"
              className={cn(
                "h-3 w-3 text-sidebar-foreground/30 transition-transform duration-200",
                draftsOpen && "rotate-90",
              )}
              aria-hidden
            />
          </button>

          <div className={cn(
            "grid transition-all duration-300 ease-in-out flex-1 min-h-0",
            draftsOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
          )}>
            <div className="overflow-hidden flex flex-col min-h-0">
              <div id="sidebar-recents" className="overflow-y-auto no-scrollbar min-h-0 flex-1 pb-4">
                {recents.length ? (
                  <motion.div
                    className="space-y-1"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.03,
                        },
                      },
                    }}
                  >
                    {recents.map((r) => {
                      const active = r.id === activeRecentId && location.pathname.startsWith("/chat/");
                      return (
                        <motion.div
                          key={r.id}
                          variants={{
                            hidden: { opacity: 0, x: -10 },
                            visible: { opacity: 1, x: 0 },
                          }}
                          className="group relative"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              onSelectRecent?.(r.id);
                              navigate(`/chat/${r.id}`);
                            }}
                            className={cn(
                              "chat-focus w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                              "hover:bg-[hsl(var(--chat-hover))] hover:text-sidebar-foreground",
                              active ? "bg-[hsl(var(--chat-hover))] text-sidebar-foreground font-medium" : "text-sidebar-foreground/90 font-normal",
                            )}
                            aria-current={active ? "page" : undefined}
                            title={r.title}
                          >
                            <span className="block truncate pr-6">{r.title}</span>
                          </button>

                          <div
                            className={cn(
                              "absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity",
                              "z-10"
                            )}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          >
                            <ChatOptionsDropdown
                              isFavorite={!!r.favorite}
                              onToggleFavorite={() => handleToggleFavorite(r.id, !!r.favorite)}
                              onRename={() => handleRename(r.id, r.title)}
                              onDelete={() => handleDelete(r.id)}
                              onArchive={() => toast.info("Conversa arquivada (funcionalidade em breve)")}
                              triggerClassName="text-sidebar-foreground/50 hover:text-sidebar-foreground"
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <div className="px-3 py-2 text-xs text-muted-foreground">{tt("Sem recentes", "No recents")}</div>
                )}
              </div>
            </div>
          </div>

          {/* Gradient divisor para sumir o fim do scroll de forma "invisível" */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-sidebar to-transparent" />
        </div>
      )}

      {/* Share Banner */}
      <div className="mt-auto px-3 pb-2">
        <button
          type="button"
          onClick={() => setShareOpen(true)}
          className="w-full text-left cursor-pointer rounded-xl border border-sidebar-border/40 bg-sidebar-accent/10 p-3 transition-colors hover:bg-sidebar-accent/20 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-semibold text-sidebar-foreground">Compartilhe o Opendraft</span>
              <span className="text-[11px] text-sidebar-foreground/70">Ganhe 10 créditos cada</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent border border-sidebar-border/20 text-sidebar-foreground/70 group-hover:text-sidebar-foreground group-hover:scale-105 transition-all">
              <AppIcon name="Gift" className="h-4 w-4" />
            </div>
          </div>
        </button>
      </div>

      <div className="px-3 pb-3 pt-2">
        <button
          type="button"
          className={cn(
            "chat-focus flex w-full items-center gap-[11px] rounded-lg px-3 py-2 text-left text-sm transition-colors",
            "text-sidebar-foreground/90 hover:bg-[hsl(var(--chat-hover))] hover:text-sidebar-foreground",
          )}
          aria-label={tt("Abrir configurações", "Open settings")}
          onClick={() => {
            setSettingsInitialSection("configuracoes");
            setSettingsOpen(true);
          }}
        >
          <AppIcon name="Settings" className={cn(MINI_ICON_CLASS, "shrink-0 opacity-90")} />
          <span className="truncate">{tt("Configurações", "Settings")}</span>
        </button>
      </div>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={(next) => {
          setSettingsOpen(next);
        }}
        initialSection={settingsInitialSection}
      />
    </aside>
  );

  if (!isMobile) {
    return (
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30",
          "border-0 bg-sidebar text-sidebar-foreground",
          "transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
          className,
        )}
        style={{ width: collapsed ? CHAT_SIDEBAR_COLLAPSED_WIDTH_PX : CHAT_SIDEBAR_WIDTH_PX }}
      >
        {collapsed ? collapsedContent : content}
        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          initialSection={settingsInitialSection}
        />
        <ShareDialog open={shareOpen} onOpenChange={setShareOpen} />
        <RenameModal
          open={renameModalOpen}
          onOpenChange={setRenameModalOpen}
          title={itemToRename?.title || ""}
          onRename={confirmRename}
        />
      </div>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        hideClose
        className={cn(
          "p-0 sm:max-w-none",
          "border-0 bg-sidebar text-sidebar-foreground",
          className,
        )}
        style={{ width: CHAT_SIDEBAR_WIDTH_PX }}
      >
        {content}
        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          initialSection={settingsInitialSection}
        />
        <ShareDialog open={shareOpen} onOpenChange={setShareOpen} />
        <RenameModal
          open={renameModalOpen}
          onOpenChange={setRenameModalOpen}
          title={itemToRename?.title || ""}
          onRename={confirmRename}
        />
      </SheetContent>
    </Sheet>
  );
}
