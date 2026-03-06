import * as React from "react";
import { cn } from "@/lib/utils";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const MRR_TREND = [
    { month: "Abr", mrr: 8200 }, { month: "Mai", mrr: 9100 }, { month: "Jun", mrr: 11400 },
    { month: "Jul", mrr: 13200 }, { month: "Ago", mrr: 14800 }, { month: "Set", mrr: 16100 },
    { month: "Out", mrr: 18400 }, { month: "Nov", mrr: 19800 }, { month: "Dez", mrr: 21200 },
    { month: "Jan", mrr: 22400 }, { month: "Fev", mrr: 23100 }, { month: "Mar", mrr: 24750 },
];

const MRR_BY_PLAN = [
    { plan: "Free", mrr: 0, pct: 0 },
    { plan: "Pro", mrr: 15234, pct: 61.6 },
    { plan: "Max", mrr: 7110, pct: 28.7 },
    { plan: "Max X", mrr: 2406, pct: 9.7 },
];

const MRR_GROWTH = [
    { month: "Out", newMrr: 2800, expansion: 420, churn: -720, net: 2500 },
    { month: "Nov", newMrr: 2100, expansion: 380, churn: -680, net: 1800 },
    { month: "Dez", newMrr: 2400, expansion: 510, churn: -510, net: 2400 },
    { month: "Jan", newMrr: 1800, expansion: 340, churn: -940, net: 1200 },
    { month: "Fev", newMrr: 1400, expansion: 280, churn: -980, net: 700 },
    { month: "Mar", newMrr: 2200, expansion: 460, churn: -510, net: 2150 },
];

const CANCELLATIONS = [
    { user: "Maria Oliveira", plan: "Pro", reason: "Muito caro", time: "4 meses", paid: "R$ 388" },
    { user: "João Pereira", plan: "Pro", reason: "Não usa mais", time: "7 meses", paid: "R$ 679" },
    { user: "Fernanda Alves", plan: "Max", reason: "Mudou para concorrente", time: "2 meses", paid: "R$ 394" },
    { user: "Ricardo Santos", plan: "Pro", reason: "Problemas técnicos", time: "1 mês", paid: "R$ 97" },
    { user: "Carla Mendes", plan: "Pro", reason: "Feature que precisa não existe", time: "5 meses", paid: "R$ 485" },
];

const TRANSACTIONS = [
    { user: "Bruno Mendes", plan: "Pro", valor: "R$ 97", data: "05/03/2025", status: "paid" },
    { user: "Ana Costa", plan: "Max", valor: "R$ 197", data: "03/03/2025", status: "paid" },
    { user: "Pedro Lima", plan: "Max X", valor: "R$ 497", data: "12/03/2025", status: "paid" },
    { user: "Julia Santos", plan: "Pro", valor: "R$ 97", data: "01/03/2025", status: "paid" },
    { user: "Maria Oliveira", plan: "Pro", valor: "R$ 97", data: "18/02/2025", status: "refunded" },
    { user: "Carlos Silva", plan: "Pro", valor: "R$ 97", data: "20/02/2025", status: "failed" },
];

