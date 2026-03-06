import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface BriefingQualityBarProps {
    text: string;
}

// Simple heuristic: check for key copywriting elements
function analyzeBriefing(text: string) {
    const lower = text.toLowerCase();
    const checks = [
        { key: "público-alvo", found: /público|audiência|persona|target|cliente ideal|quem/.test(lower) },
        { key: "produto/serviço", found: /produto|serviço|oferta|vender|venda|lançamento/.test(lower) },
        { key: "canal", found: /instagram|facebook|email|whatsapp|landing|site|youtube|tiktok|ads|anúncio/.test(lower) },
        { key: "objetivo", found: /objetivo|meta|conversão|vender|atrair|engajar|captar|lead/.test(lower) },
        { key: "tom de voz", found: /tom|estilo|formal|informal|urgente|suave|direto|divertido|profissional/.test(lower) },
    ];

    const found = checks.filter(c => c.found).length;
    const missing = checks.filter(c => !c.found).map(c => c.key);

    return {
        score: found,
        total: checks.length,
        missing,
        level: found <= 1 ? "fraco" as const : found <= 3 ? "bom" as const : "ótimo" as const,
    };
}

export function BriefingQualityBar({ text }: BriefingQualityBarProps) {
    const analysis = React.useMemo(() => analyzeBriefing(text), [text]);

    if (text.trim().length < 10) return null;

    const colorMap = {
        "fraco": { bar: "bg-orange-400/80", text: "text-orange-400", label: "Fraco" },
        "bom": { bar: "bg-blue-400/80", text: "text-blue-400", label: "Bom" },
        "ótimo": { bar: "bg-emerald-400/80", text: "text-emerald-400", label: "Ótimo" },
    };

    const style = colorMap[analysis.level];
    const pct = (analysis.score / analysis.total) * 100;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
            >
                <div className="flex items-center gap-3 px-4 py-2">
                    {/* Progress bar */}
                    <div className="flex-1 flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-muted/50 overflow-hidden">
                            <motion.div
                                className={cn("h-full rounded-full", style.bar)}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            />
                        </div>
                        <span className={cn("text-[11px] font-medium shrink-0 tabular-nums", style.text)}>
                            {style.label}
                        </span>
                    </div>

                    {/* Missing items */}
                    {analysis.missing.length > 0 && analysis.missing.length <= 3 && (
                        <span className="text-[11px] text-muted-foreground/60 truncate max-w-[200px]">
                            Falta: {analysis.missing.join(", ")}
                        </span>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
