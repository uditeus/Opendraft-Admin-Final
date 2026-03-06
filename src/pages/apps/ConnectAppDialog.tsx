import * as React from "react";

import { cn } from "@/lib/utils";
import { GLOBAL_IMAGE_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useI18n } from "@/i18n/i18n";

export function ConnectAppDialog({
  open,
  onOpenChange,
  appName,
  appDescription,
  imageAlt,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appName: string;
  appDescription?: string;
  imageAlt?: string;
}) {
  const { tt } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{tt("Conectar", "Connect")} {appName}</DialogTitle>
          <DialogDescription>
            {appDescription ??
              tt(
                "Revise as permissões e confirme para concluir a conexão.",
                "Review permissions and confirm to finish connecting.",
              )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2 pb-4">
          <section className="space-y-3">
            <h3 className="text-[14px] font-semibold text-foreground">
              {tt("O que acontece ao conectar", "What happens when you connect")}
            </h3>
            <ul className="space-y-2.5 pl-1 text-[13px] text-muted-foreground/90">
              <li className="flex items-start gap-2">
                <div className="mt-1.5 h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" />
                <span>{tt("Habilita acesso ao app dentro do chat.", "Enables access to the app inside chat.")}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5 h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" />
                <span>{tt(`Permite usar comandos e recursos do ${appName}.`, `Lets you use ${appName} commands and features.`)}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5 h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" />
                <span>{tt("Você pode desconectar a qualquer momento.", "You can disconnect at any time.")}</span>
              </li>
            </ul>
          </section>
        </div>

        <DialogFooter>
          <Button variant="outline" className="rounded-xl px-6 h-11 border-border/60" onClick={() => onOpenChange(false)}>
            {tt("Cancelar", "Cancel")}
          </Button>
          <Button className="rounded-xl px-6 h-11 bg-[#949499] hover:bg-[#808085] text-white transition-all shadow-sm border-0" onClick={() => onOpenChange(false)}>
            {tt("Conectar", "Connect")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
