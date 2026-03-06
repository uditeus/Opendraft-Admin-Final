import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { AppIcon } from "@/components/icons/AppIcon";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAppById } from "./appsData";
import { ConnectAppDialog } from "./ConnectAppDialog";
import { useI18n } from "@/i18n/i18n";
import { GLOBAL_IMAGE_URL } from "@/lib/constants";

function InfoRow({ label, value, href }: { label: string; value?: string; href?: string }) {
  return (
    <div className="grid grid-cols-2 gap-6 py-3">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:underline">
            {value}
            <AppIcon name="ExternalLink" className="h-4 w-4 opacity-70" />
          </a>
        ) : (
          value ?? "—"
        )}
      </div>
    </div>
  );
}

export default function AppDetailsPage() {
  const { tt } = useI18n();
  const { appId } = useParams();
  const [connectOpen, setConnectOpen] = React.useState(false);

  const app = React.useMemo(() => (appId ? getAppById(appId) : null), [appId]);

  if (!app) {
    return (
      <div className="mx-auto w-full max-w-5xl px-5 pb-16 pt-16">
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/playbooks" className="hover:underline">
              {tt("Playbooks", "Playbooks")}
            </Link>
            <AppIcon name="ChevronRight" className="h-4 w-4 opacity-70" />
            <span className="text-foreground">{tt("Desconhecido", "Unknown")}</span>
          </div>
          <h1 className="text-2xl font-semibold">{tt("Playbook não encontrado", "Playbook not found")}</h1>
        </header>
      </div>
    );
  }

  const info = app.info;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-16 pt-16">
      <header className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/playbooks" className="hover:underline">
            {tt("Playbooks", "Playbooks")}
          </Link>
          <AppIcon name="ChevronRight" className="h-4 w-4 opacity-70" />
          <span className="text-foreground">{app.name}</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "grid h-12 w-12 shrink-0 place-items-center rounded-full",
                "bg-[hsl(var(--chat-active))] text-lg font-semibold text-foreground",
              )}
              aria-hidden
            >
              {app.initials}
            </div>
            <div>
              <h1 className="text-3xl font-semibold leading-tight">{app.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{app.description}</p>
            </div>
          </div>

          <Button variant="secondary" className="rounded-full px-6" onClick={() => setConnectOpen(true)}>
            {tt("Conectar", "Connect")}
          </Button>
        </div>
      </header>

      <ConnectAppDialog
        open={connectOpen}
        onOpenChange={setConnectOpen}
        appName={app.name}
        appDescription={app.description}
        imageAlt={tt("Exemplo de interação", "Interaction example")}
      />

      <main className="mt-10">
        <section
          className={cn(
            "relative overflow-hidden rounded-2xl",
            "bg-muted/40",
            "shadow-elev-2",
          )}
        >
          <div className="grid gap-5 p-7 sm:p-8 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "relative overflow-hidden rounded-2xl border border-border/40 bg-background/40",
                  "backdrop-blur-sm",
                )}
              >
                <div className="p-4">
                  <div className="rounded-xl bg-background/70 p-3 text-xs text-muted-foreground">
                    {i === 0
                      ? tt(`@${app.name} blur the background`, `@${app.name} blur the background`)
                      : i === 1
                        ? tt(`@${app.name} apply an artistic effect`, `@${app.name} apply an artistic effect`)
                        : tt(`@${app.name} what effects are available?`, `@${app.name} what effects are available?`)}
                  </div>
                  <div className="mt-3 overflow-hidden rounded-xl border border-border/40 bg-background">
                    <img
                      src={GLOBAL_IMAGE_URL}
                      alt={tt("Exemplo de interação", "Interaction example")}
                      loading="lazy"
                      className="h-56 w-full object-cover opacity-80"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>


        </section>

        <section className="mt-10">
          <p className="max-w-3xl text-sm leading-relaxed text-foreground/90">{app.longDescription ?? app.description}</p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold">{tt("Informação", "Information")}</h2>
          <Separator className="mt-4" />
          <div className="divide-y divide-border/50">
            <InfoRow label={tt("Categoria", "Category")} value={info?.categoryLabel} />
            <InfoRow label={tt("Capacidades", "Capabilities")} value={info?.capabilities} />
            <InfoRow label={tt("Site", "Website")} value={info?.site ? tt("Abrir", "Open") : undefined} href={info?.site} />
            <InfoRow label={tt("Versão", "Version")} value={info?.version} />
          </div>
        </section>
      </main>
    </div>
  );
}
