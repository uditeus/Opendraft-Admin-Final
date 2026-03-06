import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppIcon, type AppIconName } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";

interface IntentCard {
    id: string;
    label: string;
    description: string;
    icon: AppIconName;
}

interface IntentCardsProps {
    cards: IntentCard[];
    onSelect: (card: IntentCard) => void;
    onDismiss: () => void;
}

export function IntentCards({ cards, onSelect, onDismiss }: IntentCardsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full space-y-3"
        >
            <div className="flex items-center justify-between">
                <p className="text-[13px] text-muted-foreground">
                    Não tenho certeza do que você precisa. Escolha uma opção:
                </p>
                <button
                    onClick={onDismiss}
                    className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                >
                    Enviar assim mesmo
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cards.map((card, idx) => (
                    <motion.button
                        key={card.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        onClick={() => onSelect(card)}
                        className={cn(
                            "flex items-start gap-3 rounded-xl border border-border/50 bg-background/50 p-4 text-left",
                            "hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm transition-all",
                            "active:scale-[0.98]"
                        )}
                    >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 mt-0.5">
                            <AppIcon name={card.icon} size={16} className="text-primary" />
                        </span>
                        <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-medium text-foreground">{card.label}</div>
                            <div className="text-[11px] text-muted-foreground/60 mt-0.5">{card.description}</div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}

/**
 * Analyzes a prompt for ambiguity. Returns interpretation cards or null if intent is clear.
 */
export function detectAmbiguity(prompt: string): IntentCard[] | null {
    const lower = prompt.toLowerCase().trim();
    const wordCount = lower.split(/\s+/).length;

    // Only check short, vague prompts
    if (wordCount > 8) return null;

    // Pattern: single vague word
    if (wordCount <= 2) {
        if (/^(copy|texto|escreve|cria|faz|gera|ajuda|preciso)/i.test(lower)) {
            return [
                { id: "ad", label: "Copy para anúncio", description: "Facebook/Instagram Ads", icon: "Presentation" },
                { id: "email", label: "E-mail marketing", description: "Campanha de e-mail", icon: "Copy" },
                { id: "landing", label: "Landing page", description: "Página de vendas ou captura", icon: "FileText" },
                { id: "social", label: "Post de redes sociais", description: "Instagram, LinkedIn, etc.", icon: "Share2" },
            ];
        }
    }

    // Pattern: "copy para [X]" without enough context
    if (/^copy (para|pra|de|do)\s/i.test(lower) && wordCount <= 5) {
        return [
            { id: "persuasive", label: "Copy persuasiva", description: "Com foco em conversão e venda", icon: "Zap" },
            { id: "brand", label: "Copy de marca", description: "Tom institucional e branding", icon: "Star" },
            { id: "educational", label: "Copy educativa", description: "Informativa e com autoridade", icon: "BookOpen" },
        ];
    }

    return null;
}
