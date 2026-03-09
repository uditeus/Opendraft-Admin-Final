import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminAiCosts() {
    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-8">
                <div>
                    <h1 className="text-4xl font-serif font-normal text-foreground tracking-tight">AI Costs</h1>
                    <p className="text-sm text-muted-foreground mt-2">Gestão de custos e faturamento de modelos.</p>
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
                <h3 className="text-xl font-serif text-foreground mb-4">Projeção de Custos</h3>
                <p className="text-sm text-muted-foreground mb-12 max-w-2xl">Custos estimados baseados no consumo atual de tokens por modelo.</p>

                <div className="h-[320px] w-full bg-muted/5 border border-dashed border-border/20 rounded-2xl flex items-center justify-center text-muted-foreground/40 italic font-medium px-12 text-center">
                    Gráfico de custo acumulado vs orçamento em desenvolvimento.
                </div>
            </div>
        </div>
    );
}
