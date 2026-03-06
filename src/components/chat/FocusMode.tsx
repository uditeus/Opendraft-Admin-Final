import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Response } from "@/components/chat/Response";
import { AppIcon } from "@/components/icons/AppIcon";
import { Button } from "@/components/ui/button";
import { ChatTooltip } from "@/components/design-system/chat-tooltip";

interface FocusModeProps {
    content: string;
    open: boolean;
    onClose: () => void;
}

export function FocusMode({ content, open, onClose }: FocusModeProps) {
    const [copied, setCopied] = React.useState(false);

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const charCount = content.length;

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Close on Escape
    React.useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Content Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative z-10 mx-4 w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border border-border bg-background shadow-elev-3 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                            <div className="flex items-center gap-3">
                                <AppIcon name="Presentation" className="h-5 w-5 text-primary" />
                                <h2 className="text-sm font-semibold text-foreground">Modo Foco</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] text-muted-foreground tabular-nums">
                                    {wordCount} {wordCount === 1 ? "palavra" : "palavras"} · {charCount} {charCount === 1 ? "caractere" : "caracteres"}
                                </span>
                                <ChatTooltip label={copied ? "Copiado!" : "Copiar"}>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleCopy}>
                                        <AppIcon name={copied ? "Check" : "Copy"} size={16} />
                                    </Button>
                                </ChatTooltip>
                                <ChatTooltip label="Fechar (Esc)">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
                                        <AppIcon name="X" size={16} />
                                    </Button>
                                </ChatTooltip>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-auto px-8 py-6">
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                <Response>{content}</Response>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
