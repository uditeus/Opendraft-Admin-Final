import * as React from "react";
import { AppIcon } from "@/components/icons/AppIcon";
import { AdminTable } from "@/components/admin/AdminTable";
import { cn } from "@/lib/utils";

const ACTION_COLORS: Record<string, string> = {
    DAR_CREDITOS: "text-foreground bg-foreground/5 border-border/10",
    REMOVER_CREDITOS: "text-amber-500 bg-amber-500/5 border-amber-500/10",
    SUSPENDER: "text-amber-500 bg-amber-500/5 border-amber-500/10",
    REATIVAR: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10",
    BANIR: "text-red-500 bg-red-500/5 border-red-500/10",
    ALTERAR_ROLE: "text-foreground bg-foreground/5 border-foreground/10",
    ALTERAR_PLANO: "text-foreground bg-muted/20 border-border/20",
    RESET_SENHA: "text-muted-foreground bg-muted/10 border-border/10",
    LOGIN_ADMIN: "text-muted-foreground bg-transparent border-transparent",
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
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 mt-8">
                <div>
                    <h1 className="text-[42px]  font-normal text-foreground tracking-tight leading-tight">Audit Logs</h1>
                    <p className="text-[15px] text-muted-foreground mt-3 font-normal">Registro completo e imutável de todas as ações administrativas realizadas no sistema.</p>
                </div>
            </div>

            {/* Quick Filters - Actions */}
            <div className="flex flex-wrap items-center gap-3 mb-10 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
                <span className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest mr-3 shrink-0">Ação</span>
                {[
                    { key: "all", label: "Todas" },
                    ...Object.keys(ACTION_COLORS).slice(0, 6).map(key => ({
                        key,
                        label: key.replace(/_/g, " ").toLowerCase().replace(/^\w/, c => c.toUpperCase())
                    }))
                ].map((f) => (
                    <button
                        key={f.key}
                        onClick={() => { setActionFilter(f.key); setPage(1); }}
                        className={cn(
                            "h-9 px-5 rounded-full text-[13px] font-medium transition-all border whitespace-now8-nowrap shrink-0",
                            actionFilter === f.key
                                ? "bg-foreground text-background border-foreground shadow-sm"
                                : "bg-muted/5 border-border/10 text-muted-foreground hover:border-border/20 hover:text-foreground",
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="w-full">
                <AdminTable
                    columns={[
                        {
                            key: "timestamp", label: "Data & Hora", render: (r) => (
                                <div className="flex flex-col">
                                    <span className="text-[13px] text-foreground/80 font-medium tabular-nums">{r.timestamp.split(' ')[0]}</span>
                                    <span className="text-[11px] text-muted-foreground/40 tabular-nums">{r.timestamp.split(' ')[1]}</span>
                                </div>
                            )
                        },
                        {
                            key: "admin", label: "Administrador", render: (r) => (
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-medium text-foreground truncate">{r.admin.split('@')[0]}</span>
                                    <span className="text-[11px] text-muted-foreground/30 font-normal truncate">{r.admin}</span>
                                </div>
                            )
                        },
                        {
                            key: "action", label: "Evento", render: (r) => (
                                <span className={cn(
                                    "px-2.5 py-1 rounded-md text-[10px] font-medium tracking-wide border",
                                    ACTION_COLORS[r.action] || "text-muted-foreground bg-muted/5 border-border/5"
                                )}>
                                    {r.action.replace(/_/g, " ")}
                                </span>
                            )
                        },
                        {
                            key: "target", label: "Alvo", render: (r) => (
                                <span className="text-[13.5px] text-foreground/60 font-normal truncate max-w-[120px] block">{r.target}</span>
                            )
                        },
                        {
                            key: "detail", label: "Atividade", render: (r) => (
                                <span className="text-[13.5px] text-muted-foreground/80 font-normal truncate block max-w-[320px]">
                                    {r.detail}
                                </span>
                            )
                        },
                        {
                            key: "ip", label: "Acesso IP", render: (r) => (
                                <span className="text-[11px] text-muted-foreground/20 font-medium tabular-nums tracking-tight">{r.ip}</span>
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
                    searchPlaceholder="Administrador, alvo ou detalhe..."
                    emptyMessage="Nenhum log encontrado para estes critérios"
                />
            </div>
        </div>
    );
}
