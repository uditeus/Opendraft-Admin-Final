import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";

interface AffiliateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AffiliateDialog({ open, onOpenChange }: AffiliateDialogProps) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSubscribed, setIsSubscribed] = React.useState(false);

    // Reset state when dialog opens
    React.useEffect(() => {
        if (open) {
            setIsSubscribed(false);
            setIsLoading(false);
        }
    }, [open]);

    const handleSubscribe = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setIsSubscribed(true);
        // toast.success is optional if we show visual feedback on the button itself, 
        // but let's keep it simple and clean.
    };

    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <DialogPrimitive.Content
                    className={cn(
                        "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] duration-200",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-1/2 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-1/2",
                        "sm:max-w-[500px] p-0 overflow-hidden gap-0 rounded-[24px] border border-border/60 bg-background shadow-2xl block"
                    )}
                >
                    <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50">
                        <AppIcon name="X" className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>

                    <div className="p-8 pb-6">
                        <h2 className="text-[22px] font-bold tracking-tight text-foreground mb-4">
                            Programa de Afiliados Opendraft
                        </h2>

                        <div className="space-y-6">
                            <p className="text-[15px] text-muted-foreground leading-relaxed">
                                Torne-se um afiliado e ganhe com cada recomendação. Saiba mais sobre o programa <a href="https://opendraft.us/affiliates" target="_blank" rel="noopener noreferrer" className="underline font-medium text-foreground hover:text-primary transition-colors">aqui</a>.
                            </p>

                            <div className="space-y-1">
                                <h3 className="text-[15px] font-semibold text-foreground">
                                    Você é um criador estabelecido?
                                </h3>
                                <p className="text-[15px] text-muted-foreground leading-relaxed">
                                    Se você tem um grande público, <a href="https://opendraft.us/contact" target="_blank" rel="noopener noreferrer" className="underline font-medium text-foreground hover:text-primary transition-colors">entre em contato</a> conosco para oportunidades exclusivas.
                                </p>
                            </div>

                            {/* Images Collage */}
                            <div className="grid grid-cols-3 gap-3 h-28 sm:h-32 mt-2">
                                <div className="relative overflow-hidden rounded-lg bg-muted">
                                    <img
                                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop"
                                        alt="Creator"
                                        className="absolute inset-0 h-full w-full object-cover transition-transform hover:scale-105 duration-700"
                                    />
                                </div>
                                <div className="relative overflow-hidden rounded-lg bg-muted translate-y-[-8px]">
                                    <img
                                        src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=400&auto=format&fit=crop"
                                        alt="Podcaster"
                                        className="absolute inset-0 h-full w-full object-cover transition-transform hover:scale-105 duration-700"
                                    />
                                </div>
                                <div className="relative overflow-hidden rounded-lg bg-muted">
                                    <img
                                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
                                        alt="Influencer"
                                        className="absolute inset-0 h-full w-full object-cover transition-transform hover:scale-105 duration-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hubla Card Section */}
                    <div className="px-8 pb-8">
                        <div className="rounded-2xl border border-zinc-800 bg-black px-8 pb-8 pt-0 flex flex-col items-center text-center gap-0 shadow-xl overflow-hidden">

                            {/* Hubla Logo */}
                            <div className="-mt-2 mb-2">
                                <img
                                    src="https://i.imgur.com/QluTT08.png"
                                    alt="Hubla"
                                    className="w-[180px] h-auto object-contain"
                                />
                            </div>

                            <p className="-mt-2 text-[14px] text-zinc-400 leading-relaxed max-w-[320px]">
                                O Programa de Afiliados do Opendraft é gerenciado pela Hubla, garantindo segurança e transparência nos seus pagamentos.
                                <br className="hidden sm:block" />
                                Ao se inscrever, você concorda com nossos <a href="#" className="underline text-[#d7ff60] hover:text-[#d7ff60]/80 transition-colors">termos</a>.
                            </p>

                            <Button
                                className={cn(
                                    "w-full h-12 mt-4 font-bold rounded-lg text-[15px] transition-all",
                                    isSubscribed
                                        ? "bg-zinc-900/50 border border-[#d7ff60]/50 text-[#d7ff60] hover:bg-zinc-900/50 cursor-default"
                                        : "bg-[#d7ff60] hover:bg-[#cbe64d] text-black shadow-[0_0_15px_rgba(215,255,96,0.15)] hover:translate-y-[-1px]"
                                )}
                                onClick={handleSubscribe}
                                disabled={isLoading || isSubscribed}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                                        <span>Processando...</span>
                                    </div>
                                ) : isSubscribed ? (
                                    <div className="flex items-center gap-2">
                                        <AppIcon name="Check" className="h-5 w-5" />
                                        <span>Inscrição realizada com sucesso!</span>
                                    </div>
                                ) : (
                                    "Inscreva-se no programa de afiliados"
                                )}
                            </Button>
                        </div>
                    </div>

                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
