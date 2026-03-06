import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppIcon } from "@/components/icons/AppIcon";

const STEPS = [
    { label: "Analisando briefing", icon: "Search" as const, durationMs: 2000 },
    { label: "Definindo ângulo", icon: "Compass" as const, durationMs: 3000 },
    { label: "Escrevendo copy", icon: "QuillWrite" as const, durationMs: 4000 },
];

interface TaskProgressBarProps {
    isActive: boolean;
    hasContent: boolean;
}

export function TaskProgressBar({ isActive, hasContent }: TaskProgressBarProps) {
    const [currentStep, setCurrentStep] = React.useState(0);
    const [startTime] = React.useState(() => Date.now());

    React.useEffect(() => {
        if (!isActive || hasContent) return;

        const timers: NodeJS.Timeout[] = [];
        let accumulated = 0;

        STEPS.forEach((step, idx) => {
            if (idx === 0) return; // Start at step 0
            accumulated += step.durationMs;
            timers.push(setTimeout(() => setCurrentStep(idx), accumulated));
        });

        return () => timers.forEach(clearTimeout);
    }, [isActive, hasContent]);

    // Reset when generation starts
    React.useEffect(() => {
        if (isActive && !hasContent) {
            setCurrentStep(0);
        }
    }, [isActive, hasContent]);

    if (!isActive || hasContent) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 overflow-hidden"
            >
                <div className="flex items-center gap-4 px-1">
                    {STEPS.map((step, idx) => {
                        const done = idx < currentStep;
                        const active = idx === currentStep;
                        return (
                            <motion.div
                                key={step.label}
                                className="flex items-center gap-1.5"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.15 }}
                            >
                                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-medium transition-colors duration-300 ${done ? "bg-primary/20 text-primary" : active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                                    {done ? (
                                        <AppIcon name="Check" size={12} />
                                    ) : active ? (
                                        <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
                                            <AppIcon name={step.icon} size={12} />
                                        </motion.span>
                                    ) : (
                                        <AppIcon name={step.icon} size={12} />
                                    )}
                                </span>
                                <span className={`text-[12px] transition-colors duration-300 ${done ? "text-primary font-medium" : active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                                    {step.label}
                                </span>
                                {idx < STEPS.length - 1 && (
                                    <span className={`mx-1 text-[10px] ${done ? "text-primary" : "text-muted-foreground/40"}`}>→</span>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
