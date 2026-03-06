import React from "react";
import { AppIcon } from "@/components/icons/AppIcon";
import { Button } from "@/components/ui/button";
import type { DocumentData } from "@/components/chat/types";

interface DocumentCardProps {
    document: DocumentData;
}

export function DocumentCard({ document }: DocumentCardProps) {
    return (
        <div className="mt-4 w-full max-w-[560px] bg-background dark:bg-muted/20 border border-border/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center p-4 gap-4">
                {/* Slanted Paper Icon Component */}
                <div className="relative shrink-0 w-12 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 bg-muted/40 border border-border/40 rounded-[2px] rotate-[-6deg] translate-x-[-2px] translate-y-[2px]" />
                    <div className="relative w-10 h-13 bg-background border border-border/80 rounded-[2px] flex items-center justify-center">
                        <AppIcon name="FileText" className="h-5 w-5 text-muted-foreground/60" />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-semibold text-foreground truncate">
                        {document.title}
                    </h4>
                    <p className="text-[12px] text-muted-foreground mt-0.5">
                        Documento · {document.fileName?.split('.').pop()?.toUpperCase() || 'DOCX'}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg hover:bg-muted/50">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                            <path d="M7.74 3.522c.383 0 .738.205.93.536l6.487 11.238a1.076 1.076 0 0 1-.929 1.614H1.258a1.076 1.076 0 0 1-.929-1.614l6.48-11.238c.192-.331.547-.536.93-.536zM16.143 4.26a1.076 1.076 0 0 1 1.859 0l4.897 8.482a1.076 1.076 0 0 1-.93 1.614h-9.794a1.076 1.076 0 0 1-.93-1.614l4.898-8.482zM15 17.5h7c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5h-15c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5h8z" />
                        </svg>
                    </Button>
                    <Button variant="outline" className="h-10 px-6 rounded-lg font-medium text-[14px] hover:bg-muted/50">
                        Baixar
                    </Button>
                </div>
            </div>
        </div>
    );
}
