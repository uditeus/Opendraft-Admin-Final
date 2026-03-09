import * as React from "react";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/icons/AppIcon";

const HEALTH = [
    { service: "API IA (OpenAI)", status: "ok", latency: "142ms", uptime: "99.98%" },
    { service: "API IA (Anthropic)", status: "ok", latency: "198ms", uptime: "99.95%" },
    { service: "Database (Supabase)", status: "ok", latency: "12ms", uptime: "99.99%" },
    { service: "Auth (Supabase)", status: "ok", latency: "45ms", uptime: "99.99%" },
    { service: "Storage (R2)", status: "degraded", latency: "380ms", uptime: "99.87%" },
    { service: "Payments (Stripe)", status: "ok", latency: "210ms", uptime: "99.97%" },
];

const STATUS_COLOR: Record<string, string> = {
    ok: "text-emerald-500",
    degraded: "text-amber-500",
    down: "text-red-500",
};

const PROMPTS = [
    { id: "main", label: "Prompt Principal", desc: "System prompt para todas as interações", value: "Você é o Opendraft, um assistente de copywriting profissional..." },
    { id: "copy", label: "Prompt de Copy", desc: "Prompt para geração de copies", value: "Ao escrever uma copy, siga a estrutura: Hook → Dor → Oferta → Prova → CTA..." },
    { id: "analysis", label: "Prompt de Análise", desc: "Prompt para análise de texto", value: "Analise o seguinte texto considerando: clareza, persuasão, estrutura..." },
    { id: "planning", label: "Prompt de Planejamento", desc: "Prompt para planejamento de conteúdo", value: "Crie um plano de conteúdo com: objetivo, público, ângulo, estrutura..." },
];

const MODELS = [
    { id: "primary", label: "Modelo Principal", current: "gpt-4.1", options: ["gpt-4.1", "gpt-4o", "claude-sonnet-4-20250514"] },
    { id: "fast", label: "Modelo Rápido", current: "gpt-4o-mini", options: ["gpt-4o-mini", "claude-haiku", "gpt-3.5-turbo"] },
    { id: "analysis", label: "Modelo Análise", current: "claude-sonnet-4-20250514", options: ["claude-sonnet-4-20250514", "gpt-4.1", "gpt-4o"] },
];

const RATE_LIMITS = [
    { plan: "Free", reqMin: 5, tokensDay: 50000 },
    { plan: "Pro", reqMin: 30, tokensDay: 500000 },
    { plan: "Max", reqMin: 60, tokensDay: 2000000 },
    { plan: "Max X", reqMin: 0, tokensDay: 0 },
];

const FEATURE_FLAGS = [
    { id: "ai_generation", label: "Geração IA", desc: "Liga/desliga toda geração IA", enabled: true, critical: true },
    { id: "templates", label: "Templates", desc: "Sistema de templates", enabled: true },
    { id: "playbooks", label: "Playbooks", desc: "Playbooks de copy", enabled: true },
    { id: "exports", label: "Exportação", desc: "Export de docs e PDF", enabled: true },
    { id: "new_editor", label: "Novo Editor", desc: "Nova versão do editor (beta)", enabled: false },
];

const TOKEN_PRICING = [
    { model: "gpt-4.1", input: "R$ 0,012", output: "R$ 0,048" },
    { model: "gpt-4o", input: "R$ 0,0025", output: "R$ 0,010" },
    { model: "gpt-4o-mini", input: "R$ 0,00015", output: "R$ 0,0006" },
];

