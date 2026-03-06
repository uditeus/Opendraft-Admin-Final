import * as React from "react";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart } from "recharts";

import { ACQUISITION_SOURCES as SOURCE_DATA, GROWTH_FUNNEL as FUNNEL } from "@/lib/admin-mock";

import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminGrowth() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">Growth & Acquisition</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Origem dos usuários, canais de aquisição e conversão</p>
            </div>

            <AdminSubNav
                items={[
                    { label: "Growth", path: "/admin/growth" },
                    { label: "Product", path: "/admin/product" },
                    { label: "Retention", path: "/admin/analytics/retention" },
                ]}
            />

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "VISITANTES (30D)", value: "48.200", change: "+12.4%" },
                    { label: "SIGNUPS (30D)", value: "3.420", change: "+8.2%" },
                    { label: "CONVERSÃO GERAL", value: "2.23%", change: "-0.5%" },
                    { label: "CAC MÉDIO", value: "R$ 12,40", change: "-R$ 1,20" },
                ].map((kpi) => (
                    <div key={kpi.label} className="rounded-xl border border-border/50 bg-card shadow-sm p-6 group">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#3E768D]">{kpi.label}</span>
                        <div className="flex items-baseline gap-2 mt-3">
                            <p className="text-[24px] font-bold text-foreground/90 tracking-tight">{kpi.value}</p>
                            <span className={cn("text-[11px] font-bold", kpi.change.startsWith("+") ? "text-emerald-500" : "text-amber-500")}>
                                {kpi.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Funil Visual */}
            <div className="rounded-xl border border-border/50 bg-card shadow-sm p-8">
                <h3 className="text-[15px] font-bold text-foreground mb-10">Funil de Conversão do Produto</h3>
                <div className="flex items-end gap-6 h-[200px] max-w-4xl mx-auto">
                    {FUNNEL.map((step, i) => {
                        const maxVal = FUNNEL[0].value;
                        const height = (step.value / maxVal) * 100;
                        return (
                            <div key={step.name} className="flex-1 flex flex-col items-center gap-4 group">
                                <span className="text-[13px] font-bold text-foreground tabular-nums">{step.value.toLocaleString()}</span>
                                <div className="w-full relative">
                                    <div
                                        className="w-full rounded-xl bg-[#3E768D]/10 border border-[#3E768D]/20 transition-all duration-500 group-hover:bg-[#3E768D]/20 group-hover:border-[#3E768D]/30 shadow-inner"
                                        style={{ height: `${height * 2}px` }}
                                    />
                                    {i < FUNNEL.length - 1 && (
                                        <div className="absolute top-1/2 -right-3 -translate-y-1/2 z-10 hidden md:block">
                                            <div className="bg-muted px-2 py-1 rounded-full text-[10px] font-bold text-muted-foreground border border-border/50 transform rotate-90 md:rotate-0">
                                                {((FUNNEL[i + 1].value / step.value) * 100).toFixed(0)}%
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{step.name}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Origem dos usuários */}
            <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden mb-2">
                <div className="px-6 py-4 border-b border-border/30 bg-muted/20 flex items-center justify-between">
                    <h3 className="text-[14px] font-bold text-foreground">Traffic Analytics por Campanha</h3>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Live tracking</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/30">
                                {["SOURCE", "MEDIUM", "CAMPAIGN", "USERS", "CONVERSIONS", "REVENUE"].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {SOURCE_DATA.map((s) => (
                                <tr key={s.source} className="hover:bg-muted/5 transition-colors">
                                    <td className="px-6 py-4 text-[13.5px] font-bold text-foreground/90">{s.source}</td>
                                    <td className="px-6 py-4 text-[12px] text-muted-foreground font-medium uppercase tracking-wider">{s.medium}</td>
                                    <td className="px-6 py-4 text-[11px] text-muted-foreground font-bold font-mono bg-muted/20 rounded-md inline-block m-4">{s.campaign}</td>
                                    <td className="px-6 py-4 text-[13px] font-bold tabular-nums text-foreground/70">{s.users.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-[13px] font-bold text-[#3E768D]">{s.conversions}</td>
                                    <td className="px-6 py-4 text-[13.5px] font-bold text-emerald-600">{s.revenue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Conversão e CAC por canal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-border/30 bg-muted/20">
                        <h3 className="text-[14px] font-bold text-foreground">Efficiency by Channel</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/30">
                                    {["CANAL", "CVR", "LTV/CAC"].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {SOURCE_DATA.map((c) => (
                                    <tr key={c.source} className="hover:bg-muted/5 transition-colors">
                                        <td className="px-6 py-4 text-[13px] font-bold text-foreground/90">{c.source}</td>
                                        <td className="px-6 py-4 text-[13px] font-bold text-emerald-500 tabular-nums">
                                            {c.convRate}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#3E768D]" style={{ width: `${c.ratio === "—" ? 0 : Math.min(100, parseFloat(c.ratio))}%` }} />
                                                </div>
                                                <span className="text-[12px] font-bold text-[#3E768D] tabular-nums">{c.ratio}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-card shadow-sm p-6 flex flex-col justify-center text-center">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                        <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                    <h4 className="text-[18px] font-bold text-foreground">Sustentabilidade em 46.9x</h4>
                    <p className="text-[13px] text-muted-foreground mt-2 max-w-xs mx-auto font-medium">Seu LTV/CAC médio é extraordinário. Sugerimos agressividade maior em canais com CAC abaixo de R$ 15,00.</p>
                </div>
            </div>
        </div>
    );
}
