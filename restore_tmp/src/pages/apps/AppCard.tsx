import * as React from "react";

import { cn } from "@/lib/utils";
import type { AppItem } from "./appsData";
import { useI18n } from "@/i18n/i18n";

function MockThumbnail() {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-xl",
        "border border-border/40 bg-muted",
      )}
      aria-hidden
    >
      {/* Light ‘app preview’ frame */}
      <div className={cn("absolute inset-3 rounded-lg", "bg-background/70", "backdrop-blur-sm")}>
        <div className="flex items-center gap-2 px-3 pt-3">
          <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          <div className="ml-auto h-6 w-28 rounded-full bg-muted" />
        </div>

        <div className="px-3 pb-3 pt-4">
          <div className="space-y-2">
            <div className="h-3 w-[70%] rounded bg-muted" />
            <div className="h-3 w-[55%] rounded bg-muted" />
            <div className="h-3 w-[62%] rounded bg-muted" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="h-16 rounded-lg bg-muted" />
            <div className="h-16 rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppCard({ item, onClick }: { item: AppItem; onClick: (item: AppItem) => void }) {
  const { tt } = useI18n();

  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className={cn(
        "group w-full text-left",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "ring-offset-background",
      )}
      aria-label={tt("Abrir playbook", "Open playbook")}
    >
      <div className="space-y-3">
        <div className={cn("aspect-[16/10] overflow-hidden rounded-xl border border-border/40")}>
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <MockThumbnail />
          )}
        </div>
        <div className="space-y-1">
          <div className="truncate text-sm font-semibold text-foreground">{item.name}</div>
        </div>
      </div>
    </button>
  );
}