import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminFinancials() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">Financial Overview</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Visão financeira, MRR e métricas de receita</p>
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
                    { label: "MRR ATUAL", value: "R$ 24.750", sub: "↑+7.1% vs fev" },
                    { label: "ARR ESTIMADO", value: "R$ 297.000", sub: "Baseado no MRR atual" },
                    { label: "NET NEW MRR", value: "R$ 2.150", sub: "Novos + Exp - Churn" },
                    { label: "LTV MÉDIO", value: "R$ 582", sub: "Lifetime Value" },
                ].map((kpi) => (
                    <div key={kpi.label} className="rounded-xl border border-border/50 bg-card shadow-sm p-5 transition-all hover:border-border duration-200">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">{kpi.label}</span>
                        <p className="mt-2 text-2xl font-semibold text-foreground tracking-tight whitespace-nowrap">{kpi.value}</p>
                        {kpi.sub && <p className={cn("text-[11px] mt-1 font-medium", kpi.sub.includes("↑") ? "text-emerald-500" : "text-muted-foreground/60")}>{kpi.sub}</p>}
                    </div>
                ))}
            </div>

            {/* MRR chart + MRR by plan */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 rounded-xl border border-border/50 bg-card shadow-sm p-6">
                    <h3 className="text-[14px] font-bold text-foreground mb-6">MRR — Últimos 12 meses</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={MRR_TREND}>
                            <CartesianGrid strokeDasharray="0 0" stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dx={-10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                            <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: 12 }} />
                            <Area type="monotone" dataKey="mrr" stroke="#3E768D" fill="#3E768D" fillOpacity={0.06} strokeWidth={2.5} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="rounded-xl border border-border/50 bg-card shadow-sm p-6">
                    <h3 className="text-[14px] font-bold text-foreground mb-6">MRR por plano</h3>
                    <div className="space-y-5 mt-2">
                        {MRR_BY_PLAN.map((p) => (
                            <div key={p.plan} className="group">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[13px] text-foreground/80 font-bold">{p.plan}</span>
                                    <span className="text-[12px] text-foreground/90 font-bold tabular-nums">R$ {p.mrr.toLocaleString()}</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted/40 overflow-hidden relative">
                                    <div className="absolute inset-y-0 left-0 rounded-full bg-[#3E768D] transition-all duration-700 ease-out shadow-[0_0_8px_rgba(62,118,141,0.2)]" style={{ width: `${p.pct}%` }} />
                                </div>
                                <div className="mt-1 flex justify-end">
                                    <span className="text-[10px] text-muted-foreground font-bold">{p.pct}% share</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cancelamentos */}
            <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden mb-4">
                <div className="px-6 py-4 border-b border-border/30 bg-muted/20">
                    <h3 className="text-[14px] font-bold text-foreground">Cancelamentos recentes</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">Feed de retenção — motivos e insights</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/30">
                                {["USUÁRIO", "PLANO", "MOTIVO", "TENURE", "VALOR PAGO"].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {CANCELLATIONS.map((c, i) => (
                                <tr key={i} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4 text-[13px] font-bold text-foreground/90">{c.user}</td>
                                    <td className="px-6 py-4 text-[13px] text-foreground/70 font-bold">{c.plan}</td>
                                    <td className="px-6 py-4 text-[13px] text-red-400 font-medium">{c.reason}</td>
                                    <td className="px-6 py-4 text-[13px] text-muted-foreground font-medium">{c.time}</td>
                                    <td className="px-6 py-4 text-[13px] text-foreground/90 font-bold tabular-nums">{c.paid}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transações */}
            <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden mb-4 font-sans">
                <div className="px-6 py-4 border-b border-border/30 bg-muted/20">
                    <h3 className="text-[14px] font-bold text-foreground">Transações recentes</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/30">
                                {["USUÁRIO", "PLANO", "VALOR", "DATA", "STATUS"].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {TRANSACTIONS.map((t, i) => (
                                <tr key={i} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4 text-[13px] font-bold text-foreground/90">{t.user}</td>
                                    <td className="px-6 py-4 text-[13px] text-foreground/70 font-bold">{t.plan}</td>
                                    <td className="px-6 py-4 text-[13px] text-foreground/90 font-bold tabular-nums">{t.valor}</td>
                                    <td className="px-6 py-4 text-[13px] text-muted-foreground font-medium">{t.data}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm",
                                            t.status === "paid" && "text-emerald-500 bg-emerald-500/10 shadow-[0_0_8px_rgba(16,185,129,0.2)]",
                                            t.status === "refunded" && "text-amber-500 bg-amber-500/10 shadow-[0_0_8px_rgba(245,158,11,0.2)]",
                                            t.status === "failed" && "text-red-500 bg-red-500/10 shadow-[0_0_8px_rgba(239,68,68,0.2)]",
                                        )}>
                                            {t.status === "paid" ? "Pago" : t.status === "refunded" ? "Reembolsado" : "Falhou"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
