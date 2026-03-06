import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminUserActivity() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">Timeline & Activity</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Logs de login, gerações e alterações de perfil em tempo real</p>
            </div>

            <AdminSubNav
                items={[
                    { label: "Overview", path: "/admin/users" },
                    { label: "Tickets", path: "/admin/tickets" },
                    { label: "Activity", path: "/admin/users/activity" },
                    { label: "Security", path: "/admin/users/security" },
                ]}
            />

            <div className="rounded-xl border border-border/50 bg-card shadow-sm p-32 flex flex-col items-center justify-center text-center">
                <div className="h-14 w-14 rounded-full bg-muted/20 flex items-center justify-center mb-6">
                    <div className="h-3 w-3 rounded-full bg-muted-foreground/30 animate-pulse" />
                </div>
                <h3 className="text-[18px] font-bold text-foreground">Timeline de Atividade</h3>
                <p className="text-[14px] text-muted-foreground mt-2 max-w-sm font-medium">Aguardando novos eventos dos usuários... Logs de login e interações aparecerão aqui em tempo real.</p>
            </div>
        </div>
    );
}
