import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminEvents() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">Product Events</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Fluxo global de eventos do produto</p>
            </div>

            <AdminSubNav
                items={[
                    { label: "Dashboard", path: "/admin" },
                    { label: "Realtime", path: "/admin/realtime" },
                    { label: "Events", path: "/admin/events" },
                ]}
            />

            <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden mb-4">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/30 bg-muted/20">
                                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Evento</th>
                                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Usuário</th>
                                <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Data</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {[
                                { name: "user.signup", user: "pedro@example.com", date: "Há 2 mins" },
                                { name: "copy.generated", user: "ana@example.com", date: "Há 5 mins" },
                                { name: "subscription.updated", user: "bruno@example.com", date: "Há 12 mins" },
                                { name: "project.deleted", user: "carlos@example.com", date: "Há 15 mins" },
                                { name: "ai.token_limit_reached", user: "julia@example.com", date: "Há 18 mins" },
                            ].map((e, i) => (
                                <tr key={i} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4 text-[13px] font-mono font-semibold text-[#3E768D]">{e.name}</td>
                                    <td className="px-6 py-4 text-[13px] text-foreground/70 font-medium">{e.user}</td>
                                    <td className="px-6 py-4 text-[13px] text-muted-foreground font-medium">{e.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
