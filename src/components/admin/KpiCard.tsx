import * as React from "react";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/icons/AppIcon";

interface KpiCardProps {
    label: string;
    value: string;
    icon?: React.ReactNode;
    variation?: number;
    variationLabel?: string;
}

export function KpiCard({ label, value, icon, variation, variationLabel }: KpiCardProps) {
    const isPositive = variation !== undefined && variation > 0;
    const isNegative = variation !== undefined && variation < 0;

    return (
        <div
            className={cn(
                "rounded-xl border border-sidebar-border/40 bg-sidebar-accent/10 p-4 transition-colors hover:bg-sidebar-accent/20",
                "flex flex-col gap-2",
            )}
        >
            <div className="flex items-center gap-2 text-sidebar-foreground/50">
                {icon}
                <span className="text-[12px] font-medium uppercase tracking-wider">{label}</span>
            </div>
            <span className="text-[22px] font-semibold text-foreground tracking-tight">{value}</span>
            {variation !== undefined && (
                <div className="flex items-center gap-1.5">
                    <span
                        className={cn(
                            "flex items-center gap-0.5 text-[12px] font-medium",
                            isPositive && "text-emerald-500",
                            isNegative && "text-red-400",
                            !isPositive && !isNegative && "text-muted-foreground",
                        )}
                    >
                        {isPositive ? "↑" : isNegative ? "↓" : ""}
                        {isPositive ? "+" : ""}
                        {variation}%
                    </span>
                    {variationLabel && (
                        <span className="text-[11px] text-muted-foreground">{variationLabel}</span>
                    )}
                </div>
            )}
        </div>
    );
}
