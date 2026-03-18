import * as React from "react";
import { AppIcon } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { motion } from "framer-motion";

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
    trialing: { label: "Trial", color: "text-foreground bg-foreground/10" },
};

import { AdminTable } from "@/components/admin/AdminTable";

export default function AdminSubscriptions() {
    const [filter, setFilter] = React.useState("all");

    const filtered = filter === "all" ? MOCK_SUBS : MOCK_SUBS.filter((s) => s.status === filter);

    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 mt-8">
                <div>
                    <h1 className="text-[42px]  font-normal text-foreground tracking-tight leading-tight">Subscriptions</h1>
                    <p className="text-[15px] text-muted-foreground mt-3 font-normal">Gestão central de planos, ciclos de faturamento e retenção.</p>
                </div>
            </div>

            <div className="mb-20">
                <AdminSubNav
                    items={[
                        { label: "Visão Geral", path: "/admin/financials" },
                        { label: "Assinaturas", path: "/admin/subscriptions" },
                        { label: "Economia", path: "/admin/economics" },
                    ]}
                />
            </div>

            {/* KPIs - Refined */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20 border-b border-border/5 pb-16">
                {[
                    { label: "Total Assinaturas", value: "1.247" },
                    { label: "Ativas", value: "1.184", trend: "+12%" },
                    { label: "Cancelamentos", value: "23", trend: "-5%", negative: true },
                    { label: "Inadimplência", value: "14", trend: "0%" },
                ].map((kpi) => (
                    <div key={kpi.label} className="flex flex-col">
                        <span className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest mb-4">{kpi.label}</span>
                        <div className="flex items-baseline gap-3">
                            <p className="text-[38px] font-normal text-foreground tracking-tight ">{kpi.value}</p>
                            {kpi.trend && (
                                <span className={cn("text-[12px] font-medium transition-colors",
                                    kpi.negative ? "text-red-400" : "text-emerald-500"
                                )}>
                                    {kpi.trend}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Distribuição por plano - Modernized */}
            <div className="w-full mb-24 max-w-3xl">
                <h3 className="text-[22px]  text-foreground/90 mb-10 tracking-tight">Distribuição de Receita por Plano</h3>
                <div className="space-y-10">
                    {PLAN_DISTRIBUTION.map((p) => (
                        <div key={p.plan} className="flex flex-col gap-3 group">
                            <div className="flex items-center justify-between text-[14px]">
                                <span className="font-medium text-foreground/80">{p.plan}</span>
                                <span className="text-muted-foreground/50 tabular-nums">
                                    {p.count} assinantes <span className="mx-2 opacity-30">/</span> {p.pct}%
                                </span>
                            </div>
                            <div className="h-[6px] rounded-full bg-muted/10 overflow-hidden relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${p.pct}%` }}
                                    transition={{ duration: 1, ease: "circOut" }}
                                    className="absolute inset-y-0 left-0 rounded-full bg-foreground shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-700"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters - Pill Style */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
                <span className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest mr-3">Status</span>
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
                            "h-9 px-5 rounded-full text-[13px] font-medium transition-all border",
                            filter === f.key
                                ? "bg-foreground text-background border-foreground shadow-sm"
                                : "bg-muted/5 border-border/10 text-muted-foreground hover:border-border/20 hover:text-foreground",
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Table - Integrated new AdminTable */}
            <div className="w-full">
                <AdminTable
                    columns={[
                        {
                            key: "user", label: "Assinante", render: (r) => (
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[14.5px] font-medium text-foreground truncate">{r.user}</span>
                                    <span className="text-[12px] text-muted-foreground/50 truncate font-normal mt-0.5">{r.email}</span>
                                </div>
                            )
                        },
                        {
                            key: "plan", label: "Plano", render: (r) => (
                                <span className="text-[14px] font-medium text-foreground/80">{r.plan}</span>
                            )
                        },
                        {
                            key: "status", label: "Status", render: (r) => {
                                const st = STATUS_MAP[r.status] ?? STATUS_MAP.active;
                                return (
                                    <div className="flex items-center gap-2">
                                        <div className={cn("h-1.5 w-1.5 rounded-full",
                                            r.status === 'active' ? 'bg-emerald-500' :
                                                r.status === 'canceled' ? 'bg-red-400' : 'bg-amber-400'
                                        )} />
                                        <span className={cn("text-[13px] font-normal transition-colors", st.color.split(' ')[0])}>
                                            {st.label}
                                        </span>
                                    </div>
                                );
                            }
                        },
                        { key: "price", label: "Valor", render: (r) => <span className="text-[14px] font-medium tabular-nums text-foreground/90">{r.price}</span> },
                        { key: "started", label: "Início", render: (r) => <span className="text-[12px] text-muted-foreground/40 font-normal tabular-nums">{r.started}</span> },
                        { key: "nextBilling", label: "Cobr", render: (r) => <span className="text-[12px] text-muted-foreground/60 font-medium tabular-nums">{r.nextBilling}</span> },
                        { key: "gateway", label: "Meio", render: (r) => <span className="text-[11px] font-medium text-muted-foreground/40 tracking-wider uppercase">{r.gateway}</span> },
                    ]}
                    data={filtered}
                    keyExtractor={(r) => String(r.id)}
                    emptyMessage="Nenhuma assinatura encontrada nesta categoria"
                />
            </div>
        </div>
    );
}

const mockUsage = {
    // ... possibly move mocks or keep them internal to avoid scope collision if needed
};
