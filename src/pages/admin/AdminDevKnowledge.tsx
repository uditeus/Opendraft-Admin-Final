import * as React from "react";
import { AppIcon } from "@/components/icons/AppIcon";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminDevKnowledge() {
    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-8">
                <div>
                    <h1 className="text-4xl  font-normal text-foreground tracking-tight">Knowledge Base</h1>
                    <p className="text-sm text-muted-foreground mt-2">Gestão de vetores, documentos e contexto de RAG.</p>
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

            <div className="w-full flex-1 flex flex-col items-center justify-center py-32 text-center">
                <div className="h-16 w-16 rounded-2xl bg-foreground/5 flex items-center justify-center mb-10 border border-border/10">
                    <AppIcon name="DatabaseIcon" className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="text-2xl  font-normal text-foreground mb-4">Knowledge Base (RAG)</h3>
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">Gerencie os documentos e índices vetoriais utilizados pela IA para compor o contexto das respostas.</p>
            </div>
        </div>
    );
}
