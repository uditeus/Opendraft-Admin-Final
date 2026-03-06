import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AppIcon, createAppIcon } from "@/components/icons/AppIcon";
import { Button } from "@/components/ui/button";
import { ChatTooltip } from "@/components/design-system/chat-tooltip";
import { cn } from "@/lib/utils";
import type { DocumentData } from "./types";

const Download = createAppIcon("Download");
const RotateCcw = createAppIcon("RotateCcw");
const X = createAppIcon("X");
const ExternalLink = createAppIcon("ExternalLink");
const Edit02 = createAppIcon("Edit2");
const Check = createAppIcon("Check");

interface DocumentPreviewColumnProps {
    document: DocumentData;
    onClose?: () => void;
    content?: string;
    onAction?: (action: string, text: string) => void;
}

export function DocumentPreviewColumn({ document, onClose, content: initialContent, onAction }: DocumentPreviewColumnProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(initialContent || "");

    useEffect(() => {
        if (initialContent) {
            setContent(initialContent);
        }
    }, [initialContent]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full w-full bg-[#f7f7f7] dark:bg-[#131416] border-l border-border/10 relative"
        >

            {/* Professional Header Bar */}
            <header className="h-10 shrink-0 bg-[#f7f7f7] dark:bg-[#131416] flex items-center justify-between px-4 z-10 border-b border-border/5">
                <div className="flex items-center gap-3 min-w-0">
                    {/* Elements removed for a cleaner look */}
                </div>

                <div className="flex items-center gap-1">
                    <ChatTooltip label={isEditing ? "Salvar e visualizar" : "Editar documento"}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditing(!isEditing)}
                            className={cn(
                                "h-7 w-7 rounded-md transition-all",
                                isEditing ? "text-primary opacity-100 bg-primary/10" : "opacity-60 hover:opacity-100"
                            )}
                        >
                            {isEditing ? <Check className="h-3.5 w-3.5" /> : <Edit02 className="h-3.5 w-3.5" />}
                        </Button>
                    </ChatTooltip>

                    <ChatTooltip label="Abrir no Drive">
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md opacity-60 hover:opacity-100">
                            <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                    </ChatTooltip>
                    <ChatTooltip label="Baixar">
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md opacity-60 hover:opacity-100">
                            <Download className="h-3.5 w-3.5" />
                        </Button>
                    </ChatTooltip>
                    <ChatTooltip label="Atualizar">
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md opacity-40 hover:opacity-100">
                            <RotateCcw className="h-3.5 w-3.5" />
                        </Button>
                    </ChatTooltip>
                    <ChatTooltip label="Fechar documento">
                        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground">
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </ChatTooltip>
                </div>
            </header>

            {/* Background area (Desk surface) */}
            <div className="flex-1 overflow-y-auto chat-scroll bg-[#f7f7f7] dark:bg-[#131416] flex justify-center pt-8 pb-32 px-8">
                {/* Paper Container (A4 Look) - Grows with content, no internal scroll */}
                <div
                    data-selection-area="document"
                    className="w-[816px] min-h-[1056px] h-fit shadow-[0_8px_24px_rgba(0,0,0,0.08)] bg-white p-20 md:p-24 rounded-[4px] relative border border-black/[0.03] flex flex-col mb-20"
                >
                    <div className="rich-document-content text-[16px] leading-[1.6] text-black font-sans text-left h-full">
                        {isEditing ? (
                            <textarea
                                value={content}
                                onChange={(e) => {
                                    setContent(e.target.value);
                                    // Auto-resize
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                                ref={(el) => {
                                    if (el) {
                                        el.style.height = 'auto';
                                        el.style.height = el.scrollHeight + 'px';
                                    }
                                }}
                                spellCheck={false}
                                className="w-full bg-transparent outline-none resize-none border-none p-0 focus:ring-0 text-[16px] leading-[1.45] text-black font-sans overflow-hidden"
                                placeholder="Comece a digitar..."
                                autoFocus
                            />
                        ) : content ? (
                            <RenderMarkdown content={content} />
                        ) : (
                            <div className="space-y-6">
                                <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded" />
                                <div className="h-4 w-1/2 bg-gray-100 animate-pulse rounded" />
                                <div className="h-4 w-5/6 bg-gray-100 animate-pulse rounded" />
                                <div className="h-20 w-full bg-gray-50 animate-pulse rounded" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function RenderMarkdown({ content }: { content: string }) {
    const lines = content.split('\n');
    return (
        <div className="w-full">
            {lines.map((line, i) => {
                const t = line.trim();

                // Handling empty lines - synchronized with textarea line-height
                if (!t) return <div key={i} className="h-[1.45em]" />;

                // Headings - removing extra padding to match textarea alignment
                if (t.startsWith('# ')) {
                    return (
                        <h1 key={i} className="text-[32px] font-bold text-black border-none leading-[1.45]">
                            {t.replace('# ', '')}
                        </h1>
                    );
                }
                if (t.startsWith('## ')) {
                    return (
                        <h2 key={i} className="text-[24px] font-bold text-black border-none leading-[1.45]">
                            {t.replace('## ', '')}
                        </h2>
                    );
                }
                if (t.startsWith('### ')) {
                    return (
                        <h3 key={i} className="text-[18px] font-bold text-black border-none leading-[1.45]">
                            {t.replace('### ', '')}
                        </h3>
                    );
                }

                // List items (bullets)
                if (t.startsWith('- ') || t.startsWith('* ') || t.startsWith('• ')) {
                    const marker = t.startsWith('- ') ? '-' : (t.startsWith('* ') ? '*' : '•');
                    return (
                        <div key={i} className="flex gap-3 pl-4">
                            <span className="text-[16px] text-black/60 flex-shrink-0 leading-[1.45]">•</span>
                            <span className="text-[16px] leading-[1.45] text-black">
                                {t.substring(marker.length).trim()}
                            </span>
                        </div>
                    );
                }

                // Default Paragraph with simple bold detection
                const parts = line.split('**');
                return (
                    <p key={i} className="text-[16px] leading-[1.45] text-black min-h-[1.45em]">
                        {parts.map((p, j) => (
                            j % 2 === 1 ? (
                                <strong key={j} className="font-bold">
                                    {p}
                                </strong>
                            ) : p
                        ))}
                    </p>
                );
            })}
        </div>
    );
}
