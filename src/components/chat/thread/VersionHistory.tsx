import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppIcon } from "@/components/icons/AppIcon";
import { Button } from "@/components/ui/button";
import { ChatTooltip } from "@/components/design-system/chat-tooltip";
import { cn } from "@/lib/utils";

export interface MessageVersion {
    content: string;
    timestamp: number;
}

interface VersionHistoryProps {
    versions: MessageVersion[];
    currentContent: string;
    onRestore: (content: string) => void;
}

export function VersionHistory({ versions, currentContent, onRestore }: VersionHistoryProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [previewIdx, setPreviewIdx] = React.useState<number | null>(null);

    if (versions.length === 0) return null;

    return (
        <div className="relative inline-flex">
            <ChatTooltip label="Histórico de versões">
                <Button
                    variant="chatGhost"
                    size="chatIcon"
                    aria-label="Histórico de versões"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn("active:scale-[0.98]", isOpen && "text-primary")}
                >
                    <AppIcon name="History" className="h-4 w-4" />
                </Button>
            </ChatTooltip>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-0 mb-2 z-50 w-[260px] rounded-xl border border-border bg-background shadow-elev-2 overflow-hidden"
                    >
                        <div className="px-3 py-2 border-b border-border/50">
                            <span className="text-[11px] font-medium text-muted-foreground">
                                {versions.length} {versions.length === 1 ? "versão anterior" : "versões anteriores"}
                            </span>
                        </div>
                        <div className="max-h-[200px] overflow-auto p-1">
                            {versions.map((v, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        onRestore(v.content);
                                        setIsOpen(false);
                                    }}
                                    onMouseEnter={() => setPreviewIdx(idx)}
                                    onMouseLeave={() => setPreviewIdx(null)}
                                    className={cn(
                                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors",
                                        previewIdx === idx
                                            ? "bg-primary/10 text-foreground"
                                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                    )}
                                >
                                    <AppIcon name="RotateCcw" size={13} className="shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[12px] font-medium">Versão {versions.length - idx}</div>
                                        <div className="text-[11px] text-muted-foreground/60 truncate">{v.content.substring(0, 60)}...</div>
                                        <div className="text-[10px] text-muted-foreground/40">
                                            {new Date(v.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
