import * as React from "react";
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AppIcon } from "@/components/icons/AppIcon";

const MRR_TREND = Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}`,
    mrr: Math.floor(35000 + Math.random() * 8000 + (i * 200)),
}));

export default function AdminFinancials() {
    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 mt-8">
                <div>
                    <h1 className="text-[42px]  font-normal text-foreground tracking-tight leading-tight">Revenue</h1>
                    <p className="text-[15px] text-muted-foreground mt-3 font-normal">Acompanhamento detalhado de MRR, Churn e métricas de crescimento.</p>
                </div>
            </div>

            {/* KPIs - Refined */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20 border-b border-border/5 pb-16">
                {[
                    { label: "MRR", value: "R$ 42.450", trend: "+12.4%" },
                    { label: "Nova Receita", value: "R$ 5.200", trend: "+8.1%" },
                    { label: "Churn Rate", value: "1.2%", trend: "-0.5%", negative: true },
                    { label: "LTV Médio", value: "R$ 1.240", trend: "Estável" },
                ].map((kpi) => (
                    <div key={kpi.label} className="flex flex-col">
                        <span className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest mb-4">{kpi.label}</span>
                        <div className="flex items-baseline gap-3">
                            <p className="text-[38px] font-normal text-foreground tracking-tight ">{kpi.value}</p>
                            <span className={cn("text-[12px] font-medium transition-colors",
                                kpi.trend.startsWith("+") || kpi.trend === "Estável" ? "text-emerald-500" : "text-amber-500"
                            )}>
                                {kpi.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Chart - Enhanced */}
            <div className="w-full mb-24">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-[22px]  text-foreground/90 tracking-tight text-center">Evolução Mensal de Receita</h3>
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/10 border border-border/5 text-[12px] text-muted-foreground font-medium">
                        30 dias <AppIcon name="ChevronDown" className="h-3 w-3 opacity-40 ml-1" />
                    </div>
                </div>
                <div className="h-[320px] w-full -ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MRR_TREND}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="currentColor" stopOpacity={0.1} className="text-foreground" />
                                    <stop offset="95%" stopColor="currentColor" stopOpacity={0} className="text-foreground" />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" strokeOpacity={0.1} vertical={false} />
                            <XAxis
                                dataKey="day"
                                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", opacity: 0.4 }}
                                axisLine={false}
                                tickLine={false}
                                dy={15}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", opacity: 0.4 }}
                                axisLine={false}
                                tickLine={false}
                                dx={-15}
                                tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
                            />
                            <Tooltip
                                cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1, strokeOpacity: 0.5 }}
                                contentStyle={{
                                    background: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border)/0.2)",
                                    borderRadius: 12,
                                    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
                                    fontSize: 12,
                                    padding: '12px 16px'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="mrr"
                                stroke="currentColor"
                                fill="url(#revenueGradient)"
                                strokeWidth={2.5}
                                className="text-foreground"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-20">
                {/* Plans Breakdown - 3 cols */}
                <div className="lg:col-span-3">
                    <h3 className="text-[20px]  text-foreground/90 mb-10 tracking-tight">Receita por Plano</h3>
                    <div className="overflow-x-auto -mx-2">
                        <table className="w-full border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    {["Plano", "Ativos", "Share", "MRR"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-widest text-muted-foreground/30">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/5">
                                {[
                                    { plan: "Free / Starter", users: "1.102", share: "12%", mrr: "R$ 40" },
                                    { plan: "Pro", users: "412", share: "54%", mrr: "R$ 20.188" },
                                    { plan: "Max", users: "89", share: "22%", mrr: "R$ 13.261" },
                                    { plan: "Max 5x", users: "24", share: "12%", mrr: "R$ 8.961" },
                                ].map((p) => (
                                    <tr key={p.plan} className="group hover:bg-muted/5 transition-all">
                                        <td className="px-4 py-5 text-[14.5px] font-medium text-foreground/80">{p.plan}</td>
                                        <td className="px-4 py-5 text-[14px] tabular-nums text-muted-foreground/60">{p.users}</td>
                                        <td className="px-4 py-5 text-[14px] font-medium text-foreground/70">{p.share}</td>
                                        <td className="px-4 py-5 text-[14.5px] font-semibold text-foreground tabular-nums">{p.mrr}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Atividade Financeira Recente - 2 cols */}
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-[20px]  text-foreground/90 tracking-tight">Atividade Recente</h3>
                        <AppIcon name="RefreshCw" className="h-[18px] w-[18px] text-muted-foreground/30 hover:text-foreground/50 transition-colors cursor-pointer" />
                    </div>
                    <div className="space-y-8">
                        {[
                            { user: "joao.silva@exemplo.com", time: "Agora", plan: "Max 5x", val: "R$ 373,39", type: "upgrade", icon: "ArrowUpRight" },
                            { user: "maria.souza@corp.com", time: "Há 12m", plan: "Pro", val: "R$ 49,00", type: "new", icon: "Plus" },
                            { user: "rogerio@empresa.com", time: "Há 41m", plan: "Pro", val: "R$ 49,00", type: "renew", icon: "RefreshCw" },
                            { user: "carlos.m@teste.com", time: "Há 1h", plan: "Pro", val: "R$ -", type: "churn", icon: "ArrowDown01Icon" },
                        ].map((tx, i) => (
                            <div key={i} className="flex items-start gap-4 transition-all">
                                <div className={cn(
                                    "mt-1.5 shrink-0 flex items-center justify-center p-2 rounded-lg border border-border/10",
                                    tx.type === "churn" ? "text-amber-500 bg-amber-500/5 border-amber-500/10" : "text-emerald-500 bg-emerald-500/5 border-emerald-500/10"
                                )}>
                                    <AppIcon name={tx.icon as any} className="w-3.5 h-3.5" strokeWidth={2.5} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[14px] font-medium text-foreground truncate">{tx.user}</span>
                                        <span className="text-[11px] text-muted-foreground/30 tabular-nums lowercase">{tx.time}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[12px] text-muted-foreground/50 font-normal">
                                            {tx.type === 'churn' ? 'Cancelamento' : 'Assinatura'} · <span className="text-muted-foreground/30">{tx.plan}</span>
                                        </span>
                                        <span className={cn("text-[13px] font-medium tabular-nums shadow-sm px-2 py-0.5 rounded-md",
                                            tx.type === "churn" ? "text-muted-foreground/40 bg-muted/5" : "text-emerald-500/90 bg-emerald-500/5"
                                        )}>{tx.val}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
