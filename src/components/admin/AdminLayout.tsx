import * as React from "react";
import { Outlet } from "react-router-dom";

import { AppIcon } from "@/components/icons/AppIcon";
import { Button } from "@/components/ui/button";
import { ChatTooltip } from "@/components/design-system/chat-tooltip";
import { AdminSidebar, ADMIN_SIDEBAR_WIDTH_PX, ADMIN_SIDEBAR_COLLAPSED_WIDTH_PX } from "@/components/admin/AdminSidebar";
import { AdminCommandPalette } from "@/components/admin/AdminCommandPalette";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function AdminLayout() {
    const isMobile = useIsMobile();
    const [sidebarOpen, setSidebarOpen] = React.useState(() => {
        const saved = localStorage.getItem("adminSidebarOpen");
        return saved !== null ? saved === "true" : true;
    });
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(() => {
        const saved = localStorage.getItem("adminSidebarCollapsed");
        return saved !== null ? saved === "true" : false;
    });

    React.useEffect(() => {
        localStorage.setItem("adminSidebarOpen", String(sidebarOpen));
    }, [sidebarOpen]);

    React.useEffect(() => {
        localStorage.setItem("adminSidebarCollapsed", String(sidebarCollapsed));
    }, [sidebarCollapsed]);

    return (
        <div className="h-screen w-full bg-background text-foreground transition-colors duration-500 overflow-hidden">
            <AdminCommandPalette />

            {/* Mobile Overlay */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-all duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Top-left sidebar trigger */}
            <div className="fixed left-3 top-3 z-50">
                <ChatTooltip label={sidebarOpen ? "Fechar barra lateral" : "Abrir barra lateral"}>
                    <Button
                        variant="chatIcon"
                        size="chatIcon"
                        aria-label={sidebarOpen ? "Fechar barra lateral" : "Abrir barra lateral"}
                        data-state={sidebarOpen ? "open" : "closed"}
                        aria-expanded={sidebarOpen}
                        onClick={() => setSidebarOpen((v) => !v)}
                    >
                        <AppIcon name={sidebarOpen && isMobile ? "X" : "LayoutLeftIcon"} />
                    </Button>
                </ChatTooltip>
            </div>

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50",
                    "border-0 bg-sidebar text-sidebar-foreground shadow-2xl lg:shadow-none",
                    "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                )}
                style={{ width: sidebarCollapsed ? ADMIN_SIDEBAR_COLLAPSED_WIDTH_PX : ADMIN_SIDEBAR_WIDTH_PX }}
            >
                <AdminSidebar
                    collapsed={!isMobile && sidebarOpen ? sidebarCollapsed : false}
                    onToggleCollapsed={() => {
                        if (isMobile) {
                            setSidebarOpen(false);
                        } else {
                            setSidebarCollapsed((v) => !v);
                        }
                    }}
                />
            </div>

            {/* Main content */}
            <div
                className="h-full w-full"
                style={{
                    paddingLeft: !isMobile && sidebarOpen
                        ? sidebarCollapsed
                            ? ADMIN_SIDEBAR_COLLAPSED_WIDTH_PX
                            : ADMIN_SIDEBAR_WIDTH_PX
                        : 0,
                    transition: "padding-left 300ms ease-[cubic-bezier(0.4,0,0.2,1)]",
                }}
            >
                <div className="h-full overflow-y-auto no-scrollbar scroll-smooth">
                    <div className="w-full px-4 lg:pl-[247px] lg:pr-[246px] pt-16 pb-24">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
