import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Response } from "@/components/chat/Response";
import { AppIcon } from "@/components/icons/AppIcon";
import { Button } from "@/components/ui/button";
import { ChatTooltip } from "@/components/design-system/chat-tooltip";

interface PresentationModeProps {
    content: string;
    title?: string;
    open: boolean;
    onClose: () => void;
}

export function PresentationMode({ content, title, open, onClose }: PresentationModeProps) {
    const [copied, setCopied] = React.useState(false);
    const cardRef = React.useRef<HTMLDivElement>(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExportPDF = () => {
        // Use browser print dialog for PDF export
        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title || "OpenDraft Export"}</title>
          <style>
            body { font-family: 'Inter', -apple-system, sans-serif; padding: 48px; max-width: 700px; margin: 0 auto; color: #1a1a1a; line-height: 1.7; }
            h1 { font-size: 24px; margin-bottom: 8px; }
            h2 { font-size: 18px; }
            p { margin: 12px 0; }
            .meta { color: #888; font-size: 12px; margin-bottom: 32px; }
            .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #eee; color: #aaa; font-size: 11px; }
          </style>
        </head>
        <body>
          <div class="meta">Gerado com OpenDraft · ${new Date().toLocaleDateString("pt-BR")}</div>
          ${cardRef.current?.innerHTML || content}
          <div class="footer">OpenDraft · Copy inteligente para marcas</div>
        </body>
        </html>
      `);
            printWindow.document.close();
            printWindow.print();
        }
    };

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
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
                >
                    {/* Close backdrop */}
                    <div className="absolute inset-0" onClick={onClose} />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative z-10 mx-4 w-full max-w-2xl"
                    >
                        {/* Card */}
                        <div
                            ref={cardRef}
                            className="rounded-2xl bg-white text-gray-900 shadow-2xl overflow-hidden"
                        >
                            {/* Card Header */}
                            <div className="px-10 pt-10 pb-2">
                                <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-6">
                                    <span className="h-1 w-1 rounded-full bg-blue-500" />
                                    OpenDraft
                                    <span className="ml-auto text-[10px] normal-case tracking-normal font-normal">
                                        {new Date().toLocaleDateString("pt-BR")}
                                    </span>
                                </div>
                                {title && (
                                    <h1 className="text-xl font-bold text-gray-900 mb-4">{title}</h1>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="px-10 pb-10">
                                <div className="prose prose-sm max-w-none text-gray-700" style={{ lineHeight: 1.8 }}>
                                    <Response>{content}</Response>
                                </div>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center justify-center gap-3 mt-6">
                            <ChatTooltip label="Copiar texto">
                                <Button
                                    variant="ghost"
                                    className="h-10 gap-2 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
                                    onClick={handleCopy}
                                >
                                    <AppIcon name={copied ? "Check" : "Copy"} size={16} />
                                    {copied ? "Copiado!" : "Copiar"}
                                </Button>
                            </ChatTooltip>
                            <ChatTooltip label="Exportar PDF">
                                <Button
                                    variant="ghost"
                                    className="h-10 gap-2 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
                                    onClick={handleExportPDF}
                                >
                                    <AppIcon name="FileText" size={16} />
                                    Exportar PDF
                                </Button>
                            </ChatTooltip>
                            <ChatTooltip label="Fechar (Esc)">
                                <Button
                                    variant="ghost"
                                    className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white p-0"
                                    onClick={onClose}
                                >
                                    <AppIcon name="X" size={16} />
                                </Button>
                            </ChatTooltip>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
