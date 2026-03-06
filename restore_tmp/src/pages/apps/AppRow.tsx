import * as React from "react";
import { AppIcon } from "@/components/icons/AppIcon";

import { cn } from "@/lib/utils";
import type { AppItem } from "./appsData";

export function AppRow({ item, onClick }: { item: AppItem; onClick: (item: AppItem) => void }) {
  return (
    <button
      type="button"
      className={cn(
        "chat-focus group relative flex w-full items-center gap-3 rounded-lg py-3 text-left",
        "after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px after:bg-border/50",
      )}
      onClick={() => onClick(item)}
    >
      <div
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-full",
          "bg-[hsl(var(--chat-active))] text-sm font-semibold text-foreground",
        )}
        aria-hidden
      >
        {item.initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-foreground">{item.name}</div>
        <div className="truncate text-xs text-muted-foreground">{item.description}</div>
      </div>
      <AppIcon name="ChevronRight" className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}
