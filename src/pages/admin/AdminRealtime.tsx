import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminRealtime() {
    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-8">
                <div>
                    <h1 className="text-4xl font-serif font-normal text-foreground tracking-tight">Realtime Activity</h1>
                    <p className="text-sm text-muted-foreground mt-2">Atividade em tempo real dos usuários.</p>
                </div>
            </div>

            <div className="mb-12">
                <AdminSubNav
                    items={[
                        { label: "Dashboard", path: "/admin" },
                        { label: "Realtime", path: "/admin/realtime" },
                        { label: "Events", path: "/admin/events" },
                    ]}
                />
            </div>

            <div className="w-full flex-1 flex flex-col items-center justify-center py-32 text-center opacity-40">
                <div className="h-14 w-14 rounded-full bg-emerald-500/5 flex items-center justify-center mb-8">
                    <div className="h-3.5 w-3.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.3)]" />
                </div>
                <h3 className="text-xl font-serif text-foreground mb-4">Monitoramento em Tempo Real</h3>
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">Conectando ao stream de eventos... Aguardando novos dados de interação.</p>
            </div>
        </div>
    );
}
