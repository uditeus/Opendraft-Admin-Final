import * as React from "react";
import { KpiCard } from "@/components/admin/KpiCard";
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
    { name: "Free", value: 680, color: "#6B7280" },
    { name: "Pro", value: 420, color: "#3B82F6" },
    { name: "Max", value: 110, color: "#8B5CF6" },
    { name: "Max 5x", value: 37, color: "#F59E0B" },
];

const PERIOD_OPTIONS = ["Hoje", "7 dias", "30 dias", "90 dias", "12 meses"];

function ChartTooltip({ active, payload, label, prefix = "" }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-sidebar-border/40 bg-background px-3 py-2 shadow-xl">
            <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
            {payload.map((p: any, i: number) => (
                <p key={i} className="text-[12px] font-medium" style={{ color: p.color }}>
                    {p.name}: {prefix}{typeof p.value === "number" ? p.value.toLocaleString("pt-BR") : p.value}
                </p>
            ))}
        </div>
    );
}

export default function AdminMetrics() {
    const [period, setPeriod] = React.useState("12 meses");

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[22px] font-semibold text-foreground tracking-tight">Métricas</h1>
                    <p className="text-[13px] text-muted-foreground mt-1">Analytics da plataforma</p>
                </div>
                <div className="flex items-center gap-1 rounded-lg border border-sidebar-border/40 bg-sidebar-accent/10 p-1">
                    {PERIOD_OPTIONS.map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors",
                                period === p
                                    ? "bg-[hsl(var(--chat-hover))] text-foreground"
                                    : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label="Total de usuários" value="1.247" icon={<AppIcon name="User" className="h-4 w-4" />} variation={8.2} variationLabel="crescimento" />
                <KpiCard label="DAU / MAU" value="34,2%" icon={<AppIcon name="BarChart3" className="h-4 w-4" />} variation={2.1} />
                <KpiCard label="Churn rate" value="3,2%" icon={<AppIcon name="ChevronDown" className="h-4 w-4" />} variation={-0.5} />
                <KpiCard label="Conversão Free → Paid" value="18,7%" icon={<AppIcon name="BarChart3" className="h-4 w-4" />} variation={2.1} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl border border-sidebar-border/40 bg-sidebar-accent/10 p-6">
                    <h3 className="text-[13px] font-medium text-muted-foreground mb-6">Crescimento de usuários</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={GROWTH_DATA}>
                            <defs>
                                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--sidebar-border) / 0.3)" />
                            <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<ChartTooltip />} />
                            <Area type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} fill="url(#growthGrad)" name="Total" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="rounded-xl border border-sidebar-border/40 bg-sidebar-accent/10 p-6">
                    <h3 className="text-[13px] font-medium text-muted-foreground mb-6">Churn rate mensal</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={CHURN_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--sidebar-border) / 0.3)" />
                            <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v.toFixed(1)}%`} />
                            <Tooltip content={<ChartTooltip />} />
                            <Line type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={2} dot={{ r: 3, fill: "#EF4444" }} name="Churn %" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl border border-sidebar-border/40 bg-sidebar-accent/10 p-6">
                    <h3 className="text-[13px] font-medium text-muted-foreground mb-6">Copies geradas por dia</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={ENGAGEMENT_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--sidebar-border) / 0.3)" />
                            <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<ChartTooltip />} />
                            <Bar dataKey="copies" fill="#8B5CF6" radius={[3, 3, 0, 0]} name="Copies" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="rounded-xl border border-sidebar-border/40 bg-sidebar-accent/10 p-6">
                    <h3 className="text-[13px] font-medium text-muted-foreground mb-6">Distribuição por plano</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie data={PLAN_DIST} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                                {PLAN_DIST.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<ChartTooltip />} />
                            <Legend iconType="circle" iconSize={8}
                                formatter={(value) => <span className="text-[12px] text-muted-foreground ml-1">{value}</span>} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <RoleGuard requires="dev">
                <div className="rounded-xl border border-sidebar-border/40 bg-sidebar-accent/10 p-6">
                    <h3 className="text-[13px] font-medium text-muted-foreground mb-4">Saúde da plataforma</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                            ["Uptime 30d", "99,97%"],
                            ["Latência API", "1.8s"],
                            ["Taxa de erro", "0,3%"],
                            ["Tokens hoje", "2.4M"],
                            ["Custo API est.", "R$ 87"],
                        ].map(([l, v]) => (
                            <div key={l} className="flex flex-col">
                                <span className="text-[11px] text-muted-foreground mb-1">{l}</span>
                                <span className="text-[16px] font-medium text-foreground/80">{v}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </RoleGuard>
        </div>
    );
}
