import * as React from "react";
import { Check } from "@/components/icons/lucide";

import { cn } from "@/lib/utils";

type GuideId = "objective" | "audience" | "offer" | "angle" | "structure";

const GUIDES: Array<{ id: GuideId; label: string }> = [
  { id: "objective", label: "Objetivo" },
  { id: "audience", label: "Público" },
  { id: "offer", label: "Oferta" },
  { id: "angle", label: "Ângulo" },
  { id: "structure", label: "Estrutura" },
];

export function CopyGuidesBar({
  value,
}: {
  value: GuideId[];
}) {
  const selected = React.useMemo(() => new Set(value), [value]);

  return (
    <section aria-label="Guias para escrever copy" className="mx-auto w-full max-w-3xl px-4">
      <div className="flex flex-wrap items-center justify-start gap-2 pl-10">
        {GUIDES.map((g) => {
          const isOn = selected.has(g.id);
          return (
            <div
              key={g.id}
              className={cn(
                "group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm",
                "bg-[hsl(var(--chat-composer))] text-foreground/70 shadow-elev-1",
                "hover:text-foreground",
                "transition-colors",
                "select-none",
                isOn && "text-foreground",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-4 w-4 items-center justify-center rounded-full",
                  "bg-background/0 shadow-elev-1",
                  "opacity-70 transition-opacity group-hover:opacity-90",
                  isOn && "opacity-100",
                )}
                aria-hidden="true"
              >
                <Check className={cn("h-3.5 w-3.5 transition-opacity", isOn ? "opacity-100" : "opacity-60")} />
              </span>
              <span className="font-medium leading-none">{g.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
