import * as React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ─── Plan data ────────────────────────────────────────────────────────────────

const PLANS = [
    {
        id: "pro",
        name: "Pro",
        tagline: "Para uso intensivo diário.",
        price: { monthly: "20", yearly: "16" },
        currency: "$",
        perUser: false,
        cta: "Assinar Pro",
        headerNote: null as string | null,
        features: [
            "Mais uso mensal*",
            "Acesso ao Opendraft 1.5 Pro",
            "Playbooks e agentes personalizados",
            "Estilos de escrita personalizados",
            "Acesso antecipado a novos recursos",
            "Exportação PDF e Docx",
            "Suporte via chat",
        ],
    },
    {
        id: "max",
        name: "Max",
        tagline: "Para produtores de alto volume.",
        price: { monthly: "100", yearly: "80" },
        currency: "$",
        perUser: false,
        cta: "Assinar Max",
        headerNote: "Tudo do Pro, mais:",
        features: [
            "20× mais uso que o Pro*",
            "Todos os modelos Opendraft",
            "Integração com ferramentas de marketing",
            "Acesso à API",
            "Suporte prioritário",
            "Compartilhamento de playbooks",
            "Painel de uso da equipe",
        ],
    },
    {
        id: "max5x",
        name: "Max 5x",
        tagline: "Para equipes de alta performance.",
        price: { monthly: "500", yearly: "400" },
        currency: "$",
        perUser: true,
        cta: "Assinar Max 5x",
        headerNote: "Tudo do Max, mais:",
        features: [
            "100× mais uso que o Pro*",
            "Gestão de membros e permissões",
            "Faturamento centralizado",
            "Relatórios de produção",
            "Retenção de dados configurável",
            "SSO / SAML",
            "SLA garantido",
        ],
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UpgradePage() {
    const navigate = useNavigate();
    const [billing, setBilling] = React.useState<"monthly" | "yearly">("yearly");

    return (
        <div className="h-screen overflow-hidden bg-[#f7f7f7] dark:bg-[#131416] text-foreground flex flex-col">


            {/* Back icon */}
            <div className="fixed top-4 left-4 z-20">
                <button
                    onClick={() => navigate(-1)}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 translate-y-1">

                {/* Header */}
                <div className="text-center mb-14">
                    <h1 className="text-[32px] font-semibold text-foreground tracking-[-0.02em]">
                        Planos que crescem com você
                    </h1>
                </div>

                {/* Billing toggle */}
                <div className="flex items-center bg-zinc-100 dark:bg-[#181a1b] rounded-xl p-0.5 mb-5 border border-black/[0.06] dark:border-white/[0.05]">
                    {(["yearly", "monthly"] as const).map((cycle) => (
                        <button
                            key={cycle}
                            onClick={() => setBilling(cycle)}
                            className={cn(
                                "flex items-center px-4 h-7 rounded-lg text-[12.5px] font-medium transition-all duration-200",
                                billing === cycle
                                    ? "bg-white dark:bg-[#131416] text-zinc-900 dark:text-zinc-100 shadow-sm"
                                    : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                            )}
                        >
                            {cycle === "yearly" ? "Anual" : "Mensal"}
                        </button>
                    ))}
                </div>

                {/* Cards */}
                <div className="w-full max-w-[1140px] grid grid-cols-1 md:grid-cols-3 gap-5">
                    {PLANS.map((plan) => (
                        <div key={plan.id} className="flex flex-col rounded-xl bg-[#fefefe] dark:bg-[#181a1b] border border-black/[0.06] dark:border-white/[0.05] shadow-sm min-h-[600px]">
                            <div className="p-9 pb-7">
                                {/* Name + tagline */}
                                <p className="text-[24px] font-semibold text-foreground tracking-tight mb-0.5">
                                    {plan.name}
                                </p>
                                <p className="text-[13px] text-muted-foreground mb-5">
                                    {plan.tagline}
                                </p>

                                {/* Price */}
                                <div className="mb-5">
                                    <div className="flex items-end gap-1.5">
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={billing + plan.id}
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                transition={{ duration: 0.12 }}
                                                className="text-[38px] font-bold leading-none tracking-tight text-foreground"
                                            >
                                                {plan.currency}{billing === "yearly" ? plan.price.yearly : plan.price.monthly}
                                            </motion.span>
                                        </AnimatePresence>
                                        <span className="text-[12px] text-muted-foreground mb-1.5 leading-tight">
                                            /mês{plan.perUser && ", por usuário"}
                                        </span>
                                    </div>
                                    <AnimatePresence>
                                        {billing === "yearly" && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="text-[12px] text-muted-foreground mt-1 overflow-hidden"
                                            >
                                                cobrado anualmente
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* CTA */}
                                <button className="w-full h-10 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-100 text-[13.5px] font-medium transition-all cursor-pointer">
                                    {plan.cta}
                                </button>
                            </div>

                            {/* Features */}
                            <div className="px-9 pb-9 pt-1 border-t border-border flex flex-col flex-1">
                                {plan.headerNote && (
                                    <p className="text-[11.5px] font-medium text-muted-foreground uppercase tracking-wider mb-3 pt-5">
                                        {plan.headerNote}
                                    </p>
                                )}
                                {!plan.headerNote && <div className="pt-5" />}
                                <ul className="flex flex-col gap-2.5">
                                    {plan.features.map((feat) => (
                                        <li key={feat} className="flex items-start gap-2.5">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                                className="shrink-0 mt-0.5 text-zinc-400 dark:text-zinc-500">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            <span className="text-[13px] text-muted-foreground leading-snug">
                                                {feat}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <p className="mt-8 text-[12px] text-muted-foreground/60 text-center max-w-lg leading-relaxed">
                    *Limites de uso se aplicam. Preços não incluem impostos aplicáveis.{" "}
                    <button
                        onClick={() => navigate("/pricing")}
                        className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
                    >
                        Ver comparação completa →
                    </button>
                </p>
            </div>
        </div >
    );
}
