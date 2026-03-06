import * as React from "react";
import { AppIcon } from "@/components/icons/AppIcon";
import { ChatTooltip } from "@/components/design-system/chat-tooltip";
import { Button } from "@/components/ui/button";

export function UserActions({
    onCopy,
    copied,
    onRegenerate,
    createdAt,
}: {
    onCopy: () => void;
    copied: boolean;
    onRegenerate: () => void;
    createdAt?: number;
}) {
    const shortDate = createdAt ? new Date(createdAt).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "short",
    }) : "";

    const fullDate = createdAt ? new Date(createdAt).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }) + ", " + new Date(createdAt).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    }) : "";

    return (
        <div className="mt-1.5 flex items-center justify-end gap-3 px-1 transition-opacity duration-200 opacity-0 group-hover/bubble:opacity-100">
            {shortDate && (
                <ChatTooltip label={fullDate} side="bottom">
                    <span className="text-[11px] text-muted-foreground/40 font-medium lowercase cursor-default">
                        {shortDate}
                    </span>
                </ChatTooltip>
            )}
            <div className="flex items-center gap-0.5">
                <ChatTooltip label="Tentar novamente" side="bottom">
                    <Button
                        variant="chatGhost"
                        size="chatIconSm"
                        onClick={onRegenerate}
                        className="text-muted-foreground/50 hover:text-foreground"
                    >
                        <AppIcon name="Regenerate" className="h-[14px] w-[14px]" />
                    </Button>
                </ChatTooltip>

                <ChatTooltip label={copied ? "Copiado" : "Copiar"} side="bottom">
                    <Button
                        variant="chatGhost"
                        size="chatIconSm"
                        onClick={onCopy}
                        className="text-muted-foreground/50 hover:text-foreground"
                    >
                        {copied ? <AppIcon name="Check" className="h-[14px] w-[14px]" /> : <AppIcon name="Copy" className="h-[14px] w-[14px]" />}
                    </Button>
                </ChatTooltip>
            </div>
        </div>
    );
}
