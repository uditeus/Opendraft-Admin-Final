import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n";

interface PricingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PricingDialog({ open, onOpenChange }: PricingDialogProps) {
    const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">("yearly");
    const { tt } = useI18n();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[1100px] w-full p-8 md:p-12 gap-0 rounded-[32px] border border-border/40 dark:border-white/10 bg-[#fefefe] dark:bg-[#0d0d0d] shadow-2xl overflow-y-auto max-h-[95vh] text-[#1d1d1f] dark:text-[#f5f5f5]">

                {/* Header */}
                <div className="flex flex-col items-center text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-[#1d1d1f] dark:text-white mb-8">
                        Escolha o plano ideal para você
                    </h2>

                    {/* Billing Switcher */}
                    <div className="inline-flex h-9 items-center rounded-full bg-[#efedeb] dark:bg-[#252525] p-1">
                        <button
                            onClick={() => setBillingCycle("monthly")}
                            className={cn(
                                "flex h-full items-center justify-center rounded-full px-6 text-[11px] font-medium transition-all duration-200",
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
                                "flex h-full items-center justify-center rounded-full px-6 text-[11px] font-medium transition-all duration-200",
                                billingCycle === "yearly"
                                    ? "bg-white dark:bg-[#333] text-foreground dark:text-white shadow-sm"
                                    : "text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white"
                            )}
                        >
                            Anual
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Creator Card */}
                    <div className="flex flex-col rounded-[24px] border border-border/40 dark:border-white/10 bg-white dark:bg-[#151515] shadow-sm overflow-hidden">
                        <div className="p-6 pb-8">
                            <h3 className="text-xl font-semibold mb-1 dark:text-white">Creator</h3>
                            <p className="text-[13px] text-muted-foreground dark:text-gray-400 mb-4">
                                Produza copy com consistência
                            </p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-lg font-medium">R$</span>
                                <span className="text-3xl font-semibold dark:text-white">
                                    {billingCycle === "yearly" ? "69" : "89"}
                                </span>
                                <div className="flex flex-col leading-tight ml-1">
                                    <span className="text-[10px] text-muted-foreground dark:text-gray-500">/mês</span>
                                    {billingCycle === "yearly" && <span className="text-[8px] text-muted-foreground dark:text-gray-500">anual</span>}
                                </div>
                            </div>
                            <Button className="h-10 w-full rounded-xl bg-[#1d1d1f] dark:bg-white dark:text-[#1d1d1f] text-sm font-medium text-white hover:bg-[#1d1d1f]/90 dark:hover:bg-white/90">
                                Assinar Creator
                            </Button>
                        </div>

                        <div className="flex-1 p-6 border-t border-border/40 dark:border-white/10">
                            <div className="space-y-3">
                                <FeatureItem text="100 créditos por mês" />
                                <FeatureItem text="50 copies completas" />
                                <FeatureItem text="Playbooks padrão" />
                                <FeatureItem text="Histórico completo" />
                            </div>
                        </div>
                    </div>

                    {/* Strategist Card */}
                    <div className="flex flex-col rounded-[24px] border-2 border-blue-600/30 dark:border-blue-500/20 bg-[#f8fbff] dark:bg-[#0a1220] shadow-md relative overflow-hidden">
                        <div className="p-6 pb-8">
                            <h3 className="text-xl font-semibold mb-1 text-[#1d1d1f] dark:text-white">Strategist</h3>
                            <p className="text-[13px] text-blue-600/80 dark:text-blue-400 mb-4 font-medium">
                                Estratégia completa
                            </p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-lg font-medium">R$</span>
                                <span className="text-3xl font-semibold text-[#1d1d1f] dark:text-white">
                                    {billingCycle === "yearly" ? "99" : "149"}
                                </span>
                                <div className="flex flex-col leading-tight ml-1">
                                    <span className="text-[10px] text-muted-foreground dark:text-gray-500">/mês</span>
                                    {billingCycle === "yearly" && <span className="text-[8px] text-muted-foreground dark:text-gray-500">anual</span>}
                                </div>
                            </div>
                            <Button className="h-10 w-full rounded-xl bg-[#1d1d1f] dark:bg-white dark:text-[#1d1d1f] text-sm font-medium text-white hover:bg-[#1d1d1f]/90 dark:hover:bg-white/90">
                                Assinar Strategist
                            </Button>
                        </div>

                        <div className="flex-1 p-6 border-t border-blue-600/10 dark:border-blue-500/10">
                            <p className="text-[11px] font-bold mb-3 text-[#1d1d1f] dark:text-white">Tudo do Creator e:</p>
                            <div className="space-y-3">
                                <FeatureItem text="200 créditos por mês" />
                                <FeatureItem text="100 copies completas" />
                                <FeatureItem text="Playbooks personalizados" />
                                <FeatureItem text="Prioridade total" />
                            </div>
                        </div>
                    </div>

                    {/* Authority Card */}
                    <div className="flex flex-col rounded-[24px] border border-border/40 dark:border-white/10 bg-white dark:bg-[#151515] shadow-sm overflow-hidden">
                        <div className="p-6 pb-8">
                            <h3 className="text-xl font-semibold mb-1 dark:text-white">Authority</h3>
                            <p className="text-[13px] text-muted-foreground dark:text-gray-400 mb-4">
                                Produção em escala
                            </p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-lg font-medium">R$</span>
                                <span className="text-3xl font-semibold dark:text-white">
                                    {billingCycle === "yearly" ? "199" : "299"}
                                </span>
                                <div className="flex flex-col leading-tight ml-1">
                                    <span className="text-[10px] text-muted-foreground dark:text-gray-500">/mês</span>
                                    {billingCycle === "yearly" && <span className="text-[8px] text-muted-foreground dark:text-gray-500">anual</span>}
                                </div>
                            </div>
                            <Button className="h-10 w-full rounded-xl bg-[#1d1d1f] dark:bg-white dark:text-[#1d1d1f] text-sm font-medium text-white hover:bg-[#1d1d1f]/90 dark:hover:bg-white/90">
                                Assinar Authority
                            </Button>
                        </div>

                        <div className="flex-1 p-6 border-t border-border/40 dark:border-white/10">
                            <p className="text-[11px] font-bold mb-3 text-[#1d1d1f] dark:text-white">Tudo do Strategist e:</p>
                            <div className="space-y-3">
                                <FeatureItem text="400 créditos por mês" />
                                <FeatureItem text="Variações ilimitadas" />
                                <FeatureItem text="Prioridade máxima" />
                                <FeatureItem text="Suporte VIP" />
                            </div>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}

function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-3">
            <AppIcon
                name="Check"
                className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground/60 dark:text-gray-500"
                size={16}
                strokeWidth={2.5}
            />
            <span className="text-[13px] font-medium leading-[1.4] text-[#1d1d1f]/80 dark:text-gray-300">
                {text}
            </span>
        </div>
    );
}
