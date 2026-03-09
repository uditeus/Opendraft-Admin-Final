import * as React from "react";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/icons/AppIcon";
import { ACQUISITION_SOURCES as SOURCE_DATA, GROWTH_FUNNEL as FUNNEL } from "@/lib/admin-mock";

export default function AdminGrowth() {
    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-8">
                <div>
                    <h1 className="text-4xl font-serif font-normal text-foreground tracking-tight">Growth</h1>
                    <p className="text-sm text-muted-foreground mt-2">Visitantes, signups, conversão e métricas de canais.</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 border-b border-border/10 pb-12">
                {[
                    { label: "VISITANTES (30D)", value: "48.200", change: "+12.4%" },
                    { label: "SIGNUPS (30D)", value: "3.420", change: "+8.2%" },
                    { label: "CONVERSÃO GERAL", value: "2.23%", change: "-0.5%" },
                    { label: "CAC MÉDIO", value: "R$ 12,40", change: "-R$ 1,20" },
                ].map((kpi) => (
                    <div key={kpi.label} className="flex flex-col">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">{kpi.label}</span>
                        <div className="flex items-baseline gap-2">
                            <p className="text-4xl font-normal text-foreground tracking-tight font-serif">{kpi.value}</p>
                            <span className={cn("text-xs font-semibold", kpi.change.startsWith("+") ? "text-emerald-500" : "text-emerald-500")}>
                                {kpi.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Funil Visual */}
            <div className="w-full mb-16">
                <h3 className="text-xl font-serif text-foreground mb-8">Funil de Conversão do Produto</h3>
                <div className="flex items-end gap-4 h-[200px] max-w-4xl pt-4">
                    {FUNNEL.map((step, i) => {
                        const maxVal = FUNNEL[0].value;
                        const height = (step.value / maxVal) * 100;
                        return (
                            <div key={step.name} className="flex-1 flex flex-col items-center gap-4 group">
                                <span className="text-sm font-semibold text-foreground tabular-nums opacity-80">{step.value.toLocaleString()}</span>
                                <div className="w-full relative px-2">
                                    <div
                                        className="w-full rounded-xl bg-muted/20 transition-all duration-500 group-hover:bg-foreground group-hover:opacity-80"
                                        style={{ height: `${height * 1.5}px` }}
                                    />
                                    {i < FUNNEL.length - 1 && (
                                        <div className="absolute top-1/2 -right-6 -translate-y-1/2 z-10 hidden md:flex items-center">
                                            <div className="bg-background px-2 py-1 rounded-full text-[10px] font-bold text-foreground border border-border/30">
                                                {((FUNNEL[i + 1].value / step.value) * 100).toFixed(0)}%
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{step.name}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-16">
                {/* Traffic Analytics */}
                <div className="w-full">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-serif text-foreground">Tráfego & Analytics</h3>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/20">
                                    {["SOURCE", "USERS", "CONVERSIONS", "REVENUE"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/10">
                                {SOURCE_DATA.map((s) => (
                                    <tr key={s.source} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-4 text-sm font-medium text-foreground">
                                            <div className="flex flex-col">
                                                <span>{s.source}</span>
                                                <span className="text-[10px] font-mono text-muted-foreground uppercase mt-0.5">{s.campaign}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm tabular-nums text-foreground/80">{s.users.toLocaleString()}</td>
                                        <td className="px-4 py-4 text-sm font-semibold text-foreground">{s.conversions}</td>
                                        <td className="px-4 py-4 text-sm font-semibold text-emerald-500">{s.revenue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Efficiency by Channel */}
                <div className="w-full">
                    <h3 className="text-xl font-serif text-foreground mb-8">Eficiência (CAC/LTV)</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/20">
                                    {["CANAL", "CVR", "LTV/CAC"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/10">
                                {SOURCE_DATA.map((c) => (
                                    <tr key={c.source} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-4 text-sm font-medium text-foreground">{c.source}</td>
                                        <td className="px-4 py-4 text-sm font-medium text-emerald-500 tabular-nums">
                                            {c.convRate}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-semibold text-foreground/80 tabular-nums">{c.ratio}</span>
                                                {c.ratio !== "—" && (
                                                    <div className="h-1.5 w-16 bg-muted/30 rounded-full overflow-hidden">
                                                        <div className="h-full bg-foreground" style={{ width: `${Math.min(100, parseFloat(c.ratio))}%` }} />
                                                    </div>
                                                )}
                                            </div>
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
