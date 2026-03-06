import * as React from "react";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { cn } from "@/lib/utils";

export default function AdminAiModels() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">AI Models</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Performance e distribuição por modelo de IA</p>
            </div>

            <AdminSubNav
                items={[
                    { label: "Usage", path: "/admin/api-usage" },
                    { label: "Costs", path: "/admin/api-usage/costs" },
                    { label: "Models", path: "/admin/api-usage/models" },
                    { label: "Limits", path: "/admin/api-usage/limits" },
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                    { name: "GPT-4o", usage: "45%", latency: "1.2s", status: "Healthy" },
                    { name: "Claude 3.5 Sonnet", usage: "35%", latency: "0.8s", status: "Healthy" },
                    { name: "Gemini 1.5 Pro", usage: "20%", latency: "1.5s", status: "Warning" },
                ].map((m) => (
                    <div key={m.name} className="p-5 rounded-xl border border-border/50 bg-card shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-foreground text-[15px]">{m.name}</h4>
                            <span className={cn(
                                "h-2 w-2 rounded-full",
                                m.status === "Healthy" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                            )} />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] text-muted-foreground font-medium uppercase tracking-tight">Share</span>
                                <span className="text-[13px] font-bold text-foreground/80">{m.usage}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] text-muted-foreground font-medium uppercase tracking-tight">Latency</span>
                                <span className="text-[13px] font-bold text-foreground/80">{m.latency}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
