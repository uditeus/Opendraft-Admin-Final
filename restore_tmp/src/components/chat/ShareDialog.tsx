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
    const inviteLink = `https://opendraft.us/invite/${user?.id?.slice(0, 8) || "u-123456"}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        toast.success("Link copiado para a área de transferência!");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden gap-0 rounded-[32px] border-border/60">
                {view === "share" ? (
                    <>
                        {/* Header Section with Gradient */}
                        <div className="relative bg-[#F3F1EB] dark:bg-muted/20 p-8 pb-10 overflow-hidden">
                            {/* ... header content ... */}
                            <div className="absolute right-[-40px] top-[20px] h-32 w-32 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 opacity-80 blur-2xl" />
                            <div className="absolute right-[-20px] top-[40px] h-24 w-24 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-300 opacity-60 blur-xl" />

                            <div className="relative z-10 flex flex-col items-start gap-4">
                                <div className="inline-flex items-center rounded-full bg-background px-3 py-1 text-xs font-semibold shadow-sm">
                                    Ganhe 10+ créditos
                                </div>

                                <div className="flex flex-col">
                                    <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A] dark:text-foreground">
                                        Espalhe a novidade
                                    </h2>
                                    <p className="text-[#666666] dark:text-muted-foreground mt-1 text-[15px]">
                                        e ganhe créditos grátis
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6 pt-6">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                                Como funciona:
                            </h3>

                            <div className="space-y-5">
                                <div className="flex items-start gap-3">
                                    <AppIcon name="Zap" className="h-5 w-5 mt-0.5 text-foreground shrink-0" />
                                    <div className="text-[14px] leading-relaxed">
                                        <span className="text-foreground">Compartilhe seu link de convite</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <AppIcon name="Star" className="h-5 w-5 mt-0.5 text-foreground shrink-0" />
                                    <div className="text-[14px] leading-relaxed">
                                        <span className="text-foreground">Amigos se cadastram e ganham </span>
                                        <span className="font-bold text-foreground">10 créditos extra</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <AppIcon name="MessageCircle" className="h-5 w-5 mt-0.5 text-foreground shrink-0" />
                                    <div className="text-[14px] leading-relaxed">
                                        <span className="text-foreground">Você ganha </span>
                                        <span className="font-bold text-foreground">100 créditos</span>
                                        <span className="text-foreground"> quando eles assinarem um plano pago</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 mb-2">
                                <div className="text-xs font-medium text-muted-foreground mb-3">
                                    0 cadastrados, 0 convertidos
                                </div>

                                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-muted/40 border border-border/50">
                                    <div className="flex items-center gap-2 px-3 overflow-hidden flex-1 min-w-0">
                                        <AppIcon name="ExternalLink" className="h-4 w-4 text-muted-foreground shrink-0" />
                                        <span className="text-sm text-foreground/80 truncate font-medium">
                                            {inviteLink}
                                        </span>
                                    </div>
                                    <Button
                                        onClick={handleCopy}
                                        className="h-9 px-4 rounded-lg bg-foreground text-background hover:bg-foreground/90 font-medium shrink-0 whitespace-nowrap"
                                    >
                                        Copiar link
                                    </Button>
                                </div>

                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={() => setView("terms")}
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors hover:underline"
                                    >
                                        Ver Termos e Condições
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
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
