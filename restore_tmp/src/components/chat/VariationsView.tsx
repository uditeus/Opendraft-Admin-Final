import React from "react";
import { motion } from "framer-motion";
import { Response } from "@/components/chat/Response";
import { AppIcon } from "@/components/icons/AppIcon";
import { Button } from "@/components/ui/button";
import { ChatTooltip } from "@/components/design-system/chat-tooltip";
import { cn } from "@/lib/utils";

interface VariationsViewProps {
    variations: string[];
}

export function VariationsView({ variations }: VariationsViewProps) {
    const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

    const handleCopy = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    if (variations.length === 0) return null;

    return (
        <div className="w-full">
            <div className={cn(
                "grid gap-3",
                variations.length === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
            )}>
                {variations.map((text, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative rounded-xl border border-border/50 bg-background/50 p-4 hover:border-border hover:bg-background/80 transition-all"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
                                Variação {idx + 1}
                            </span>
                            <ChatTooltip label={copiedIdx === idx ? "Copiado!" : "Copiar"}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleCopy(text, idx)}
                                >
                                    <AppIcon name={copiedIdx === idx ? "Check" : "Copy"} size={13} />
                                </Button>
                            </ChatTooltip>
                        </div>

                        {/* Content */}
                        <div className="prose prose-sm max-w-none dark:prose-invert text-[13px] leading-relaxed">
                            <Response>{text}</Response>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

/**
 * Utility to detect if a message content contains variations.
 * Looks for patterns like "Variação 1:", "**Variação 1**", numbered lists with "---", etc.
 */
export function parseVariations(content: string): string[] | null {
    // Pattern: "Variação X:" or "**Variação X**" or "### Variação X"
    const varPattern = /(?:^|\n)(?:#{1,3}\s*)?(?:\*\*)?(?:Variação|Variation)\s*(\d+)(?:\*\*)?[:\s]*\n([\s\S]*?)(?=(?:\n(?:#{1,3}\s*)?(?:\*\*)?(?:Variação|Variation)\s*\d+)|$)/gi;
    const matches = [...content.matchAll(varPattern)];

    if (matches.length >= 2) {
        return matches.map(m => m[2].trim());
    }

    // Fallback: split by "---" separators if 2+ sections exist
    const separatorSections = content.split(/\n---+\n/).filter(s => s.trim().length > 30);
    if (separatorSections.length >= 2 && separatorSections.length <= 4) {
        return separatorSections.map(s => s.trim());
    }

    return null;
}
