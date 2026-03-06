import * as React from "react";
import { AppIcon, createAppIcon } from "@/components/icons/AppIcon";

const Pencil = createAppIcon("Pencil");
const MessageCircleQuestion = createAppIcon("MessageCircleQuestion");
const ClipboardList = createAppIcon("ClipboardList");

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SUGGESTIONS: Array<{
  id: string;
  text: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
    { id: "a1", text: "Ajude com minha lição de casa", Icon: Pencil },
    { id: "a2", text: "Explique um assunto para mim", Icon: MessageCircleQuestion },
    { id: "a3", text: "Crie um teste simulado", Icon: ClipboardList },
  ];

export function AnalyzeSuggestionPanel({ onPick }: { onPick: (text: string) => void }) {
  return (
    <section aria-label="Sugestões do modo Analisar" className="mx-auto w-full max-w-3xl px-4">
      <div className="pl-6">
        <ul className="divide-y divide-border/60">
          {SUGGESTIONS.map(({ id, text, Icon }) => (
            <li key={id}>
              <Button
                type="button"
                variant="ghost"
                className={cn(
                  "group h-auto w-full justify-between gap-3 rounded-none px-0 py-3",
                  "bg-transparent hover:bg-transparent active:bg-transparent",
                  "text-foreground/90 hover:text-foreground",
                )}
                onClick={() => onPick(text)}
              >
                <span className="flex min-w-0 items-center gap-3 text-left">
                  <span className="inline-flex h-5 w-5 items-center justify-center">
                    <Icon className="h-4 w-4 opacity-70 transition-opacity group-hover:opacity-90" />
                  </span>
                  <span className="min-w-0 text-[13px] font-medium">
                    <span className="block truncate">{text}</span>
                  </span>
                </span>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
