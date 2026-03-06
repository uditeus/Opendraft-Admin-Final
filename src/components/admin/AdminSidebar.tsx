import * as React from "react";
import { AppIcon, createAppIcon } from "@/components/icons/AppIcon";
import { ChatTooltip } from "@/components/design-system/chat-tooltip";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/components/auth/AuthProvider";

export const ADMIN_SIDEBAR_WIDTH_PX = 300;
export const ADMIN_SIDEBAR_COLLAPSED_WIDTH_PX = 52;

const MINI_BUTTON_CLASS = "h-10 w-10";
const MINI_ICON_CLASS = "h-[18px] w-[18px]";

type AdminNavItem = {
    id: string;
    label: string;
    path: string;
    Icon: React.ComponentType<{ className?: string }>;
    requiresRole?: "admin" | "dev" | "owner";
};

const adminItems: AdminNavItem[] = [
    { id: "overview", label: "Overview", path: "/admin", Icon: createAppIcon("PencilEdit02Icon") },
    { id: "users", label: "Users", path: "/admin/users", Icon: createAppIcon("User") },
    { id: "revenue", label: "Revenue", path: "/admin/financials", Icon: createAppIcon("CreditCard"), requiresRole: "owner" },
    { id: "analytics", label: "Analytics", path: "/admin/growth", Icon: createAppIcon("ChartBarIcon") },
    { id: "ai", label: "AI", path: "/admin/api-usage", Icon: createAppIcon("Zap") },
    { id: "developer", label: "Developer", path: "/admin/settings", Icon: createAppIcon("DatabaseIcon"), requiresRole: "dev" },
    { id: "system", label: "System", path: "/admin/logs", Icon: createAppIcon("Settings") },
];

export function AdminSidebar({
    collapsed = false,
    onToggleCollapsed,
}: {
    collapsed?: boolean;
    onToggleCollapsed?: () => void;
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const { hasRole } = useRole();

    const isItemActive = (item: AdminNavItem) => {
        // Precise active state for grouped items
        if (item.id === "overview") return location.pathname === "/admin" || location.pathname === "/admin/";
        if (item.id === "users") return location.pathname.includes("/users") || location.pathname.includes("/admin/tickets");
        if (item.id === "revenue") return location.pathname.includes("/financials") || location.pathname.includes("/subscriptions") || location.pathname.includes("/economics");
        if (item.id === "analytics") return location.pathname.includes("/growth") || location.pathname.includes("/product") || location.pathname.includes("/retention");
        if (item.id === "ai") return location.pathname.includes("/api-usage");
        if (item.id === "developer") return location.pathname.includes("/settings");
        if (item.id === "system") return location.pathname.includes("/logs");
        return false;
    };

    const visibleItems = adminItems.filter((item) => {
        if (!item.requiresRole) return true;
        return hasRole(item.requiresRole);
    });

    if (collapsed) {
        return (
            <aside className="flex h-full flex-col items-center px-1.5 py-3">
                <div className="flex w-full flex-col items-center">
                    <ChatTooltip label="Expandir barra lateral" side="right" align="center" sideOffset={10}>
                        <button
                            type="button"
                            className={cn(
                                "group chat-focus relative grid place-items-center rounded-full transition-colors",
                                MINI_BUTTON_CLASS,
                                "bg-transparent text-sidebar-foreground/70 hover:bg-[hsl(var(--chat-hover))] hover:text-sidebar-foreground",
                            )}
                            onClick={onToggleCollapsed}
                        >
                            <AppIcon name="LayoutLeftIcon" className={MINI_ICON_CLASS} />
                        </button>
                    </ChatTooltip>
                </div>

                <div className="mt-2 flex w-full flex-col items-center gap-1">
                    {visibleItems.map((item) => {
                        const { id, Icon, label } = item;
                        const active = isItemActive(item);
                        return (
                            <ChatTooltip key={id} label={label} side="right" align="center" sideOffset={10}>
                                <button
                                    type="button"
                                    className={cn(
                                        "chat-focus grid place-items-center rounded-full transition-colors",
                                        MINI_BUTTON_CLASS,
                                        "text-sidebar-foreground/90 hover:bg-[hsl(var(--chat-hover))] hover:text-sidebar-foreground",
                                        active && "bg-[hsl(var(--chat-hover))] text-sidebar-foreground"
                                    )}
                                    onClick={() => navigate(item.path)}
                                >
                                    <Icon className={cn(MINI_ICON_CLASS, "opacity-90")} />
                                </button>
                            </ChatTooltip>
                        );
                    })}
                </div>

                <div className="mt-auto flex w-full flex-col items-center pb-4">
                    <ChatTooltip label="Voltar ao app" side="right" align="center" sideOffset={10}>
                        <button
                            type="button"
                            className={cn(
                                "chat-focus grid place-items-center rounded-full transition-colors",
                                MINI_BUTTON_CLASS,
                                "text-sidebar-foreground/70 hover:bg-red-500/10 hover:text-red-500",
                            )}
                            onClick={() => { window.location.href = "/"; }}
                        >
                            <AppIcon name="ArrowLeft" className={MINI_ICON_CLASS} />
                        </button>
                    </ChatTooltip>
                </div>
            </aside>
        );
    }

    return (
        <aside className="flex h-full flex-col">
            <div className="pt-2 pb-1 px-3">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 flex-1 items-center px-3 py-2 text-sidebar-foreground">
                        <span className="truncate text-lg font-semibold tracking-tight">Console Opendraft</span>
                    </div>
                    {onToggleCollapsed && (
                        <ChatTooltip label="Encolher barra lateral">
                            <button
                                type="button"
                                className="chat-focus grid h-10 w-10 place-items-center rounded-xl bg-transparent text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
                                onClick={onToggleCollapsed}
                            >
                                <AppIcon name="LayoutLeftIcon" className={MINI_ICON_CLASS} />
                            </button>
                        </ChatTooltip>
                    )}
                </div>
            </div>

            <div className="pt-0 px-3 flex-1 overflow-y-auto no-scrollbar">
                <div className="space-y-1">
                    {visibleItems.map((item) => {
                        const { id, Icon, label } = item;
                        const active = isItemActive(item);
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => navigate(item.path)}
                                className={cn(
                                    "chat-focus text-sm",
                                    "group flex w-full items-center gap-[11px] rounded-lg px-3 py-2 text-left transition-colors",
                                    "text-sidebar-foreground/90 hover:bg-[hsl(var(--chat-hover))] hover:text-sidebar-foreground",
                                    active && "bg-[hsl(var(--chat-hover))] text-sidebar-foreground font-medium",
                                )}
                            >
                                <Icon className={cn(MINI_ICON_CLASS, "shrink-0 opacity-90")} />
                                <span className="min-w-0 flex-1 truncate">{label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="px-3 pb-4">
                <button
                    type="button"
                    onClick={() => { window.location.href = "/"; }}
                    className={cn(
                        "chat-focus text-sm",
                        "group flex w-full items-center gap-[11px] rounded-lg px-3 py-2.5 text-left transition-colors",
                        "text-sidebar-foreground/70 hover:bg-red-500/10 hover:text-red-500",
                    )}
                >
                    <AppIcon name="ArrowLeft" className={cn(MINI_ICON_CLASS, "shrink-0 opacity-70")} />
                    <span className="min-w-0 flex-1 truncate font-medium">Voltar ao app</span>
                </button>
            </div>
        </aside>
    );
}
