import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    label: string;
    value: string;
    subValue?: string;
}

function StatCard({ label, value, subValue }: StatCardProps) {
    return (
        <div className="flex flex-col gap-1 rounded-2xl border border-border/40 bg-muted/10 p-5 transition-all h-[120px] justify-between">
            <div className="min-h-[32px] flex items-start">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] leading-tight">{label}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tabular-nums tracking-tighter text-foreground">{value}</span>
                {subValue && <span className="text-[10px] text-muted-foreground font-medium">{subValue}</span>}
            </div>
        </div>
    );
}

export function UsageStats() {
    const totalCredits = "0";
    const usedCredits = "0";
    const remainingCredits = "0";

    return (
        <div className="space-y-8 py-2">
            {/* Stat Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="Créditos totais" value={totalCredits} />
                <StatCard label="Créditos usados" value={usedCredits} />
                <StatCard label="Créditos restantes" value={remainingCredits} />
            </div>

            {/* Usage Chart Section (Dashed Empty State) */}
            <div className="rounded-2xl border border-dashed border-border/60 bg-muted/5 p-8 transition-all">
                <div className="mb-12 flex items-center justify-between">
                    <div>
                        <h3 className="text-[13px] font-bold text-foreground uppercase tracking-widest">Consumo Semanal</h3>
                        <p className="text-[11px] text-muted-foreground mt-1">O histórico de uso será exibido aqui conforme você utiliza os créditos.</p>
                    </div>
                </div>

                <div className="h-[180px] w-full mt-4 flex flex-col items-center justify-center space-y-4">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-border/40 to-transparent" />
                    <div className="flex flex-col items-center gap-1 opacity-40">
                        <p className="text-[11px] font-bold text-foreground uppercase tracking-[0.2em]">Sem Atividade</p>
                        <p className="text-[10px] text-muted-foreground">Nenhum crédito consumido nos últimos 30 dias</p>
                    </div>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-border/40 to-transparent" />
                </div>
            </div>
        </div>
    );
}
