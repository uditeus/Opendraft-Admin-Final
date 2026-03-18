import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminMaintenance() {
    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-8">
                <div>
                    <h1 className="text-4xl  font-normal text-foreground tracking-tight">System Maintenance</h1>
                    <p className="text-sm text-muted-foreground mt-2">Ferramentas de emergência e manutenção global do sistema.</p>
                </div>
            </div>

            <div className="mb-12">
                <AdminSubNav
                    items={[
                        { label: "Activity Logs", path: "/admin/logs" },
                        { label: "Technical Logs", path: "/admin/logs/technical" },
                        { label: "Maintenance", path: "/admin/system/maintenance" },
                    ]}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl">
                <button className="flex flex-col text-left group">
                    <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                    </div>
                    <h4 className="text-xl  font-normal text-foreground mb-4">Limpar Cache Global</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Remove todos os dados temporários e cache distribuído (Redis). Use com cautela.</p>
                </button>

                <button className="flex flex-col text-left group">
                    <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <div className="h-3 w-3 rounded-full bg-amber-500 rotate-45" />
                    </div>
                    <h4 className="text-xl  font-normal text-foreground mb-4">Modo Manutenção</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Ativa a tela de "Voltamos logo" para todos os usuários não-admin.</p>
                </button>

                <div className="flex flex-col opacity-30 cursor-not-allowed border-t border-border/10 pt-8 mt-8 col-span-2">
                    <h4 className="text-sm font-semibold text-foreground uppercase tracking-widest mb-4">Banco de Dados (Read-Only)</h4>
                    <p className="text-sm text-muted-foreground">Bloqueia todas as escritas no banco de dados principal.</p>
                </div>
            </div>
        </div>
    );
}
