import * as React from "react";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/icons/AppIcon";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

import { ADMIN_TICKETS as MOCK_TICKETS } from "@/lib/admin-mock";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    open: { label: "Aberto", color: "text-blue-400 bg-blue-500/10" },
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
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">Support Tickets</h1>
                    <p className="text-[13.5px] text-muted-foreground mt-0.5">Tickets de suporte, dúvidas e solicitações dos usuários</p>
                </div>
            </div>

            <AdminSubNav
                items={[
                    { label: "Overview", path: "/admin/users" },
                    { label: "Tickets", path: "/admin/tickets" },
                    { label: "Activity", path: "/admin/users/activity" },
                    { label: "Security", path: "/admin/users/security" },
                ]}
            />

            <div className="flex items-center gap-2">
                {["all", "open", "replied", "resolved", "closed"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "px-4 py-2 rounded-full text-[12px] font-bold transition-all border shadow-sm uppercase tracking-wider",
                            filter === f
                                ? "bg-[#3E768D] border-[#3E768D] text-white shadow-[0_0_12px_rgba(62,118,141,0.3)]"
                                : "border-border/40 bg-card text-muted-foreground hover:text-foreground hover:border-border",
                        )}
                    >
                        {f === "all" ? "Todos" : STATUS_MAP[f]?.label || f}
                    </button>
                ))}
            </div>

            <div className="flex gap-6 items-start">
                {/* Ticket list */}
                <div className={cn("rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden transition-all duration-300", selected ? "w-1/2" : "w-full")}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/30 bg-muted/20">
                                    {["ID", "USUÁRIO", "ASSUNTO", "STATUS", "PRIORIDADE", "DATA"].map((h) => (
                                        <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {filtered.map((t) => {
                                    const st = STATUS_MAP[t.status];
                                    const pr = PRIORITY_MAP[t.priority];
                                    return (
                                        <tr
                                            key={t.id}
                                            className={cn(
                                                "hover:bg-muted/10 transition-colors cursor-pointer group",
                                                selected === t.id && "bg-[#3E768D]/5"
                                            )}
                                            onClick={() => setSelected(selected === t.id ? null : t.id)}
                                        >
                                            <td className="px-5 py-4 text-[12px] font-bold font-mono text-muted-foreground group-hover:text-[#3E768D]">{t.id}</td>
                                            <td className="px-5 py-4 text-[13px] font-bold text-foreground/90">{t.user}</td>
                                            <td className="px-5 py-4 text-[13px] text-foreground/70 max-w-[200px] truncate font-medium">{t.subject}</td>
                                            <td className="px-5 py-4">
                                                <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm", st.color)}>{st.label}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm", pr.color)}>{pr.label}</span>
                                            </td>
                                            <td className="px-5 py-4 text-[12px] text-muted-foreground font-medium whitespace-nowrap">{t.created.split(' ')[0]}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Ticket detail panel */}
                {selectedTicket && (
                    <div className="w-1/2 rounded-xl border border-border/50 bg-card shadow-sm p-8 flex flex-col gap-6 sticky top-24 animate-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center justify-between">
                            <span className="text-[12px] font-bold font-mono text-[#3E768D] bg-[#3E768D]/10 px-3 py-1 rounded-full">{selectedTicket.id}</span>
                            <button onClick={() => setSelected(null)} className="h-8 w-8 rounded-full border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-all">
                                <AppIcon name="X" className="h-4 w-4" />
                            </button>
                        </div>

                        <div>
                            <h3 className="text-[20px] font-bold text-foreground leading-tight">{selectedTicket.subject}</h3>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center font-bold text-[12px] text-muted-foreground uppercase">
                                    {selectedTicket.user.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13.5px] font-bold text-foreground/90">{selectedTicket.user}</span>
                                    <span className="text-[12px] text-muted-foreground font-medium">{selectedTicket.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm", STATUS_MAP[selectedTicket.status].color)}>{STATUS_MAP[selectedTicket.status].label}</span>
                            <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm", PRIORITY_MAP[selectedTicket.priority].color)}>{PRIORITY_MAP[selectedTicket.priority].label}</span>
                        </div>

                        <div className="mt-4 pt-6 border-t border-border/30">
                            <textarea
                                placeholder="Digite sua resposta..."
                                className="w-full bg-muted/20 border border-border/40 rounded-xl p-4 text-[13.5px] font-medium min-h-[120px] outline-none focus:border-[#3E768D]/50 transition-all resize-none"
                            />
                            <div className="flex justify-end mt-4">
                                <button className="bg-[#3E768D] text-white px-6 py-2.5 rounded-full text-[13px] font-bold shadow-lg shadow-[#3E768D]/20 hover:shadow-xl hover:translate-y-[-1px] transition-all">
                                    Enviar Resposta
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
