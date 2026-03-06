import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { AppIcon } from "@/components/icons/AppIcon";
import { useI18n } from "@/i18n/i18n";
import { cn } from "@/lib/utils";

interface ChatOptionsDropdownProps {
    isFavorite: boolean;
    onToggleFavorite: () => void;
    onRename: () => void;
    onDelete: () => void;
    onArchive?: () => void;
    triggerClassName?: string;
    align?: "start" | "end" | "center";
    children?: React.ReactNode;
}

export function ChatOptionsDropdown({
    isFavorite,
    onToggleFavorite,
    onRename,
    onDelete,
    onArchive,
    triggerClassName,
    align = "end",
    children
}: ChatOptionsDropdownProps) {
    const { tt } = useI18n();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children || (
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                            "h-7 w-7 rounded-md flex items-center justify-center transition-all text-foreground/50 hover:text-foreground",
                            triggerClassName
                        )}
                    >
                        <AppIcon name="MoreHorizontal" className="h-3.5 w-3.5" />
                    </button>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align={align}
                className="w-44 p-1 rounded-xl bg-popover border-border/40 shadow-elev-3"
            >
                <DropdownMenuItem
                    onSelect={() => {
                        onToggleFavorite();
                    }}
                    className="flex items-center gap-2 px-2.5 py-2 text-[13px] cursor-pointer rounded-lg transition-colors focus:bg-accent"
                >
                    <AppIcon
                        name="Star"
                        className={cn("h-4 w-4", isFavorite ? "fill-current" : "opacity-70")}
                    />
                    <span>
                        {isFavorite ? tt("Remover estrela", "Remove star") : tt("Favoritar", "Favorite")}
                    </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onSelect={() => {
                        onRename();
                    }}
                    className="flex items-center gap-2 px-2.5 py-2 text-[13px] cursor-pointer rounded-lg transition-colors focus:bg-accent"
                >
                    <AppIcon name="Edit04Icon" className="h-4 w-4 opacity-70" />
                    <span>{tt("Renomear", "Rename")}</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onSelect={() => {
                        if (onArchive) onArchive();
                    }}
                    className="flex items-center gap-2 px-2.5 py-2 text-[13px] cursor-pointer rounded-lg transition-colors focus:bg-accent"
                >
                    <AppIcon name="Archive03Icon" className="h-4 w-4 opacity-70" />
                    <span>{tt("Arquivar", "Archive")}</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1 opacity-50" />

                <DropdownMenuItem
                    onSelect={() => {
                        onDelete();
                    }}
                    className="flex items-center gap-2 px-2.5 py-2 text-[13px] cursor-pointer rounded-lg transition-colors text-red-600 focus:text-red-600 focus:bg-red-50/50 dark:focus:bg-red-950/20"
                >
                    <AppIcon name="Trash2Icon" className="h-4 w-4 opacity-70" />
                    <span>{tt("Excluir chat", "Delete chat")}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
