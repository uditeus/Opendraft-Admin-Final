import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminUserActivity() {
    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-8">
                <div>
                    <h1 className="text-4xl font-serif font-normal text-foreground tracking-tight">Timeline & Activity</h1>
                    <p className="text-sm text-muted-foreground mt-2">Logs de login, gerações e alterações de perfil em tempo real.</p>
                </div>
            </div>

            <div className="mb-12">
                <AdminSubNav
                    items={[
                        { label: "Overview", path: "/admin/users" },
                        { label: "Tickets", path: "/admin/tickets" },
                        { label: "Activity", path: "/admin/users/activity" },
                        { label: "Security", path: "/admin/users/security" },
                    ]}
                />
            </div>

            <div className="w-full flex-1 flex flex-col items-center justify-center py-32 text-center opacity-40">
                <div className="h-14 w-14 rounded-full bg-muted/20 flex items-center justify-center mb-8">
                    <div className="h-3 w-3 rounded-full bg-foreground shadow-[0_0_12px_rgba(255,255,255,0.4)] animate-pulse" />
                </div>
                <h3 className="text-xl font-serif text-foreground mb-4">Timeline de Atividade</h3>
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">Aguardando novos eventos dos usuários... Logs de login e interações aparecerão aqui em tempo real.</p>
            </div>
        </div>
    );
}
