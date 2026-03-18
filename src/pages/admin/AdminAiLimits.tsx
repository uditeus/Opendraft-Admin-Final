import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminAiLimits() {
    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-8">
                <div>
                    <h1 className="text-4xl  font-normal text-foreground tracking-tight">AI Limits</h1>
                    <p className="text-sm text-muted-foreground mt-2">Rate limits e cotas de uso por plano.</p>
                </div>
            </div>

            <div className="mb-12">
                <AdminSubNav
                    items={[
                        { label: "Usage", path: "/admin/api-usage" },
                        { label: "Costs", path: "/admin/api-usage/costs" },
                        { label: "Models", path: "/admin/api-usage/models" },
                        { label: "Limits", path: "/admin/api-usage/limits" },
                    ]}
                />
            </div>

            <div className="w-full">
                <h3 className="text-xl  text-foreground mb-4">Configurações de Rate Limit</h3>
                <p className="text-sm text-muted-foreground mb-12 max-w-2xl">Ajuste os limites globais de requisições por usuário/minuto para cada tier.</p>

                <div className="space-y-0 max-w-2xl border-t border-border/10">
                    <div className="flex justify-between items-center py-6 border-b border-border/10 group">
                        <span className="text-sm font-semibold text-foreground">Tier Free</span>
                        <span className="text-xl  tabular-nums text-foreground">5 req/min</span>
                    </div>
                    <div className="flex justify-between items-center py-6 border-b border-border/10 group">
                        <span className="text-sm font-semibold text-foreground">Tier Pro</span>
                        <span className="text-xl  tabular-nums text-foreground">50 req/min</span>
                    </div>
                    <div className="flex justify-between items-center py-6 border-b border-border/10 group">
                        <span className="text-sm font-semibold text-foreground">Tier Max</span>
                        <span className="text-xl  tabular-nums text-foreground">120 req/min</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
