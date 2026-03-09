import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icons/AppIcon";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";

interface ShareDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ShareDialog({ open, onOpenChange }: ShareDialogProps) {
    const { user } = useAuth();
    const [view, setView] = React.useState<"share" | "terms">("share");

    // Reset view when dialog closes
    React.useEffect(() => {
        if (open) setView("share");
    }, [open]);

    // Mock invite link - in production this would come from user metadata or API
    const inviteLink = `https://opendraft.me/invite/${user?.id?.slice(0, 8) || "u-123456"}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        toast.success("Link copiado para a área de transferência!");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn(
                "sm:max-w-[480px] p-0 overflow-hidden gap-0 rounded-[24px] border border-border/20 shadow-2xl bg-background dark:bg-[#1A1A1A]",
                "[&>button]:text-foreground/50 dark:[&>button]:text-white/70 hover:[&>button]:text-foreground dark:hover:[&>button]:text-white [&>button]:top-5 [&>button]:right-5 [&>button]:bg-black/5 dark:[&>button]:bg-white/10 [&>button]:backdrop-blur-sm [&>button]:rounded-full [&>button]:h-7 [&>button]:w-7 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button_svg]:h-[16px] [&>button_svg]:w-[16px]"
            )}>
                {view === "share" ? (
                    <div className="flex flex-col">
                        {/* Header Section */}
                        <div className="relative w-full shrink-0 overflow-hidden bg-transparent p-1.5 flex items-center justify-center">
                            <img src="https://i.imgur.com/0hSDvgm.png" className="w-full h-auto block dark:hidden rounded-[18px]" alt="Banner Light" />
                            <img src="https://i.imgur.com/KHLrgOJ.png" className="w-full h-auto hidden dark:block rounded-[18px]" alt="Banner Dark" />
                        </div>

                        {/* Content Section */}
                        <div className="px-6 py-6 pb-8 bg-transparent">
                            <h3 className="text-[14px] font-semibold text-foreground dark:text-white mb-5">
                                Como funciona:
                            </h3>

                            <div className="space-y-4">
                                {/* Step 1 */}
                                <div className="flex gap-3.5 items-start">
                                    <AppIcon name="Zap" className="h-[20px] w-[20px] mt-0.5 text-foreground/80 dark:text-white/90 shrink-0" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-[14px] leading-snug text-foreground/90 dark:text-white/95 font-medium">Compartilhe seu link de convite</p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex gap-3.5 items-start">
                                    <AppIcon name="Star" className="h-[20px] w-[20px] mt-0.5 text-foreground/80 dark:text-white/90 shrink-0" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-[14px] leading-snug text-foreground/90 dark:text-white/95 font-medium">
                                            Amigos se cadastram e ganham <span className="font-bold text-foreground dark:text-white">10 créditos extra</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="flex gap-3.5 items-start">
                                    <AppIcon name="MessageCircle" className="h-[20px] w-[20px] mt-0.5 text-foreground/80 dark:text-white/90 shrink-0" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-[14px] leading-snug text-foreground/90 dark:text-white/95 font-medium">
                                            Você ganha <span className="font-bold text-foreground dark:text-white">100 créditos</span> quando assinarem um plano pago
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-1">
                                <div className="text-[13px] font-medium text-foreground/60 dark:text-white/60 mb-3">
                                    <span className="font-bold text-foreground dark:text-white">0</span> cadastrados, <span className="font-bold text-foreground dark:text-white">0</span> convertidos
                                </div>

                                <div className="group flex items-center p-1.5 rounded-[12px] bg-zinc-100 dark:bg-[#222] border border-black/5 dark:border-white/5 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)] transition-all hover:bg-zinc-200/50 dark:hover:bg-[#2A2A2A] focus-within:ring-2 focus-within:ring-black/5 dark:focus-within:ring-white/10 dark:focus-within:bg-[#2A2A2A]">
                                    <div className="flex items-center gap-2.5 px-3 overflow-hidden flex-1 min-w-0">
                                        <AppIcon name="ExternalLink" className="h-[14px] w-[14px] text-foreground/40 dark:text-white/50 shrink-0" />
                                        <span className="text-[13px] text-foreground/80 dark:text-white/90 truncate font-semibold">
                                            {inviteLink}
                                        </span>
                                    </div>
                                    <Button
                                        onClick={handleCopy}
                                        className="h-[32px] px-4 rounded-[8px] bg-white border border-black/5 dark:border-transparent hover:bg-zinc-50 dark:hover:bg-white/90 text-black shadow-sm font-semibold shrink-0 whitespace-nowrap transition-all"
                                    >
                                        Copiar Link
                                    </Button>
                                </div>

                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={() => setView("terms")}
                                        className="text-[12px] font-medium text-foreground/40 dark:text-white/40 hover:text-foreground/70 dark:hover:text-white/60 transition-colors"
                                    >
                                        Ver diretrizes do programa
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="p-6 pb-2">
                            <button
                                onClick={() => setView("share")}
                                className="group mb-4 flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <AppIcon name="ArrowLeft" className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                Voltar
                            </button>
                            <h2 className="text-xl font-bold tracking-tight text-foreground">
                                Diretrizes do Programa
                            </h2>
                        </div>
                        <div className="px-6 pb-8">
                            <ul className="list-disc space-y-3 pl-4 text-[13px] leading-relaxed text-muted-foreground">
                                <li>
                                    Esta promoção está disponível apenas para novos usuários do Opendraft que se inscreverem através do seu link. Queremos compartilhar a magia do Opendraft com novos olhares!
                                </li>
                                <li>
                                    As recompensas são ganhas assim que seu convidado criar uma nova conta e assinar um plano pago. Não serão concedidos créditos para indicações inativas ou incompletas.
                                </li>
                                <li>
                                    Não concedemos créditos para usuários com contas de e-mail descartáveis ou de alto risco. Todos os e-mails são verificados para garantir a qualidade.
                                </li>
                                <li>
                                    Cada novo usuário pode gerar apenas uma (1) recompensa. Sem acúmulos ou exploração de brechas.
                                </li>
                                <li>
                                    Evite fazer spam ou usar indevidamente seu link de indicação. Nossos algoritmos monitoram ativamente o engajamento e alertam sobre atividades incomuns.
                                </li>
                                <li>
                                    Se detectarmos atividades suspeitas ou fora de conformidade, temos o direito de reter recompensas ou desativar seu link.
                                </li>
                                <li>
                                    Podemos atualizar, pausar ou descontinuar este programa a qualquer momento enquanto continuamos a experimentar e melhorar.
                                </li>
                            </ul>

                            <div className="mt-6 text-[13px] text-muted-foreground">
                                Para termos completos de serviço e regras de indicação, veja os <a href="#" className="underline font-medium text-foreground hover:text-primary">Termos do Opendraft</a>.
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
