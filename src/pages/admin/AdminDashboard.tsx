import * as React from "react";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/icons/AppIcon";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MOCK_RESULTS = [
    { id: "1", type: "top", title: "Matheus Aguiar", subtitle: "Administrador • Logado há 5 min", shortcut: "U", path: "/admin/users/usr_1" },
    { id: "2", type: "suggestion", title: "Receita mensal: Fevereiro", subtitle: "Crescimento de 12% vs janeiro", shortcut: "F", path: "/admin/financials" },
    { id: "3", type: "suggestion", title: "Modelos de IA: Llama 3", subtitle: "Funcionando normalmente", shortcut: "C", path: "/admin/api-usage/models" },
    { id: "4", type: "folder", title: "Logs de segurança", subtitle: "C:/system/logs/security", shortcut: "S", path: "/admin/logs" },
    { id: "5", type: "folder", title: "Métricas de retenção", subtitle: "C:/stats/retention", shortcut: "R", path: "/admin/analytics/retention" },
];

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [draft, setDraft] = React.useState("");
    const [isFocused, setIsFocused] = React.useState(false);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "Bom dia";
        if (hour >= 12 && hour < 18) return "Boa tarde";
        if (hour >= 18 && hour < 23) return "Boa noite";
        return "Boa madrugada";
    };

    const headline = `${getGreeting()}, Opendraft`;

    const filtered = draft.trim().length > 0
        ? MOCK_RESULTS.filter(r => r.title.toLowerCase().includes(draft.toLowerCase()))
        : [];

    return (
        <div className="flex flex-col w-full h-full items-center pt-[15vh]">
            <div className="w-full max-w-[720px] px-4 flex flex-col items-center">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-14 text-center text-[40px] font-normal tracking-tight text-foreground font-serif"
                >
                    {headline}
                </motion.h1>

                <div className="w-full relative">
                    <div className={cn(
                        "flex flex-col w-full bg-[hsl(var(--chat-composer))] animate-in fade-in duration-300 rounded-[26px] overflow-hidden transition-all shadow-elev-2 border border-border",
                        "dark:border-border/10",
                        isFocused ? "border-foreground/20 dark:border-border/20" : ""
                    )}>
                        <div className="flex items-center h-[52px] px-6">
                            <div className="mr-4 text-muted-foreground/40 shrink-0">
                                <AppIcon name="Search" className="h-[18px] w-[18px]" strokeWidth={2.5} />
                            </div>
                            <input
                                type="text"
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                                placeholder="Pesquisar..."
                                className="flex-1 bg-transparent text-[16px] text-foreground placeholder:text-muted-foreground/40 outline-none font-sans"
                                autoFocus
                            />
                        </div>

                        <AnimatePresence>
                            {draft.trim() && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                                    className="border-t border-border/5 overflow-hidden"
                                >
                                    <div className="p-2 pt-1 pb-3">
                                        {/* Best Match - Simplified */}
                                        {filtered.filter(r => r.type === "top").map(res => (
                                            <div
                                                key={res.id}
                                                onClick={() => navigate(res.path || "/admin")}
                                                className="mx-1 p-3.5 bg-foreground/[0.03] border border-border/10 rounded-xl flex items-center gap-4 transition-colors hover:bg-foreground/[0.05] cursor-pointer"
                                            >
                                                <div className="h-9 w-9 flex items-center justify-center bg-muted/60 rounded-lg text-muted-foreground/60 text-[13px]">
                                                    {res.shortcut}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-[14.5px] font-medium text-foreground leading-tight">{res.title}</div>
                                                    <div className="text-[12px] text-muted-foreground/50 mt-1">{res.subtitle}</div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="px-5 pt-4 pb-2 text-[11px] font-medium text-muted-foreground/50 tracking-tight">
                                            Sugestões
                                        </div>
                                        {filtered.filter(r => r.type === "suggestion").map(res => (
                                            <div
                                                key={res.id}
                                                onClick={() => navigate(res.path || "/admin")}
                                                className="mx-1 px-5 py-2.5 rounded-lg flex items-center transition-colors hover:bg-foreground/[0.03] cursor-pointer group"
                                            >
                                                <div className="flex-1 text-[14px] text-foreground/60 group-hover:text-foreground/90 transition-colors">
                                                    {res.title} <span className="text-muted-foreground/40 ml-2">— {res.subtitle}</span>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="px-5 pt-4 pb-2 text-[11px] font-medium text-muted-foreground/50 border-t border-border/5 mt-2 tracking-tight">
                                            Módulos
                                        </div>
                                        {filtered.filter(r => r.type === "folder").map(res => (
                                            <div
                                                key={res.id}
                                                onClick={() => navigate(res.path || "/admin")}
                                                className="mx-1 px-5 py-2.5 rounded-lg flex flex-col transition-colors hover:bg-foreground/[0.03] cursor-pointer group"
                                            >
                                                <div className="text-[14px] text-foreground/60 group-hover:text-foreground/90 transition-colors">{res.title}</div>
                                                <div className="text-[11px] text-muted-foreground/30">{res.subtitle}</div>
                                            </div>
                                        ))}
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
