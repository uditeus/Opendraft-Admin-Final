import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AdminTable } from "@/components/admin/AdminTable";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { AppIcon } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";

import { ADMIN_USERS_LIST as MOCK_USERS } from "@/lib/admin-mock";

const STATUS_MAP: Record<string, { label: string; text: string }> = {
    active: { label: "Ativo", text: "text-foreground" },
    suspended: { label: "Suspenso", text: "text-muted-foreground" },
    banned: { label: "Banido", text: "text-red-500" },
};

const ROLE_BADGE: Record<string, string> = {
    user: "text-muted-foreground bg-muted/20 border-border/50",
    admin: "text-[#0066fe] bg-[#0066fe]/10 border-[#0066fe]/20",
    dev: "text-foreground bg-muted/40 border-border",
    owner: "text-foreground bg-foreground/10 border-foreground/20",
};

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
        <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-10">
                <div>
                    <h1 className="text-3xl font-serif font-semibold text-foreground tracking-tight">Users</h1>
                    <p className="text-sm text-muted-foreground mt-1">Gerenciar base de usuários e acessos</p>
                </div>
                <RoleGuard requires="owner">
                    <button className={cn(
                        "flex items-center gap-2 h-10 px-5 rounded-full text-sm font-medium transition-colors",
                        "border border-border/50 bg-background text-foreground hover:bg-muted/20",
                    )}>
                        <AppIcon name="Download" className="h-[15px] w-[15px] opacity-60" />
                        Exportar CSV
                    </button>
                </RoleGuard>
            </div>

            {/* Filters (Clean) */}
            <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-border/30 pb-6">
                <div className="relative w-full sm:w-auto min-w-[180px]">
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className={cn(
                            "h-10 w-full rounded-2xl border border-border/50 bg-transparent px-4 pr-10",
                            "text-sm font-medium text-foreground outline-none focus:border-[#0066fe] focus:ring-1 focus:ring-[#0066fe] transition-all cursor-pointer appearance-none",
                        )}
                    >
                        <option value="all">Todos os status</option>
                        <option value="active">Ativo</option>
                        <option value="suspended">Suspenso</option>
                        <option value="banned">Banido</option>
                    </select>
                    <AppIcon name="ChevronDown" className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                <div className="relative w-full sm:w-auto min-w-[180px]">
                    <select
                        value={planFilter}
                        onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
                        className={cn(
                            "h-10 w-full rounded-2xl border border-border/50 bg-transparent px-4 pr-10",
                            "text-sm font-medium text-foreground outline-none focus:border-[#0066fe] focus:ring-1 focus:ring-[#0066fe] transition-all cursor-pointer appearance-none",
                        )}
                    >
                        <option value="all">Todos os planos</option>
                        <option value="Free">Free</option>
                        <option value="Pro">Pro</option>
                        <option value="Max">Max</option>
                        <option value="Max 5x">Max 5x</option>
                    </select>
                    <AppIcon name="ChevronDown" className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
            </div>

            {/* Table */}
            <div className="border border-border/30 rounded-3xl overflow-hidden bg-background">
                <AdminTable
                    columns={[
                        {
                            key: "name", label: "Usuário", render: (r) => (
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-muted/10 border border-border/20 flex items-center justify-center">
                                        <AppIcon name="UserIcon" className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-foreground">{r.name}</span>
                                        <span className="text-xs text-muted-foreground">{r.email}</span>
                                    </div>
                                </div>
                            )
                        },
                        {
                            key: "status", label: "Status", render: (r) => {
                                const st = STATUS_MAP[r.status] || STATUS_MAP.active;
                                return (
                                    <span className={cn("text-xs font-semibold", st.text)}>
                                        {st.label}
                                    </span>
                                );
                            }
                        },
                        {
                            key: "role", label: "Role", render: (r) => (
                                <span className={cn(
                                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                    ROLE_BADGE[r.role] || ROLE_BADGE.user,
                                )}>
                                    {r.role}
                                </span>
                            )
                        },
                        { key: "credits", label: "Créditos", render: (r) => <span className="text-sm font-medium tabular-nums text-foreground">{r.credits}</span> },
                        { key: "createdAt", label: "Cadastro", render: (r) => <span className="text-xs text-muted-foreground">{r.createdAt}</span> },
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
        </div>
    );
}
