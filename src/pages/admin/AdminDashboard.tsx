import * as React from "react";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/icons/AppIcon";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { DASHBOARD_CHART_DATA as CHART_DATA, RECENT_ACTIVITY, ACTIVITY_TYPE_CONFIG as TYPE_ICON } from "@/lib/admin-mock";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminDashboard() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">Overview</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Visão geral da performance e atividade</p>
            </div>

            <AdminSubNav
                items={[
                    { label: "Dashboard", path: "/admin" },
                    { label: "Realtime", path: "/admin/realtime" },
                    { label: "Events", path: "/admin/events" },
                ]}
            />

            {/* KPIs row 1 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "TOTAL USUÁRIOS", value: "1.247", sub: "↑+42 esta semana" },
                    { label: "USUÁRIOS ATIVOS (30D)", value: "891", sub: null },
                    { label: "MRR", value: "R$ 24.750", sub: "↑+7.1% vs mês anterior" },
                    { label: "MRR CRESCIMENTO %", value: "+7.1%", sub: "Meta: >5%" },
                ].map((kpi) => (
                    <div key={kpi.label} className="rounded-xl border border-border/50 bg-card shadow-sm p-5 transition-all hover:border-border duration-200">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">{kpi.label}</span>
                        <p className="mt-2 text-2xl font-semibold text-foreground tracking-tight">{kpi.value}</p>
                        {kpi.sub && <p className={cn("text-[11px] mt-1 font-medium", (kpi.sub.startsWith("↑") || kpi.sub.startsWith("Meta")) ? "text-emerald-500" : "text-muted-foreground/60")}>{kpi.sub}</p>}
                    </div>
                ))}
            </div>

            {/* KPIs row 2 */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { label: "TRIALS ATIVOS", value: "47" },
                    { label: "TRIALS EXPIRANDO HOJE", value: "8" },
                    { label: "CANCELAMENTOS HOJE", value: "2" },
                    { label: "TICKETS ABERTOS", value: "12" },
                    { label: "CHURN RATE", value: "3.2%" },
                ].map((kpi) => (
                    <div key={kpi.label} className="rounded-xl border border-border/50 bg-card shadow-sm p-4">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/60">{kpi.label}</span>
                        <p className="mt-1 text-xl font-semibold text-foreground tracking-tight">{kpi.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Chart */}
                <div className="lg:col-span-2 rounded-xl border border-border/50 bg-card shadow-sm p-6">
                    <h3 className="text-[14px] font-bold text-foreground mb-6">Novos usuários — 30 dias</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={CHART_DATA}>
                            <CartesianGrid strokeDasharray="0 0" stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
                            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dx={-10} />
                            <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: 12 }} cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }} />
                            <Area type="monotone" dataKey="users" stroke="#3E768D" fill="#3E768D" fillOpacity={0.06} strokeWidth={2.5} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Activity feed */}
                <div className="rounded-xl border border-border/50 bg-card shadow-sm p-6 overflow-hidden flex flex-col">
                    <h3 className="text-[14px] font-bold text-foreground mb-6">Atividade recente</h3>
                    <div className="space-y-4 overflow-y-auto no-scrollbar">
                        {RECENT_ACTIVITY.map((a, i) => {
                            const { icon, color } = TYPE_ICON[a.type] ?? TYPE_ICON.signup;
                            return (
                                <div key={i} className="flex items-start gap-3 group">
                                    <div className={cn("mt-1 shrink-0 p-1.5 rounded-lg bg-muted/50 transition-colors group-hover:bg-muted font-bold", color)}>
                                        <AppIcon name={icon as any} className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0 border-b border-border/30 pb-3 last:border-0 w-full">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className="text-[13px] font-semibold text-foreground/90 truncate">{a.user}</span>
                                            <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap">{a.time}</span>
                                        </div>
                                        <p className="text-[12px] text-muted-foreground truncate font-medium">{a.detail}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Revenue chart */}
            <div className="rounded-xl border border-border/50 bg-card shadow-sm p-6">
                <h3 className="text-[14px] font-bold text-foreground mb-6">Receita diária — 30 dias</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={CHART_DATA}>
                        <CartesianGrid strokeDasharray="0 0" stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dy={10} />
                        <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dx={-10} />
                        <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: 12 }} />
                        <Area type="monotone" dataKey="revenue" stroke="#3E768D" fill="#3E768D" fillOpacity={0.06} strokeWidth={2.5} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
                {[
                    { label: "COPIES GERADAS HOJE", value: "342" },
                    { label: "TOKENS HOJE", value: "142.8K" },
                    { label: "CUSTO IA HOJE", value: "R$ 47" },
                    { label: "ARPU", value: "R$ 49" },
                ].map((kpi) => (
                    <div key={kpi.label} className="rounded-xl border border-border/50 bg-card shadow-sm p-5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/60">{kpi.label}</span>
                        <p className="mt-1.5 text-2xl font-semibold text-foreground tracking-tight">{kpi.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