export default function AdminSettings() {
    const [killSwitch, setKillSwitch] = React.useState(false);
    const [flags, setFlags] = React.useState(FEATURE_FLAGS);
    const [editingPrompt, setEditingPrompt] = React.useState<string | null>(null);

    const toggleFlag = (id: string) => {
        setFlags((prev) => prev.map((f) => f.id === id ? { ...f, enabled: !f.enabled } : f));
    };

    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-8">
                <div>
                    <h1 className="text-4xl font-serif font-normal text-foreground tracking-tight">Settings & Developer</h1>
                    <p className="text-sm text-muted-foreground mt-2">Configurações de infraestrutura, prompts, modelos e flags.</p>
                </div>
            </div>

            {/* Kill Switch */}
            <div className="w-full mb-16">
                <div className={cn(
                    "flex flex-col md:flex-row items-center md:items-start justify-between transition-all duration-300",
                    "border-l-4 pl-6",
                    killSwitch ? "border-red-500" : "border-border/50"
                )}>
                    <div className="flex items-start gap-4 text-center md:text-left">
                        <div className={cn(
                            "mt-1 p-2 rounded-xl transition-colors shrink-0",
                            killSwitch ? "bg-red-500 text-white" : "bg-red-500/10 text-red-500"
                        )}>
                            <AppIcon name="Zap" className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground flex flex-col md:flex-row items-center gap-2">
                                Kill Switch — Geração IA
                                {killSwitch && <span className="mt-2 md:mt-0 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] uppercase tracking-widest animate-pulse">Emergência Ativa</span>}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-2 max-w-md">Desativa instantaneamente toda a API de geração para todos os usuários. Use em falhas críticas de faturamento ou infraestrutura.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setKillSwitch(!killSwitch)}
                        className={cn(
                            "mt-6 md:mt-0 px-8 py-3 w-full md:w-auto text-sm font-bold transition-all whitespace-nowrap",
                            killSwitch ? "text-emerald-500 hover:opacity-80" : "text-red-500 hover:opacity-80"
                        )}
                    >
                        {killSwitch ? "REATIVAR SISTEMAS" : "TRIGGER SHUTDOWN"}
                    </button>
                </div>
            </div>

            {/* Health Checks */}
            <div className="w-full mb-16">
                <h3 className="text-xl font-serif text-foreground mb-8">Infraestrutura & Serviços Externos</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/20">
                                {["SERVIÇO", "STATUS", "LATÊNCIA", "UPTIME"].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {HEALTH.map((h) => (
                                <tr key={h.service} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-4 text-sm font-medium text-foreground">{h.service}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-2 h-2 rounded-full", h.status === "ok" ? "bg-emerald-500" : h.status === "degraded" ? "bg-amber-500" : "bg-red-500")}></div>
                                            <span className={cn("text-[10px] font-bold uppercase tracking-wider", STATUS_COLOR[h.status])}>{h.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm font-mono text-muted-foreground">{h.latency}</td>
                                    <td className="px-4 py-4 text-sm text-muted-foreground">{h.uptime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 mb-16">
                {/* Prompt Manager */}
                <div className="flex flex-col">
                    <h3 className="text-xl font-serif text-foreground mb-8">Prompt Manager</h3>
                    <div className="space-y-4">
                        {PROMPTS.map((p) => (
                            <div key={p.id} className="border-b border-border/20 pb-4 last:border-0 last:pb-0 hover:bg-muted/10 p-4 -mx-4 rounded-xl transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <span className="text-sm font-semibold text-foreground">{p.label}</span>
                                        <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                                    </div>
                                    <button
                                        onClick={() => setEditingPrompt(editingPrompt === p.id ? null : p.id)}
                                        className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {editingPrompt === p.id ? "FECHAR" : "EDITAR"}
                                    </button>
                                </div>
                                {editingPrompt === p.id ? (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <textarea
                                            defaultValue={p.value}
                                            className="w-full rounded-xl border border-border/40 bg-transparent p-4 text-sm font-mono resize-none h-40 outline-none focus:border-foreground transition-all leading-relaxed"
                                        />
                                        <div className="mt-3 flex justify-end">
                                            <button className="px-6 py-2 rounded-full text-[13px] font-medium bg-foreground text-background hover:opacity-90 transition-opacity">
                                                Salvar Alterações
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground font-mono truncate">{p.value}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Second column: Models & Flags */}
                <div className="flex flex-col gap-16">
                    {/* Feature Flags */}
                    <div className="w-full">
                        <h3 className="text-xl font-serif text-foreground mb-8">Feature Flags</h3>
                        <div className="divide-y divide-border/10">
                            {flags.map((f) => (
                                <div key={f.id} className="flex items-center justify-between py-4 hover:bg-muted/10 px-2 -mx-2 rounded-xl transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <span className="text-sm font-medium text-foreground flex items-center gap-2">
                                                {f.label}
                                                {f.critical && <AppIcon name="Zap" className="w-3.5 h-3.5 text-amber-500" />}
                                            </span>
                                            <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => toggleFlag(f.id)} className={cn("w-11 h-6 rounded-full transition-all relative shrink-0", f.enabled ? "bg-foreground" : "bg-muted")}>
                                        <div className={cn("absolute top-1 h-4 w-4 rounded-full bg-white transition-all shadow-sm", f.enabled ? "translate-x-6" : "translate-x-1")} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Model Routing */}
                    <div className="w-full">
                        <h3 className="text-xl font-serif text-foreground mb-8">Model Routing</h3>
                        <div className="space-y-6">
                            {MODELS.map((m) => (
                                <div key={m.id}>
                                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">{m.label}</span>
                                    <select
                                        defaultValue={m.current}
                                        className="w-full bg-transparent border-b border-border/30 pb-2 text-sm font-medium text-foreground outline-none focus:border-foreground transition-all appearance-none cursor-pointer"
                                    >
                                        {m.options.map((o) => (
                                            <option key={o} value={o} className="bg-background text-foreground">{o}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Rate Limits & Pricing tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="w-full">
                    <h3 className="text-xl font-serif text-foreground mb-8">Rate Limits</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/20">
                                    {["PLANO", "R/MIN", "T/DIA"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/10">
                                {RATE_LIMITS.map((r) => (
                                    <tr key={r.plan} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-4 text-sm font-medium text-foreground">{r.plan}</td>
                                        <td className="px-4 py-4 text-sm font-semibold text-foreground">{r.reqMin === 0 ? "∞" : r.reqMin}</td>
                                        <td className="px-4 py-4 text-sm text-muted-foreground">{r.tokensDay === 0 ? "∞" : (r.tokensDay / 1000).toLocaleString() + "k"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="w-full">
                    <h3 className="text-xl font-serif text-foreground mb-8">Preços por Token</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/20">
                                    {["MODELO", "INPUT", "OUTPUT"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/10">
                                {TOKEN_PRICING.map((t) => (
                                    <tr key={t.model} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-4 text-[13px] font-mono text-muted-foreground">{t.model}</td>
                                        <td className="px-4 py-4 text-sm font-medium text-emerald-500">{t.input}</td>
                                        <td className="px-4 py-4 text-sm font-medium text-emerald-500">{t.output}</td>
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
