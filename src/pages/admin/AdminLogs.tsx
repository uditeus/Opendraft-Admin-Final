import * as React from "react";
import { AppIcon } from "@/components/icons/AppIcon";
import { AdminTable } from "@/components/admin/AdminTable";
import { cn } from "@/lib/utils";

const ACTION_COLORS: Record<string, string> = {
    DAR_CREDITOS: "text-[#0066fe] bg-[#0066fe]/10 border-[#0066fe]/20",
    REMOVER_CREDITOS: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    SUSPENDER: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    REATIVAR: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    BANIR: "text-red-500 bg-red-500/10 border-red-500/20",
    ALTERAR_ROLE: "text-foreground bg-foreground/10 border-foreground/20",
    ALTERAR_PLANO: "text-foreground bg-muted/40 border-border/50",
    RESET_SENHA: "text-muted-foreground bg-muted/20 border-border/30",
    LOGIN_ADMIN: "text-muted-foreground bg-muted/10 border-transparent",
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
        <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-20">
            <div className="mt-10">
                <h1 className="text-3xl font-serif font-semibold text-foreground tracking-tight">Audit Logs</h1>
                <p className="text-sm text-muted-foreground mt-1">Histórico completo de ações administrativas e de sistema</p>
            </div>

            <div className="flex items-center gap-4 border-b border-border/30 pb-6">
                <div className="relative w-full sm:w-auto min-w-[200px]">
                    <select
                        value={actionFilter}
                        onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
                        className={cn(
                            "h-10 w-full rounded-2xl border border-border/50 bg-transparent px-4 pr-10",
                            "text-sm font-medium text-foreground outline-none focus:border-[#0066fe] focus:ring-1 focus:ring-[#0066fe] transition-all cursor-pointer appearance-none",
                        )}
                    >
                        <option value="all">Todas as ações</option>
                        {Object.keys(ACTION_COLORS).map((a) => (
                            <option key={a} value={a}>{a.replace(/_/g, " ")}</option>
                        ))}
                    </select>
                    <AppIcon name="ChevronDown" className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
            </div>

            <div className="border border-border/30 rounded-3xl overflow-hidden bg-background">
                <AdminTable
                    columns={[
                        {
                            key: "timestamp", label: "Data/Hora", render: (r) => (
                                <span className="text-xs text-muted-foreground font-mono">{r.timestamp}</span>
                            )
                        },
                        {
                            key: "admin", label: "Admin", render: (r) => (
                                <span className="text-sm font-semibold text-foreground">{r.admin}</span>
                            )
                        },
                        {
                            key: "action", label: "Ação", render: (r) => (
                                <span className={cn(
                                    "rounded-full px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider border",
                                    ACTION_COLORS[r.action] || "text-muted-foreground bg-muted/10 border-border"
                                )}>
                                    {r.action.replace(/_/g, " ")}
                                </span>
                            )
                        },
                        {
                            key: "target", label: "Alvo", render: (r) => (
                                <span className="text-sm text-foreground/80">{r.target}</span>
                            )
                        },
                        {
                            key: "detail", label: "Detalhes", render: (r) => (
                                <span className="text-sm text-muted-foreground max-w-[300px] truncate block">{r.detail}</span>
                            )
                        },
                        {
                            key: "ip", label: "IP", render: (r) => (
                                <span className="text-xs text-muted-foreground/50 font-mono">{r.ip}</span>
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
                    searchPlaceholder="Buscar por admin, alvo ou detalhe..."
                    emptyMessage="Nenhum log encontrado"
                />
            </div>
        </div>
    );
}
