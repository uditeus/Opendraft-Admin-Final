import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminDevExperiments() {
    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-8">
                <div>
                    <h1 className="text-4xl font-serif font-normal text-foreground tracking-tight">Experiments</h1>
                    <p className="text-sm text-muted-foreground mt-2">Testes A/B, Feature Flags e novas funcionalidades.</p>
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

            <div className="w-full flex-1 flex flex-col items-center justify-center py-32 text-center opacity-40">
                <div className="h-14 w-14 rounded-full bg-muted/20 flex items-center justify-center mb-8">
                    <div className="h-2 w-2 rounded-full bg-foreground shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
                </div>
                <h4 className="text-xl font-serif font-normal text-foreground mb-4">Nenhum experimento ativo no momento.</h4>
                <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">Você poderá criar experimentos para testar novas personas e prompts em breve.</p>
            </div>
        </div>
    );
}
