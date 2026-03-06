import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TaskStep, DocumentData } from "@/components/chat/types";
import { AppIcon } from "@/components/icons/AppIcon";
import { TextShimmer } from "@/components/ui/text-shimmer";

/** ─── Task Step Item ─────────────────────────────────────────── */
function TaskStepItem({ step, isLast }: { step: TaskStep; isLast: boolean }) {
    return (
        <div className="flex items-start gap-2.5 relative">
            {/* Connector line */}
            {!isLast && (
                <div className="absolute left-[3px] top-[14px] bottom-0 w-[0.5px] bg-muted-foreground/10" />
            )}

            {/* Status icon - Exact matching bolinhas style */}
            <div className="relative z-10 flex flex-col items-center pt-[6px]">
                {step.status === "done" && (
                    <div className="h-[7px] w-[7px] rounded-full bg-muted-foreground/30" />
                )}
                {step.status === "running" && (
                    <div className="h-[7px] w-[7px] rounded-full bg-foreground/60 animate-pulse" />
                )}
                {step.status === "pending" && (
                    <div className="h-[7px] w-[7px] rounded-full bg-muted-foreground/10" />
                )}
                {step.status === "error" && (
                    <div className="h-[7px] w-[7px] rounded-full bg-red-500/40" />
                )}
            </div>

            {/* Label & tag */}
            <div className={cn("flex flex-col min-w-0 pb-3", isLast && "pb-0.5")}>
                {step.status === "running" ? (
                    <TextShimmer
                        className="text-[11px] font-medium leading-[15px] text-muted-foreground/70"
                    >
                        {step.label}
                    </TextShimmer>
                ) : (
                    <p
                        className={cn(
                            "text-[11px] font-medium leading-[15px]",
                            step.status === "done" ? "text-muted-foreground/45" :
                                step.status === "error" ? "text-red-500/60" :
                                    "text-muted-foreground/25"
                        )}
                    >
                        {step.label}
                    </p>
                )}
                {step.tag && (
                    <span className="mt-1 inline-flex items-center rounded-sm bg-muted/10 px-1 py-0 text-[10px] font-mono text-muted-foreground/30 w-fit">
                        {step.tag}
                    </span>
                )}
            </div>
        </div>
    );
}

/** ─── Document Card ─────────────────────────────────────────── */
export function DocumentCard({ document }: { document: DocumentData }) {
    const fileSizeLabel = document.sizeBytes
        ? document.sizeBytes > 1024 * 1024
            ? `${(document.sizeBytes / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(document.sizeBytes / 1024)} KB`
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 rounded-lg border border-border/30 bg-muted/20 p-2 flex items-center gap-2.5 shadow-none"
        >
            {/* File icon */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-blue-500/5 border border-blue-500/10">
                <AppIcon name="FileText" className="h-4 w-4 text-blue-500/50" />
            </div>

            {/* Info */}
            <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[12px] font-medium text-foreground/60 truncate">
                    {document.title}
                </span>
                <span className="text-[10px] text-muted-foreground/40">
                    DOCX{fileSizeLabel ? ` · ${fileSizeLabel}` : ""}
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
                <a
                    href={`https://drive.google.com/file/d/upload?url=${encodeURIComponent(document.url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted/40 transition-colors text-muted-foreground/40"
                    title="Google Drive"
                >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                        <path d="M7.74 3.522c.383 0 .738.205.93.536l6.487 11.238a1.076 1.076 0 0 1-.929 1.614H1.258a1.076 1.076 0 0 1-.929-1.614l6.48-11.238c.192-.331.547-.536.93-.536zM16.143 4.26a1.076 1.076 0 0 1 1.859 0l4.897 8.482a1.076 1.076 0 0 1-.93 1.614h-9.794a1.076 1.076 0 0 1-.93-1.614l4.898-8.482zM15 17.5h7c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5h-15c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5h8z" />
                    </svg>
                </a>

                <a
                    href={document.url}
                    download={document.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 px-2 items-center justify-center rounded-md bg-foreground/5 hover:bg-foreground/10 text-[11px] font-medium text-foreground/60 transition-colors"
                >
                    Baixar
                </a>
            </div>
        </motion.div>
    );
}

/** ─── Task View (steps + optional document) ─────────────────── */
export function TaskView({
    steps,
    document,
}: {
    steps: TaskStep[];
    document?: DocumentData;
}) {
    if (!steps || steps.length === 0) return null;

    return (
        <div className="flex flex-col">
            {steps.map((step, i) => (
                <TaskStepItem key={step.id} step={step} isLast={i === steps.length - 1} />
            ))}
            {document && <DocumentCard document={document} />}
        </div>
    );
}
