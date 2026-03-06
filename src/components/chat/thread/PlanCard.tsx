import * as React from "react";
import { Lightbulb, Play } from "@/components/icons/lucide";

import type { ChatPlanData } from "@/components/chat/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function PlanCard({
  plan,
  onApprove,
  onRegenerate,
}: {
  plan: ChatPlanData;
  onApprove?: () => void;
  onRegenerate?: () => void;
}) {
  const Row = ({ label, value, clamp = true }: { label: string; value: string; clamp?: boolean }) => (
    <div className="grid grid-cols-[96px_1fr] items-center gap-3 sm:grid-cols-[120px_1fr]">
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={clamp ? "min-w-0 truncate whitespace-nowrap text-[13px] font-medium text-foreground" : "min-w-0 text-[13px] font-medium text-foreground"}>
        {value}
      </div>
    </div>
  );

  return (
    <Card className="shadow-elev-1">
      <CardContent className="p-4 sm:p-5">
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold leading-5 text-foreground">Plano</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Revise e aprove para abrir o Workspace.</p>
          </div>
        </header>

        <section aria-label="Resumo do plano" className="mt-4">
          <dl className="space-y-2">
            <Row label="Ângulo" value={plan.angle} />
            <Row label="Estrutura" value={plan.structure} />
            <Row label="Público" value={plan.audience} />
            <Row label="Oferta" value={plan.offer} />
            <Row label="Objetivo" value={plan.objective} />
            {plan.channel ? <Row label="Canal" value={plan.channel} /> : null}
          </dl>
        </section>

        <div className="mt-4">
          <Button
            variant="chatPrimary"
            className="h-10 w-full rounded-lg text-sm"
            type="button"
            onClick={onApprove}
          >
            <Play className="opacity-90" />
            Aprovar plano
          </Button>

          <div className="mt-3 flex min-w-0 items-start gap-2 text-xs text-muted-foreground">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="min-w-0 leading-5 sm:truncate sm:whitespace-nowrap">
              Ao aprovar, você “trava” o plano e começa a execução no Workspace.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
