import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AdminTable } from "@/components/admin/AdminTable";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { AppIcon } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";

import { ADMIN_USERS_LIST as MOCK_USERS } from "@/lib/admin-mock";

const STATUS_MAP: Record<string, { label: string; dot: string; text: string }> = {
    active: { label: "Ativo", dot: "bg-emerald-400", text: "text-emerald-400" },
    suspended: { label: "Suspenso", dot: "bg-amber-400", text: "text-amber-400" },
    banned: { label: "Banido", dot: "bg-red-400", text: "text-red-400" },
};

const ROLE_BADGE: Record<string, string> = {
    user: "text-muted-foreground bg-sidebar-accent/30",
    admin: "text-blue-400 bg-blue-500/10",
    dev: "text-purple-400 bg-purple-500/10",
    owner: "text-amber-400 bg-amber-500/10",
};

import { AdminSubNav } from "@/components/admin/AdminSubNav";

export default function AdminUsers() {
    const navigate = useNavigate();
    const [search, setSearch] = React.useState("");
    const [page, setPage] = React.useState(1);
    const [statusFilter, setStatusFilter] = React.useState<string>("all");
    const [planFilter, setPlanFilter] = React.useState<string>("all");
    const pageSize = 25;

    const filtered = MOCK_USERS.filter((u) => {
        const matchesSearch = !search ||
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || u.status === statusFilter;
        const matchesPlan = planFilter === "all" || u.plan === planFilter;
        return matchesSearch && matchesStatus && matchesPlan;
    });

    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[26px] font-serif font-semibold text-foreground tracking-tight">Users</h1>
                    <p className="text-[13.5px] text-muted-foreground mt-0.5">Gerenciar base de usuários e acessos</p>
                </div>
                <RoleGuard requires="owner">
                    <button className={cn(
                        "chat-focus flex items-center gap-2 h-10 px-4 rounded-full text-[13px] font-medium transition-all shadow-sm",
                        "border border-border/50 bg-card",
                        "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                    )}>
                        <AppIcon name="Download" className="h-[15px] w-[15px] opacity-60" />
                        Exportar CSV
                    </button>
                </RoleGuard>
            </div>

            <AdminSubNav
                items={[
                    { label: "Overview", path: "/admin/users" },
                    { label: "Tickets", path: "/admin/tickets" },
                    { label: "Activity", path: "/admin/users/activity" },
                    { label: "Security", path: "/admin/users/security" },
                ]}
            />

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className={cn(
                            "h-10 rounded-full border border-border/50 bg-card px-5 pr-10 shadow-sm appearance-none",
                            "text-[13px] font-medium text-foreground/70 outline-none focus:border-border transition-all cursor-pointer",
                        )}
                    >
                        <option value="all">Todos os status</option>
                        <option value="active">Ativo</option>
                        <option value="suspended">Suspenso</option>
                        <option value="banned">Banido</option>
                    </select>
                    <AppIcon name="ChevronDown" className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/40 pointer-events-none" />
                </div>

                <div className="relative">
                    <select
                        value={planFilter}
                        onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
                        className={cn(
                            "h-10 rounded-full border border-border/50 bg-card px-5 pr-10 shadow-sm appearance-none",
                            "text-[13px] font-medium text-foreground/70 outline-none focus:border-border transition-all cursor-pointer",
                        )}
                    >
                        <option value="all">Todos os planos</option>
                        <option value="Free">Free</option>
                        <option value="Pro">Pro</option>
                        <option value="Max">Max</option>
                        <option value="Max 5x">Max 5x</option>
                    </select>
                    <AppIcon name="ChevronDown" className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/40 pointer-events-none" />
                </div>
            </div>

            {/* Table */}
            <AdminTable
                columns={[
                    {
                        key: "name", label: "Usuário", render: (r) => (
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-muted/40 border border-border/20 overflow-hidden shadow-sm flex items-center justify-center">
                                    <AppIcon name="UserIcon" className="h-5 w-5 text-muted-foreground/40" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-bold text-foreground/90">{r.name}</span>
                                    <span className="text-[11px] text-muted-foreground font-medium">{r.email}</span>
                                </div>
                            </div>
                        )
                    },
                    {
                        key: "status", label: "Status", render: (r) => {
                            const st = STATUS_MAP[r.status] || STATUS_MAP.active;
                            return (
                                <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm", st.text, "bg-muted/20")}>
                                    {st.label}
                                </span>
                            );
                        }
                    },
                    {
                        key: "role", label: "Role", render: (r) => (
                            <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm",
                                ROLE_BADGE[r.role] || ROLE_BADGE.user,
                            )}>
                                {r.role}
                            </span>
                        )
                    },
                    { key: "credits", label: "Créditos", render: (r) => <span className="text-[13px] font-bold tabular-nums text-foreground/80">{r.credits}</span> },
                    { key: "createdAt", label: "Cadastro", render: (r) => <span className="text-[12px] text-muted-foreground font-medium">{r.createdAt}</span> },
                    { key: "lastLogin", label: "Último login", render: (r) => <span className="text-[12px] text-muted-foreground font-medium">{r.lastLogin}</span> },
                ]}
                data={paginated}
                keyExtractor={(r) => r.id}
                page={page}
                pageSize={pageSize}
                total={filtered.length}
                onPageChange={setPage}
                searchValue={search}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                searchPlaceholder="Buscar por nome, email ou ID..."
                onRowClick={(r) => navigate(`/admin/users/${r.id}`)}
                emptyMessage="Nenhum usuário encontrado com esses filtros"
            />
        </div>
    );
}
