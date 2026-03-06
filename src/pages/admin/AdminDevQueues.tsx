import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminDevQueues() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">Queues & Workers</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Processamento em background e filas de tarefas da IA</p>
            </div>

            <AdminSubNav
                items={[
                    { label: "Prompts & Config", path: "/admin/settings" },
                    { label: "Knowledge Base", path: "/admin/developer/knowledge" },
                    { label: "Experiments", path: "/admin/developer/experiments" },
                    { label: "Queues", path: "/admin/developer/queues" },
                ]}
            />

            <div className="rounded-xl border border-border/50 bg-card shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                    <h4 className="text-[16px] font-bold text-foreground">Status das Filas</h4>
                    <span className="px-3 py-1 rounded-full text-[10px] bg-emerald-500/10 text-emerald-500 font-bold uppercase tracking-widest shadow-sm">OPERACIONAL</span>
                </div>
                <div className="space-y-4 max-w-xl">
                    <div className="flex justify-between items-center py-3 border-b border-border/30">
                        <span className="text-[13px] font-bold text-foreground/80">Fila Default</span>
                        <span className="text-[13px] font-bold tabular-nums text-muted-foreground/60">0 jobs</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border/30">
                        <span className="text-[13px] font-bold text-foreground/80">AI Generations</span>
                        <div className="flex items-center gap-3">
                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-[13px] font-bold tabular-nums text-[#3E768D]">12 jobs pending</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border/30">
                        <span className="text-[13px] font-bold text-foreground/80">Email Workers</span>
                        <span className="text-[13px] font-bold tabular-nums text-muted-foreground/60">0 jobs</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
