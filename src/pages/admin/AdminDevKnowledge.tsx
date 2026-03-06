import * as React from "react";
import { AppIcon } from "@/components/icons/AppIcon";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminDevKnowledge() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">Knowledge Base</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Gestão de vetores, documentos e contexto de RAG</p>
            </div>

            <AdminSubNav
                items={[
                    { label: "Prompts & Config", path: "/admin/settings" },
                    { label: "Knowledge Base", path: "/admin/developer/knowledge" },
                    { label: "Experiments", path: "/admin/developer/experiments" },
                    { label: "Queues", path: "/admin/developer/queues" },
                ]}
            />

            <div className="rounded-xl border border-border/50 bg-card shadow-sm p-32 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 rounded-2xl bg-[#3E768D]/10 flex items-center justify-center mb-6 shadow-sm">
                    <AppIcon name="DatabaseIcon" className="h-8 w-8 text-[#3E768D]" />
                </div>
                <h3 className="text-[18px] font-bold text-foreground">Knowledge Base (RAG)</h3>
                <p className="text-[14px] text-muted-foreground mt-2 max-w-sm font-medium">Gerencie os documentos e índices vetoriais utilizados pela IA para compor o contexto das respostas.</p>
            </div>
        </div>
    );
}
