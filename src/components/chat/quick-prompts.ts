export type QuickPromptCategory = "write" | "ideas" | "plan" | "analyze";

export interface QuickPrompt {
    id: string;
    category: QuickPromptCategory;
    title: string;
    prompt: string;
}

// 4 prompts per category (pill)
export const QUICK_PROMPTS: Record<QuickPromptCategory, QuickPrompt[]> = {
    write: [
        {
            id: "creative-ads",
            category: "write",
            title: "Criativo Persuasivo para Anúncios",
            prompt: "Oi OpenDraft! Quero criar um criativo altamente persuasivo para anúncios. Se precisar de mais informações, me faça até 4 perguntas estratégicas agora mesmo para entender o produto, público e objetivo. Se achar que devo enviar algum material que ajude você a escrever melhor, me avise. Use as ferramentas disponíveis se isso melhorar o resultado. Execute a tarefa assim que tiver contexto suficiente e entregue algo pronto para usar.",
        },
        {
            id: "youtube-script",
            category: "write",
            title: "Roteiro Estratégico para YouTube",
            prompt: "Oi OpenDraft! Quero desenvolver um roteiro estratégico para YouTube focado em retenção e conversão. Se faltar contexto, me faça de 1 a 4 perguntas essenciais agora. Se algum documento ou referência puder melhorar o roteiro, me avise. Use recursos disponíveis se fizer sentido. Assim que tiver as informações necessárias, escreva o roteiro completo de forma natural e envolvente.",
        },
        {
            id: "sales-page",
            category: "write",
            title: "Estrutura Completa de Página de Vendas",
            prompt: "Oi OpenDraft! Preciso estruturar uma página de vendas altamente persuasiva. Se precisar de mais informações, me faça algumas perguntas estratégicas agora mesmo. Caso algum material ajude a tornar a estrutura mais forte, me avise. Utilize ferramentas disponíveis se necessário. Assim que entender o contexto, construa a estrutura completa pronta para desenvolvimento.",
        },
        {
            id: "presentation-script",
            category: "write",
            title: "Roteiro de Apresentação Persuasiva",
            prompt: "Oi OpenDraft! Quero criar um roteiro de apresentação envolvente e convincente. Se faltar informação, me faça 1 a 3 perguntas principais agora. Se eu puder enviar algo que ajude você a construir melhor essa apresentação, me avise. Use ferramentas disponíveis se necessário. Depois disso, desenvolva o roteiro de forma clara e estratégica.",
        },
    ],
    ideas: [
        {
            id: "irresistible-offer",
            category: "ideas",
            title: "Criar Oferta Irresistível",
            prompt: "Oi OpenDraft! Quero desenvolver uma oferta mais forte e difícil de recusar. Se precisar entender melhor o produto ou público, me faça perguntas estratégicas agora. Se houver materiais que possam ajudar, me avise. Use ferramentas disponíveis se fizer sentido. Depois disso, apresente ideias estruturadas e aplicáveis.",
        },
        {
            id: "unique-mechanism",
            category: "ideas",
            title: "Desenvolver Mecanismo Único",
            prompt: "Oi OpenDraft! Quero criar um mecanismo único para diferenciar meu produto no mercado. Se faltar contexto, me faça perguntas essenciais agora. Caso algum documento ou referência ajude na criação, me avise. Utilize recursos disponíveis se necessário. Depois construa propostas claras e estratégicas.",
        },
        {
            id: "creative-angles",
            category: "ideas",
            title: "Ângulos Poderosos para Criativos",
            prompt: "Oi OpenDraft! Preciso de novos ângulos estratégicos para meus criativos. Se precisar de mais informações sobre público ou objetivo, me faça perguntas agora. Se algum material puder ajudar, me avise. Use ferramentas disponíveis se fizer sentido. Em seguida, gere ideias aplicáveis e direcionadas para conversão.",
        },
        {
            id: "increase-clicks",
            category: "ideas",
            title: "Ideias para Aumentar Cliques",
            prompt: "Oi OpenDraft! Quero gerar ideias estratégicas para aumentar cliques nos meus anúncios. Se precisar entender melhor o contexto, me faça algumas perguntas agora. Caso eu deva enviar algo que ajude você a pensar melhor, me avise. Use recursos disponíveis se necessário. Depois entregue ideias práticas e acionáveis.",
        },
    ],
    plan: [
        {
            id: "content-strategy",
            category: "plan",
            title: "Planejamento Estratégico de Conteúdo",
            prompt: "Oi OpenDraft! Quero montar um planejamento estratégico de conteúdo. Se precisar entender melhor meu nicho ou objetivo, me faça perguntas agora. Se algum material puder melhorar o planejamento, me avise. Use ferramentas disponíveis se fizer sentido. Depois organize um plano claro e aplicável.",
        },
        {
            id: "social-storytelling",
            category: "plan",
            title: "Storytelling para Redes Sociais",
            prompt: "Oi OpenDraft! Quero estruturar melhor meu storytelling nas redes sociais. Se faltar contexto, me faça perguntas estratégicas agora. Caso eu possa enviar algo que ajude você a construir isso melhor, me avise. Use recursos disponíveis se necessário. Em seguida, desenvolva uma estrutura prática e estratégica.",
        },
        {
            id: "converting-profile",
            category: "plan",
            title: "Perfil que Converte Seguidores",
            prompt: "Oi OpenDraft! Quero transformar meu perfil em algo que realmente converte seguidores em clientes. Se precisar de mais informações, me faça perguntas agora. Se algum material ajudar você a analisar melhor, me avise. Utilize ferramentas disponíveis se necessário. Depois entregue melhorias claras e estratégicas.",
        },
        {
            id: "editorial-calendar",
            category: "plan",
            title: "Calendário Editorial Estratégico",
            prompt: "Oi OpenDraft! Preciso organizar meu conteúdo em um calendário estratégico. Se precisar entender melhor minha rotina ou objetivo, me faça perguntas agora. Caso algum documento ajude, me avise. Use ferramentas disponíveis se fizer sentido. Depois crie um plano estruturado e aplicável.",
        },
    ],
    analyze: [
        {
            id: "analyze-creative",
            category: "analyze",
            title: "Analisar Criativo para Conversão",
            prompt: "Oi OpenDraft! Vou enviar um criativo para análise. Se precisar de contexto adicional antes de avaliar, me faça perguntas agora. Se algum material complementar ajudar, me avise. Use ferramentas disponíveis se necessário. Depois entregue uma análise estratégica focada em conversão.",
        },
        {
            id: "analyze-sales-page",
            category: "analyze",
            title: "Analisar Página de Vendas",
            prompt: "Oi OpenDraft! Vou enviar uma página de vendas para análise estratégica. Se faltar contexto, me faça perguntas agora. Caso eu deva enviar mais informações, me avise. Use recursos disponíveis se necessário. Depois entregue uma análise clara e orientada para melhoria de conversão.",
        },
        {
            id: "vsl-diagnosis",
            category: "analyze",
            title: "Diagnóstico de VSL",
            prompt: "Oi OpenDraft! Vou enviar uma VSL para diagnóstico estratégico. Se precisar entender melhor público ou oferta, me faça perguntas agora. Caso algum material ajude na análise, me avise. Use ferramentas disponíveis se fizer sentido. Depois entregue sugestões práticas de melhoria.",
        },
        {
            id: "copy-review",
            category: "analyze",
            title: "Revisão Estratégica de Copy",
            prompt: "Oi OpenDraft! Vou enviar uma copy para revisão estratégica. Se faltar informação para avaliar corretamente, me faça perguntas agora. Caso eu deva enviar algo complementar, me avise. Use ferramentas disponíveis se necessário. Depois entregue melhorias claras e orientadas para conversão.",
        },
    ],
};

export const PILL_CONFIG = {
    write: {
        label: "Escrever",
        icon: "Pen01Icon",
        emoji: "✍️",
    },
    ideas: {
        label: "Ter ideias",
        icon: "Lightbulb",
        emoji: "💡",
    },
    plan: {
        label: "Planejar conteúdo",
        icon: "CalendarClock",
        emoji: "📅",
    },
    analyze: {
        label: "Analisar texto",
        icon: "Search",
        emoji: "🔎",
    },
} as const;
