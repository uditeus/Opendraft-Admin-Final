import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppIcon } from "@/components/icons/AppIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MEMORY_KEY = "opendraft-user-memory";

export interface UserMemoryData {
    nicho: string;
    produto: string;
    tomDeVoz: string;
    publicoAlvo: string;
    customNotes: string;
}

const DEFAULT_MEMORY: UserMemoryData = {
    nicho: "",
    produto: "",
    tomDeVoz: "",
    publicoAlvo: "",
    customNotes: "",
};

export function loadUserMemory(): UserMemoryData {
    try {
        const stored = localStorage.getItem(MEMORY_KEY);
        if (stored) return { ...DEFAULT_MEMORY, ...JSON.parse(stored) };
    } catch { }
    return { ...DEFAULT_MEMORY };
}

export function saveUserMemory(data: UserMemoryData) {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(data));
}

/**
 * Builds a context string from user memory for AI prompts.
 */
export function buildMemoryContext(): string {
    const mem = loadUserMemory();
    const parts: string[] = [];
    if (mem.nicho) parts.push(`Nicho: ${mem.nicho}`);
    if (mem.produto) parts.push(`Produto/Serviço: ${mem.produto}`);
    if (mem.tomDeVoz) parts.push(`Tom de voz: ${mem.tomDeVoz}`);
    if (mem.publicoAlvo) parts.push(`Público-alvo: ${mem.publicoAlvo}`);
    if (mem.customNotes) parts.push(`Notas: ${mem.customNotes}`);
    return parts.length > 0
        ? `[Contexto do usuário]\n${parts.join("\n")}\n`
        : "";
}

interface UserMemoryPanelProps {
    open: boolean;
    onClose: () => void;
}

export function UserMemoryPanel({ open, onClose }: UserMemoryPanelProps) {
    const [data, setData] = React.useState<UserMemoryData>(loadUserMemory);
    const [saved, setSaved] = React.useState(false);

    const handleSave = () => {
        saveUserMemory(data);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const update = (key: keyof UserMemoryData, value: string) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const fields: { key: keyof UserMemoryData; label: string; placeholder: string }[] = [
        { key: "nicho", label: "Nicho", placeholder: "ex: SaaS, e-commerce, saúde..." },
        { key: "produto", label: "Produto/Serviço", placeholder: "ex: App de produtividade, curso online..." },
        { key: "tomDeVoz", label: "Tom de voz", placeholder: "ex: direto, acolhedor, profissional..." },
        { key: "publicoAlvo", label: "Público-alvo", placeholder: "ex: empreendedores 25-40 anos..." },
    ];

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[90] flex items-center justify-center"
                >
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative z-10 mx-4 w-full max-w-md rounded-2xl border border-border bg-background shadow-elev-3 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                            <div className="flex items-center gap-2">
                                <AppIcon name="BrainIcon" className="h-5 w-5 text-primary" />
                                <h2 className="text-sm font-semibold">Memória do Usuário</h2>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
                                <AppIcon name="X" size={16} />
                            </Button>
                        </div>

                        {/* Fields */}
                        <div className="px-6 py-5 space-y-4">
                            <p className="text-[12px] text-muted-foreground">
                                Informações salvas aqui serão usadas automaticamente em todas as conversas.
                            </p>

                            {fields.map(f => (
                                <div key={f.key} className="space-y-1">
                                    <label className="text-[12px] font-medium text-foreground">{f.label}</label>
                                    <input
                                        type="text"
                                        value={data[f.key]}
                                        onChange={e => update(f.key, e.target.value)}
                                        placeholder={f.placeholder}
                                        className={cn(
                                            "w-full rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-[13px]",
                                            "placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-colors"
                                        )}
                                    />
                                </div>
                            ))}

                            <div className="space-y-1">
                                <label className="text-[12px] font-medium text-foreground">Notas adicionais</label>
                                <textarea
                                    value={data.customNotes}
                                    onChange={e => update("customNotes", e.target.value)}
                                    placeholder="Qualquer contexto extra que a IA deve considerar..."
                                    rows={3}
                                    className={cn(
                                        "w-full resize-none rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-[13px]",
                                        "placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-colors"
                                    )}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border/50">
                            <Button variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
                            <Button size="sm" onClick={handleSave} className="gap-1.5">
                                {saved ? <><AppIcon name="Check" size={14} /> Salvo!</> : "Salvar memória"}
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
