import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminAiLimits() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">AI Limits</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Rate limits e cotas de uso por plano</p>
            </div>

            <AdminSubNav
                items={[
                    { label: "Usage", path: "/admin/api-usage" },
                    { label: "Costs", path: "/admin/api-usage/costs" },
                    { label: "Models", path: "/admin/api-usage/models" },
                    { label: "Limits", path: "/admin/api-usage/limits" },
                ]}
            />

            <div className="p-8 rounded-xl border border-border/50 bg-card shadow-sm">
                <h4 className="text-[16px] font-bold text-foreground">Configurações de Rate Limit</h4>
                <p className="text-[14px] text-muted-foreground mt-1 mb-8 font-medium">Ajuste os limites globais de requisições por usuário/minuto para cada tier.</p>
                <div className="space-y-6 max-w-xl">
                    <div className="flex justify-between items-center text-[13px] border-b border-border/30 pb-4 group">
                        <span className="font-bold text-foreground/80">Tier Free</span>
                        <span className="font-bold tabular-nums text-[#3E768D] bg-[#3E768D]/10 px-3 py-1 rounded-full">5 req/min</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px] border-b border-border/30 pb-4 group">
                        <span className="font-bold text-foreground/80">Tier Pro</span>
                        <span className="font-bold tabular-nums text-[#3E768D] bg-[#3E768D]/10 px-3 py-1 rounded-full">50 req/min</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px] border-b border-border/30 pb-4 group">
                        <span className="font-bold text-foreground/80">Tier Max</span>
                        <span className="font-bold tabular-nums text-[#3E768D] bg-[#3E768D]/10 px-3 py-1 rounded-full">120 req/min</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
