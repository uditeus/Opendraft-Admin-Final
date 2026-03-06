import * as React from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function ChatTooltipBody({ label, shortcut }: { label: string; shortcut?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="whitespace-nowrap text-xs font-medium leading-4">{label}</span>
      {shortcut ? (
        <span
          className={cn(
            "rounded-[6px] px-1.5 py-0.5 text-[11px] font-medium leading-3",
            "bg-[hsl(var(--chat-tooltip-key-bg))] text-[hsl(var(--chat-tooltip-key-fg))]",
          )}
        >
          {shortcut}
        </span>
      ) : null}
    </div>
  );
}

export function ChatTooltipContent({
  label,
  shortcut,
  className,
  sideOffset = 8,
  side = "top",
  align = "center",
}: {
  label: string;
  shortcut?: string;
  className?: string;
  sideOffset?: number;
  side?: React.ComponentProps<typeof TooltipContent>["side"];
  align?: React.ComponentProps<typeof TooltipContent>["align"];
}) {
  return (
    <TooltipContent
      side={side}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "border-0 px-3 py-2 shadow-chat-elev",
        "rounded-xl bg-[hsl(var(--chat-tooltip-bg))] text-[hsl(var(--chat-tooltip-fg))]",
        className,
      )}
    >
      <ChatTooltipBody label={label} shortcut={shortcut} />
    </TooltipContent>
  );
}

export function ChatTooltip({
  label,
  shortcut,
  children,
  delayDuration = 250,
  side,
  align,
  sideOffset,
  open,
  onOpenChange,
}: {
  label: string;
  shortcut?: string;
  children: React.ReactNode;
  delayDuration?: number;
  side?: React.ComponentProps<typeof TooltipContent>["side"];
  align?: React.ComponentProps<typeof TooltipContent>["align"];
  sideOffset?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Tooltip delayDuration={delayDuration} open={open} onOpenChange={onOpenChange}>
      {/*
        TooltipTrigger com `asChild` injeta `ref` no filho.
        Para evitar warnings quando o filho é um componente que não forwardRef,
        sempre envolvemos em um elemento DOM (span) que aceita ref.
      */}
      <TooltipTrigger asChild>
        <span className="inline-flex">{children}</span>
      </TooltipTrigger>
      <ChatTooltipContent
        label={label}
        shortcut={shortcut}
        side={side}
        align={align}
        sideOffset={sideOffset}
      />
    </Tooltip>
  );
}
