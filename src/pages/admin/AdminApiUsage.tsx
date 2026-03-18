import * as React from "react";
import { AppIcon } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const TOKEN_TREND = Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}`,
    tokens: Math.floor(500000 + Math.random() * 1500000),
}));

const COST_TREND = Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}`,
    cost: +(Math.random() * 100 + 50).toFixed(2),
}));

const MODEL_STARS = [
    { model: "GPT-4o", provider: "OpenAI", calls: 12840, tokens: "22.3M", avgLatency: "120ms", cost: "R$ 1.240" },
    { model: "Claude 3.5 Sonnet", provider: "Anthropic", calls: 4210, tokens: "8.7M", avgLatency: "180ms", cost: "R$ 520" },
    { model: "Gemini 1.5 Pro", provider: "Google", calls: 31200, tokens: "11.7M", avgLatency: "90ms", cost: "R$ 180" },
    { model: "Llama 3 8B", provider: "Meta", calls: 8700, tokens: "4.5M", avgLatency: "210ms", cost: "R$ 90" },
    { model: "Mixtral 8x7B", provider: "Mistral AI", calls: 5400, tokens: "3.1M", avgLatency: "150ms", cost: "R$ 60" },
];

export default function AdminApiUsage() {
    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 mt-8">
                <div>
                    <h1 className="text-[42px]  font-normal text-foreground tracking-tight leading-tight">API Usage</h1>
                    <p className="text-[15px] text-muted-foreground mt-3 font-normal">Monitoramento em tempo real de tokens, latência e custos de inferência.</p>
                </div>
            </div>

            {/* KPIs - Refined */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20 border-b border-border/5 pb-16">
                {[
                    { label: "Custo (Mês)", value: "$4.280,50", trend: "+12.4%", negative: true },
                    { label: "Tokens Gerados", value: "84.2M", trend: "+5.1%" },
                    { label: "Chamadas (30d)", value: "1.242k", trend: "-0.5%" },
                    { label: "Taxa de Erro", value: "0.02%", trend: "Estável" },
                ].map((kpi) => (
                    <div key={kpi.label} className="flex flex-col">
                        <span className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest mb-4">{kpi.label}</span>
                        <div className="flex items-baseline gap-3">
                            <p className="text-[38px] font-normal text-foreground tracking-tight ">{kpi.value}</p>
                            <span className={cn("text-[12px] font-medium transition-colors",
                                kpi.negative ? "text-amber-500" : "text-emerald-500"
                            )}>
                                {kpi.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Gráficos Principais - Enhanced */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-24">
                <div className="w-full">
                    <h3 className="text-[20px]  text-foreground/90 mb-10 tracking-tight text-center lg:text-left">Consumo de Tokens (Diário)</h3>
                    <div className="h-[300px] w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={TOKEN_TREND}>
                                <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" strokeOpacity={0.1} vertical={false} />
                                <XAxis
                                    dataKey="day"
                                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", opacity: 0.4 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={15}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", opacity: 0.4 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dx={-15}
                                />
                                <Tooltip
                                    cursor={{ fill: "hsl(var(--muted)/0.05)" }}
                                    contentStyle={{
                                        background: "hsl(var(--background))",
                                        border: "1px solid hsl(var(--border)/0.2)",
                                        borderRadius: 12,
                                        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
                                        fontSize: 12
                                    }}
                                />
                                <Bar
                                    dataKey="tokens"
                                    fill="currentColor"
                                    className="text-foreground/80 hover:text-foreground transition-colors"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={32}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="w-full">
                    <h3 className="text-[20px]  text-foreground/90 mb-10 tracking-tight text-center lg:text-left">Custo Operacional</h3>
                    <div className="h-[300px] w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={COST_TREND}>
                                <defs>
                                    <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="currentColor" stopOpacity={0.1} className="text-foreground" />
                                        <stop offset="95%" stopColor="currentColor" stopOpacity={0} className="text-foreground" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" strokeOpacity={0.1} vertical={false} />
                                <XAxis
                                    dataKey="day"
                                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", opacity: 0.4 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={15}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", opacity: 0.4 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dx={-15}
                                />
                                <Tooltip
                                    cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1, strokeOpacity: 0.5 }}
                                    contentStyle={{
                                        background: "hsl(var(--background))",
                                        border: "1px solid hsl(var(--border)/0.2)",
                                        borderRadius: 12,
                                        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
                                        fontSize: 12
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="cost"
                                    stroke="currentColor"
                                    fill="url(#costGradient)"
                                    strokeWidth={2.5}
                                    className="text-foreground"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Listagem por Modelo - Clean Table */}
            <div className="w-full">
                <h3 className="text-[22px]  text-foreground/90 mb-10 tracking-tight">Consumo por Modelo</h3>
                <div className="overflow-x-auto -mx-2">
                    <table className="w-full border-separate border-spacing-0">
                        <thead>
                            <tr>
                                {["Modelo", "Provedor", "Chamadas", "Tokens", "Latência", "Custo"].map((h) => (
                                    <th key={h} className="px-5 py-4 text-left text-[11px] font-medium uppercase tracking-widest text-muted-foreground/30">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/5">
                            {MODEL_STARS.map((s) => (
                                <tr key={s.model} className="group hover:bg-muted/5 transition-all">
                                    <td className="px-5 py-6 text-[14.5px] font-medium text-foreground/80">{s.model}</td>
                                    <td className="px-5 py-6">
                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted/10 text-muted-foreground/60 border border-border/5 tracking-wider uppercase">
                                            {s.provider}
                                        </span>
                                    </td>
                                    <td className="px-5 py-6 text-[14px] tabular-nums text-muted-foreground/60">{s.calls.toLocaleString()}</td>
                                    <td className="px-5 py-6 text-[14px] font-medium text-foreground/70">{s.tokens}</td>
                                    <td className="px-5 py-6 text-[14px] tabular-nums text-muted-foreground/50">{s.avgLatency}</td>
                                    <td className="px-5 py-6 text-[14.5px] font-semibold text-foreground tabular-nums">{s.cost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
