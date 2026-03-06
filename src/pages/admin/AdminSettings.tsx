import * as React from "react";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/icons/AppIcon";

// ── Health Checks ───────────────────────────────────────────
const HEALTH = [
    { service: "API IA (OpenAI)", status: "ok", latency: "142ms", uptime: "99.98%" },
    { service: "API IA (Anthropic)", status: "ok", latency: "198ms", uptime: "99.95%" },
    { service: "Database (Supabase)", status: "ok", latency: "12ms", uptime: "99.99%" },
    { service: "Auth (Supabase)", status: "ok", latency: "45ms", uptime: "99.99%" },
    { service: "Storage (R2)", status: "degraded", latency: "380ms", uptime: "99.87%" },
    { service: "Payments (Stripe)", status: "ok", latency: "210ms", uptime: "99.97%" },
];

const STATUS_COLOR: Record<string, string> = {
    ok: "text-emerald-500 bg-emerald-500/10",
    degraded: "text-amber-400 bg-amber-500/10",
    down: "text-red-500 bg-red-500/10",
};

// ── Prompts ─────────────────────────────────────────────────
const PROMPTS = [
    { id: "main", label: "Prompt Principal", desc: "System prompt para todas as interações", value: "Você é o Opendraft, um assistente de copywriting profissional..." },
    { id: "copy", label: "Prompt de Copy", desc: "Prompt para geração de copies", value: "Ao escrever uma copy, siga a estrutura: Hook → Dor → Oferta → Prova → CTA..." },
    { id: "analysis", label: "Prompt de Análise", desc: "Prompt para análise de texto", value: "Analise o seguinte texto considerando: clareza, persuasão, estrutura..." },
    { id: "planning", label: "Prompt de Planejamento", desc: "Prompt para planejamento de conteúdo", value: "Crie um plano de conteúdo com: objetivo, público, ângulo, estrutura..." },
];

// ── Models ──────────────────────────────────────────────────
const MODELS = [
    { id: "primary", label: "Modelo Principal", current: "gpt-4.1", options: ["gpt-4.1", "gpt-4o", "claude-sonnet-4-20250514"] },
    { id: "fast", label: "Modelo Rápido", current: "gpt-4o-mini", options: ["gpt-4o-mini", "claude-haiku", "gpt-3.5-turbo"] },
    { id: "analysis", label: "Modelo Análise", current: "claude-sonnet-4-20250514", options: ["claude-sonnet-4-20250514", "gpt-4.1", "gpt-4o"] },
];

// ── Rate Limits ─────────────────────────────────────────────
const RATE_LIMITS = [
    { plan: "Free", reqMin: 5, tokensMin: 10000, tokensDay: 50000, maxPerGen: 2000, maxPerDay: 20 },
    { plan: "Pro", reqMin: 30, tokensMin: 60000, tokensDay: 500000, maxPerGen: 8000, maxPerDay: 200 },
    { plan: "Max", reqMin: 60, tokensMin: 120000, tokensDay: 2000000, maxPerGen: 16000, maxPerDay: 500 },
    { plan: "Max X", reqMin: 0, tokensMin: 0, tokensDay: 0, maxPerGen: 0, maxPerDay: 0 },
];

// ── Feature Flags ───────────────────────────────────────────
const FEATURE_FLAGS = [
    { id: "ai_generation", label: "Geração IA", desc: "Liga/desliga toda geração IA", enabled: true, critical: true },
    { id: "templates", label: "Templates", desc: "Sistema de templates", enabled: true, critical: false },
    { id: "playbooks", label: "Playbooks", desc: "Playbooks de copy", enabled: true, critical: false },
    { id: "exports", label: "Exportação", desc: "Export de docs e PDF", enabled: true, critical: false },
    { id: "new_editor", label: "Novo Editor", desc: "Nova versão do editor (beta)", enabled: false, critical: false },
    { id: "realtime_collab", label: "Collab Real-time", desc: "Colaboração em tempo real (beta)", enabled: false, critical: false },
];

// ── Token Pricing ───────────────────────────────────────────
const TOKEN_PRICING = [
    { model: "gpt-4.1", input: "R$ 0,012", output: "R$ 0,048" },
    { model: "gpt-4o", input: "R$ 0,0025", output: "R$ 0,010" },
    { model: "gpt-4o-mini", input: "R$ 0,00015", output: "R$ 0,0006" },
    { model: "claude-sonnet-4-20250514", input: "R$ 0,003", output: "R$ 0,015" },
];

