import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminDevExperiments() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">Experiments</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Testes A/B, Feature Flags e novas funcionalidades</p>
            </div>

            <AdminSubNav
                items={[
                    { label: "Prompts & Config", path: "/admin/settings" },
                    { label: "Knowledge Base", path: "/admin/developer/knowledge" },
                    { label: "Experiments", path: "/admin/developer/experiments" },
                    { label: "Queues", path: "/admin/developer/queues" },
                ]}
            />

            <div className="p-12 rounded-xl border border-border/50 bg-card shadow-sm flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                </div>
                <h4 className="text-[15px] font-bold text-foreground/40 italic">Nenhum experimento ativo no momento.</h4>
                <p className="text-[13px] text-muted-foreground/50 mt-1 max-w-xs font-medium">Você poderá criar experimentos para testar novas personas e prompts em breve.</p>
            </div>
        </div>
    );
}
