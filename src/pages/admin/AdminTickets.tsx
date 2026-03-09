import * as React from "react";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/icons/AppIcon";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { ADMIN_TICKETS as MOCK_TICKETS } from "@/lib/admin-mock";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    open: { label: "Aberto", color: "text-foreground bg-foreground/10" },
    replied: { label: "Respondido", color: "text-amber-400 bg-amber-500/10" },
    resolved: { label: "Resolvido", color: "text-emerald-500 bg-emerald-500/10" },
    closed: { label: "Fechado", color: "text-muted-foreground bg-muted/30" },
};

const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
    urgent: { label: "Urgente", color: "text-red-500 bg-red-500/10" },
    high: { label: "Alta", color: "text-orange-400 bg-orange-500/10" },
    medium: { label: "Média", color: "text-amber-400 bg-amber-500/10" },
    low: { label: "Baixa", color: "text-muted-foreground bg-muted/20" },
};

export default function AdminTickets() {
    const [filter, setFilter] = React.useState("all");
    const [selected, setSelected] = React.useState<string | null>(null);

    const filtered = filter === "all" ? MOCK_TICKETS : MOCK_TICKETS.filter((t) => t.status === filter);
    const selectedTicket = MOCK_TICKETS.find((t) => t.id === selected);

    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-8">
                <div>
                    <h1 className="text-4xl font-serif font-normal text-foreground tracking-tight">Support Tickets</h1>
                    <p className="text-sm text-muted-foreground mt-2">Tickets de suporte e solicitações dos usuários.</p>
                </div>
            </div>

            <div className="mb-12">
                <AdminSubNav
                    items={[
                        { label: "Overview", path: "/admin/users" },
                        { label: "Tickets", path: "/admin/tickets" },
                        { label: "Activity", path: "/admin/users/activity" },
                        { label: "Security", path: "/admin/users/security" },
                    ]}
                />
            </div>

            <div className="flex items-center gap-4 mb-8">
                {["all", "open", "replied", "resolved", "closed"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "px-4 py-2 rounded-full text-[13px] font-bold transition-all border",
                            filter === f
                                ? "bg-foreground text-background border-foreground"
                                : "bg-transparent border-border/40 text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                        )}
                    >
                        {f === "all" ? "Todos" : STATUS_MAP[f]?.label || f}
                    </button>
                ))}
            </div>

            <div className="flex gap-12 items-start shrink-0">
                {/* Ticket list */}
                <div className={cn("transition-all duration-300 shrink-0", selected ? "w-[400px]" : "w-full")}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/20">
                                    {["ID", "USUÁRIO", "ASSUNTO", "STATUS", "PRIORIDADE", "DATA"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/10">
                                {filtered.map((t) => {
                                    const st = STATUS_MAP[t.status];
                                    const pr = PRIORITY_MAP[t.priority];
                                    return (
                                        <tr
                                            key={t.id}
                                            className={cn(
                                                "hover:bg-muted/30 transition-colors cursor-pointer group",
                                                selected === t.id && "bg-muted/50 border-l-2 border-foreground"
                                            )}
                                            onClick={() => setSelected(selected === t.id ? null : t.id)}
                                        >
                                            <td className="px-4 py-4 text-[12px] font-bold font-mono text-muted-foreground">{t.id}</td>
                                            <td className="px-4 py-4 text-sm font-semibold text-foreground">{t.user}</td>
                                            <td className="px-4 py-4 text-sm text-foreground/80 max-w-[200px] truncate">{t.subject}</td>
                                            <td className="px-4 py-4">
                                                <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", st.color)}>{st.label}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", pr.color)}>{pr.label}</span>
                                            </td>
                                            <td className="px-4 py-4 text-[12px] text-muted-foreground font-medium whitespace-nowrap">{t.created.split(' ')[0]}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Ticket detail panel */}
                {selectedTicket && (
                    <div className="flex-1 min-w-[400px] border-l border-border/10 pl-12 sticky top-24 animate-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-[11px] font-bold font-mono text-foreground bg-foreground/10 px-3 py-1 rounded-full">{selectedTicket.id}</span>
                            <button onClick={() => setSelected(null)} className="h-10 w-10 rounded-full border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                                <AppIcon name="X" className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-serif text-foreground leading-tight mb-6">{selectedTicket.subject}</h3>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-sm text-muted-foreground uppercase">
                                    {selectedTicket.user.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-foreground">{selectedTicket.user}</span>
                                    <span className="text-xs text-muted-foreground font-medium">{selectedTicket.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-12">
                            <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", STATUS_MAP[selectedTicket.status].color)}>{STATUS_MAP[selectedTicket.status].label}</span>
                            <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", PRIORITY_MAP[selectedTicket.priority].color)}>{PRIORITY_MAP[selectedTicket.priority].label}</span>
                        </div>

                        <div className="pt-12 border-t border-border/10">
                            <textarea
                                placeholder="Digite sua resposta..."
                                className="w-full bg-transparent border border-border/40 rounded-2xl p-4 text-sm font-medium min-h-[160px] outline-none focus:border-foreground/30 transition-all resize-none leading-relaxed"
                            />
                            <div className="flex justify-end mt-6">
                                <button className="bg-foreground text-background px-8 py-3 rounded-full text-sm font-bold hover:opacity-90 transition-all">
                                    ENVIAR RESPOSTA
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
