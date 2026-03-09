import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

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

export default function AdminProduct() {
    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-8">
                <div>
                    <h1 className="text-4xl font-serif font-normal text-foreground tracking-tight">Product Analytics</h1>
                    <p className="text-sm text-muted-foreground mt-2">Uso de features, engajamento e retenção granular.</p>
                </div>
            </div>

            <div className="mb-12">
                <AdminSubNav
                    items={[
                        { label: "Growth", path: "/admin/growth" },
                        { label: "Product", path: "/admin/product" },
                        { label: "Retention", path: "/admin/analytics/retention" },
                    ]}
                />
            </div>

            {/* Engagement KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 border-b border-border/10 pb-12">
                {[
                    { label: "DAU", value: String(ENGAGEMENT.dau), desc: "Daily Active Users" },
                    { label: "WAU", value: String(ENGAGEMENT.wau), desc: "Weekly Active Users" },
                    { label: "MAU", value: String(ENGAGEMENT.mau), desc: "Monthly Active Users" },
                    { label: "STICKINESS", value: ENGAGEMENT.stickiness, desc: "DAU / MAU Ratio" },
                ].map((kpi) => (
                    <div key={kpi.label} className="flex flex-col">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">{kpi.label}</span>
                        <p className="text-4xl font-normal text-foreground tracking-tight font-serif">{kpi.value}</p>
                        <span className="text-[11px] text-muted-foreground mt-2 font-medium uppercase tracking-tighter opacity-60">{kpi.desc}</span>
                    </div>
                ))}
            </div>

            {/* Feature usage table */}
            <div className="w-full mb-20">
                <h3 className="text-xl font-serif text-foreground mb-8">Usage by Application Feature</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/20">
                                {["FEATURE", "UNIQUE USERS", "TOTAL USAGE", "AVG/USER", "ENGAGEMENT"].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {FEATURE_USAGE.map((f) => (
                                <tr key={f.feature} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-4 text-sm font-semibold text-foreground">{f.feature}</td>
                                    <td className="px-4 py-4 text-sm font-semibold tabular-nums text-foreground/70">{f.unique.toLocaleString()}</td>
                                    <td className="px-4 py-4 text-sm font-bold tabular-nums text-foreground">{f.total.toLocaleString()}</td>
                                    <td className="px-4 py-4 text-xs text-muted-foreground font-bold tabular-nums">{f.avg}</td>
                                    <td className="px-4 py-4">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase",
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
                <div>
                    <h3 className="text-xl font-serif text-foreground mb-8">Retention by Monthly Cohort</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/20">
                                    {["COHORT", "DAY 1", "DAY 7", "DAY 30"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/10">
                                {RETENTION_COHORTS.map((c) => (
                                    <tr key={c.cohort} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-4 text-sm font-bold text-foreground">{c.cohort}</td>
                                        <td className="px-4 py-4 text-sm text-emerald-500 font-bold tabular-nums">{c.d1}</td>
                                        <td className="px-4 py-4 text-sm text-foreground font-bold tabular-nums">{c.d7}</td>
                                        <td className="px-4 py-4 text-sm text-muted-foreground font-bold tabular-nums">{c.d30}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                    {SESSION_STATS.map((s) => (
                        <div key={s.label} className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{s.label}</span>
                            <p className="text-2xl font-normal text-foreground tracking-tight font-serif">{s.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
