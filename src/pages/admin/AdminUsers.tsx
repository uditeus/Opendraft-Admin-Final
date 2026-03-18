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
    admin: "text-foreground bg-foreground/10 border-foreground/20",
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
        <div className="flex flex-col w-full h-full pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 mt-8">
                <div>
                    <h1 className="text-[42px]  font-normal text-foreground tracking-tight leading-tight">Users</h1>
                    <p className="text-[15px] text-muted-foreground mt-3 font-normal">Base de dados central com 1.248 usuários ativos na plataforma.</p>
                </div>
            </div>

            {/* Quick Filters (Pill Style like Library) */}
            <div className="flex flex-col gap-8 mb-16">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest mr-2">Status</span>
                    {[
                        { key: "all", label: "Todos" },
                        { key: "active", label: "Ativos" },
                        { key: "suspended", label: "Suspensos" },
                    ].map((f) => (
                        <button
                            key={f.key}
                            onClick={() => { setStatusFilter(f.key); setPage(1); }}
                            className={cn(
                                "h-9 px-5 rounded-full text-[13px] font-medium transition-all border",
                                statusFilter === f.key
                                    ? "bg-foreground text-background border-foreground shadow-sm"
                                    : "bg-muted/5 border-border/10 text-muted-foreground hover:border-border/20 hover:text-foreground"
                            )}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest mr-2">Plano</span>
                    {[
                        { key: "all", label: "Todos" },
                        { key: "Free", label: "Free" },
                        { key: "Pro", label: "Pro" },
                        { key: "Max", label: "Max" },
                    ].map((f) => (
                        <button
                            key={f.key}
                            onClick={() => { setPlanFilter(f.key); setPage(1); }}
                            className={cn(
                                "h-9 px-5 rounded-full text-[13px] font-medium transition-all border",
                                planFilter === f.key
                                    ? "bg-foreground text-background border-foreground shadow-sm"
                                    : "bg-muted/5 border-border/10 text-muted-foreground hover:border-border/20 hover:text-foreground"
                            )}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="w-full">
                <AdminTable
                    columns={[
                        {
                            key: "name", label: "Usuário", render: (r) => (
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-muted/10 border border-border/10 flex items-center justify-center shrink-0">
                                        <AppIcon name="UserIcon" className="h-[18px] w-[18px] text-muted-foreground/60" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[14.5px] font-medium text-foreground truncate">{r.name}</span>
                                        <span className="text-[12px] text-muted-foreground/50 truncate font-normal mt-0.5">{r.email}</span>
                                    </div>
                                </div>
                            )
                        },
                        {
                            key: "status", label: "Status", render: (r) => {
                                const st = STATUS_MAP[r.status] || STATUS_MAP.active;
                                return (
                                    <div className="flex items-center gap-2">
                                        <div className={cn("h-1.5 w-1.5 rounded-full",
                                            r.status === 'active' ? "bg-emerald-500" :
                                                r.status === 'suspended' ? "bg-amber-500" : "bg-red-500"
                                        )} />
                                        <span className={cn("text-[13px] font-normal", st.text)}>
                                            {st.label}
                                        </span>
                                    </div>
                                );
                            }
                        },
                        {
                            key: "role", label: "Permissão", render: (r) => (
                                <span className={cn(
                                    "px-3 py-1 rounded-lg text-[11px] font-medium capitalize",
                                    r.role === 'admin' || r.role === 'owner' ? "bg-foreground/5 text-foreground border border-foreground/10" : "bg-muted/5 text-muted-foreground border border-border/5"
                                )}>
                                    {r.role}
                                </span>
                            )
                        },
                        { key: "credits", label: "Créditos", render: (r) => <span className="text-[14px] font-medium tabular-nums text-foreground">{r.credits}</span> },
                        { key: "createdAt", label: "Cadastro", render: (r) => <span className="text-[12px] text-muted-foreground/40 font-normal tabular-nums">{r.createdAt}</span> },
                    ]}
                    data={paginated}
                    keyExtractor={(r) => r.id}
                    page={page}
                    pageSize={pageSize}
                    total={filtered.length}
                    onPageChange={setPage}
                    searchValue={search}
                    onSearchChange={(v) => { setSearch(v); setPage(1); }}
                    searchPlaceholder="Nome, email ou identificador..."
                    onRowClick={(r) => navigate(`/admin/users/${r.id}`)}
                    emptyMessage="Nenhum usuário corresponde aos critérios"
                />
            </div>
        </div>
    );
}
