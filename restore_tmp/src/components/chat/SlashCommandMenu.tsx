import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppIcon, type AppIconName } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";

export interface SlashCommand {
    id: string;
    label: string;
    description: string;
    icon: AppIconName;
    insertText: string;
}

const DEFAULT_COMMANDS: SlashCommand[] = [
    { id: "variacao", label: "/variação", description: "Gerar variações da copy", icon: "Cells", insertText: "Gere 3 variações da copy: " },
    { id: "curto", label: "/mais curto", description: "Versão mais concisa", icon: "ListTodo", insertText: "Reescreva de forma mais curta: " },
    { id: "agressivo", label: "/mais agressivo", description: "Tom mais direto e urgente", icon: "Zap", insertText: "Reescreva com tom mais agressivo e direto: " },
    { id: "anuncio", label: "/anúncio", description: "Formato de anúncio pago", icon: "Presentation", insertText: "Crie um anúncio para Facebook/Instagram Ads: " },
    { id: "email", label: "/email", description: "Copy para e-mail marketing", icon: "Copy", insertText: "Crie um e-mail de marketing: " },
    { id: "headline", label: "/headline", description: "Gerar títulos chamativos", icon: "Highlighter", insertText: "Crie 5 headlines persuasivas para: " },
    { id: "cta", label: "/CTA", description: "Call-to-action poderoso", icon: "ArrowUpRight", insertText: "Crie CTAs persuasivos para: " },
];

interface SlashCommandMenuProps {
    open: boolean;
    filterText: string;
    onSelect: (command: SlashCommand) => void;
    onClose: () => void;
}

export function SlashCommandMenu({ open, filterText, onSelect, onClose }: SlashCommandMenuProps) {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const filtered = React.useMemo(() => {
        const q = filterText.toLowerCase();
        return DEFAULT_COMMANDS.filter(c =>
            c.label.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
        );
    }, [filterText]);

    // Reset selection when filter changes
    React.useEffect(() => {
        setSelectedIndex(0);
    }, [filterText]);

    // Keyboard navigation
    React.useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex(i => Math.max(i - 1, 0));
            } else if (e.key === "Enter" && filtered.length > 0) {
                e.preventDefault();
                onSelect(filtered[selectedIndex]);
            } else if (e.key === "Escape") {
                e.preventDefault();
                onClose();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, filtered, selectedIndex, onSelect, onClose]);

    if (!open || filtered.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-3 mb-2 z-50 w-[320px] overflow-hidden rounded-2xl border border-border bg-[hsl(var(--chat-composer))] shadow-elev-2 backdrop-blur"
            >
                <div className="px-3 py-2 border-b border-border/50">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Comandos rápidos</span>
                </div>
                <div className="max-h-[240px] overflow-auto p-1">
                    {filtered.map((cmd, idx) => (
                        <button
                            key={cmd.id}
                            onClick={() => onSelect(cmd)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors",
                                idx === selectedIndex
                                    ? "bg-[hsl(var(--chat-hover))] text-foreground"
                                    : "text-muted-foreground hover:bg-[hsl(var(--chat-hover))] hover:text-foreground"
                            )}
                        >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <AppIcon name={cmd.icon} size={15} className="text-primary" />
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-medium">{cmd.label}</div>
                                <div className="text-[11px] text-muted-foreground/70 truncate">{cmd.description}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