import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminSettings() {
    const [killSwitch, setKillSwitch] = React.useState(false);
    const [flags, setFlags] = React.useState(FEATURE_FLAGS);
    const [editingPrompt, setEditingPrompt] = React.useState<string | null>(null);

    const toggleFlag = (id: string) => {
        setFlags((prev) => prev.map((f) => f.id === id ? { ...f, enabled: !f.enabled } : f));
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">System Settings</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Configurações de prompts, modelos, feature flags e infraestrutura</p>
            </div>

            <AdminSubNav
                items={[
                    { label: "Prompts & Config", path: "/admin/settings" },
                    { label: "Knowledge Base", path: "/admin/developer/knowledge" },
                    { label: "Experiments", path: "/admin/developer/experiments" },
                    { label: "Queues", path: "/admin/developer/queues" },
                ]}
            />

            {/* Kill Switch */}
            <div className={cn(
                "rounded-xl border-2 p-8 flex items-center justify-between transition-all duration-300 shadow-sm",
                killSwitch
                    ? "border-red-500 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                    : "border-border/50 bg-card hover:border-border",
            )}>
                <div className="flex items-start gap-4">
                    <div className={cn(
                        "mt-1 p-2 rounded-xl transition-colors",
                        killSwitch ? "bg-red-500 text-white" : "bg-red-500/10 text-red-500"
                    )}>
                        <AppIcon name="Zap" className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-[16px] font-bold text-foreground flex items-center gap-2">
                            Kill Switch — Geração IA
                            {killSwitch && <span className="ml-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] uppercase tracking-widest animate-pulse">Ativo</span>}
                        </h3>
                        <p className="text-[13px] text-muted-foreground mt-1 max-w-md font-medium">Desativa toda geração IA instantaneamente em todos os modelos. Use apenas em caso de falha crítica ou abuso massivo.</p>
                    </div>
                </div>
                <button
                    onClick={() => setKillSwitch(!killSwitch)}
                    className={cn(
                        "px-8 py-3 rounded-full text-[13px] font-bold transition-all shadow-lg",
                        killSwitch
                            ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20"
                            : "bg-red-600 text-white hover:bg-red-700 shadow-red-500/20",
                    )}
                >
                    {killSwitch ? "REATIVAR SISTEMAS" : "DETALHAR EMERGENCY SHUTDOWN"}
                </button>
            </div>

            {/* Health Checks */}
            <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden mb-2">
                <div className="px-6 py-4 border-b border-border/30 bg-muted/20">
                    <h3 className="text-[14px] font-bold text-foreground">Infra Health Check</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">Monitoramento de latência e disponibilidade</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/30">
                                {["SERVIÇO", "STATUS", "LATÊNCIA", "UPTIME"].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {HEALTH.map((h) => (
                                <tr key={h.service} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4 text-[13.5px] font-bold text-foreground/90">{h.service}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm", STATUS_COLOR[h.status])}>{h.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-[13px] font-bold tabular-nums text-foreground/60">{h.latency}</td>
                                    <td className="px-6 py-4 text-[13px] text-muted-foreground font-medium">{h.uptime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Two column layout for Prompts and Models */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Prompt Manager */}
                <div className="rounded-xl border border-border/50 bg-card shadow-sm p-6">
                    <h3 className="text-[15px] font-bold text-foreground mb-1">Prompt Manager</h3>
                    <p className="text-[12px] text-muted-foreground mb-6 font-medium">Edite prompts do sistema em tempo real sem deploy.</p>
                    <div className="space-y-4">
                        {PROMPTS.map((p) => (
                            <div key={p.id} className="rounded-xl border border-border/30 p-5 bg-muted/5 group transition-all hover:border-border">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <span className="text-[13px] font-bold text-foreground/90 group-hover:text-[#3E768D] transition-colors">{p.label}</span>
                                        <p className="text-[11px] text-muted-foreground font-medium">{p.desc}</p>
                                    </div>
                                    <button
                                        onClick={() => setEditingPrompt(editingPrompt === p.id ? null : p.id)}
                                        className="px-3 py-1.5 rounded-full text-[11px] font-bold border border-border/40 text-muted-foreground hover:text-foreground hover:border-border transition-all uppercase tracking-wider"
                                    >
                                        {editingPrompt === p.id ? "Fechar" : "Editar"}
                                    </button>
                                </div>
                                {editingPrompt === p.id ? (
                                    <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <textarea
                                            defaultValue={p.value}
                                            className="w-full rounded-xl border border-border/40 bg-muted/20 p-4 text-[12px] text-foreground font-mono resize-none h-40 outline-none focus:border-[#3E768D]/40 transition-all leading-relaxed"
                                        />
                                        <div className="mt-3 flex justify-end">
                                            <button className="px-6 py-2 rounded-full text-[12px] font-bold bg-[#3E768D] text-white shadow-lg shadow-[#3E768D]/20 hover:shadow-xl transition-all">
                                                Salvar Alterações
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-[12px] text-muted-foreground/60 font-mono italic truncate">{p.value}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Model Selector */}
                    <div className="rounded-xl border border-border/50 bg-card shadow-sm p-6">
                        <h3 className="text-[15px] font-bold text-foreground mb-1">Model Routing</h3>
                        <p className="text-[12px] text-muted-foreground mb-6 font-medium">Configure quais modelos processam cada tipo de request.</p>
                        <div className="space-y-4">
                            {MODELS.map((m) => (
                                <div key={m.id} className="rounded-xl border border-border/30 p-5 bg-muted/5">
                                    <span className="text-[13px] font-bold text-foreground/80 block mb-3 uppercase tracking-wider text-[#3E768D]">{m.label}</span>
                                    <select
                                        defaultValue={m.current}
                                        className="w-full bg-muted/20 border border-border/40 rounded-xl px-4 py-3 text-[13px] font-bold text-foreground outline-none focus:border-[#3E768D]/40 transition-all appearance-none cursor-pointer"
                                    >
                                        {m.options.map((o) => (
                                            <option key={o} value={o} className="bg-card text-foreground">{o}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Feature Flags */}
                    <div className="rounded-xl border border-border/50 bg-card shadow-sm p-6">
                        <h3 className="text-[15px] font-bold text-foreground mb-1">Feature Flags</h3>
                        <p className="text-[12px] text-muted-foreground mb-6 font-medium">Controle granular de funcionalidades em produção.</p>
                        <div className="space-y-3">
                            {flags.map((f) => (
                                <div key={f.id} className="flex items-center justify-between rounded-xl border border-border/30 p-4 bg-muted/5 hover:bg-muted/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "h-2.5 w-2.5 rounded-full shrink-0 shadow-sm transition-all",
                                            f.enabled ? "bg-emerald-500 shadow-emerald-500/20" : "bg-muted-foreground/30"
                                        )} />
                                        <div>
                                            <span className="text-[13.5px] font-bold text-foreground/90">{f.label}</span>
                                            <p className="text-[11px] text-muted-foreground font-medium">{f.desc}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleFlag(f.id)}
                                        className={cn(
                                            "w-11 h-6 rounded-full transition-all relative shadow-inner",
                                            f.enabled ? "bg-[#3E768D]" : "bg-muted",
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-1 h-4 w-4 rounded-full bg-white transition-all shadow-md",
                                            f.enabled ? "translate-x-6" : "translate-x-1",
                                        )} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Rate Limits & Pricing tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-border/30 bg-muted/20">
                        <h3 className="text-[14px] font-bold text-foreground">Rate Limits (Globit)</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/30">
                                    {["PLANO", "R/MIN", "T/DIA"].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {RATE_LIMITS.map((r) => (
                                    <tr key={r.plan} className="border-b border-border/20 last:border-0">
                                        <td className="px-6 py-4 text-[13px] font-bold text-foreground/90">{r.plan}</td>
                                        <td className="px-6 py-4 text-[13px] font-bold tabular-nums text-[#3E768D]">{r.reqMin === 0 ? "∞" : r.reqMin}</td>
                                        <td className="px-6 py-4 text-[13px] font-medium text-muted-foreground tabular-nums">{r.tokensDay === 0 ? "∞" : (r.tokensDay / 1000).toLocaleString() + "k"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-border/30 bg-muted/20">
                        <h3 className="text-[14px] font-bold text-foreground">Token Valuation (BRL)</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/30">
                                    {["MODELO", "INPUT", "OUTPUT"].map((h) => (
                                        <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {TOKEN_PRICING.map((t) => (
                                    <tr key={t.model} className="border-b border-border/20 last:border-0 hover:bg-muted/5 transition-colors">
                                        <td className="px-6 py-4 text-[12px] font-bold font-mono text-foreground/70">{t.model}</td>
                                        <td className="px-6 py-4 text-[12px] font-bold tabular-nums text-emerald-500">{t.input}</td>
                                        <td className="px-6 py-4 text-[12px] font-bold tabular-nums text-emerald-500">{t.output}</td>
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
