import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Agrupa botões mantendo bordas e raios consistentes.
 * Pode ser aninhado (um ButtonGroup dentro de outro) para criar clusters.
 */
export function ButtonGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center",
        "[&>button]:rounded-none [&>a]:rounded-none",
        "[&>button:first-child]:rounded-l-md [&>a:first-child]:rounded-l-md",
        "[&>button:last-child]:rounded-r-md [&>a:last-child]:rounded-r-md",
        "[&>button+button]:-ml-px [&>a+a]:-ml-px [&>button+a]:-ml-px [&>a+button]:-ml-px",
        className,
      )}
      {...props}
    />
  );
}
