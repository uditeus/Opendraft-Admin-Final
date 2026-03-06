import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { RoleGuard } from "@/components/admin/RoleGuard";
import { AppIcon } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";

const TABS = ["Visão Geral", "Assinatura", "Atividade", "Segurança", "Notas Admin"];

const MOCK_USER = {
    id: "usr_1",
    name: "Bruno Mendes",
    email: "bruno@example.com",
    role: "user" as const,
    status: "active" as const,
    plan: "Pro",
    credits: 127,
    createdAt: "14/01/2024",
    lastLogin: "05/03/2025 14:32",
    lastLoginIp: "189.40.xxx.xxx",
    totalCopies: 847,
    totalTokens: "1.2M",
    sessions: 214,
};

export default function AdminUserDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = React.useState(0);
    const [creditModal, setCreditModal] = React.useState(false);
    const [suspendModal, setSuspendModal] = React.useState(false);
    const [banModal, setBanModal] = React.useState(false);
    const [credits, setCredits] = React.useState(50);

    const u = MOCK_USER;

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <button
                    onClick={() => navigate("/admin/users")}
                    className="chat-focus h-9 w-9 grid place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/20 transition-colors"
                >
                    <AppIcon name="ArrowLeft" className="h-4 w-4" />
                </button>
                <div className="flex-1">
                    <h1 className="text-[22px] font-semibold text-foreground tracking-tight">{u.name}</h1>
                    <p className="text-[13px] text-muted-foreground">{u.email} · {id}</p>
                </div>
                <div className="flex items-center gap-2">
                    <RoleGuard requires="admin">
                        <button onClick={() => setCreditModal(true)} className={cn(
                            "chat-focus flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-medium transition-colors",
                            "border border-sidebar-border/40 text-foreground/60 hover:text-foreground hover:bg-sidebar-accent/20",
                        )}>
                            <AppIcon name="Plus" className="h-3.5 w-3.5" />
                            Créditos
                        </button>
                    </RoleGuard>
                    <RoleGuard requires="admin">
                        <button onClick={() => setSuspendModal(true)} className={cn(
                            "chat-focus flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-medium transition-colors",
                            "border border-amber-500/30 text-amber-400 hover:bg-amber-500/10",
                        )}>
                            Suspender
                        </button>
                    </RoleGuard>
                    <RoleGuard requires="dev">
                        <button onClick={() => setBanModal(true)} className={cn(
                            "chat-focus flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-medium transition-colors",
                            "border border-red-500/30 text-red-400 hover:bg-red-500/10",
                        )}>
                            Banir
                        </button>
                    </RoleGuard>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-sidebar-border/30 pb-0">
                {TABS.map((tab, i) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(i)}
                        className={cn(
                            "px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors -mb-[1px]",
                            activeTab === i
                                ? "border-foreground text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground",
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            ["Status", u.status === "active" ? "🟢 Ativo" : u.status === "suspended" ? "🟡 Suspenso" : "🔴 Banido"],
                            ["Plano", u.plan],
                            ["Créditos", String(u.credits)],
                            ["Role", u.role.toUpperCase()],
                            ["Cadastro", u.createdAt],
                            ["Último login", u.lastLogin],
                            ["Total copies", String(u.totalCopies)],
                            ["Total tokens", u.totalTokens],
                            ["Sessões", String(u.sessions)],
                            ["IP último login", u.lastLoginIp],
                        ].map(([label, value]) => (
                            <div key={label} className="rounded-xl border border-sidebar-border/40 bg-sidebar-accent/10 p-4">
                                <span className="text-[11px] text-muted-foreground block mb-1">{label}</span>
                                <span className="text-[15px] font-medium text-foreground/80">{value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 1 && (
                    <div className="rounded-xl border border-sidebar-border/40 bg-sidebar-accent/10 p-6">
                        <h3 className="text-[15px] font-semibold text-foreground mb-4">Detalhes da assinatura</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                ["Plano atual", u.plan],
                                ["Status", "Ativo"],
                                ["Preço", "R$ 97/mês"],
                                ["Próxima renovação", "14/04/2025"],
                                ["Método", "Cartão ****4242"],
                                ["Gateway", "Stripe"],
                            ].map(([l, v]) => (
                                <div key={l} className="flex flex-col py-2 border-b border-sidebar-border/20">
                                    <span className="text-[11px] text-muted-foreground">{l}</span>
                                    <span className="text-sm text-foreground/80 font-medium">{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 2 && (
                    <div className="rounded-xl border border-sidebar-border/40 bg-sidebar-accent/10 p-6">
                        <h3 className="text-[15px] font-semibold text-foreground mb-4">Atividade recente</h3>
                        <div className="space-y-3">
                            {[
                                { time: "14:32", msg: "Gerou copy — Template: Post Instagram" },
                                { time: "14:28", msg: "Acessou biblioteca" },
                                { time: "13:45", msg: "Login realizado" },
                                { time: "11:20", msg: "Gerou copy — Template: Email Marketing" },
                                { time: "10:05", msg: "Alterou configurações da conta" },
                            ].map((a, i) => (
                                <div key={i} className="flex items-center gap-4 py-2 border-b border-sidebar-border/20">
                                    <span className="text-[11px] text-muted-foreground font-mono w-12">{a.time}</span>
                                    <span className="text-[13px] text-foreground/70">{a.msg}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 3 && (
                    <div className="rounded-xl border border-sidebar-border/40 bg-sidebar-accent/10 p-6">
                        <h3 className="text-[15px] font-semibold text-foreground mb-4">Segurança</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                ["2FA ativo", "Não"],
                                ["Provider", "Email/Senha"],
                                ["IP último login", u.lastLoginIp],
                                ["Sessões ativas", "2"],
                                ["Último reset de senha", "12/12/2024"],
                                ["Email verificado", "Sim"],
                            ].map(([l, v]) => (
                                <div key={l} className="flex flex-col py-2 border-b border-sidebar-border/20">
                                    <span className="text-[11px] text-muted-foreground">{l}</span>
                                    <span className="text-sm text-foreground/80 font-medium">{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 4 && (
                    <div className="rounded-xl border border-sidebar-border/40 bg-sidebar-accent/10 p-6">
                        <h3 className="text-[15px] font-semibold text-foreground mb-4">Notas do admin</h3>
                        <textarea
                            rows={5}
                            placeholder="Adicione notas sobre este usuário..."
                            className={cn(
                                "w-full rounded-lg border border-sidebar-border/40 bg-sidebar-accent/10 p-3",
                                "text-sm text-foreground placeholder:text-muted-foreground/50 outline-none resize-none",
                                "focus:border-sidebar-primary/40 transition-colors",
                            )}
                        />
                        <button className={cn(
                            "mt-3 chat-focus h-9 px-4 rounded-lg text-sm font-medium transition-colors",
                            "bg-sidebar-primary text-sidebar-primary-foreground hover:opacity-90",
                        )}>
                            Salvar nota
                        </button>
                    </div>
                )}
            </div>

            {/* Modals */}
            <ConfirmModal
                isOpen={creditModal}
                onClose={() => setCreditModal(false)}
                onConfirm={() => setCreditModal(false)}
                title="Dar créditos"
                description={`Adicionar créditos para ${u.name}`}
                confirmButtonLabel="Confirmar"
            >
                <div className="flex flex-col gap-2">
                    <label className="text-[12px] text-muted-foreground">Quantidade</label>
                    <input
                        type="number"
                        value={credits}
                        onChange={(e) => setCredits(Number(e.target.value))}
                        className={cn(
                            "h-10 w-full rounded-lg border border-sidebar-border/40 bg-sidebar-accent/10 px-3",
                            "text-sm text-foreground outline-none focus:border-sidebar-primary/40",
                        )}
                    />
                </div>
            </ConfirmModal>

            <ConfirmModal
                isOpen={suspendModal}
                onClose={() => setSuspendModal(false)}
                onConfirm={() => setSuspendModal(false)}
                title="Suspender usuário"
                description={`Tem certeza que deseja suspender ${u.name}?`}
                confirmText="SUSPENDER"
                confirmButtonLabel="Suspender"
                destructive
            />

            <ConfirmModal
                isOpen={banModal}
                onClose={() => setBanModal(false)}
                onConfirm={() => setBanModal(false)}
                title="Banir usuário"
                description={`Esta ação é permanente. O usuário ${u.name} perderá todo o acesso.`}
                confirmText="BANIR"
                confirmButtonLabel="Banir permanentemente"
                destructive
            />
        </div>
    );
}
