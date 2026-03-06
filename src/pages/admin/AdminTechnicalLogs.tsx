import * as React from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { cn } from "@/lib/utils";

const LEVEL_COLORS: Record<string, string> = {
    INFO: "text-blue-400 bg-blue-500/10",
    WARN: "text-amber-400 bg-amber-500/10",
    ERROR: "text-red-400 bg-red-500/10",
    DEBUG: "text-muted-foreground bg-sidebar-accent/20",
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
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">Technical Logs</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Logs de sistema em tempo real — visível apenas para desenvolvedores</p>
            </div>

            <div className="flex items-center gap-3">
                <select
                    value={levelFilter}
                    onChange={(e) => { setLevelFilter(e.target.value); setPage(1); }}
                    className={cn(
                        "h-9 rounded-full border border-border/40 bg-card px-4",
                        "text-[12px] font-bold text-foreground/70 outline-none focus:border-[#3E768D]/40 transition-all",
                    )}
                >
                    <option value="all">TODOS OS NÍVEIS</option>
                    <option value="ERROR">ERROR</option>
                    <option value="WARN">WARN</option>
                    <option value="INFO">INFO</option>
                    <option value="DEBUG">DEBUG</option>
                </select>

                <select
                    value={serviceFilter}
                    onChange={(e) => { setServiceFilter(e.target.value); setPage(1); }}
                    className={cn(
                        "h-9 rounded-full border border-border/40 bg-card px-4",
                        "text-[12px] font-bold text-foreground/70 outline-none focus:border-[#3E768D]/40 transition-all",
                    )}
                >
                    <option value="all">TODOS OS SERVIÇOS</option>
                    <option value="api-gateway">api-gateway</option>
                    <option value="auth-service">auth-service</option>
                    <option value="ai-worker">ai-worker</option>
                    <option value="payment-service">payment-service</option>
                    <option value="queue">queue</option>
                </select>
            </div>

            <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
                <AdminTable
                    columns={[
                        {
                            key: "timestamp", label: "TIMESTAMP", render: (r) => (
                                <span className="text-[11px] text-muted-foreground font-mono font-bold whitespace-nowrap">{r.timestamp}</span>
                            )
                        },
                        {
                            key: "level", label: "LEVEL", render: (r) => (
                                <span className={cn("rounded-full px-3 py-1 text-[10px] font-bold tracking-widest", LEVEL_COLORS[r.level] || "")}>
                                    {r.level}
                                </span>
                            )
                        },
                        {
                            key: "service", label: "SERVICE", render: (r) => (
                                <span className="text-[12px] text-[#3E768D] font-bold font-mono lowercase">{r.service}</span>
                            )
                        },
                        {
                            key: "message", label: "MESSAGE", render: (r) => (
                                <span className="text-[12.5px] text-foreground/80 font-mono font-medium max-w-[500px] truncate block">{r.message}</span>
                            )
                        },
                        {
                            key: "traceId", label: "TRACE_ID", render: (r) => (
                                <span className="text-[10px] text-muted-foreground/40 font-mono font-bold uppercase">{r.traceId}</span>
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
                    searchPlaceholder="Search logs or trace IDs..."
                    emptyMessage="Nenhum log técnico encontrado"
                />
            </div>
        </div>
    );
}
