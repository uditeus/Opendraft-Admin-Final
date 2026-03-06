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
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

interface ReportBugDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ReportBugDialog({ open, onOpenChange }: ReportBugDialogProps) {
    const { tt } = useI18n();
    const [description, setDescription] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);
    const MAX_CHARS = 2000;

    // Reset state when opening
    React.useEffect(() => {
        if (open) {
            setDescription("");
            setSubmitting(false);
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) {
            toast.error(tt("Por favor, descreva o problema.", "Please describe the issue."));
            return;
        }

        setSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setSubmitting(false);
        onOpenChange(false);
        toast.success(tt("Recebemos seu feedback. Obrigado!", "Feedback received. Thank you!"));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-6 gap-0">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-medium">
                        {tt("O que houve?", "What happened?")}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <Textarea
                        id="bug-description"
                        autoFocus
                        placeholder={tt(
                            "Conte sobre o problema que você encontrou",
                            "Tell us about the problem you found"
                        )}
                        className={cn(
                            "min-h-[240px] resize-none w-full shadow-none",
                            "bg-transparent border border-border/60 focus-visible:ring-1 focus-visible:ring-ring/20 focus-visible:ring-offset-0",
                            "placeholder:text-muted-foreground/40",
                            "text-[15px] leading-relaxed p-4",
                            "rounded-xl transition-all duration-200",
                        )}
                        value={description}
                        onChange={(e) => setDescription(e.target.value.slice(0, MAX_CHARS))}
                    />

                    <div className="flex justify-end w-full">
                        <span className="text-xs text-muted-foreground/60">
                            {description.length} / {MAX_CHARS} {tt("caracteres usados", "characters used")}
                        </span>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            type="submit"
                            disabled={submitting || !description.trim()}
                            className={cn(
                                "rounded-full px-6 h-10 bg-primary text-primary-foreground font-medium transition-all hover:opacity-90",
                                submitting && "opacity-80"
                            )}
                        >
                            {submitting ? (
                                <div className="flex items-center gap-2">
                                    <AppIcon name="RotateCcw" className="h-4 w-4 animate-spin" />
                                    <span>{tt("Enviando...", "Sending...")}</span>
                                </div>
                            ) : (
                                tt("Enviar", "Send")
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
