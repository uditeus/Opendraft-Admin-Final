import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminUserSecurity() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">Security & Auth</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Segurança, autenticação e mitigação de abuso</p>
            </div>

            <AdminSubNav
                items={[
                    { label: "Overview", path: "/admin/users" },
                    { label: "Tickets", path: "/admin/tickets" },
                    { label: "Activity", path: "/admin/users/activity" },
                    { label: "Security", path: "/admin/users/security" },
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-8 rounded-xl border border-border/50 bg-card shadow-sm group">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <h4 className="text-[16px] font-bold text-foreground">Alertas de Login</h4>
                    </div>
                    <p className="text-[14px] text-muted-foreground font-medium">Nenhum comportamento suspeito detectado nas últimas 24h. Todos os logins dentro do padrão esperado.</p>
                </div>

                <div className="p-8 rounded-xl border border-border/50 bg-card shadow-sm group">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                        <h4 className="text-[16px] font-bold text-foreground">Taxa de MFA</h4>
                    </div>
                    <p className="text-[14px] text-muted-foreground font-medium">12.4% dos usuários ativos possuem MFA habilitado. Sugerimos campanha interna para aumentar a segurança.</p>
                </div>
            </div>
        </div>
    );
}
