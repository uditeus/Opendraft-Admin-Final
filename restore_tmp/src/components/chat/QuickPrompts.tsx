import React from "react";
import { QUICK_PROMPTS, CATEGORY_CONFIG, type QuickPromptCategory } from "@/components/chat/quick-prompts";
import { AppIcon } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";

interface QuickPromptsProps {
    onSelectPrompt: (prompt: string) => void;
    onHoverPrompt?: (prompt: string | null) => void;
}

export function QuickPrompts({ onSelectPrompt, onHoverPrompt }: QuickPromptsProps) {
    const categories: QuickPromptCategory[] = ["write", "ideas", "plan", "analyze"];

    return (
        <div className="w-full max-w-[900px] mx-auto space-y-8 animate-in fade-in duration-500">
            {categories.map((category) => {
                const config = CATEGORY_CONFIG[category];
                const prompts = QUICK_PROMPTS.filter((p) => p.category === category);

                return (
                    <div key={category} className="space-y-3">
                        {/* Category Header */}
                        <div className="flex items-center gap-2 px-1">
                            <span className="text-base">{config.emoji}</span>
                            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                                {config.label}
                            </h3>
                        </div>

                        {/* Prompts Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {prompts.map((prompt) => (
                                <button
                                    key={prompt.id}
                                    type="button"
                                    onClick={() => onSelectPrompt(prompt.prompt)}
                                    onMouseEnter={() => onHoverPrompt?.(prompt.prompt)}
                                    onMouseLeave={() => onHoverPrompt?.(null)}
                                    className={cn(
                                        "group relative flex items-start gap-3 p-4 rounded-xl border border-border",
                                        "bg-background hover:bg-accent/50",
                                        "text-left transition-all duration-200",
                                        "hover:border-border/80 hover:shadow-sm"
                                    )}
                                >
                                    {/* Icon */}
                                    <div className="shrink-0 mt-0.5">
                                        <AppIcon
                                            name={config.icon as any}
                                            className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors"
                                            strokeWidth={1.5}
                                        />
                                    </div>

                                    {/* Title */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[15px] leading-6 text-foreground font-normal">
                                            {prompt.title}
                                        </p>
                                    </div>

                                    {/* Hover indicator */}
                                    <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <AppIcon
                                            name="ArrowRight"
                                            className="h-4 w-4 text-muted-foreground"
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
