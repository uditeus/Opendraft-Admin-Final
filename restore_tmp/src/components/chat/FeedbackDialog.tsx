import * as React from "react";
import { toast } from "sonner";
import { AppIcon } from "@/components/icons/AppIcon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n/i18n";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useChatStore } from "@/components/chat/store";

interface FeedbackDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    type: "like" | "dislike" | null;
    threadId: string;
    messageId: string;
}

export function FeedbackDialog({ open, onOpenChange, type, threadId, messageId }: FeedbackDialogProps) {
    const { tt } = useI18n();
    const { updateMessageFeedback } = useChatStore();
    const [details, setDetails] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);

    // Reset state when opening
    React.useEffect(() => {
        if (open) {
            setDetails("");
            setSubmitting(false);
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await updateMessageFeedback(threadId, messageId, type);
            await new Promise((resolve) => setTimeout(resolve, 800));
            toast.success(tt("Obrigado pelo seu feedback!", "Thank you for your feedback!"));
            onOpenChange(false);
        } catch (err) {
            console.error("Feedback failed:", err);
            toast.error(tt("Erro ao enviar feedback.", "Error sending feedback."));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] min-h-[300px] p-8 gap-0 rounded-[32px] bg-popover text-foreground shadow-2xl flex flex-col overflow-hidden">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-xl font-bold tracking-tight">
                        {tt("Feedback", "Feedback")}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-1">
                    <div className="flex-1 flex flex-col gap-0.5 min-h-0">
                        <label className="text-[13px] font-medium text-muted-foreground/60 mb-2">
                            {tt("Dê os detalhes: (opcional)", "Give details: (optional)")}
                        </label>
                        <Textarea
                            placeholder={
                                type === "like"
                                    ? tt("O que foi satisfatório na resposta?", "What was satisfactory about the response?")
                                    : tt("O que foi insatisfatório na resposta?", "What was unsatisfactory about the response?")
                            }
                            className={cn(
                                "min-h-[84px] flex-1 resize-none w-full shadow-none",
                                "bg-muted/10 border border-border/40 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border/40",
                                "placeholder:text-muted-foreground/30",
                                "text-[14px] leading-relaxed p-4",
                                "rounded-2xl transition-all duration-200",
                            )}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-4 mt-6">
                        <p className="text-[10px] leading-relaxed text-muted-foreground/40 italic font-medium">
                            {tt(
                                "Ao enviar este relatório, toda a conversa atual será enviada à Opendraft para futuras melhorias nos nossos modelos. Saiba Mais",
                                "By submitting this report, the entire current conversation will be sent to Opendraft for future improvements to our models. Learn More"
                            )}
                        </p>

                        <DialogFooter className="gap-3 justify-end items-center">
                            <Button
                                type="submit"
                                disabled={submitting}
                                className={cn(
                                    "rounded-full w-[110px] h-10 font-bold bg-foreground text-background border-none hover:bg-foreground hover:text-background",
                                    submitting && "opacity-80"
                                )}
                            >
                                {submitting ? (
                                    <AppIcon name="RotateCcw" className="h-4 w-4 animate-spin" />
                                ) : (
                                    tt("Enviar", "Send")
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="rounded-full w-[110px] h-10 font-semibold border-border/60 bg-muted/20 text-foreground shadow-none hover:bg-muted/20 hover:text-foreground"
                            >
                                {tt("Cancelar", "Cancel")}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
