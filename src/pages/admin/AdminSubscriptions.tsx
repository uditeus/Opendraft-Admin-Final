import * as React from "react";
import { AppIcon } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";

const MOCK_SUBS = [
    { id: 1, user: "Bruno Mendes", email: "bruno@example.com", plan: "Pro", status: "active", price: "R$ 97", started: "14/01/2024", nextBilling: "14/04/2025", gateway: "Stripe" },
    { id: 2, user: "Ana Costa", email: "ana@example.com", plan: "Max", status: "active", price: "R$ 197", started: "03/06/2024", nextBilling: "03/04/2025", gateway: "Stripe" },
    { id: 3, user: "Carlos Silva", email: "carlos@example.com", plan: "Pro", status: "canceled", price: "R$ 97", started: "20/09/2024", nextBilling: "—", gateway: "Stripe" },
    { id: 4, user: "Julia Santos", email: "julia@example.com", plan: "Free", status: "active", price: "R$ 0", started: "01/03/2025", nextBilling: "—", gateway: "—" },
    { id: 5, user: "Pedro Lima", email: "pedro@example.com", plan: "Max X", status: "active", price: "R$ 497", started: "12/11/2024", nextBilling: "12/04/2025", gateway: "Stripe" },
    { id: 6, user: "Maria Oliveira", email: "maria@example.com", plan: "Pro", status: "past_due", price: "R$ 97", started: "18/07/2024", nextBilling: "18/03/2025", gateway: "Stripe" },
];

const PLAN_DISTRIBUTION = [
    { plan: "Free", count: 847, pct: 68 },
    { plan: "Pro", count: 312, pct: 25 },
    { plan: "Max", count: 72, pct: 5.8 },
    { plan: "Max X", count: 16, pct: 1.2 },
];

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    active: { label: "Ativa", color: "text-emerald-500 bg-emerald-500/10" },
    canceled: { label: "Cancelada", color: "text-red-400 bg-red-500/10" },
    past_due: { label: "Inadimplente", color: "text-amber-400 bg-amber-500/10" },
    trialing: { label: "Trial", color: "text-blue-400 bg-blue-500/10" },
};

import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminSubscriptions() {
    const [filter, setFilter] = React.useState("all");

    const filtered = filter === "all" ? MOCK_SUBS : MOCK_SUBS.filter((s) => s.status === filter);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">Revenue & Subscriptions</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Gestão de planos e assinaturas</p>
            </div>

            <AdminSubNav
                items={[
                    { label: "MRR", path: "/admin/financials" },
                    { label: "Subscriptions", path: "/admin/subscriptions" },
                    { label: "Economics", path: "/admin/economics" },
                ]}
            />

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "TOTAL ASSINATURAS", value: "1.247" },
                    { label: "ASSINATURAS ATIVAS", value: "1.184" },
                    { label: "CANCELAMENTOS (30D)", value: "23" },
                    { label: "INADIMPLENTES", value: "14" },
                ].map((kpi) => (
                    <div key={kpi.label} className="rounded-xl border border-border/50 bg-card shadow-sm p-5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-1.5">{kpi.label}</span>
                        <p className="mt-2 text-2xl font-semibold text-foreground tracking-tight">{kpi.value}</p>
                    </div>
                ))}
            </div>

            {/* Distribuição por plano */}
            <div className="rounded-xl border border-border/50 bg-card shadow-sm p-6">
                <h3 className="text-[14px] font-bold text-foreground mb-6">Distribuição por plano</h3>
                <div className="space-y-4">
                    {PLAN_DISTRIBUTION.map((p) => (
                        <div key={p.plan} className="flex items-center gap-4 group">
                            <span className="w-16 text-[13px] text-foreground/80 font-bold">{p.plan}</span>
                            <div className="flex-1 h-3 rounded-full bg-muted/40 overflow-hidden relative">
                                <div className="absolute inset-y-0 left-0 rounded-full bg-[#3E768D] transition-all duration-700 ease-out shadow-[0_0_12px_rgba(62,118,141,0.3)]" style={{ width: `${p.pct}%` }} />
                            </div>
                            <span className="text-[12px] text-muted-foreground font-semibold w-24 text-right tabular-nums">{p.count} <span className="text-muted-foreground/40 font-medium ml-1">({p.pct}%)</span></span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 px-1">
                {[
                    { key: "all", label: "Todas" },
                    { key: "active", label: "Ativas" },
                    { key: "canceled", label: "Canceladas" },
                    { key: "past_due", label: "Inadimplentes" },
                ].map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={cn(
                            "px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 border shadow-sm",
                            filter === f.key
                                ? "bg-[hsl(var(--chat-active))] border-border/60 text-foreground"
                                : "bg-card border-border/40 text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden mb-4">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/30 bg-muted/20">
                                {["USUÁRIO", "PLANO", "STATUS", "PREÇO", "INÍCIO", "PRÓX. COBRANÇA", "GATEWAY"].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {filtered.map((s) => {
                                const st = STATUS_MAP[s.status] ?? STATUS_MAP.active;
                                return (
                                    <tr key={s.id} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-[13px] font-bold text-foreground/90">{s.user}</div>
                                            <div className="text-[11px] text-muted-foreground font-medium">{s.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-[13px] text-foreground/80 font-bold">{s.plan}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm", st.color)}>{st.label}</span>
                                        </td>
                                        <td className="px-6 py-4 text-[13px] text-foreground/90 font-bold tabular-nums">{s.price}</td>
                                        <td className="px-6 py-4 text-[13px] text-muted-foreground font-medium">{s.started}</td>
                                        <td className="px-6 py-4 text-[13px] text-muted-foreground font-medium">{s.nextBilling}</td>
                                        <td className="px-6 py-4 text-[13px] text-muted-foreground font-medium">{s.gateway}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
