import * as React from "react";
import { AppIcon, createAppIcon } from "@/components/icons/AppIcon";

const Sparkles = createAppIcon("Sparkles");
const FileText = createAppIcon("FileText");
const Zap = createAppIcon("Zap");
const Table2 = createAppIcon("Table2");
const Presentation = createAppIcon("Presentation");
const BarChart3 = createAppIcon("BarChart3");

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type TabId = "suggestions" | "reports" | "actions" | "sheets" | "presentations";

const TABS: Array<{ id: TabId; label: string; Icon: React.ComponentType<{ className?: string }> }> = [
  { id: "suggestions", label: "Sugestões", Icon: Sparkles },
  { id: "reports", label: "Relatórios", Icon: FileText },
  { id: "actions", label: "Ações", Icon: Zap },
  { id: "sheets", label: "Planilhas", Icon: Table2 },
  { id: "presentations", label: "Apresentações", Icon: Presentation },
];

const PROMPTS: Record<TabId, Array<{ id: string; text: string; Icon: React.ComponentType<{ className?: string }> }>> = {
  suggestions: [
    { id: "s1", text: "Montar um modelo de fluxo de caixa descontado para uma empresa de energia", Icon: BarChart3 },
    { id: "s2", text: "Reservar pousada em Paraty com critérios via Agoda", Icon: Sparkles },
    { id: "s3", text: "Analisar veículos elétricos compactos e SUVs híbridos com preço abaixo de US$ 4…", Icon: BarChart3 },
    { id: "s4", text: "Revisar e priorizar minha caixa de entrada após as férias", Icon: Sparkles },
  ],
  reports: [
    { id: "r1", text: "Gerar um relatório semanal de performance do time com tópicos e próximos passos", Icon: FileText },
    { id: "r2", text: "Resumir este documento e extrair riscos, decisões e pendências", Icon: FileText },
    { id: "r3", text: "Criar um relatório de concorrência com comparação de features e preços", Icon: FileText },
    { id: "r4", text: "Escrever um post-mortem de incidente com linha do tempo e ações", Icon: FileText },
  ],
  actions: [
    { id: "a1", text: "Criar um plano de ação de 30 dias para aumentar conversão do funil", Icon: Zap },
    { id: "a2", text: "Listar tarefas e checklist para lançar um produto em 2 semanas", Icon: Zap },
    { id: "a3", text: "Definir um roteiro de entrevistas com usuários e critérios de seleção", Icon: Zap },
    { id: "a4", text: "Planejar uma agenda de estudos com metas semanais e revisões", Icon: Zap },
  ],
  sheets: [
    { id: "p1", text: "Montar uma planilha de orçamento mensal com categorias e metas", Icon: Table2 },
    { id: "p2", text: "Criar uma planilha de acompanhamento de projetos com status e donos", Icon: Table2 },
    { id: "p3", text: "Gerar uma tabela comparativa de fornecedores com pesos por critério", Icon: Table2 },
    { id: "p4", text: "Criar um modelo de planilha para controle de estoque com alertas", Icon: Table2 },
  ],
  presentations: [
    { id: "ap1", text: "Criar um roteiro de apresentação de produto com 8 slides", Icon: Presentation },
    { id: "ap2", text: "Transformar este texto em uma apresentação executiva (1 página por tema)", Icon: Presentation },
    { id: "ap3", text: "Montar uma apresentação para convencer stakeholders de uma mudança", Icon: Presentation },
    { id: "ap4", text: "Criar uma apresentação de resultados trimestrais com narrativa", Icon: Presentation },
  ],
};

export function ExplorePromptPanel({ onPickPrompt }: { onPickPrompt: (text: string) => void }) {
  const [active, setActive] = React.useState<TabId>("suggestions");

  return (
    <section aria-label="Sugestões do modo Explorar" className="mx-auto w-full max-w-3xl px-4">
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[15px]",
                "border border-border bg-[hsl(var(--chat-composer))] text-muted-foreground shadow-elev-1",
                "hover:bg-[hsl(var(--chat-hover))]",
                "transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive && "shadow-elev-1",
              )}
              aria-pressed={isActive}
            >
              <Icon className="h-4 w-4 opacity-80" />
              <span className="font-medium leading-none">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-2">
        <div className="w-full">
          <ul className="divide-y divide-border/60">
            {PROMPTS[active].map(({ id, text, Icon }) => (
              <li key={id}>
                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    "group h-auto w-full justify-between gap-3 rounded-none pl-8 pr-4 py-3",
                    "bg-transparent hover:bg-transparent active:bg-transparent",
                    "text-foreground/90 hover:text-foreground",
                  )}
                  onClick={() => onPickPrompt(text)}
                >
                  <span className="flex min-w-0 items-start gap-3 text-left">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center">
                      <Icon className="h-4 w-4 opacity-70 transition-opacity group-hover:opacity-90" />
                    </span>
                    <span className="min-w-0 text-[13px] font-medium text-foreground">
                      <span className="block truncate">{text}</span>
                    </span>
                  </span>

                  <span
                    className={cn(
                      "inline-flex h-7 w-7 items-center justify-center rounded-full",
                      "opacity-60 transition-opacity group-hover:opacity-100",
                    )}
                    aria-hidden="true"
                  >
                    <AppIcon name="ArrowUpRight" className="h-4 w-4" />
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
