import * as React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { AppIcon } from "@/components/icons/AppIcon";
import { Button } from "@/components/ui/button";
import { ChatTooltip } from "@/components/design-system/chat-tooltip";
import { CHAT_SIDEBAR_WIDTH_PX, CHAT_SIDEBAR_COLLAPSED_WIDTH_PX, ChatSidebarDrawer } from "@/components/chat/ChatSidebarDrawer";
import { SearchDialog } from "@/components/chat/SearchDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChatStore } from "@/components/chat/store";

export function ChatLayout() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? saved === "true" : true;
  });
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved !== null ? saved === "true" : false;
  });
  const [searchOpen, setSearchOpen] = React.useState(false);

  const store = useChatStore();

  // Ctrl/Cmd + K abre busca (global)
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Sync to localStorage
  React.useEffect(() => {
    localStorage.setItem("sidebarOpen", String(sidebarOpen));
  }, [sidebarOpen]);

  React.useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  return (
    <div className="h-screen w-full bg-background text-foreground">
      {/* Top-left sidebar trigger */}
      <div className="fixed left-3 top-3 z-20">
        <ChatTooltip label={sidebarOpen ? "Fechar barra lateral" : "Abrir barra lateral"}>
          <Button
            variant="chatIcon"
            size="chatIcon"
            aria-label={sidebarOpen ? "Fechar barra lateral" : "Abrir barra lateral"}
            data-state={sidebarOpen ? "open" : "closed"}
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <AppIcon name="LayoutLeftIcon" />
          </Button>
        </ChatTooltip>
      </div>

      <ChatSidebarDrawer
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        collapsed={!isMobile && sidebarOpen ? sidebarCollapsed : false}
        onOpenSearch={() => setSearchOpen(true)}
        onToggleCollapsed={() => setSidebarCollapsed((v) => !v)}
        recents={store.threads}
        activeRecentId={store.activeThreadId}
        onSelectRecent={(id) => {
          store.setActiveThreadId(id);
          navigate(`/chat/${id}`);
        }}
        userName="Matheus Aguiar"
      />

      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        recents={store.threads.map((t) => ({ id: t.id, title: t.title }))}
        onPick={() => {
          // V1 visual: sem navegação ainda
        }}
      />

      <div
        className="h-full w-full"
        style={{
          paddingLeft: !isMobile && sidebarOpen
            ? sidebarCollapsed
              ? CHAT_SIDEBAR_COLLAPSED_WIDTH_PX
              : CHAT_SIDEBAR_WIDTH_PX
            : 0,
          transition: "padding-left 200ms ease-out",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
