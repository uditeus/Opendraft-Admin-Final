import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminRetention() {
    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-8">
                <div>
                    <h1 className="text-4xl font-serif font-normal text-foreground tracking-tight">Retention Analysis</h1>
                    <p className="text-sm text-muted-foreground mt-2">Métricas de retenção por cohort e stickiness do produto.</p>
                </div>
            </div>

            <div className="mb-12">
                <AdminSubNav
                    items={[
                        { label: "Growth", path: "/admin/growth" },
                        { label: "Product", path: "/admin/product" },
                        { label: "Retention", path: "/admin/analytics/retention" },
                    ]}
                />
            </div>

            <div className="w-full mb-16">
                <h3 className="text-xl font-serif text-foreground mb-4">Retenção de Usuários Médio</h3>
                <p className="text-sm text-muted-foreground mb-12 max-w-2xl">Porcentagem de usuários que retornam ao app após a primeira semana.</p>

                <div className="grid grid-cols-4 gap-12 h-44 max-w-2xl">
                    {[85, 72, 64, 58].map((v, i) => (
                        <div key={i} className="flex flex-col items-center justify-end gap-4 group">
                            <div className="w-full bg-foreground/10 border border-border/10 rounded-2xl relative transition-all group-hover:bg-foreground/20" style={{ height: `${v}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[11px] font-bold text-foreground tabular-nums opacity-60">
                                    {v}%
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">W{i + 1}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 max-w-4xl">
                <div className="flex flex-col">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 pb-2 border-b border-border/10">Churn Rate Estático</h4>
                    <p className="text-4xl font-serif font-normal text-red-500/80">4.2%</p>
                    <p className="text-xs text-muted-foreground mt-3 font-medium">Melhora de 0.8% em relação ao mês anterior.</p>
                </div>
                <div className="flex flex-col">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 pb-2 border-b border-border/10">DAU/MAU Stickiness</h4>
                    <p className="text-4xl font-serif font-normal text-emerald-600/80">33.9%</p>
                    <p className="text-xs text-muted-foreground mt-3 font-medium">Referência High-Growth SaaS: {'>'} 20%.</p>
                </div>
            </div>
        </div>
    );
}
