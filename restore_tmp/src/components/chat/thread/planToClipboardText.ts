import type { ChatPlanData } from "@/components/chat/types";

export function planToClipboardText(p: ChatPlanData) {
  const parts = [
    `Ângulo: ${p.angle}`,
    `Estrutura: ${p.structure}`,
    `Público: ${p.audience}`,
    `Oferta: ${p.offer}`,
    `Objetivo: ${p.objective}`,
    p.channel ? `Canal: ${p.channel}` : null,
  ].filter(Boolean);
  return parts.join("\n");
}
