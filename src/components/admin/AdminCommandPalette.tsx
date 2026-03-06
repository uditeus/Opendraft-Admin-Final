import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AppIcon } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";

const SEARCH_ITEMS = [
    // Pages
    { type: "page", label: "Dashboard", path: "/admin", icon: "PencilEdit02Icon" },
    { type: "page", label: "Realtime", path: "/admin/realtime", icon: "ActivityIcon" },
    { type: "page", label: "Events", path: "/admin/events", icon: "Gitbook" },
    { type: "page", label: "Usuários", path: "/admin/users", icon: "LibrariesIcon" },
    { type: "page", label: "Atividade de Usuário", path: "/admin/users/activity", icon: "ClockIcon" },
    { type: "page", label: "Segurança de Usuário", path: "/admin/users/security", icon: "LockIcon" },
    { type: "page", label: "Assinaturas", path: "/admin/subscriptions", icon: "CreditCard" },
    { type: "page", label: "API & AI Usage", path: "/admin/api-usage", icon: "Zap" },
    { type: "page", label: "AI Custos", path: "/admin/api-usage/costs", icon: "BarChart3" },
    { type: "page", label: "AI Modelos", path: "/admin/api-usage/models", icon: "LayersIcon" },
    { type: "page", label: "AI Limites", path: "/admin/api-usage/limits", icon: "Filter" },
    { type: "page", label: "Financeiro", path: "/admin/financials", icon: "BarChart3" },
    { type: "page", label: "Tráfego & Aquisição", path: "/admin/growth", icon: "ChartBarIcon" },
    { type: "page", label: "Retenção", path: "/admin/analytics/retention", icon: "UserGroupIcon" },
    { type: "page", label: "Produto", path: "/admin/product", icon: "Compass" },
    { type: "page", label: "Economics", path: "/admin/economics", icon: "Saturn01Icon" },
    { type: "page", label: "Tickets", path: "/admin/tickets", icon: "MessageSquare" },
    { type: "page", label: "Logs", path: "/admin/logs", icon: "Gitbook" },
    { type: "page", label: "Sistema", path: "/admin/settings", icon: "Settings" },
    { type: "page", label: "Base de Conhecimento", path: "/admin/developer/knowledge", icon: "DatabaseIcon" },
    { type: "page", label: "Experimentos", path: "/admin/developer/experiments", icon: "Sparkles" },
    { type: "page", label: "Filas de Tarefas", path: "/admin/developer/queues", icon: "LayersIcon" },
    { type: "page", label: "Manutenção", path: "/admin/system/maintenance", icon: "Settings" },
    // Users
    { type: "user", label: "Bruno Mendes", path: "/admin/users/1", icon: "User" },
    { type: "user", label: "Ana Costa", path: "/admin/users/2", icon: "User" },
    { type: "user", label: "Pedro Lima", path: "/admin/users/3", icon: "User" },
    { type: "user", label: "Julia Santos", path: "/admin/users/4", icon: "User" },
    // Actions
    { type: "action", label: "Kill Switch — Desativar IA", path: "/admin/settings", icon: "Zap" },
    { type: "action", label: "Prompt Manager", path: "/admin/settings", icon: "Pencil" },
    { type: "action", label: "Health Checks", path: "/admin/settings", icon: "CheckCircle2Icon" },
];

const TYPE_LABEL: Record<string, string> = {
    page: "Páginas",
    user: "Usuários",
    action: "Ações",
};

export function AdminCommandPalette() {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const navigate = useNavigate();
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Ctrl+K
    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((v) => !v);
            }
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    React.useEffect(() => {
        if (open) {
            setQuery("");
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    const filtered = query.length === 0
        ? SEARCH_ITEMS
        : SEARCH_ITEMS.filter((item) =>
            item.label.toLowerCase().includes(query.toLowerCase())
        );

    const grouped = React.useMemo(() => {
        const groups: Record<string, typeof SEARCH_ITEMS> = {};
        for (const item of filtered) {
            if (!groups[item.type]) groups[item.type] = [];
            groups[item.type].push(item);
        }
        return groups;
    }, [filtered]);

    const flatItems = filtered;

    const handleSelect = (item: typeof SEARCH_ITEMS[0]) => {
        navigate(item.path);
        setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((i) => Math.min(i + 1, flatItems.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && flatItems[selectedIndex]) {
            handleSelect(flatItems[selectedIndex]);
        }
    };

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

            {/* Palette */}
            <div className="fixed left-1/2 top-[20%] z-50 w-full max-w-[540px] -translate-x-1/2 rounded-xl border border-sidebar-border/50 bg-popover shadow-2xl overflow-hidden">
                {/* Input */}
                <div className="flex items-center gap-3 border-b border-sidebar-border/30 px-4 py-3">
                    <AppIcon name="Search" className="h-4 w-4 text-muted-foreground shrink-0" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                        onKeyDown={handleKeyDown}
                        placeholder="Buscar usuário, página, transação, ticket..."
                        className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/50 outline-none"
                    />
                    <kbd className="hidden sm:inline text-[10px] text-muted-foreground/50 border border-sidebar-border/30 rounded px-1.5 py-0.5 font-mono">ESC</kbd>
                </div>

                {/* Results */}
                <div className="max-h-[360px] overflow-y-auto py-2">
                    {filtered.length === 0 && (
                        <div className="px-4 py-8 text-center text-[13px] text-muted-foreground">Nenhum resultado encontrado</div>
                    )}

                    {Object.entries(grouped).map(([type, items]) => (
                        <div key={type}>
                            <div className="px-4 py-1.5">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">{TYPE_LABEL[type] || type}</span>
                            </div>
                            {items.map((item) => {
                                const globalIdx = flatItems.indexOf(item);
                                return (
                                    <button
                                        key={item.label + item.path}
                                        onClick={() => handleSelect(item)}
                                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                                        className={cn(
                                            "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                                            globalIdx === selectedIndex ? "bg-sidebar-accent/20" : "hover:bg-sidebar-accent/10",
                                        )}
                                    >
                                        <AppIcon name={item.icon as any} className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                                        <span className="text-[13px] text-foreground/80">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="border-t border-sidebar-border/30 px-4 py-2 flex items-center gap-4 text-[10px] text-muted-foreground/50">
                    <span>↑↓ navegar</span>
                    <span>↵ selecionar</span>
                    <span>esc fechar</span>
                </div>
            </div>
        </>
    );
}
