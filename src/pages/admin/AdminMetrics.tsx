import * as React from "react";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { AppIcon } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const GROWTH_DATA = Array.from({ length: 12 }, (_, i) => ({
    month: ["Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez", "Jan", "Fev", "Mar"][i],
    total: 300 + i * 95 + Math.floor(Math.random() * 50),
    new: 20 + Math.floor(Math.random() * 30),
}));

const CHURN_DATA = Array.from({ length: 12 }, (_, i) => ({
    month: ["Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez", "Jan", "Fev", "Mar"][i],
    rate: 5.2 - i * 0.15 + Math.random() * 0.5,
}));

const ENGAGEMENT_DATA = Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}`,
    copies: Math.floor(Math.random() * 300) + 100,
}));

const PLAN_DIST = [
    { name: "Free", value: 680, color: "hsl(var(--foreground)/0.3)" },
    { name: "Pro", value: 420, color: "hsl(var(--foreground)/0.6)" },
    { name: "Max", value: 110, color: "hsl(var(--foreground)/0.8)" },
    { name: "Max 5x", value: 37, color: "hsl(var(--foreground))" },
];

const PERIOD_OPTIONS = ["Hoje", "7 dias", "30 dias", "90 dias", "12 meses"];

import { motion } from "framer-motion";

function ChartTooltip({ active, payload, label, prefix = "" }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-border/10 bg-background/80 backdrop-blur-xl px-4 py-3 shadow-2xl text-[12px]">
            <p className="text-muted-foreground mb-2 font-medium uppercase tracking-widest text-[10px] opacity-40">{label}</p>
            {payload.map((p: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <p className="font-semibold text-foreground/90 tabular-nums">
                        {p.name}: {prefix}{typeof p.value === "number" ? p.value.toLocaleString("pt-BR") : p.value}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default function AdminMetrics() {
    const [period, setPeriod] = React.useState("30 dias");

    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 mt-8">
                <div>
                    <h1 className="text-[42px] font-serif font-normal text-foreground tracking-tight leading-tight">Analytics</h1>
                    <p className="text-[15px] text-muted-foreground mt-3 font-normal">Monitoramento central de crescimento, retenção e engajamento.</p>
                </div>
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {PERIOD_OPTIONS.map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={cn(
                                "h-9 px-5 rounded-full text-[13px] font-medium transition-all border shrink-0",
                                period === p
                                    ? "bg-foreground text-background border-foreground shadow-sm"
                                    : "bg-muted/5 border-border/10 text-muted-foreground hover:border-border/20 hover:text-foreground",
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPIs - Refined */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-24 border-b border-border/5 pb-16">
                {[
                    { label: "Total Usuários", value: "1.247", variation: 8.2 },
                    { label: "Aderência (DAU/MAU)", value: "34,2%", variation: 2.1 },
                    { label: "Churn Rate (30d)", value: "3,2%", variation: -0.5 },
                    { label: "Conversão Paid", value: "18,7%", variation: 2.1 },
                ].map((kpi) => (
                    <div key={kpi.label} className="flex flex-col">
                        <span className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest mb-4">{kpi.label}</span>
                        <div className="flex items-baseline gap-3">
                            <p className="text-[38px] font-normal text-foreground tracking-tight font-serif">{kpi.value}</p>
                            <span className={cn("text-[12px] font-medium transition-colors",
                                kpi.variation > 0 ? "text-emerald-500" : "text-amber-500"
                            )}>
                                {kpi.variation > 0 ? "+" : ""}{kpi.variation}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24">
                <div className="flex flex-col">
                    <h3 className="text-[20px] font-serif text-foreground/90 mb-10 tracking-tight">Crescimento de Base</h3>
                    <div className="h-[300px] w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={GROWTH_DATA}>
                                <defs>
                                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="currentColor" stopOpacity={0.1} className="text-foreground" />
                                        <stop offset="95%" stopColor="currentColor" stopOpacity={0} className="text-foreground" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" strokeOpacity={0.1} vertical={false} />
                                <XAxis
                                    dataKey="month"
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
                                />
                                <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeOpacity: 0.5 }} />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="currentColor"
                                    fill="url(#growthGradient)"
                                    strokeWidth={2.5}
                                    name="Total"
                                    className="text-foreground"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex flex-col">
                    <h3 className="text-[20px] font-serif text-foreground/90 mb-10 tracking-tight">Taxa de Churn (%)</h3>
                    <div className="h-[300px] w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={CHURN_DATA}>
                                <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" strokeOpacity={0.1} vertical={false} />
                                <XAxis
                                    dataKey="month"
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
                                    tickFormatter={(v) => `${v.toFixed(1)}%`}
                                />
                                <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeOpacity: 0.5 }} />
                                <Line
                                    type="monotone"
                                    dataKey="rate"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                    dot={{ r: 4, fill: "hsl(var(--background))", stroke: "currentColor", strokeWidth: 2 }}
                                    name="Churn %"
                                    className="text-foreground"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24">
                <div className="flex flex-col">
                    <h3 className="text-[20px] font-serif text-foreground/90 mb-10 tracking-tight">Copies Produzidas</h3>
                    <div className="h-[300px] w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ENGAGEMENT_DATA}>
                                <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" strokeOpacity={0.1} vertical={false} />
                                <XAxis
                                    dataKey="day"
                                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", opacity: 0.4 }}
                                    axisLine={false}
                                    tickLine={false}
                                    interval={period === "7 dias" ? 0 : 4}
                                    dy={15}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", opacity: 0.4 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dx={-15}
                                />
                                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.05)' }} />
                                <Bar
                                    dataKey="copies"
                                    fill="currentColor"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={32}
                                    className="text-foreground/80 hover:text-foreground transition-colors"
                                    name="Copies"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex flex-col">
                    <h3 className="text-[20px] font-serif text-foreground/90 mb-10 tracking-tight">Mix de Planos</h3>
                    <div className="h-[300px] w-full flex items-center justify-center -ml-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={PLAN_DIST}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={75}
                                    outerRadius={105}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {PLAN_DIST.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<ChartTooltip />} />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    align="right"
                                    verticalAlign="middle"
                                    layout="vertical"
                                    formatter={(value) => (
                                        <span className="text-[11px] font-medium text-muted-foreground/50 uppercase tracking-widest ml-3">
                                            {value}
                                        </span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <RoleGuard requires="dev">
                <div className="pt-24 border-t border-border/5">
                    <h3 className="text-[20px] font-serif text-foreground/90 mb-12 tracking-tight">System Health (Dev Only)</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-16">
                        {[
                            { label: "Uptime (30d)", value: "99,97%" },
                            { label: "Latência p95", value: "1.8s" },
                            { label: "Taxa de Erro", value: "0,3%" },
                            { label: "Tokens (Hoje)", value: "2.4M" },
                            { label: "Custo Estimado", value: "R$ 87" },
                        ].map((stat) => (
                            <div key={stat.label} className="flex flex-col">
                                <span className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest mb-4">{stat.label}</span>
                                <span className="text-[24px] font-serif font-normal text-foreground/70">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </RoleGuard>
        </div>
    );
}
