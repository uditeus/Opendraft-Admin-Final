import * as React from "react";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/icons/AppIcon";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { DASHBOARD_CHART_DATA as CHART_DATA, RECENT_ACTIVITY, ACTIVITY_TYPE_CONFIG as TYPE_ICON } from "@/lib/admin-mock";

export default function AdminDashboard() {
    return (
        <div className="flex flex-col gap-10 max-w-4xl mx-auto pb-20">
            {/* Spotlight Composer */}
            <div className="flex flex-col items-center text-center mt-10 mb-8">
                <h1 className="text-3xl font-serif font-semibold text-foreground tracking-tight mb-8">
                    Como posso ajudar com o painel hoje?
                </h1>

                <div className="relative w-full max-w-2xl bg-background rounded-[24px] border border-border shadow-sm p-2 flex items-center focus-within:ring-2 focus-within:ring-[#0066fe]/20 focus-within:border-[#0066fe] transition-all">
                    <button className="p-3 text-muted-foreground hover:text-foreground transition-colors absolute left-2">
                        <AppIcon name="Plus" className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        placeholder="Pesquisar usuários, gerar relatórios..."
                        className="w-full bg-transparent border-none outline-none pl-12 pr-14 py-3 text-foreground font-medium placeholder:font-normal placeholder-muted-foreground/70"
                    />
                    <button className="absolute right-3 p-2 bg-foreground hover:bg-foreground/80 text-background rounded-full flex items-center justify-center transition-colors">
                        <AppIcon name="ArrowUpIcon" className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Quick KPIs (Clean, flat) */}
            <div className="flex flex-wrap items-center justify-between gap-6 px-1 border-b border-border/30 pb-8">
                {[
                    { label: "Total Usuários", value: "1.247", highlight: true },
                    { label: "MRR Diário", value: "R$ 495" },
                    { label: "Tickets Abertos", value: "12" },
                    { label: "Novos Hoje", value: "42" },
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest">Receita & Crescimento</h3>
                        <button className="text-xs font-medium text-[#0066fe] hover:underline">Ver detalhes</button>
                    </div>
                    <div className="h-[300px] w-full bg-background rounded-2xl border border-border/50 p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={CHART_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dx={-10} />
                                <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: 12 }} />
                                {/* Blue accent for the chart */}
                                <Area type="monotone" dataKey="users" stroke="#0066fe" fill="#0066fe" fillOpacity={0.05} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Activity Feed (Simplified) */}
                <div className="flex flex-col">
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-6">Feed Ao Vivo</h3>
                    <div className="space-y-4">
                        {RECENT_ACTIVITY.slice(0, 5).map((a, i) => {
                            const { icon } = TYPE_ICON[a.type] ?? TYPE_ICON.signup;
                            return (
                                <div key={i} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-muted/10 transition-colors cursor-default border border-transparent hover:border-border/30">
                                    <div className="mt-1.5 shrink-0">
                                        <AppIcon name={icon as any} className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-foreground">{a.user}</span>
                                            <span className="text-[11px] text-muted-foreground">{a.time}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{a.detail}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
