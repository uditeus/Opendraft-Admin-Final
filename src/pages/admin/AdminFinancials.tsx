import * as React from "react";
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AppIcon } from "@/components/icons/AppIcon";

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

export default function AdminFinancials() {
    return (
        <div className="flex flex-col gap-10 max-w-5xl mx-auto pb-20">
            <div className="mt-10">
                <h1 className="text-3xl font-serif font-semibold text-foreground tracking-tight">Revenue</h1>
                <p className="text-sm text-muted-foreground mt-1">Visão financeira e MRR da plataforma</p>
            </div>

            {/* KPIs */}
            <div className="flex flex-wrap items-center justify-between gap-6 px-1 border-b border-border/30 pb-8">
                {[
                    { label: "MRR Atual", value: "R$ 24.750", highlight: true },
                    { label: "ARR Estimado", value: "R$ 297.000" },
                    { label: "Net New MRR", value: "R$ 2.150", highlight: true },
                    { label: "LTV Médio", value: "R$ 582" },
                ].map((kpi, i) => (
                    <div key={i} className="flex flex-col">
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">{kpi.label}</span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className={cn("text-3xl font-semibold tracking-tight", kpi.highlight ? "text-[#0066fe]" : "text-foreground")}>
                                {kpi.value}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* MRR chart + MRR by plan */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest">MRR — 12 Meses</h3>
                    </div>
                    <div className="h-[280px] w-full bg-background rounded-2xl border border-border/50 p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MRR_TREND}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dx={-10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                                <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: 12 }} />
                                <Area type="monotone" dataKey="mrr" stroke="#0066fe" fill="#0066fe" fillOpacity={0.05} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest">Mix por Plano</h3>
                    </div>
                    <div className="bg-background rounded-2xl border border-border/50 p-6 space-y-6">
                        {MRR_BY_PLAN.map((p) => (
                            <div key={p.plan} className="group">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-foreground">{p.plan}</span>
                                    <span className="text-xs font-semibold tabular-nums">R$ {p.mrr.toLocaleString()}</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted/20 overflow-hidden relative">
                                    <div className="absolute inset-y-0 left-0 rounded-full bg-[#0066fe] transition-all duration-700 ease-out" style={{ width: `${p.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cancelamentos */}
                <div className="border border-border/30 rounded-3xl overflow-hidden bg-background">
                    <div className="px-6 py-5 border-b border-border/30">
                        <h3 className="text-sm font-semibold text-foreground">Cancelamentos Recentes</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/30 bg-muted/5">
                                    {["USUÁRIO", "MOTIVO", "TENURE"].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {CANCELLATIONS.map((c, i) => (
                                    <tr key={i} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-6 py-4 text-sm font-semibold text-foreground">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-muted/20 border border-border/30 flex items-center justify-center">
                                                    <AppIcon name="UserIcon" className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                                {c.user}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-foreground">{c.reason}</td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{c.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Transações */}
                <div className="border border-border/30 rounded-3xl overflow-hidden bg-background">
                    <div className="px-6 py-5 border-b border-border/30">
                        <h3 className="text-sm font-semibold text-foreground">Transações</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/30 bg-muted/5">
                                    {["USUÁRIO", "VALOR", "STATUS"].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {TRANSACTIONS.map((t, i) => (
                                    <tr key={i} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-6 py-4 text-sm font-semibold text-foreground">
                                            <div className="flex items-baseline gap-2">
                                                <span>{t.user}</span>
                                                <span className="text-[10px] uppercase text-muted-foreground font-medium">{t.plan}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-foreground">{t.valor}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                t.status === "paid" ? "text-emerald-500 bg-emerald-500/10" :
                                                    t.status === "refunded" ? "text-amber-500 bg-amber-500/10" :
                                                        "text-red-500 bg-red-500/10"
                                            )}>
                                                {t.status === "paid" ? "Pago" : t.status === "refunded" ? "Refund" : "Falhou"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
