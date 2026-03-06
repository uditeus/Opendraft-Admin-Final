import * as React from "react";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/icons/AppIcon";
import { ACQUISITION_SOURCES as SOURCE_DATA, GROWTH_FUNNEL as FUNNEL } from "@/lib/admin-mock";

export default function AdminGrowth() {
    return (
        <div className="flex flex-col gap-10 max-w-5xl mx-auto pb-20">
            <div className="mt-10">
                <h1 className="text-3xl font-serif font-semibold text-foreground tracking-tight">Growth</h1>
                <p className="text-sm text-muted-foreground mt-1">Visitantes, signups, conversão e métricas de canais</p>
            </div>

            {/* KPIs */}
            <div className="flex flex-wrap items-center justify-between gap-6 px-1 border-b border-border/30 pb-8">
                {[
                    { label: "Visitantes (30D)", value: "48.200", change: "+12.4%", changeType: "positive" },
                    { label: "Signups (30D)", value: "3.420", change: "+8.2%", changeType: "positive" },
                    { label: "Conversão", value: "2.23%", change: "-0.5%", changeType: "neutral" },
                    { label: "CAC Médio", value: "R$ 12,40", change: "-R$ 1,20", changeType: "positive", highlight: true },
                ].map((kpi, i) => (
                    <div key={i} className="flex flex-col">
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">{kpi.label}</span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className={cn("text-3xl font-semibold tracking-tight", kpi.highlight ? "text-[#0066fe]" : "text-foreground")}>
                                {kpi.value}
                            </span>
                            <span className={cn(
                                "text-xs font-semibold",
                                kpi.changeType === "positive" ? "text-emerald-500" :
                                    kpi.changeType === "negative" ? "text-red-500" : "text-muted-foreground"
                            )}>
                                {kpi.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Funil Visual */}
            <div className="border border-border/30 rounded-3xl p-8 bg-background">
                <h3 className="text-sm font-semibold text-foreground mb-10">Funil de Conversão do Produto</h3>
                <div className="flex items-end gap-4 h-[200px] max-w-4xl mx-auto">
                    {FUNNEL.map((step, i) => {
                        const maxVal = FUNNEL[0].value;
                        const height = (step.value / maxVal) * 100;
                        return (
                            <div key={step.name} className="flex-1 flex flex-col items-center gap-4 group">
                                <span className="text-sm font-semibold text-foreground tabular-nums opacity-80">{step.value.toLocaleString()}</span>
                                <div className="w-full relative px-2">
                                    <div
                                        className="w-full rounded-xl bg-muted/30 transition-all duration-500 group-hover:bg-[#0066fe] group-hover:opacity-80 border border-transparent"
                                        style={{ height: `${height * 1.5}px` }}
                                    />
                                    {i < FUNNEL.length - 1 && (
                                        <div className="absolute top-1/2 -right-6 -translate-y-1/2 z-10 hidden md:flex items-center">
                                            <div className="bg-background px-2.5 py-1 rounded-full text-xs font-bold text-[#0066fe] border border-border/50">
                                                {((FUNNEL[i + 1].value / step.value) * 100).toFixed(0)}%
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{step.name}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Traffic Analytics */}
                <div className="border border-border/30 rounded-3xl overflow-hidden bg-background">
                    <div className="px-6 py-5 border-b border-border/30 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">Tráfego & Analytics</h3>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/30 bg-muted/5">
                                    {["SOURCE", "USERS", "CONVERSIONS", "REVENUE"].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {SOURCE_DATA.map((s) => (
                                    <tr key={s.source} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-6 py-4 text-sm font-semibold text-foreground">
                                            <div className="flex flex-col">
                                                <span>{s.source}</span>
                                                <span className="text-[10px] font-mono text-muted-foreground uppercase">{s.campaign}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-foreground">{s.users.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-[#0066fe]">{s.conversions}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-emerald-500">{s.revenue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Efficiency by Channel */}
                <div className="flex flex-col gap-8">
                    <div className="border border-border/30 rounded-3xl overflow-hidden bg-background">
                        <div className="px-6 py-5 border-b border-border/30">
                            <h3 className="text-sm font-semibold text-foreground">Eficiência (CAC/LTV)</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border/30 bg-muted/5">
                                        {["CANAL", "CVR", "LTV/CAC"].map((h) => (
                                            <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20">
                                    {SOURCE_DATA.map((c) => (
                                        <tr key={c.source} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-6 py-4 text-sm font-semibold text-foreground">{c.source}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-emerald-500 tabular-nums">
                                                {c.convRate}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-bold text-foreground tabular-nums">{c.ratio}</span>
                                                    {c.ratio !== "—" && (
                                                        <div className="h-1.5 w-16 bg-muted/30 rounded-full overflow-hidden">
                                                            <div className="h-full bg-[#0066fe]" style={{ width: `${Math.min(100, parseFloat(c.ratio))}%` }} />
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

                    {/* Simple summary card */}
                    <div className="border border-border/30 rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-background">
                        <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                            <AppIcon name="Activity01Icon" className="h-5 w-5 text-emerald-500" />
                        </div>
                        <h4 className="text-lg font-bold text-foreground">Sustentabilidade em 46.9x</h4>
                        <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                            Seu LTV/CAC médio é excelente. Aumente investimento em canais com CAC abaixo de R$ 15,00.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
