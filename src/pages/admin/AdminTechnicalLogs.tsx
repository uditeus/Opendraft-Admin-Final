import * as React from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { cn } from "@/lib/utils";

const LEVEL_COLORS: Record<string, string> = {
    INFO: "text-foreground bg-foreground/10",
    WARN: "text-amber-500 bg-amber-500/10",
    ERROR: "text-red-500 bg-red-500/10",
    DEBUG: "text-muted-foreground bg-muted/20",
};

const MOCK_TECH_LOGS = Array.from({ length: 40 }, (_, i) => ({
    id: `tlog_${i + 1}`,
    timestamp: `05/03/2025 ${String(14 - Math.floor(i / 4)).padStart(2, "0")}:${String((i * 11) % 60).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
    level: (["INFO", "WARN", "ERROR", "DEBUG"] as const)[i % 4],
    service: (["api-gateway", "auth-service", "ai-worker", "payment-service", "queue"] as const)[i % 5],
    message: [
        "Request completed 200 OK (latency: 1.2s)",
        "Rate limit approaching: 85% of threshold",
        "Anthropic API timeout after 30s — retry 2/3",
        "Token count: 4521 (model: claude-3-opus)",
        "Webhook delivery failed: status 502 (stripe)",
        "Cache miss for user_preferences:usr_847",
        "Connection pool exhausted, waiting for release",
        "Scheduled task completed: cleanup_expired_sessions",
    ][i % 8],
    traceId: `tr_${Math.random().toString(36).slice(2, 14)}`,
}));

export default function AdminTechnicalLogs() {
    const [search, setSearch] = React.useState("");
    const [page, setPage] = React.useState(1);
    const [levelFilter, setLevelFilter] = React.useState("all");
    const [serviceFilter, setServiceFilter] = React.useState("all");
    const pageSize = 25;

    const filtered = MOCK_TECH_LOGS.filter((l) => {
        const matchesSearch = !search ||
            l.message.toLowerCase().includes(search.toLowerCase()) ||
            l.traceId.includes(search);
        const matchesLevel = levelFilter === "all" || l.level === levelFilter;
        const matchesService = serviceFilter === "all" || l.service === serviceFilter;
        return matchesSearch && matchesLevel && matchesService;
    });

    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 mt-8">
                <div>
                    <h1 className="text-[42px] font-serif font-normal text-foreground tracking-tight leading-tight">Technical Logs</h1>
                    <p className="text-[15px] text-muted-foreground mt-3 font-normal">Telemetria de sistema e depuração em tempo real para infraestrutura.</p>
                </div>
            </div>

            {/* Quick Filters - Level & Service */}
            <div className="flex flex-col gap-8 mb-16">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest mr-3 shrink-0">Nível</span>
                    {["all", "ERROR", "WARN", "INFO", "DEBUG"].map((f) => (
                        <button
                            key={f}
                            onClick={() => { setLevelFilter(f); setPage(1); }}
                            className={cn(
                                "h-9 px-5 rounded-full text-[12px] font-medium transition-all border shrink-0",
                                levelFilter === f
                                    ? "bg-foreground text-background border-foreground shadow-sm"
                                    : "bg-muted/5 border-border/10 text-muted-foreground hover:border-border/20 hover:text-foreground",
                            )}
                        >
                            {f === 'all' ? 'Todos' : f}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest mr-3 shrink-0">Serviço</span>
                    {["all", "api-gateway", "auth-service", "ai-worker", "payment-service", "queue"].map((f) => (
                        <button
                            key={f}
                            onClick={() => { setServiceFilter(f); setPage(1); }}
                            className={cn(
                                "h-9 px-5 rounded-full text-[12px] font-medium transition-all border shrink-0",
                                serviceFilter === f
                                    ? "bg-foreground text-background border-foreground shadow-sm"
                                    : "bg-muted/5 border-border/10 text-muted-foreground hover:border-border/20 hover:text-foreground",
                            )}
                        >
                            {f === 'all' ? 'Todos' : f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full">
                <AdminTable
                    columns={[
                        {
                            key: "timestamp", label: "Timestamp", render: (r) => (
                                <div className="flex flex-col">
                                    <span className="text-[11px] text-muted-foreground/50 font-mono tabular-nums">{r.timestamp.split(' ')[0]}</span>
                                    <span className="text-[13px] text-foreground font-mono font-medium tabular-nums">{r.timestamp.split(' ')[1]}</span>
                                </div>
                            )
                        },
                        {
                            key: "level", label: "Level", render: (r) => (
                                <span className={cn(
                                    "px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest uppercase border",
                                    LEVEL_COLORS[r.level] || "text-muted-foreground bg-muted/5 border-border/5"
                                )}>
                                    {r.level}
                                </span>
                            )
                        },
                        {
                            key: "service", label: "Service", render: (r) => (
                                <span className="text-[11px] text-foreground/40 font-mono font-bold tracking-tight bg-muted/5 px-2 py-1 rounded-md lowercase">
                                    {r.service}
                                </span>
                            )
                        },
                        {
                            key: "message", label: "Trace Message", render: (r) => (
                                <span className="text-[13px] text-foreground/90 font-mono font-normal max-w-[450px] truncate block leading-relaxed">
                                    {r.message}
                                </span>
                            )
                        },
                        {
                            key: "traceId", label: "Trace ID", render: (r) => (
                                <span className="text-[10px] text-muted-foreground/20 font-mono font-medium uppercase tracking-tight hover:text-muted-foreground/40 transition-colors cursor-pointer">
                                    {r.traceId}
                                </span>
                            )
                        },
                    ]}
                    data={paginated}
                    keyExtractor={(r) => r.id}
                    page={page}
                    pageSize={pageSize}
                    total={filtered.length}
                    onPageChange={setPage}
                    searchValue={search}
                    onSearchChange={(v) => { setSearch(v); setPage(1); }}
                    searchPlaceholder="Eventos, traces ou identificadores..."
                    emptyMessage="Nenhuma telemetria encontrada para estes critérios"
                />
            </div>
        </div>
    );
}
