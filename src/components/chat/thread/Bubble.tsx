import * as React from "react";

import { cn } from "@/lib/utils";

export function Bubble({
  role,
  children,
  actions,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <div className={cn("flex py-4 group/bubble", role === "user" ? "justify-end" : "justify-start")}>
        <div className={cn("min-w-0", role === "user" ? "max-w-[92%]" : "w-full")}>
          <div className="animate-fade-in">
            <div className={cn(role === "assistant" && "pl-7")}>
              <div
                data-selection-area="chat"
                className={cn(
                  "relative min-h-[40px] flex flex-col justify-center",
                  role === "user"
                    ? "items-end rounded-xl !rounded-br-none bg-[hsl(var(--chat-hover))] px-5 py-2.5 shadow-sm w-fit ml-auto"
                    : "items-start",
                )}
              >
                {children}
              </div>
              {actions}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
