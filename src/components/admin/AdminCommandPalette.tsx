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
    { type: "page", label: "Economics", path: "/admin/economics", icon: "PlanMode" },
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
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md transition-opacity" onClick={() => setOpen(false)} />

            {/* Palette */}
            <div className="fixed left-1/2 top-[15%] z-[100] w-full max-w-[640px] -translate-x-1/2 rounded-[32px] border border-border/10 bg-background shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Input */}
                <div className="flex items-center gap-4 px-8 py-6 border-b border-border/10">
                    <AppIcon name="Search" className="h-6 w-6 text-foreground/40 shrink-0" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                        onKeyDown={handleKeyDown}
                        placeholder="Search for anything..."
                        className="flex-1 bg-transparent text-xl  text-foreground placeholder:text-muted-foreground/30 outline-none"
                    />
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/10 bg-muted/20 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span>ESC</span>
                    </div>
                </div>

                {/* Results */}
                <div className="max-h-[480px] overflow-y-auto py-6 px-4 no-scrollbar">
                    {filtered.length === 0 && (
                        <div className="px-8 py-12 text-center text-sm text-muted-foreground/50  italic">Nenhum resultado encontrado</div>
                    )}

                    {Object.entries(grouped).map(([type, items]) => (
                        <div key={type} className="mb-8 last:mb-0">
                            <div className="px-4 mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">{TYPE_LABEL[type] || type}</span>
                            </div>
                            <div className="grid gap-1">
                                {items.map((item) => {
                                    const globalIdx = flatItems.indexOf(item);
                                    const active = globalIdx === selectedIndex;
                                    return (
                                        <button
                                            key={item.label + item.path}
                                            onClick={() => handleSelect(item)}
                                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                                            className={cn(
                                                "flex w-full items-center gap-4 px-4 py-3.5 text-left transition-all rounded-2xl",
                                                active ? "bg-foreground text-background" : "text-foreground/70 hover:bg-muted/30",
                                            )}
                                        >
                                            <div className={cn(
                                                "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                                                active ? "bg-background/10" : "bg-muted/30"
                                            )}>
                                                <AppIcon name={item.icon as any} className={cn("h-5 w-5", active ? "text-background" : "text-muted-foreground")} />
                                            </div>
                                            <span className="text-base font-medium">{item.label}</span>
                                            {active && (
                                                <span className="ml-auto text-[10px] font-bold uppercase tracking-widest opacity-40">SELECT</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="border-t border-border/10 px-8 py-4 flex items-center gap-8 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.15em]">
                    <div className="flex items-center gap-2">
                        <span className="text-foreground/40">↑↓</span> NAVEGAR
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-foreground/40">ENTER</span> SELECIONAR
                    </div>
                </div>
            </div>
        </>
    );
}
