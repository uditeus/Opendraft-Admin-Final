import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminMaintenance() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">System Maintenance</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Ferramentas de emergência e manutenção global do sistema</p>
            </div>

            <AdminSubNav
                items={[
                    { label: "Activity Logs", path: "/admin/logs" },
                    { label: "Technical Logs", path: "/admin/logs/technical" },
                    { label: "Maintenance", path: "/admin/system/maintenance" },
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <button className="p-8 rounded-xl border border-border/50 bg-card shadow-sm hover:bg-red-500/[0.02] hover:border-red-500/30 transition-all text-left group">
                    <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                    </div>
                    <h4 className="text-[16px] font-bold text-foreground">Limpar Cache Global</h4>
                    <p className="text-[13px] text-muted-foreground mt-2 font-medium">Remove todos os dados temporários e cache distribuído (Redis). Use com cautela.</p>
                </button>

                <button className="p-8 rounded-xl border border-border/50 bg-card shadow-sm hover:bg-amber-500/[0.02] hover:border-amber-500/30 transition-all text-left group">
                    <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                        <div className="h-3 w-3 rounded-full bg-amber-500 rotate-45" />
                    </div>
                    <h4 className="text-[16px] font-bold text-foreground">Modo Manutenção</h4>
                    <p className="text-[13px] text-muted-foreground mt-2 font-medium">Ativa a tela de "Voltamos logo" para todos os usuários não-admin.</p>
                </button>
            </div>

            <div className="rounded-xl border border-border/50 bg-card shadow-sm p-8 opacity-50 cursor-not-allowed">
                <h4 className="text-[14px] font-bold text-foreground">Banco de Dados (Read-Only)</h4>
                <p className="text-[12px] text-muted-foreground mt-1 font-medium">Bloqueia todas as escritas no banco de dados principal.</p>
            </div>
        </div>
    );
}
