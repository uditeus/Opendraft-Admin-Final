import * as React from "react";
import { cn } from "@/lib/utils";

const FEATURE_USAGE = [
    { feature: "Escrever copy", unique: 982, total: 14200, avg: "14.5x", engagement: "Alto" },
    { feature: "Explorar ideias", unique: 741, total: 6800, avg: "9.2x", engagement: "Alto" },
    { feature: "Planejar conteúdo", unique: 423, total: 2100, avg: "5.0x", engagement: "Médio" },
    { feature: "Analisar copy", unique: 312, total: 1840, avg: "5.9x", engagement: "Médio" },
    { feature: "Templates", unique: 687, total: 4200, avg: "6.1x", engagement: "Alto" },
    { feature: "Biblioteca", unique: 891, total: 8400, avg: "9.4x", engagement: "Alto" },
    { feature: "Playbooks", unique: 214, total: 740, avg: "3.5x", engagement: "Baixo" },
];

const ENGAGEMENT = {
    dau: 423,
    wau: 891,
    mau: 1247,
    stickiness: "33.9%",
};

const RETENTION_COHORTS = [
    { cohort: "Jan/25", d1: "72%", d7: "48%", d30: "31%" },
    { cohort: "Fev/25", d1: "74%", d7: "51%", d30: "34%" },
    { cohort: "Mar/25", d1: "71%", d7: "47%", d30: "—" },
];

const SESSION_STATS = [
    { label: "Duração média de sessão", value: "8m 42s" },
    { label: "Páginas por sessão", value: "4.7" },
    { label: "Bounce rate", value: "23%" },
    { label: "Sessões por usuário/semana", value: "3.2" },
];

import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminProduct() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">Product Analytics</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Uso de features, engajamento e retenção granular</p>
            </div>

            <AdminSubNav
                items={[
                    { label: "Growth", path: "/admin/growth" },
                    { label: "Product", path: "/admin/product" },
                    { label: "Retention", path: "/admin/analytics/retention" },
                ]}
            />

            {/* Engagement KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "DAU", value: String(ENGAGEMENT.dau), desc: "Daily Active Users" },
                    { label: "WAU", value: String(ENGAGEMENT.wau), desc: "Weekly Active Users" },
                    { label: "MAU", value: String(ENGAGEMENT.mau), desc: "Monthly Active Users" },
                    { label: "STICKINESS", value: ENGAGEMENT.stickiness, desc: "DAU / MAU Ratio" },
                ].map((kpi) => (
                    <div key={kpi.label} className="rounded-xl border border-border/50 bg-card shadow-sm p-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#3E768D]">{kpi.label}</span>
                        <p className="mt-3 text-[26px] font-bold text-foreground/90 tracking-tight">{kpi.value}</p>
                        <span className="text-[11.5px] text-muted-foreground mt-1 block font-medium uppercase tracking-tighter">{kpi.desc}</span>
                    </div>
                ))}
            </div>

            {/* Feature usage table */}
            <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border/30 bg-muted/20">
                    <h3 className="text-[14px] font-bold text-foreground">Usage by Application Feature</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/30">
                                {["FEATURE", "UNIQUE USERS", "TOTAL USAGE", "AVG/USER", "ENGAGEMENT"].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {FEATURE_USAGE.map((f) => (
                                <tr key={f.feature} className="hover:bg-muted/5 transition-colors">
                                    <td className="px-6 py-4 text-[13.5px] font-bold text-foreground/90">{f.feature}</td>
                                    <td className="px-6 py-4 text-[13.5px] font-bold tabular-nums text-foreground/70">{f.unique.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-[13.5px] font-bold tabular-nums text-[#3E768D]">{f.total.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-[13px] text-muted-foreground font-bold tabular-nums">{f.avg}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase",
                                            f.engagement === "Alto" && "text-emerald-500 bg-emerald-500/10",
                                            f.engagement === "Médio" && "text-amber-500 bg-amber-500/10",
                                            f.engagement === "Baixo" && "text-red-500 bg-red-500/10",
                                        )}>
                                            {f.engagement}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Session stats & Retention */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                <div className="rounded-xl border border-border/50 bg-card shadow-sm p-6 overflow-hidden">
                    <h3 className="text-[14px] font-bold text-foreground mb-6">Retention by Monthly Cohort</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/30">
                                    {["COHORT", "DAY 1", "DAY 7", "DAY 30"].map((h) => (
                                        <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {RETENTION_COHORTS.map((c) => (
                                    <tr key={c.cohort} className="hover:bg-muted/5 transition-colors">
                                        <td className="px-5 py-4 text-[13px] font-bold text-foreground/90">{c.cohort}</td>
                                        <td className="px-5 py-4 text-[13px] text-emerald-500 font-bold tabular-nums">{c.d1}</td>
                                        <td className="px-5 py-4 text-[13px] text-[#3E768D] font-bold tabular-nums">{c.d7}</td>
                                        <td className="px-5 py-4 text-[13px] text-muted-foreground font-bold tabular-nums">{c.d30}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {SESSION_STATS.map((s) => (
                        <div key={s.label} className="rounded-xl border border-border/50 bg-card shadow-sm p-6">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{s.label}</span>
                            <p className="mt-2 text-[20px] font-bold text-foreground/90 tracking-tight">{s.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
