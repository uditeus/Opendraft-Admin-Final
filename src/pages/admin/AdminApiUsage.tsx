import * as React from "react";
import { AppIcon } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const TOKENS_30D = Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}`,
    tokens: Math.floor(80000 + Math.random() * 120000),
}));

const COST_30D = TOKENS_30D.map((d) => ({
    day: d.day,
    cost: +(d.tokens * 0.000015).toFixed(2),
}));

const MODEL_BREAKDOWN = [
    { model: "GPT-4.1", requests: 12840, input: "18.2M", output: "4.1M", total: "22.3M", cost: "R$ 1.240" },
    { model: "Claude Sonnet", requests: 4210, input: "6.8M", output: "1.9M", total: "8.7M", cost: "R$ 520" },
    { model: "GPT-4o mini", requests: 31200, input: "9.4M", output: "2.3M", total: "11.7M", cost: "R$ 180" },
];

const TOP_USERS = [
    { user: "Pedro Lima", plan: "Max X", requests: 2140, tokens: "4.2M", cost: "R$ 312", copies: 847 },
    { user: "Ana Costa", plan: "Max", requests: 1870, tokens: "3.1M", cost: "R$ 218", copies: 621 },
    { user: "Bruno Mendes", plan: "Pro", requests: 1240, tokens: "1.8M", cost: "R$ 97", copies: 412 },
    { user: "Julia Santos", plan: "Free", requests: 890, tokens: "0.9M", cost: "R$ 42", copies: 187 },
    { user: "Carlos Silva", plan: "Pro", requests: 740, tokens: "1.2M", cost: "R$ 68", copies: 298 },
];

const COST_PER_FEATURE = [
    { feature: "Escrever copy", tokens: "28.4M", cost: "R$ 1.420", requests: 32100 },
    { feature: "Analisar copy", tokens: "8.2M", cost: "R$ 410", requests: 8700 },
    { feature: "Planejar conteúdo", tokens: "5.1M", cost: "R$ 255", requests: 4200 },
    { feature: "Gerar ideias", tokens: "3.8M", cost: "R$ 190", requests: 6100 },
    { feature: "Explorar", tokens: "2.1M", cost: "R$ 105", requests: 3400 },
];

const LIMITS = {
    Free: { tokensDay: 50000, reqMin: 5, tokensReq: 2000 },
    Pro: { tokensDay: 500000, reqMin: 30, tokensReq: 8000 },
    Max: { tokensDay: 2000000, reqMin: 60, tokensReq: 16000 },
    "Max X": { tokensDay: 0, reqMin: 0, tokensReq: 0 },
};

import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminApiUsage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">AI & Usage</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Custo e consumo de IA da plataforma</p>
            </div>

            <AdminSubNav
                items={[
                    { label: "Usage", path: "/admin/api-usage" },
                    { label: "Costs", path: "/admin/api-usage/costs" },
                    { label: "Models", path: "/admin/api-usage/models" },
                    { label: "Limits", path: "/admin/api-usage/limits" },
                ]}
            />

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "TOKENS HOJE", value: "142.8K", sub: "↑+12% vs ontem" },
                    { label: "TOKENS 7 DIAS", value: "1.02M", sub: "↑+8% vs semana anterior" },
                    { label: "TOKENS MÊS", value: "3.84M", sub: null },
                    { label: "CUSTO HOJE", value: "R$ 47", sub: null },
                    { label: "CUSTO MÊS", value: "R$ 1.940", sub: null },
                    { label: "CUSTO MÉDIO/USUÁRIO", value: "R$ 1,55", sub: null },
                    { label: "MARGEM MÉDIA/USUÁRIO", value: "R$ 47,45", sub: null },
                ].map((kpi) => (
                    <div key={kpi.label} className="rounded-xl border border-border/50 bg-card shadow-sm p-5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">{kpi.label}</span>
                        <p className="mt-2 text-2xl font-semibold text-foreground tracking-tight">{kpi.value}</p>
                        {kpi.sub && <span className="text-[11px] font-medium text-emerald-500 mt-1 block">{kpi.sub}</span>}
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="rounded-xl border border-border/50 bg-card shadow-sm p-6">
                    <h3 className="text-[14px] font-bold text-foreground mb-6">Tokens por dia (30 dias)</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={TOKENS_30D}>
                            <CartesianGrid strokeDasharray="0 0" stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
                            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dx={-10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                            <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                            <Area type="monotone" dataKey="tokens" stroke="#3E768D" fill="#3E768D" fillOpacity={0.06} strokeWidth={2.5} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="rounded-xl border border-border/50 bg-card shadow-sm p-6">
                    <h3 className="text-[14px] font-bold text-foreground mb-6">Custo por dia (R$)</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={COST_30D}>
                            <CartesianGrid strokeDasharray="0 0" stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
                            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dx={-10} />
                            <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                            <Bar dataKey="cost" fill="#3E768D" fillOpacity={0.6} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Breakdown por modelo */}
            <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border/30 bg-muted/20">
                    <h3 className="text-[14px] font-bold text-foreground">Breakdown por modelo</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/30">
                                {["MODELO", "REQUESTS", "TOKENS INPUT", "TOKENS OUTPUT", "TOTAL TOKENS", "CUSTO ESTIMADO"].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {MODEL_BREAKDOWN.map((m) => (
                                <tr key={m.model} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4 text-[13px] font-semibold text-foreground/90">{m.model}</td>
                                    <td className="px-6 py-4 text-[13px] text-foreground/70">{m.requests.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-[13px] text-muted-foreground">{m.input}</td>
                                    <td className="px-6 py-4 text-[13px] text-muted-foreground">{m.output}</td>
                                    <td className="px-6 py-4 text-[13px] text-foreground/70 font-semibold">{m.total}</td>
                                    <td className="px-6 py-4 text-[13px] text-foreground/90 font-bold">{m.cost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Usuários que mais consomem */}
            <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border/30 bg-muted/20">
                    <h3 className="text-[14px] font-bold text-foreground">Usuários que mais consomem</h3>
                    <p className="text-[11px] text-muted-foreground/60 font-medium">Ordenado por maior custo</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/30">
                                {["USUÁRIO", "PLANO", "REQUESTS", "TOKENS", "CUSTO ESTIMADO", "COPIES GERADAS"].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {TOP_USERS.map((u) => (
                                <tr key={u.user} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4 text-[13px] font-semibold text-foreground/90">{u.user}</td>
                                    <td className="px-6 py-4 text-[13px] text-foreground/70">{u.plan}</td>
                                    <td className="px-6 py-4 text-[13px] text-muted-foreground font-medium">{u.requests.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-[13px] text-muted-foreground font-medium">{u.tokens}</td>
                                    <td className="px-6 py-4 text-[13px] text-foreground/90 font-bold">{u.cost}</td>
                                    <td className="px-6 py-4 text-[13px] text-muted-foreground font-medium">{u.copies}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Custo por feature */}
            <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border/30 bg-muted/20">
                    <h3 className="text-[14px] font-bold text-foreground">Custo por feature</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/30">
                                {["FEATURE", "TOKENS", "CUSTO", "REQUESTS"].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {COST_PER_FEATURE.map((f) => (
                                <tr key={f.feature} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4 text-[13px] font-semibold text-foreground/90">{f.feature}</td>
                                    <td className="px-6 py-4 text-[13px] text-muted-foreground font-medium">{f.tokens}</td>
                                    <td className="px-6 py-4 text-[13px] text-foreground/90 font-bold">{f.cost}</td>
                                    <td className="px-6 py-4 text-[13px] text-muted-foreground font-medium">{f.requests.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Limites */}
            <div className="rounded-xl border border-border/50 bg-card shadow-sm p-6 mb-4">
                <h3 className="text-[14px] font-bold text-foreground mb-6">Limites por plano</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {Object.entries(LIMITS).map(([plan, limits]) => (
                        <div key={plan} className="rounded-xl border border-border/40 p-5 bg-muted/10">
                            <h4 className="text-[13px] font-bold text-foreground/80 mb-4">{plan}</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-[12px]">
                                    <span className="text-muted-foreground font-medium">Tokens/dia</span>
                                    <span className="text-foreground/90 font-bold">{limits.tokensDay === 0 ? "∞" : limits.tokensDay.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[12px]">
                                    <span className="text-muted-foreground font-medium">Req/min</span>
                                    <span className="text-foreground/90 font-bold">{limits.reqMin === 0 ? "∞" : limits.reqMin}</span>
                                </div>
                                <div className="flex justify-between text-[12px]">
                                    <span className="text-muted-foreground font-medium">Tokens/req</span>
                                    <span className="text-foreground/90 font-bold">{limits.tokensReq === 0 ? "∞" : limits.tokensReq.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
