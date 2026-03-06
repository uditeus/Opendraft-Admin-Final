export type TimePromptPeriod = "morning" | "afternoon" | "night" | "late";

// 24-hour headline mapping (0-23)
const HOURLY_HEADLINES: Record<number, string> = {
  0: "Ainda escrevendo, {nome}?",
  1: "Ideias não dormem",
  2: "Criando no silêncio",
  3: "Sua mente acesa, {nome}?",
  4: "Pensamentos viram copy",
  5: "Antes do mundo acordar",
  6: "Vamos escrever hoje, {nome}?",
  7: "Hora de construir ideias",
  8: "Primeira copy do dia",
  9: "O que vamos criar, {nome}?",
  10: "Coloque suas ideias no papel",
  11: "Sua mensagem ganha forma",
  12: "Escrevendo enquanto o mundo corre",
  13: "Vamos estruturar isso, {nome}?",
  14: "Transforme pensamento em texto",
  15: "Hora de lapidar sua copy",
  16: "Sua narrativa começa agora",
  17: "Reflexões ao entardecer",
  18: "Sua copy toma forma, {nome}?",
  19: "Ainda criando, {nome}?",
  20: "Ideias ganham força aqui",
  21: "Vamos escrever algo grande?",
  22: "Sua mente ainda cria, {nome}?",
  23: "Dinheiro nasce no silêncio",
};


export const PILL_CONFIG = {
  write: {
    headline: "Vamos escrever algo estratégico.",
    placeholder: "Descreva o público, a oferta e o objetivo da copy…",
  },
  ideas: {
    headline: "Vamos gerar ideias que fazem sentido.",
    placeholder: "Sobre qual nicho ou produto você quer ideias?",
  },
  plan: {
    headline: "Vamos estruturar isso do jeito certo.",
    placeholder: "Qual é o objetivo do conteúdo e para qual plataforma?",
  },
  analyze: {
    headline: "Vamos melhorar esse texto.",
    placeholder: "Cole aqui a copy que você quer analisar…",
  },
} as const;

/**
 * Get the headline for the current hour (0-23) based on user's local time.
 * Includes user name where applicable, or removes the placeholder if no name.
 */
export function getHourlyHeadline(userName: string | null = null): string {
  const now = new Date();
  const hour = now.getHours();

  let headline = HOURLY_HEADLINES[hour] || HOURLY_HEADLINES[0];

  // If headline contains {nome} placeholder
  if (headline.includes("{nome}")) {
    if (userName) {
      // Replace {nome} with actual name
      headline = headline.replace("{nome}", userName);
    } else {
      // Remove {nome} and the preceding comma/space
      headline = headline.replace(", {nome}", "").replace(" {nome}", "");
    }
  }

  return headline;
}

export function getPeriodByHour(hour: number): TimePromptPeriod {
  if (hour >= 5 && hour <= 11) return "morning";
  if (hour >= 12 && hour <= 17) return "afternoon";
  if (hour >= 18 && hour <= 23) return "night";
  return "late";
}

