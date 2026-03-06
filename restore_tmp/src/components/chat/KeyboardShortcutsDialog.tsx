import * as React from "react";
import { AppIcon } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Shortcut = {
  labelPt: string;
  labelEn: string;
  keys: string;
};

type ShortcutSection = {
  titlePt: string;
  titleEn: string;
  items: Shortcut[];
};

const sections: ShortcutSection[] = [
  {
    titlePt: "Geral",
    titleEn: "General",
    items: [
      { labelPt: "Buscar em chats", labelEn: "Search chats", keys: "Ctrl + K" },
      { labelPt: "Abrir novo chat", labelEn: "Open new chat", keys: "Ctrl + Shift + O" },
      { labelPt: "Alternar barra lateral", labelEn: "Toggle sidebar", keys: "Ctrl + Shift + S" },
    ],
  },
  {
    titlePt: "Chat",
    titleEn: "Chat",
    items: [
      {
        labelPt: "Copiar último bloco de código",
        labelEn: "Copy last code block",
        keys: "Ctrl + Shift + ;",
      },
      { labelPt: "Próxima mensagem", labelEn: "Next message", keys: "Shift + ↓" },
      { labelPt: "Mensagem anterior", labelEn: "Previous message", keys: "Shift + ↑" },
    ],
  },
  {
    titlePt: "Configurações",
    titleEn: "Settings",
    items: [
      { labelPt: "Alternar modo desenvolvedor", labelEn: "Toggle developer mode", keys: "Ctrl + ." },
      { labelPt: "Mostrar atalhos", labelEn: "Show shortcuts", keys: "Ctrl + /" },
      {
        labelPt: "Definir instruções personalizadas",
        labelEn: "Set custom instructions",
        keys: "Ctrl + Shift + I",
      },
    ],
  },
];

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { tt } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>
            {tt("Atalhos de teclado", "Keyboard shortcuts")}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-8 pt-2">
          {sections.map((section) => (
            <div key={section.titleEn} className="py-2">
              <div className="pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                {tt(section.titlePt, section.titleEn)}
              </div>
              <div className="divide-y divide-border/40">
                {section.items.map((it) => (
                  <div key={it.labelEn} className="flex items-center justify-between gap-4 py-2.5">
                    <div className="text-[14px] text-foreground/90">{tt(it.labelPt, it.labelEn)}</div>
                    <div className="shrink-0 flex gap-1">
                      {it.keys.split(" + ").map((key, i) => (
                        <React.Fragment key={key}>
                          <kbd className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded bg-muted border border-border/60 text-[10px] font-medium text-muted-foreground">
                            {key}
                          </kbd>
                          {i < it.keys.split(" + ").length - 1 && <span className="text-[10px] text-muted-foreground/50 self-center">+</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
