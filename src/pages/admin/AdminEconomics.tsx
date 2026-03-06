import * as React from "react";
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MARGIN_TREND = [
    { month: "Abr", revenue: 8200, aiCost: 840, infra: 420, margin: 6940 },
    { month: "Mai", revenue: 9100, aiCost: 920, infra: 430, margin: 7750 },
    { month: "Jun", revenue: 11400, aiCost: 1100, infra: 450, margin: 9850 },
    { month: "Jul", revenue: 13200, aiCost: 1280, infra: 460, margin: 11460 },
    { month: "Ago", revenue: 14800, aiCost: 1420, infra: 480, margin: 12900 },
    { month: "Set", revenue: 16100, aiCost: 1510, infra: 490, margin: 14100 },
    { month: "Out", revenue: 18400, aiCost: 1640, infra: 500, margin: 16260 },
    { month: "Nov", revenue: 19800, aiCost: 1780, infra: 510, margin: 17510 },
    { month: "Dez", revenue: 21200, aiCost: 1820, infra: 520, margin: 18860 },
    { month: "Jan", revenue: 22400, aiCost: 1870, infra: 530, margin: 20000 },
    { month: "Fev", revenue: 23100, aiCost: 1900, infra: 540, margin: 20660 },
    { month: "Mar", revenue: 24750, aiCost: 1940, infra: 550, margin: 22260 },
];

const PLAN_ECONOMICS = [
    { plan: "Free", arpu: "R$ 0", aiCost: "R$ 0,42", infra: "R$ 0,18", margin: "-R$ 0,60", marginPct: "-∞", users: 847 },
    { plan: "Pro", arpu: "R$ 97", aiCost: "R$ 3,10", infra: "R$ 0,45", margin: "R$ 93,45", marginPct: "96.3%", users: 312 },
    { plan: "Max", arpu: "R$ 197", aiCost: "R$ 8,40", infra: "R$ 0,70", margin: "R$ 187,90", marginPct: "95.4%", users: 72 },
    { plan: "Max X", arpu: "R$ 497", aiCost: "R$ 24,50", infra: "R$ 1,20", margin: "R$ 471,30", marginPct: "94.8%", users: 16 },
];

import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminEconomics() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">Unit Economics</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Sustentabilidade, margens e métricas de eficiência do SaaS</p>
            </div>

            <AdminSubNav
                items={[
                    { label: "MRR", path: "/admin/financials" },
                    { label: "Subscriptions", path: "/admin/subscriptions" },
                    { label: "Economics", path: "/admin/economics" },
                ]}
            />

            {/* Big KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "LTV", value: "R$ 582", sub: "Lifetime value médio" },
                    { label: "CAC", value: "R$ 12,40", sub: "Custo de aquisição" },
                    { label: "LTV / CAC", value: "46.9x", sub: "Meta ideal: > 3x" },
                    { label: "PAYBACK CAC", value: "< 1 mês", sub: "Recuperação do CAC" },
                ].map((kpi) => (
                    <div key={kpi.label} className="rounded-xl border border-border/50 bg-card shadow-sm p-6 group hover:border-border transition-all">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#3E768D]">{kpi.label}</span>
                        <p className="mt-3 text-[26px] font-bold text-foreground/90 tracking-tight group-hover:text-[#3E768D] transition-colors">{kpi.value}</p>
                        <span className="text-[11.5px] text-muted-foreground mt-1.5 block font-medium">{kpi.sub}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Margin trend chart */}
                <div className="lg:col-span-2 rounded-xl border border-border/50 bg-card shadow-sm p-6">
                    <h3 className="text-[15px] font-bold text-foreground mb-6">Eficiência e Margem — 12 meses</h3>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MARGIN_TREND}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorMargin" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3E768D" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3E768D" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 500 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} dy={10} />
                                <YAxis tick={{ fontSize: 10, fontWeight: 500 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                                <Tooltip
                                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", fontSize: "12px", fontWeight: "600" }}
                                    cursor={{ stroke: '#3E768D', strokeWidth: 2, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="revenue" name="Receita" stroke="#22c55e" fill="url(#colorRevenue)" strokeWidth={2.5} />
                                <Area type="monotone" dataKey="margin" name="Margem" stroke="#3E768D" fill="url(#colorMargin)" strokeWidth={2.5} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Per-plan summary */}
                <div className="rounded-xl border border-border/50 bg-card shadow-sm p-6 flex flex-col">
                    <h3 className="text-[15px] font-bold text-foreground mb-6">Média por Assinante</h3>
                    <div className="space-y-5 flex-1 justify-center flex flex-col">
                        {[
                            { label: "ARPU Médio", value: "R$ 49", color: "text-[#3E768D]" },
                            { label: "Custo IA / User", value: "R$ 1,55", color: "text-red-500" },
                            { label: "Infra / User", value: "R$ 0,44", color: "text-muted-foreground" },
                            { label: "Margem Final", value: "R$ 47,01", color: "text-emerald-500" },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-muted/5 border border-border/20">
                                <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">{item.label}</span>
                                <span className={cn("text-[18px] font-bold tabular-nums", item.color)}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Per-plan economics table */}
            <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border/30 bg-muted/20">
                    <h3 className="text-[14px] font-bold text-foreground">Economics Detalhado por Plano</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/30">
                                {["PLANO", "ARPU", "CUSTO IA", "MARGEM", "MARGEM %", "USERS"].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {PLAN_ECONOMICS.map((p) => (
                                <tr key={p.plan} className="hover:bg-muted/5 transition-colors">
                                    <td className="px-6 py-4 text-[13.5px] font-bold text-foreground/90">{p.plan}</td>
                                    <td className="px-6 py-4 text-[13.5px] font-bold tabular-nums text-foreground/70">{p.arpu}</td>
                                    <td className="px-6 py-4 text-[13.5px] font-bold tabular-nums text-red-500/80">{p.aiCost}</td>
                                    <td className={cn("px-6 py-4 text-[14px] font-bold tabular-nums", p.margin.startsWith("-") ? "text-red-500" : "text-emerald-500")}>{p.margin}</td>
                                    <td className={cn("px-6 py-4 text-[13.5px] font-bold", p.marginPct.startsWith("-") ? "text-red-500/80" : "text-emerald-500/80")}>{p.marginPct}</td>
                                    <td className="px-6 py-4 text-[13px] text-muted-foreground font-bold tabular-nums">{p.users}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Projections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-6">
                {[
                    { label: "MRR PROJETADO (3 MESES)", value: "R$ 29.200", sub: "Com base em +6.7%/mês" },
                    { label: "ARR PROJETADO", value: "R$ 350.400", sub: "MRR projetado × 12" },
                    { label: "RUNWAY", value: "∞", sub: "Margem positiva sustentável" },
                ].map((kpi) => (
                    <div key={kpi.label} className="rounded-xl border border-border/50 bg-card shadow-sm p-6 group hover:border-border transition-all">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#3E768D]">{kpi.label}</span>
                        <p className="mt-2 text-[22px] font-bold text-foreground/90 tracking-tight group-hover:text-[#3E768D] transition-colors">{kpi.value}</p>
                        <span className="text-[11.5px] text-muted-foreground mt-1 block font-medium">{kpi.sub}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
