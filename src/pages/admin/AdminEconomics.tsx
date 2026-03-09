import * as React from "react";
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

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

export default function AdminEconomics() {
    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-8">
                <div>
                    <h1 className="text-4xl font-serif font-normal text-foreground tracking-tight">Unit Economics</h1>
                    <p className="text-sm text-muted-foreground mt-2">Sustentabilidade, margens e métricas de eficiência do SaaS.</p>
                </div>
            </div>

            <div className="mb-12">
                <AdminSubNav
                    items={[
                        { label: "MRR", path: "/admin/financials" },
                        { label: "Subscriptions", path: "/admin/subscriptions" },
                        { label: "Economics", path: "/admin/economics" },
                    ]}
                />
            </div>

            {/* Big KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 border-b border-border/10 pb-12">
                {[
                    { label: "LTV", value: "R$ 582", sub: "Lifetime value médio" },
                    { label: "CAC", value: "R$ 12,40", sub: "Custo de aquisição" },
                    { label: "LTV / CAC", value: "46.9x", sub: "Meta ideal: > 3x" },
                    { label: "PAYBACK CAC", value: "< 1 mês", sub: "Recuperação do CAC" },
                ].map((kpi) => (
                    <div key={kpi.label} className="flex flex-col">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">{kpi.label}</span>
                        <p className="text-4xl font-normal text-foreground tracking-tight font-serif">{kpi.value}</p>
                        <span className="text-[11px] text-muted-foreground mt-2 font-medium opacity-60 uppercase tracking-tighter">{kpi.sub}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20">
                {/* Margin trend chart */}
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-serif text-foreground mb-8">Eficiência e Margem — 12 meses</h3>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MARGIN_TREND}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 500, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} dy={10} />
                                <YAxis tick={{ fontSize: 10, fontWeight: 500, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                                <Tooltip
                                    contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border)/0.5)", borderRadius: "12px", boxShadow: "none", fontSize: "12px" }}
                                    cursor={{ stroke: 'hsl(var(--foreground))', strokeWidth: 2, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="revenue" name="Receita" stroke="hsl(var(--foreground))" fill="hsl(var(--foreground))" fillOpacity={0.03} strokeWidth={2.5} />
                                <Area type="monotone" dataKey="margin" name="Margem" stroke="hsl(var(--foreground))" fill="hsl(var(--foreground))" fillOpacity={0.1} strokeWidth={2.5} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Per-plan summary */}
                <div className="flex flex-col">
                    <h3 className="text-xl font-serif text-foreground mb-8">Média por Assinante</h3>
                    <div className="space-y-6">
                        {[
                            { label: "ARPU Médio", value: "R$ 49", color: "text-foreground" },
                            { label: "Custo IA / User", value: "R$ 1,55", color: "text-red-500/80" },
                            { label: "Infra / User", value: "R$ 0,44", color: "text-muted-foreground" },
                            { label: "Margem Final", value: "R$ 47,01", color: "text-foreground font-bold" },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between py-4 border-b border-border/10">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{item.label}</span>
                                <span className={cn("text-xl font-serif tabular-nums", item.color)}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Per-plan economics table */}
            <div className="w-full mb-20">
                <h3 className="text-xl font-serif text-foreground mb-8">Economics Detalhado por Plano</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/20">
                                {["PLANO", "ARPU", "CUSTO IA", "MARGEM", "MARGEM %", "USERS"].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {PLAN_ECONOMICS.map((p) => (
                                <tr key={p.plan} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-4 text-sm font-semibold text-foreground">{p.plan}</td>
                                    <td className="px-4 py-4 text-sm font-semibold tabular-nums text-foreground/70">{p.arpu}</td>
                                    <td className="px-4 py-4 text-sm font-semibold tabular-nums text-red-500/60">{p.aiCost}</td>
                                    <td className={cn("px-4 py-4 text-sm font-bold tabular-nums", p.margin.startsWith("-") ? "text-red-500" : "text-foreground")}>{p.margin}</td>
                                    <td className={cn("px-4 py-4 text-sm font-bold", p.marginPct.startsWith("-") ? "text-red-500/80" : "text-foreground/80")}>{p.marginPct}</td>
                                    <td className="px-4 py-4 text-xs font-bold text-muted-foreground tabular-nums">{p.users}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Projections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12 pb-12">
                {[
                    { label: "MRR PROJETADO (3 MESES)", value: "R$ 29.200", sub: "Com base em +6.7%/mês" },
                    { label: "ARR PROJETADO", value: "R$ 350.400", sub: "MRR projetado × 12" },
                    { label: "RUNWAY", value: "∞", sub: "Margem positiva sustentável" },
                ].map((kpi) => (
                    <div key={kpi.label} className="flex flex-col">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">{kpi.label}</span>
                        <p className="text-4xl font-normal text-foreground tracking-tight font-serif">{kpi.value}</p>
                        <span className="text-[11px] text-muted-foreground mt-2 font-medium opacity-60 uppercase tracking-tighter">{kpi.sub}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
