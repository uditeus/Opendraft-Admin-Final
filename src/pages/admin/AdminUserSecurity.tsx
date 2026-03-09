import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminUserSecurity() {
    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-8">
                <div>
                    <h1 className="text-4xl font-serif font-normal text-foreground tracking-tight">Security & Auth</h1>
                    <p className="text-sm text-muted-foreground mt-2">Segurança, autenticação e mitigação de abuso.</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/10">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <h4 className="text-xl font-serif font-normal text-foreground">Alertas de Login</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">Nenhum comportamento suspeito detectado nas últimas 24h. Todos os logins dentro do padrão esperado.</p>
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/10">
                        <div className="h-2 w-2 rounded-full bg-foreground" />
                        <h4 className="text-xl font-serif font-normal text-foreground">Taxa de MFA</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">12.4% dos usuários ativos possuem MFA habilitado. Sugerimos campanha interna para aumentar a segurança.</p>
                </div>
            </div>
        </div>
    );
}
