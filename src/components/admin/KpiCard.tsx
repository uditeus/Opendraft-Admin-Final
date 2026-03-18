import * as React from "react";
import { cn } from "@/lib/utils";

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
        <div className="flex flex-col py-2">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
                {icon && <div className="text-muted-foreground/30 scale-75">{icon}</div>}
            </div>
            <span className="text-4xl  font-normal text-foreground tracking-tight">{value}</span>
            {variation !== undefined && (
                <div className="flex items-center gap-1.5 mt-2">
                    <span
                        className={cn(
                            "text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-full",
                            isPositive && "text-emerald-500 bg-emerald-500/10",
                            isNegative && "text-red-500 bg-red-500/10",
                            !isPositive && !isNegative && "text-muted-foreground bg-muted/20",
                        )}
                    >
                        {isPositive ? "+" : ""}{variation}%
                    </span>
                    {variationLabel && (
                        <span className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest">{variationLabel}</span>
                    )}
                </div>
            )}
        </div>
    );
}
