import { QuestionnaireData } from "@/components/chat/types";

export const QUESTIONNAIRES: Record<string, QuestionnaireData> = {
    "creative-ads": {
        steps: [
            {
                id: "product",
                question: "Qual é o produto ou serviço?",
                type: "single",
                options: [
                    { id: "digital", label: "Produto Digital (Curso, Ebook)", value: "digital" },
                    { id: "physical", label: "Produto Físico", value: "physical" },
                    { id: "service", label: "Serviço / Consultoria", value: "service" },
                    { id: "saas", label: "Software / App (SaaS)", value: "saas" },
                ],
                allowCustom: true,
            },
            {
                id: "objective",
                question: "Qual o objetivo principal do anúncio?",
                type: "single",
                options: [
                    { id: "sales", label: "Venda Direta", value: "sales" },
                    { id: "leads", label: "Captura de Leads", value: "leads" },
                    { id: "awareness", label: "Reconhecimento de Marca", value: "awareness" },
                    { id: "remarketing", label: "Remarketing / Recuperação", value: "remarketing" },
                ],
            },
            {
                id: "audience",
                question: "Qual o nível de consciência do público?",
                type: "single",
                options: [
                    { id: "cold", label: "Frio (Não te conhece, não sabe do problema)", value: "cold" },
                    { id: "problem_aware", label: "Consciente do Problema (Sabe que tem dor, busca solução)", value: "problem_aware" },
                    { id: "solution_aware", label: "Consciente da Solução (Conhece soluções, compara opções)", value: "solution_aware" },
                    { id: "product_aware", label: "Consciente do Produto (Te conhece, falta oferta)", value: "product_aware" },
                ],
            },
        ],
    },
    "youtube-script": {
        steps: [
            {
                id: "topic",
                question: "Qual é o tema central do vídeo?",
                type: "single",
                options: [
                    { id: "tutorial", label: "Tutorial / How-to", value: "tutorial" },
                    { id: "review", label: "Review / Análise", value: "review" },
                    { id: "vlog", label: "Vlog / Bastidores", value: "vlog" },
                    { id: "educational", label: "Educativo / Conceitual", value: "educational" },
                ],
                allowCustom: true,
            },
            {
                id: "goal",
                question: "Qual a chamada para ação (CTA) principal?",
                type: "single",
                options: [
                    { id: "subscribe", label: "Inscrever-se no canal", value: "subscribe" },
                    { id: "link", label: "Clicar no link da descrição", value: "click_link" },
                    { id: "comment", label: "Comentar / Engajar", value: "comment" },
                ],
                allowCustom: true,
            },
        ]
    },
    // Add more as needed
};
