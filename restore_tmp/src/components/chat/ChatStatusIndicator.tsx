import * as React from "react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { motion, AnimatePresence } from "framer-motion";
import { AppIcon } from "@/components/icons/AppIcon";

import type { ChatMessage } from "@/components/chat/types";
import { TaskView, DocumentCard } from "@/components/chat/generative-ui/TaskView";

/** Infer 3 timeline steps from the user prompt + assistant content. */
function inferSteps(userPrompt?: string, assistantContent?: string): { title: string; desc: string }[] {
    const p = (userPrompt || "").toLowerCase();
    const a = (assistantContent || "").toLowerCase();

    // E-mail
    if (p.includes("e-mail") || p.includes("email") || a.includes("assunto:") || a.includes("subject:")) {
        return [
            { title: "Compreender o objetivo do e-mail", desc: "Analisei público, tom e meta de conversão." },
            { title: "Redigir o conteúdo persuasivo", desc: "Apliquei técnicas de copy para engajar o leitor." },
            { title: "Revisar e entregar o e-mail", desc: "Finalizei o texto pronto para envio." },
        ];
    }

    // Headline / título
    if (p.includes("headline") || p.includes("título") || p.includes("titulo") || p.includes("chamada")) {
        return [
            { title: "Analisar o produto e público", desc: "Identifiquei o ângulo mais forte para chamar atenção." },
            { title: "Criar variações de headline", desc: "Testei diferentes abordagens de curiosidade e benefício." },
            { title: "Selecionar as melhores opções", desc: "Filtrei por impacto, clareza e relevância." },
        ];
    }

    // Anúncio / ad / criativo
    if (p.includes("anúncio") || p.includes("anuncio") || p.includes("ad ") || p.includes("criativo") || p.includes("tráfego")) {
        return [
            { title: "Definir a abordagem do anúncio", desc: "Escolhi o hook e ângulo com base no nível de consciência." },
            { title: "Escrever o copy do criativo", desc: "Redigi o texto com foco em clique e conversão." },
            { title: "Entregar o anúncio finalizado", desc: "Formatei o conteúdo para uso direto na plataforma." },
        ];
    }

    // Post / redes sociais / instagram / stories
    if (p.includes("post") || p.includes("instagram") || p.includes("rede") || p.includes("stories") || p.includes("carrossel") || p.includes("legenda")) {
        return [
            { title: "Entender o contexto da publicação", desc: "Analisei o canal, formato e objetivo do post." },
            { title: "Redigir o conteúdo para a rede", desc: "Criei o texto com linguagem adequada ao público." },
            { title: "Finalizar e entregar", desc: "Revisado e pronto para publicação." },
        ];
    }

    // Landing page / página de vendas / VSL
    if (p.includes("landing") || p.includes("página de venda") || p.includes("vsl") || p.includes("oferta")) {
        return [
            { title: "Mapear a estrutura da página", desc: "Defini seções e hierarquia argumentativa." },
            { title: "Escrever os blocos de copy", desc: "Redigi cada seção com foco em persuasão progressiva." },
            { title: "Entregar a copy completa", desc: "Conteúdo organizado e pronto para design." },
        ];
    }

    // Variação / reescrita / melhoria
    if (p.includes("variação") || p.includes("variações") || p.includes("reescrev") || p.includes("melhor") || p.includes("refaz")) {
        return [
            { title: "Revisar o conteúdo original", desc: "Identifiquei pontos de melhoria no texto atual." },
            { title: "Criar nova versão", desc: "Reescrevi com ângulo e abordagem diferentes." },
            { title: "Entregar a versão final", desc: "Texto refinado e pronto para uso." },
        ];
    }

    // Default / genérico
    return [
        { title: "Compreender o pedido", desc: "Analisei o contexto e objetivo da solicitação." },
        { title: "Elaborar a resposta", desc: "Redigi o conteúdo aplicando técnicas de copy." },
        { title: "Entregar o resultado", desc: "Texto finalizado e revisado." },
    ];
}

export function ChatStatusIndicator({
    message,
    isTyping,
    typingMode,
    userPrompt,
}: {
    message: ChatMessage;
    isTyping?: boolean;
    typingMode?: string;
    userPrompt?: string;
}) {
    const isAssistantGenerating = isTyping;
    const [isExpanded, setIsExpanded] = React.useState(false);

    let status: "thinking" | "generating" | "done" | null = null;
    let durationStr: string | null = null;

    if (isAssistantGenerating) {
        if (!message.content) {
            status = "thinking";
        } else {
            status = "generating";
        }
    } else if (message.metadata?.thoughtTimeMs && !message.metadata?.aborted) {
        status = "done";
        durationStr = (message.metadata.thoughtTimeMs / 1000).toFixed(1);
    }

    const steps = React.useMemo(
        () => inferSteps(userPrompt, message.content),
        [userPrompt, message.content]
    );

    // If it's generating and we have taskSteps, we always show
    const showInteractive = !!status;

    if (!showInteractive) return null;

    const isDone = status === "done";
    const isGenerating = status === "generating" || status === "thinking";

    return (
        <div className="px-0">
            <AnimatePresence mode="wait">
                {/* Thinking / Generating Toggle */}
                <div className="flex flex-col">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="group flex items-center gap-1.5 py-1 text-[12px] font-medium text-muted-foreground/30 hover:text-muted-foreground/50 transition-colors w-fit"
                        aria-expanded={isExpanded}
                    >
                        <motion.span
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center"
                        >
                            <AppIcon name="ChevronRight" size={12} />
                        </motion.span>

                        <div className="flex items-center gap-2">
                            {isGenerating && !message.content && (
                                <TextShimmer mode={typingMode || "default"} className="text-[12px] text-muted-foreground/40" />
                            )}
                            {isGenerating && message.content && (
                                <TextShimmer mode="generating" className="text-[12px] text-muted-foreground/40" />
                            )}
                            {isDone && (
                                <span>Thought for {durationStr}s</span>
                            )}
                        </div>
                    </button>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div className="py-3 ml-[3px] border-l border-muted-foreground/5 pl-4 -ml-[0.5px]">
                                    {message.metadata?.taskSteps && message.metadata.taskSteps.length > 0 ? (
                                        <TaskView steps={message.metadata.taskSteps} />
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            {steps.map((step, i) => (
                                                <div key={i} className="flex flex-col gap-0.5">
                                                    <p className="text-[11px] font-medium text-muted-foreground/45 leading-none">
                                                        {step.title}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground/20 leading-relaxed">
                                                        {step.desc}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Final document card inside the thought for neatness */}
                                    {message.metadata?.document && (
                                        <div className="mt-4 pt-4 border-t border-muted-foreground/5">
                                            <DocumentCard document={message.metadata.document} />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </AnimatePresence>
        </div>
    );
}
