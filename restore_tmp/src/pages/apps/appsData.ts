export type AppCategory =
  | "Geral"
  | "WhatsApp"
  | "Criativos"
  | "Threads"
  | "Vendas"
  | "Instagram"
  | "Email";

export type AppItem = {
  id: string;
  name: string;
  description: string;
  category: AppCategory;
  initials: string;
  image?: string;
  /** Descrição mais longa para a página de detalhes */
  longDescription?: string;
  info?: {
    categoryLabel?: string;
    capabilities?: string;
    site?: string;
    version?: string;
  };
};

export const categories: AppCategory[] = [
  "Geral",
  "WhatsApp",
  "Criativos",
  "Threads",
  "Vendas",
  "Instagram",
  "Email",
];



export const apps: AppItem[] = [
  {
    id: "whatsapp-x1",
    name: "WhatsApp X1",
    description: "Venda direta e conversão no WhatsApp",
    category: "WhatsApp",
    initials: "WX",
    image: "https://i.imgur.com/Q3Uoxoi.png",
    longDescription:
      "O WhatsApp X1 é focado em conversão direta. Estruturas de mensagens, ganchos e scripts validados para transformar contatos em clientes rapidamente.",
    info: {
      categoryLabel: "WhatsApp",
      capabilities: "Vendas Diretas",
      version: "1.0.0",
    },
  },
  {
    id: "criativo-ugc",
    name: "Criativo UGC",
    description: "Roteiros de UGC que convertem",
    category: "Criativos",
    initials: "UG",
    image: "https://i.imgur.com/UTCu7QR.png",
    longDescription:
      "Crie roteiros de User Generated Content (UGC) focados em conversão. Estruturas validadas para ganchos, corpo do vídeo e chamadas para ação.",
    info: {
      categoryLabel: "Criativos",
      capabilities: "Roteirização",
      version: "1.0.0",
    },
  },
  {
    id: "thread-twitter",
    name: "Thread Twitter",
    description: "Threads virais e educativas",
    category: "Threads",
    initials: "TT",
    image: "https://i.imgur.com/uEUzLp9.png",
    longDescription:
      "Crie threads completas com estilos diferentes (viral, opinativo, educativo, autoridade). Estruturas pensadas para retenção e engajamento no X/Twitter.",
    info: {
      categoryLabel: "Threads",
      capabilities: "Estrutura",
      version: "1.0.0",
    },
  },
  {
    id: "funil-de-vendas",
    name: "Construtor de Funil de Vendas",
    description: "Estratégia e estrutura de funis",
    category: "Vendas",
    initials: "FV",
    image: "https://i.imgur.com/gLfFbPF.png",
    longDescription:
      "Desenvolva funis de vendas de alta conversão. Planeje cada etapa da jornada do cliente, desde o primeiro contato até o fechamento.",
    info: {
      categoryLabel: "Vendas",
      capabilities: "Estratégia",
      version: "1.0.0",
    },
  },
  {
    id: "reels-instagram",
    name: "Reels de Crescimento Instagram",
    description: "Roteiros virais para o Instagram",
    category: "Instagram",
    initials: "RI",
    image: "https://i.imgur.com/5urT1bC.png",
    longDescription:
      "Roteiros otimizados para Reels com foco em crescimento orgânico e autoridade. Estruturas que retêm a atenção e incentivam a interação.",
    info: {
      categoryLabel: "Instagram",
      capabilities: "Crescimento",
      version: "1.0.0",
    },
  },
  {
    id: "email-marketing",
    name: "E-mail marketing",
    description: "Sequências e campanhas de e-mail",
    category: "Email",
    initials: "EM",
    image: "https://i.imgur.com/ipkTgrv.png",
    longDescription:
      "Crie campanhas de e-mail marketing persuasivas. Sequências de boas-vindas, nutrição e vendas com foco em entregabilidade e cliques.",
    info: {
      categoryLabel: "Email",
      capabilities: "Copywriting",
      version: "1.0.0",
    },
  },
  {
    id: "sequencia-stories",
    name: "Sequência de Stories com Storytelling",
    description: "Narrativas envolventes para Stories",
    category: "Instagram",
    initials: "SS",
    image: "https://i.imgur.com/0PhDG8T.png",
    longDescription:
      "Crie sequências de stories que prendem a atenção usando técnicas de storytelling. Estruturas validadas para gerar conexão e desejo de compra.",
    info: {
      categoryLabel: "Instagram",
      capabilities: "Engajamento",
      version: "1.0.0",
    },
  },
  {
    id: "text-sales-letter",
    name: "Text Sales Letter",
    description: "Cartas de vendas focadas em conversão",
    category: "Vendas",
    initials: "TS",
    image: "https://i.imgur.com/ngjMpah.png",
    longDescription:
      "Estruture cartas de vendas (TSL) persuasivas. Foco total em copy direta, quebra de objeções e condução para o fechamento.",
    info: {
      categoryLabel: "Vendas",
      capabilities: "Vendas Diretas",
      version: "1.0.0",
    },
  },
  {
    id: "tiktok-shop",
    name: "Construtor de Roteiro para TikTok Shop",
    description: "Roteiros para vender no TikTok",
    category: "Criativos",
    initials: "TS",
    image: "https://i.imgur.com/lDveRUA.png",
    longDescription:
      "Crie roteiros específicos para TikTok Shop. Estruturas focadas em demonstração de produto, prova social e chamadas para ação integradas.",
    info: {
      categoryLabel: "Criativos",
      capabilities: "Roteirização",
      version: "1.0.0",
    },
  },
  {
    id: "video-sales-letter",
    name: "Video Sales Letter (VSL)",
    description: "Roteiros de vídeo para alta conversão",
    category: "Vendas",
    initials: "VS",
    image: "https://i.imgur.com/OgWmWBn.png",
    longDescription:
      "Crie roteiros de VSL (Video Sales Letter) altamente persuasivos. Estruturas validadas para prender a atenção e conduzir o espectador até a compra.",
    info: {
      categoryLabel: "Vendas",
      capabilities: "Conversão em Vídeo",
      version: "1.0.0",
    },
  },
  {
    id: "gerador-de-hooks",
    name: "Gerador de Hooks",
    description: "Ganchos virais para prender a atenção",
    category: "Geral",
    initials: "GH",
    image: "https://i.imgur.com/uTyrl1v.png",
    longDescription:
      "Gere ganchos (hooks) irresistíveis para seus vídeos, anúncios ou textos. Foco total em retenção e curiosidade logo nos primeiros segundos.",
    info: {
      categoryLabel: "Geral",
      capabilities: "Retenção",
      version: "1.0.0",
    },
  },
];


export function getAppById(appId: string) {
  return apps.find((a) => a.id === appId) ?? null;
}
