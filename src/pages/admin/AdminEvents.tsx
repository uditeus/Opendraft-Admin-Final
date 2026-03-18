import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminEvents() {
    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-8">
                <div>
                    <h1 className="text-4xl  font-normal text-foreground tracking-tight">Product Events</h1>
                    <p className="text-sm text-muted-foreground mt-2">Fluxo global de eventos do produto.</p>
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

            <div className="w-full">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/20">
                                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Evento</th>
                                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Usuário</th>
                                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Data</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {[
                                { name: "user.signup", user: "pedro@example.com", date: "Há 2 mins" },
                                { name: "copy.generated", user: "ana@example.com", date: "Há 5 mins" },
                                { name: "subscription.updated", user: "bruno@example.com", date: "Há 12 mins" },
                                { name: "project.deleted", user: "carlos@example.com", date: "Há 15 mins" },
                                { name: "ai.token_limit_reached", user: "julia@example.com", date: "Há 18 mins" },
                            ].map((e, i) => (
                                <tr key={i} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-4 text-[13px] font-mono font-semibold text-foreground/80">{e.name}</td>
                                    <td className="px-4 py-4 text-sm text-foreground/70 font-medium">{e.user}</td>
                                    <td className="px-4 py-4 text-xs text-muted-foreground font-medium">{e.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
