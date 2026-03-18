import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminDevQueues() {
    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-8">
                <div>
                    <h1 className="text-4xl  font-normal text-foreground tracking-tight">Queues & Workers</h1>
                    <p className="text-sm text-muted-foreground mt-2">Processamento em background e filas de tarefas da IA.</p>
                </div>
            </div>

            <div className="mb-12">
                <AdminSubNav
                    items={[
                        { label: "Prompts & Config", path: "/admin/settings" },
                        { label: "Knowledge Base", path: "/admin/developer/knowledge" },
                        { label: "Experiments", path: "/admin/developer/experiments" },
                        { label: "Queues", path: "/admin/developer/queues" },
                    ]}
                />
            </div>

            <div className="w-full">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/10">
                    <h3 className="text-xl  text-foreground">Status das Filas</h3>
                    <span className="px-3 py-1 rounded-full text-[10px] bg-emerald-500/10 text-emerald-500 font-bold uppercase tracking-widest">OPERACIONAL</span>
                </div>

                <div className="space-y-0 max-w-2xl">
                    <div className="flex justify-between items-center py-6 border-b border-border/10">
                        <span className="text-sm font-semibold text-foreground">Fila Default</span>
                        <span className="text-xl  tabular-nums text-muted-foreground">0 jobs</span>
                    </div>
                    <div className="flex justify-between items-center py-6 border-b border-border/10">
                        <span className="text-sm font-semibold text-foreground">AI Generations</span>
                        <div className="flex items-center gap-4">
                            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-xl  tabular-nums text-foreground">12 jobs pending</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center py-6 border-b border-border/10">
                        <span className="text-sm font-semibold text-foreground">Email Workers</span>
                        <span className="text-xl  tabular-nums text-muted-foreground">0 jobs</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
