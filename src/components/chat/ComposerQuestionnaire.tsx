import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/icons/AppIcon";
import { Button } from "@/components/ui/button";
import { ChatTooltip } from "@/components/design-system/chat-tooltip";

export interface QuestionnaireOption {
    id: string;
    label: string;
    value: string;
    sublabel?: string;
}

export interface QuestionnaireStep {
    id: string;
    question: string;
    options: QuestionnaireOption[];
    type: "single" | "multiple";
    allowCustom?: boolean;
}

export interface QuestionnaireData {
    steps: QuestionnaireStep[];
}

interface ComposerQuestionnaireProps {
    data: QuestionnaireData;
    onComplete: (answers: Record<string, string[]>) => void;
    onCancel: () => void;
    className?: string;
}

export function ComposerQuestionnaire({
    data,
    onComplete,
    onCancel,
    className,
}: ComposerQuestionnaireProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string[]>>({});
    const [customInput, setCustomInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const currentStep = data.steps[currentStepIndex];
    const totalSteps = data.steps.length;
    const isLastStep = currentStepIndex === totalSteps - 1;

    const handleSelect = (optionValue: string) => {
        if (currentStep.type === "single") {
            // For single select, we can auto-advance if it's not the last step?
            // Or just select. The screenshot implies selection then maybe explicit next or auto-next.
            // "Enter para selecionar" implies explicit action, but "single" usually auto-advances in wizards.
            // Let's select and auto-advance for single, toggle for multiple.

            setAnswers((prev) => ({ ...prev, [currentStep.id]: [optionValue] }));

            // Auto-advance after a brief delay for single select
            setTimeout(() => {
                handleNext();
            }, 150);
        } else {
            // Multiple
            setAnswers((prev) => {
                const current = prev[currentStep.id] || [];
                const isSelected = current.includes(optionValue);
                const next = isSelected
                    ? current.filter((v) => v !== optionValue)
                    : [...current, optionValue];
                return { ...prev, [currentStep.id]: next };
            });
        }
    };

    const handleNext = () => {
        if (isLastStep) {
            onComplete(answers);
        } else {
            setCurrentStepIndex((prev) => prev + 1);
            setCustomInput("");
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex((prev) => prev - 1);
            setCustomInput("");
        }
    };

    const handleCustomSubmit = () => {
        if (!customInput.trim()) return;

        // Treat custom input as a selected value (or separate field?)
        // For simplicity, add it to the answers list for this step with a specific prefix or just as value.
        const customValue = `custom:${customInput.trim()}`;

        if (currentStep.type === "single") {
            setAnswers((prev) => ({ ...prev, [currentStep.id]: [customValue] }));
            handleNext();
        } else {
            setAnswers((prev) => ({
                ...prev,
                [currentStep.id]: [...(prev[currentStep.id] || []), customValue]
            }));
            setCustomInput(""); // Clear after adding? Or keep properly?
            // If multiple, maybe we just want to add it.
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Numbers
            const num = parseInt(e.key);
            if (!isNaN(num) && num >= 1 && num <= currentStep.options.length) {
                handleSelect(currentStep.options[num - 1].value);
                return;
            }

            switch (e.key) {
                case "Escape":
                    onCancel();
                    break;
                case "Enter":
                    // If focused on input, let input handle it.
                    // If multiple selection and nothing focused, maybe advance?
                    if (document.activeElement !== inputRef.current) {
                        if (currentStep.type === "multiple" || (answers[currentStep.id]?.length && currentStep.type === "single")) {
                            handleNext();
                        }
                    }
                    break;
                case "ArrowRight":
                    // Optional: visual navigation if we had focus management
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentStep, answers, currentStepIndex]);


    return (
        <div className={cn(
            "flex flex-col h-full w-full bg-[hsl(var(--chat-composer))] rounded-[26px] overflow-hidden",
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
                <h3 className="text-[17px] font-medium text-foreground">
                    {currentStep.question}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {currentStepIndex > 0 && (
                        <button onClick={handlePrev} className="hover:text-foreground transition-colors">
                            &lt;
                        </button>
                    )}
                    <span>
                        {currentStepIndex + 1} de {totalSteps}
                    </span>
                    {!isLastStep && (
                        <button onClick={handleNext} className="hover:text-foreground transition-colors">
                            &gt;
                        </button>
                    )}
                    <button onClick={onCancel} className="ml-2 hover:text-foreground">
                        <AppIcon name="X" className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Options Body */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
                <div className="space-y-1">
                    {currentStep.options.map((option, index) => {
                        const isSelected = (answers[currentStep.id] || []).includes(option.value);
                        return (
                            <button
                                key={option.id}
                                onClick={() => handleSelect(option.value)}
                                className={cn(
                                    "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200 group",
                                    isSelected
                                        ? "bg-[hsl(var(--primary)/0.1)] text-foreground font-medium"
                                        : "hover:bg-[hsl(var(--chat-hover))] text-foreground/80"
                                )}
                            >
                                <span className={cn(
                                    "flex items-center justify-center w-6 h-6 rounded-md text-xs font-medium transition-colors",
                                    isSelected
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted/50 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                                )}>
                                    {index + 1}
                                </span>

                                <div className="flex-1">
                                    <span>{option.label}</span>
                                    {option.sublabel && (
                                        <span className="ml-2 text-muted-foreground text-sm">
                                            {option.sublabel}
                                        </span>
                                    )}
                                </div>

                                {isSelected && (
                                    <AppIcon name="Check" className="w-4 h-4 text-primary" />
                                )}
                                {!isSelected && (
                                    <AppIcon name="ArrowRight" className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border/40">
                {currentStep.allowCustom && (
                    <div className="flex items-center gap-3 mb-4">
                        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-muted/50 text-muted-foreground">
                            <AppIcon name="Pencil" className="w-3.5 h-3.5" />
                        </span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleCustomSubmit();
                                }
                            }}
                            placeholder={currentStep.type === "single" ? "Outra opção (Enter para selecionar)" : "Outra opção (Enter para adicionar)"}
                            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/70"
                        />
                    </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground/60">
                    <div className="flex items-center gap-4">
                        <span>↑↓ para navegar</span>
                        <span>Enter para selecionar</span>
                        <span>Esc para pular</span>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={isLastStep ? () => onComplete(answers) : handleNext}
                        className="h-8 px-3 text-xs hover:bg-muted/50"
                    >
                        {isLastStep ? "Concluir" : "Pular"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
