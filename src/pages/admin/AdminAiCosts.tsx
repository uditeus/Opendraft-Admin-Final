import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminAiCosts() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">AI Costs</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Gestão de custos e faturamento de modelos</p>
            </div>

            <AdminSubNav
                items={[
                    { label: "Usage", path: "/admin/api-usage" },
                    { label: "Costs", path: "/admin/api-usage/costs" },
                    { label: "Models", path: "/admin/api-usage/models" },
                    { label: "Limits", path: "/admin/api-usage/limits" },
                ]}
            />

            <div className="rounded-xl border border-border/50 bg-card shadow-sm p-10">
                <h3 className="text-[18px] font-bold text-foreground">Projeção de Custos</h3>
                <p className="text-[14px] text-muted-foreground mt-1 mb-8 font-medium">Custos estimados baseados no consumo atual de tokens por modelo.</p>
                <div className="h-[240px] w-full bg-muted/20 border border-dashed border-border/40 rounded-xl flex items-center justify-center text-muted-foreground/60 italic font-medium px-12 text-center">
                    Gráfico de custo acumulado vs orçamento em desenvolvimento.
                </div>
            </div>
        </div>
    );
}
