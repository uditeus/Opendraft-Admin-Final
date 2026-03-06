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

export default function AdminApiUsage() {
    return (
        <div className="flex flex-col gap-10 max-w-5xl mx-auto pb-20">
            <div className="mt-10">
                <h1 className="text-3xl font-serif font-semibold text-foreground tracking-tight">API Usage</h1>
                <p className="text-sm text-muted-foreground mt-1">Custo, consumo de modelos e limites da plataforma</p>
            </div>

            {/* KPIs */}
            <div className="flex flex-wrap items-center justify-between gap-6 px-1 border-b border-border/30 pb-8">
                {[
                    { label: "Tokens Hoje", value: "142.8K", highlight: true },
                    { label: "Tokens 30D", value: "3.84M" },
                    { label: "Custo Hoje", value: "R$ 47", highlight: true },
                    { label: "Custo Mensal", value: "R$ 1.940" },
                    { label: "Custo/Usuário", value: "R$ 1,55" },
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

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest">Tokens por dia (30d)</h3>
                    </div>
                    <div className="h-[260px] w-full bg-background rounded-2xl border border-border/50 p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={TOKENS_30D}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dx={-10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                                <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                                <Area type="monotone" dataKey="tokens" stroke="#0066fe" fill="#0066fe" fillOpacity={0.05} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest">Custo por dia</h3>
                    </div>
                    <div className="h-[260px] w-full bg-background rounded-2xl border border-border/50 p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={COST_30D}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dx={-10} />
                                <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} cursor={{ fill: "hsl(var(--muted)/0.3)" }} />
                                <Bar dataKey="cost" fill="#0066fe" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Breakdown por modelo & Feature */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Breakdown por modelo */}
                <div className="border border-border/30 rounded-3xl overflow-hidden bg-background">
                    <div className="px-6 py-5 border-b border-border/30">
                        <h3 className="text-sm font-semibold text-foreground">Consumo por Modelo</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/30 bg-muted/5">
                                    {["MODELO", "TOTAL TOKENS", "CUSTO ESTIMADO"].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {MODEL_BREAKDOWN.map((m) => (
                                    <tr key={m.model} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-6 py-4 text-sm font-semibold text-foreground">{m.model}</td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{m.total}</td>
                                        <td className="px-6 py-4 text-sm text-[#0066fe] font-semibold">{m.cost}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Custo por feature */}
                <div className="border border-border/30 rounded-3xl overflow-hidden bg-background">
                    <div className="px-6 py-5 border-b border-border/30">
                        <h3 className="text-sm font-semibold text-foreground">Custo por Feature</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/30 bg-muted/5">
                                    {["FEATURE", "TOKENS", "CUSTO"].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {COST_PER_FEATURE.map((f) => (
                                    <tr key={f.feature} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-6 py-4 text-sm font-semibold text-foreground">{f.feature}</td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{f.tokens}</td>
                                        <td className="px-6 py-4 text-sm text-[#0066fe] font-semibold">{f.cost}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Usuários que mais consomem */}
            <div className="border border-border/30 rounded-3xl overflow-hidden bg-background">
                <div className="flex items-center justify-between px-6 py-5 border-b border-border/30">
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">Top Consumidores</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Ordenado por requisições e custo</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/30 bg-muted/5">
                                {["USUÁRIO", "PLANO", "REQUESTS", "TOKENS", "CUSTO ESTIMADO"].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {TOP_USERS.map((u) => (
                                <tr key={u.user} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-muted/20 border border-border/30 flex items-center justify-center">
                                                <AppIcon name="UserIcon" className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                            {u.user}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full border border-border bg-muted/20 text-foreground">
                                            {u.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{u.requests.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{u.tokens}</td>
                                    <td className="px-6 py-4 text-sm text-[#0066fe] font-semibold">{u.cost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Limites */}
            <div className="border border-border/30 rounded-3xl overflow-hidden bg-background p-6">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-6">Limites por plano</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(LIMITS).map(([plan, limits]) => (
                        <div key={plan} className="rounded-2xl border border-border/30 p-5">
                            <h4 className="text-sm font-semibold text-foreground mb-4">{plan}</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center pb-2 border-b border-border/20">
                                    <span className="text-xs text-muted-foreground">Tokens/dia</span>
                                    <span className="text-xs font-bold text-foreground">{limits.tokensDay === 0 ? "∞" : limits.tokensDay.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-border/20">
                                    <span className="text-xs text-muted-foreground">Req/min</span>
                                    <span className="text-xs font-bold text-foreground">{limits.reqMin === 0 ? "∞" : limits.reqMin}</span>
                                </div>
                                <div className="flex justify-between items-center relative">
                                    <span className="text-xs text-muted-foreground">Tokens/req</span>
                                    <span className="text-xs font-bold text-foreground">{limits.tokensReq === 0 ? "∞" : limits.tokensReq.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
