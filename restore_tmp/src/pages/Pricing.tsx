import * as React from "react";
import { Button } from "@/components/ui/button";
import { AppIcon, AppIconName } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function PricingPage() {
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">("yearly");

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center bg-[#fefefe] dark:bg-[#0d0d0d] px-4 py-20 font-sans text-[#1d1d1f] dark:text-[#f5f5f5] transition-colors duration-300">
            {/* Back Button */}
            <button
                onClick={() => navigate("/new")}
                className="absolute left-6 top-6 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted/50 dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white"
                aria-label="Voltar"
            >
                <AppIcon name="ArrowLeft" className="h-6 w-6" />
            </button>

            {/* Header */}
            <div className="mb-12 flex flex-col items-center text-center">
                <h1 className="mb-8 text-3xl font-medium tracking-tight dark:text-white">
                    Planos que crescem com você
                </h1>

                {/* Billing Switcher */}
                <div className="inline-flex h-10 items-center rounded-full bg-[#efedeb] dark:bg-[#252525] p-1 mb-10 transition-colors">
                    <button
                        onClick={() => setBillingCycle("monthly")}
                        className={cn(
                            "flex h-full items-center justify-center rounded-full px-6 text-xs font-medium transition-all duration-200",
                            billingCycle === "monthly"
                                ? "bg-white dark:bg-[#333] text-foreground dark:text-white shadow-sm"
                                : "text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white"
                        )}
                    >
                        Mensal
                    </button>
                    <button
                        onClick={() => setBillingCycle("yearly")}
                        className={cn(
                            "flex h-full items-center justify-center rounded-full px-6 text-xs font-medium transition-all duration-200",
                            billingCycle === "yearly"
                                ? "bg-white dark:bg-[#333] text-foreground dark:text-white shadow-sm"
                                : "text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white"
                        )}
                    >
                        Anual
                    </button>
                </div>
            </div>

            {/* Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-[1240px]">

                {/* Creator Card */}
                <div className="flex flex-col rounded-[24px] border border-border/40 dark:border-white/10 bg-white dark:bg-[#151515] shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <div className="p-8 pb-10">
                        <h3 className="text-2xl font-semibold mb-1 dark:text-white">Creator</h3>
                        <p className="text-[15px] text-muted-foreground dark:text-gray-400 mb-6">
                            Produza copy com consistência
                        </p>
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-xl font-medium">R$</span>
                            <span className="text-4xl font-semibold dark:text-white">
                                {billingCycle === "yearly" ? "69" : "89"}
                            </span>
                            <span className="text-sm text-muted-foreground dark:text-gray-500 ml-1">
                                /mês {billingCycle === "yearly" && "cobrado anualmente"}
                            </span>
                        </div>
                        <Button className="h-12 w-full rounded-xl bg-[#1d1d1f] dark:bg-white dark:text-[#1d1d1f] text-base font-medium text-white hover:bg-[#1d1d1f]/90 dark:hover:bg-white/90 transition-all active:scale-[0.98]">
                            Obter plano Creator
                        </Button>
                    </div>

                    <div className="flex-1 p-8 pt-10 border-t border-border/40 dark:border-white/10">
                        <div className="space-y-4">
                            <Feature text="100 créditos por mês" />
                            <Feature text="50 copies completas" />
                            <Feature text="Playbooks e Estilos padrão" />
                            <Feature text="20 chats ativos" />
                            <Feature text="Histórico completo" />
                            <Feature text="Exportação (PDF/Docx)" />
                        </div>
                    </div>
                </div>

                {/* Strategist Card */}
                <div className="flex flex-col rounded-[24px] border-2 border-blue-600/30 dark:border-blue-500/20 bg-[#f8fbff] dark:bg-[#0a1220] shadow-md relative overflow-hidden transition-all hover:shadow-lg">
                    <div className="p-8 pb-10">
                        <h3 className="text-2xl font-semibold mb-1 dark:text-white">Strategist</h3>
                        <p className="text-[15px] text-blue-600/80 dark:text-blue-400 mb-6 font-medium">
                            Modo estratégico completo
                        </p>
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-xl font-medium">R$</span>
                            <span className="text-4xl font-semibold text-[#1d1d1f] dark:text-white">
                                {billingCycle === "yearly" ? "99" : "149"}
                            </span>
                            <span className="text-sm text-muted-foreground dark:text-gray-500 ml-1">
                                /mês {billingCycle === "yearly" && "cobrado anualmente"}
                            </span>
                        </div>
                        <Button className="h-12 w-full rounded-xl bg-[#1d1d1f] dark:bg-white dark:text-[#1d1d1f] text-base font-medium text-white hover:bg-[#1d1d1f]/90 dark:hover:bg-white/90 transition-all active:scale-[0.98]">
                            Obter plano Strategist
                        </Button>
                    </div>

                    <div className="flex-1 p-8 pt-10 border-t border-blue-600/10 dark:border-blue-500/10">
                        <p className="text-[13px] font-semibold mb-4 text-[#1d1d1f] dark:text-white">Tudo do Creator e:</p>
                        <div className="space-y-4">
                            <Feature text="200 créditos por mês" />
                            <Feature text="100 copies completas" />
                            <Feature text="Playbooks personalizados" />
                            <Feature text="Estilos personalizados" />
                            <Feature text="Chats ilimitados" />
                            <Feature text="Prioridade na fila" />
                        </div>
                    </div>
                </div>

                {/* Authority Card */}
                <div className="flex flex-col rounded-[24px] border border-border/40 dark:border-white/10 bg-white dark:bg-[#151515] shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <div className="p-8 pb-10">
                        <h3 className="text-2xl font-semibold mb-1 dark:text-white">Authority</h3>
                        <p className="text-[15px] text-muted-foreground dark:text-gray-400 mb-6">
                            Domine sua produção em escala
                        </p>
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-xl font-medium">R$</span>
                            <span className="text-4xl font-semibold dark:text-white">
                                {billingCycle === "yearly" ? "199" : "299"}
                            </span>
                            <span className="text-sm text-muted-foreground dark:text-gray-500 ml-1">
                                /mês {billingCycle === "yearly" && "cobrado anualmente"}
                            </span>
                        </div>
                        <Button className="h-12 w-full rounded-xl bg-[#1d1d1f] dark:bg-white dark:text-[#1d1d1f] text-base font-medium text-white hover:bg-[#1d1d1f]/90 dark:hover:bg-white/90 transition-all active:scale-[0.98]">
                            Obter plano Authority
                        </Button>
                    </div>

                    <div className="flex-1 p-8 pt-10 border-t border-border/40 dark:border-white/10">
                        <p className="text-[13px] font-semibold mb-4 text-[#1d1d1f] dark:text-white">Tudo do Strategist e:</p>
                        <div className="space-y-4">
                            <Feature text="400 créditos por mês" />
                            <Feature text="200 copies completas" />
                            <Feature item text="Playbooks ilimitados" />
                            <Feature text="Variações ilimitadas" />
                            <Feature text="Prioridade máxima" />
                            <Feature text="Suporte prioritário" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function Feature({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-3">
            <AppIcon
                name="Check"
                className="h-4 w-4 shrink-0 mt-1 text-muted-foreground/60 dark:text-gray-500"
                size={16}
                strokeWidth={2.5}
            />
            <span className="text-[14px] font-medium leading-[1.4] text-[#1d1d1f]/80 dark:text-gray-300">
                {text}
            </span>
        </div>
    );
}
