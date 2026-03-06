import * as React from "react";
import { useChatStore } from "@/components/chat/store";
import { AppIcon } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

export function ComposerSurvey() {
    const store = useChatStore();
    const { activeSurvey, setSurveyAnswer, nextSurveyPage, prevSurveyPage, closeSurvey, submitSurvey, activeThreadId } = store;

    if (!activeSurvey || !activeSurvey.isOpen) return null;

    const currentQ = activeSurvey.questions[activeSurvey.currentQuestionIndex];
    const totalQuestions = activeSurvey.questions.length;
    const isLast = activeSurvey.currentQuestionIndex === totalQuestions - 1;
    const isFirst = activeSurvey.currentQuestionIndex === 0;

    const currentAnswer = activeSurvey.answers[currentQ.id];
    const selectedOptions = Array.isArray(currentAnswer)
        ? currentAnswer
        : (currentAnswer ? [currentAnswer] : []);

    const handleOptionClick = (option: string) => {
        if (currentQ.type === "single") {
            setSurveyAnswer(currentQ.id, option);
        } else {
            // Multi
            if (selectedOptions.includes(option)) {
                setSurveyAnswer(currentQ.id, selectedOptions.filter(o => o !== option));
            } else {
                setSurveyAnswer(currentQ.id, [...selectedOptions, option]);
            }
        }
    };

    const [otherText, setOtherText] = React.useState("");
    const isOtherSelected = selectedOptions.includes("OTHER_CUSTOM_VALUE");

    // Effect to sync other text if needed? 
    // For simplicity, we might store "Other: <text>" directly as answer, 
    // or use a special internal value like "OTHER_CUSTOM_VALUE" and a separate "otherText" state?
    // The store structure handles map: questionId -> string | string[].
    // Let's store the actual text if single, or "Other: text" if multi?
    // Use a prefix to distinguish? Or just store the text.
    // Re-reading requirements: "Ao selecionar Outra opção, aparece um campo de texto inline".
    // Let's assume we map the UI "Other" option to a special value in state or handle it.

    // Refined approach:
    // If user clicks "Other", we add "OTHER_CUSTOM" to selectedOptions.
    // And we show input.
    // When submitting/navigating, we replace "OTHER_CUSTOM" with the text from input?
    // Or we update the store on blur/change?

    // Let's keep it simple: "Other" is just another option visually, but backed by text input.

    const handleNext = () => {
        if (isLast) {
            // Submit
            // We need original prompt... where is it? 
            // It's not in the store's activeSurvey state.
            // Maybe we can pass it when starting survey? Or we just send "Survey Context" message?
            // The user wants: "Ao confirmar... É enviada uma mensagem única para o chat contendo as respostas + o prompt original."
            // So we must have the original prompt.
            // Let's assume the caller (ChatComposer) will handle the actual submission event by listening to store state?
            // Or we pass it to submitSurvey?
            // Implementation plan said: "submitSurvey(payload)".
            // But we don't have payload here.
            // Let's look for context.
            // Maybe we just close it here and let ChatComposer allow the "Send" button to trigger the actual submit?
            // Requirement: "Ao confirmar: O painel fecha... É enviada uma mensagem..."
            // So this component needs the original prompt or a way to trigger the send.

            // Temporary solution: Store the original prompt in a Ref or Store when starting survey?
            // Or just fire an event?
            // Let's assume for now we just call `closeSurvey` and have a callback or we rely on the `isSubmitting` state?
            // Actually, let's use a dedicated action `completeSurvey` in store that just marks it as done, 
            // and ChatComposer (which started it and has the prompt text) reacts to it?
            // Keep it simple: Passing `onSubmit` prop to ComposerSurvey? No, it's connected to store.

            // We will use `store.submitSurvey` but we need the prompt.
            // Let's stick to the plan: update `activeSurvey` to include `context` which has `originalPrompt`.
            // I'll update `startSurvey` in store to accept `context`.

            const context = (activeSurvey as any).context || {};
            submitSurvey({ chatId: activeThreadId, originalPrompt: context.originalPrompt || "" });
        } else {
            nextSurveyPage();
        }
    };

    return (
        <div className="flex flex-col gap-4 p-4 border-t border-border/50 bg-background/95 backdrop-blur-sm animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg leading-tight">{currentQ.title}</h3>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <span>{activeSurvey.currentQuestionIndex + 1} de {totalQuestions}</span>
                    <button onClick={closeSurvey} className="hover:text-foreground p-1"><AppIcon name="X" className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
                {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOptions.includes(opt);
                    return (
                        <button
                            key={idx}
                            onClick={() => handleOptionClick(opt)}
                            className={cn(
                                "flex items-center w-full p-3 rounded-lg text-left transition-all",
                                "border hover:border-primary/50",
                                isSelected
                                    ? "bg-primary/5 border-primary text-primary"
                                    : "bg-muted/30 border-transparent hover:bg-muted/50"
                            )}
                        >
                            <span className={cn(
                                "flex items-center justify-center w-6 h-6 rounded-full text-xs mr-3 border",
                                isSelected ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/30"
                            )}>
                                {idx + 1}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isSelected && <AppIcon name="Check" className="w-4 h-4 ml-2" />}
                        </button>
                    );
                })}
                {/* Other option handling would go here */}
            </div>

            <div className="flex items-center justify-between mt-4">
                <Button
                    variant="ghost"
                    onClick={closeSurvey}
                    className="text-muted-foreground hover:text-foreground"
                >
                    Pular
                </Button>

                <div className="flex gap-2">
                    {!isFirst && (
                        <Button variant="outline" size="icon" onClick={prevSurveyPage}>
                            <AppIcon name="ChevronLeft" />
                        </Button>
                    )}
                    <Button onClick={handleNext}>
                        {isLast ? "Confirmar" : "Próximo"}
                        {!isLast && <AppIcon name="ChevronRight" className="ml-2 w-4 h-4" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
