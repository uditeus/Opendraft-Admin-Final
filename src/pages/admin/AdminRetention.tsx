import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminRetention() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">Retention Analysis</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Métricas de retenção por cohort e stickiness do produto</p>
            </div>

            <AdminSubNav
                items={[
                    { label: "Growth", path: "/admin/growth" },
                    { label: "Product", path: "/admin/product" },
                    { label: "Retention", path: "/admin/analytics/retention" },
                ]}
            />

            <div className="rounded-xl border border-border/50 bg-card shadow-sm p-8 max-w-2xl">
                <h3 className="text-[15px] font-bold text-foreground mb-2">Retenção de Usuários Médio</h3>
                <p className="text-[13px] text-muted-foreground mb-10 font-medium">Porcentagem de usuários que retornam ao app após a primeira semana.</p>
                <div className="grid grid-cols-4 gap-6 h-40">
                    {[85, 72, 64, 58].map((v, i) => (
                        <div key={i} className="flex flex-col items-center justify-end gap-3 group">
                            <div className="w-full bg-[#3E768D]/10 border border-[#3E768D]/20 rounded-xl relative transition-all group-hover:bg-[#3E768D]/20" style={{ height: `${v}%` }}>
                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[11px] font-bold text-[#3E768D] tabular-nums">
                                    {v}%
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">W{i + 1}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-xl border border-border/50 bg-card shadow-sm p-6">
                    <h4 className="text-[14px] font-bold text-foreground">Churn Rate Estático</h4>
                    <p className="text-[26px] font-bold text-red-500 mt-2">4.2%</p>
                    <p className="text-[12px] text-muted-foreground mt-1 font-medium">Melhora de 0.8% em relação ao mês anterior.</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card shadow-sm p-6">
                    <h4 className="text-[14px] font-bold text-foreground">DAU/MAU Stickiness</h4>
                    <p className="text-[26px] font-bold text-emerald-500 mt-2">33.9%</p>
                    <p className="text-[12px] text-muted-foreground mt-1 font-medium">Referência High-Growth SaaS: {'>'} 20%.</p>
                </div>
            </div>
        </div>
    );
}
