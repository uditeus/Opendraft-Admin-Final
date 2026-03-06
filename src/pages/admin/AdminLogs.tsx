import * as React from "react";
import { AppIcon } from "@/components/icons/AppIcon";
import { AdminTable } from "@/components/admin/AdminTable";
import { cn } from "@/lib/utils";

const ACTION_COLORS: Record<string, string> = {
    DAR_CREDITOS: "text-emerald-400 bg-emerald-500/10",
    REMOVER_CREDITOS: "text-orange-400 bg-orange-500/10",
    SUSPENDER: "text-amber-400 bg-amber-500/10",
    REATIVAR: "text-emerald-400 bg-emerald-500/10",
    BANIR: "text-red-400 bg-red-500/10",
    ALTERAR_ROLE: "text-blue-400 bg-blue-500/10",
    ALTERAR_PLANO: "text-purple-400 bg-purple-500/10",
    RESET_SENHA: "text-muted-foreground bg-sidebar-accent/30",
    LOGIN_ADMIN: "text-muted-foreground bg-sidebar-accent/20",
};

const MOCK_LOGS = Array.from({ length: 48 }, (_, i) => ({
    id: `log_${i + 1}`,
    timestamp: `05/03/2025 ${String(14 - Math.floor(i / 4)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
    admin: ["admin@op.com", "dev@op.com", "owner@op.com"][i % 3],
    action: ["DAR_CREDITOS", "SUSPENDER", "REATIVAR", "BANIR", "ALTERAR_ROLE", "ALTERAR_PLANO", "LOGIN_ADMIN", "RESET_SENHA"][i % 8],
    target: i % 8 === 6 ? "—" : `user${(i % 15) + 1}@example.com`,
    detail: [
        "+50 créditos. Motivo: \"Problema técnico\"",
        "7 dias. Motivo: \"Uso abusivo\"",
        "Conta reativada",
        "Permanente. Motivo: \"Spam\"",
        "user → admin. Motivo: \"Novo funcionário\"",
        "Free → Pro. Cortesia",
        "Login no painel admin",
        "Email de reset enviado",
    ][i % 8],
    ip: `189.${40 + (i % 5)}.xxx.xxx`,
}));

import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminLogs() {
    const [search, setSearch] = React.useState("");
    const [page, setPage] = React.useState(1);
    const [actionFilter, setActionFilter] = React.useState("all");
    const pageSize = 25;

    const filtered = MOCK_LOGS.filter((l) => {
        const matchesSearch = !search ||
            l.admin.toLowerCase().includes(search.toLowerCase()) ||
            l.target.toLowerCase().includes(search.toLowerCase()) ||
            l.detail.toLowerCase().includes(search.toLowerCase());
        const matchesAction = actionFilter === "all" || l.action === actionFilter;
        return matchesSearch && matchesAction;
    });

    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">Audit Logs</h1>
                <p className="text-[13.5px] text-muted-foreground mt-0.5">Histórico completo de ações administrativas</p>
            </div>

            <AdminSubNav
                items={[
                    { label: "Activity Logs", path: "/admin/logs" },
                    { label: "Technical Logs", path: "/admin/logs/technical" },
                    { label: "Maintenance", path: "/admin/system/maintenance" },
                ]}
            />

            <div className="flex items-center gap-3">
                <div className="relative">
                    <select
                        value={actionFilter}
                        onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
                        className={cn(
                            "h-10 rounded-full border border-border/50 bg-card px-5 pr-10 shadow-sm appearance-none",
                            "text-[13px] font-medium text-foreground/70 outline-none focus:border-border transition-all cursor-pointer",
                        )}
                    >
                        <option value="all">Todas as ações</option>
                        {Object.keys(ACTION_COLORS).map((a) => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                    <AppIcon name="ChevronDown" className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/40 pointer-events-none" />
                </div>
            </div>

            <AdminTable
                columns={[
                    {
                        key: "timestamp", label: "Data/Hora", render: (r) => (
                            <span className="text-[12px] text-muted-foreground font-mono">{r.timestamp}</span>
                        )
                    },
                    {
                        key: "admin", label: "Admin", render: (r) => (
                            <span className="text-[12px] text-foreground/60">{r.admin}</span>
                        )
                    },
                    {
                        key: "action", label: "Ação", render: (r) => (
                            <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-semibold", ACTION_COLORS[r.action] || "text-muted-foreground")}>
                                {r.action}
                            </span>
                        )
                    },
                    {
                        key: "target", label: "Alvo", render: (r) => (
                            <span className="text-[12px] text-foreground/60">{r.target}</span>
                        )
                    },
                    {
                        key: "detail", label: "Detalhes", render: (r) => (
                            <span className="text-[12px] text-muted-foreground max-w-[300px] truncate block">{r.detail}</span>
                        )
                    },
                    {
                        key: "ip", label: "IP", render: (r) => (
                            <span className="text-[11px] text-muted-foreground/60 font-mono">{r.ip}</span>
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
                searchPlaceholder="Buscar em logs..."
                emptyMessage="Nenhum log encontrado"
            />
        </div>
    );
}
