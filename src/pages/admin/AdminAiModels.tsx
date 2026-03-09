import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { cn } from "@/lib/utils";

export default function AdminAiModels() {
    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-8">
                <div>
                    <h1 className="text-4xl font-serif font-normal text-foreground tracking-tight">AI Models</h1>
                    <p className="text-sm text-muted-foreground mt-2">Performance e distribuição por modelo de IA.</p>
                </div>
            </div>

            <div className="mb-12">
                <AdminSubNav
                    items={[
                        { label: "Usage", path: "/admin/api-usage" },
                        { label: "Costs", path: "/admin/api-usage/costs" },
                        { label: "Models", path: "/admin/api-usage/models" },
                        { label: "Limits", path: "/admin/api-usage/limits" },
                    ]}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                    { name: "GPT-4o", usage: "45%", latency: "1.2s", status: "Healthy" },
                    { name: "Claude 3.5 Sonnet", usage: "35%", latency: "0.8s", status: "Healthy" },
                    { name: "Gemini 1.5 Pro", usage: "20%", latency: "1.5s", status: "Warning" },
                ].map((m) => (
                    <div key={m.name} className="flex flex-col">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/10">
                            <h4 className="font-serif text-xl font-normal text-foreground">{m.name}</h4>
                            <span className={cn(
                                "h-2 w-2 rounded-full",
                                m.status === "Healthy" ? "bg-emerald-500" : "bg-amber-500"
                            )} />
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Share</span>
                                <span className="text-xl font-serif text-foreground/80">{m.usage}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Latency</span>
                                <span className="text-xl font-serif text-foreground/80">{m.latency}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
