import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminRealtime() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">Realtime Activity</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Atividade em tempo real dos usuários</p>
            </div>

            <AdminSubNav
                items={[
                    { label: "Dashboard", path: "/admin" },
                    { label: "Realtime", path: "/admin/realtime" },
                    { label: "Events", path: "/admin/events" },
                ]}
            />

            <div className="rounded-xl border border-border/50 bg-card shadow-sm p-32 flex flex-col items-center justify-center text-center">
                <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                    <div className="h-3.5 w-3.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                </div>
                <h3 className="text-[18px] font-bold text-foreground">Monitoramento em Tempo Real</h3>
                <p className="text-[14px] text-muted-foreground mt-2 max-w-sm font-medium">Conectando ao stream de eventos... Aguardando novos dados de interação.</p>
            </div>
        </div>
    );
}
