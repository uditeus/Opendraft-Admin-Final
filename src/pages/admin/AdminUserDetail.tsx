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

import { motion, AnimatePresence } from "framer-motion";

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
        <div className="flex flex-col w-full h-full pb-20">
            {/* Header - Sophisticated */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16 mt-8">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate("/admin/users")}
                        className="h-12 w-12 grid place-items-center rounded-2xl border border-border/10 text-muted-foreground/40 hover:text-foreground hover:border-border/30 transition-all bg-muted/5 group shadow-sm hover:shadow-md"
                    >
                        <AppIcon name="ArrowLeft" className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-[38px] font-serif font-normal text-foreground tracking-tight leading-tight">{u.name}</h1>
                            <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase",
                                u.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                            )}>
                                {u.status}
                            </span>
                        </div>
                        <p className="text-[14px] text-muted-foreground/60 font-normal">
                            {u.email} <span className="mx-2 opacity-20">/</span> <span className="font-mono text-[11px] font-medium tracking-tight bg-muted/5 px-2 py-0.5 rounded uppercase">{id}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <RoleGuard requires="admin">
                        <button
                            onClick={() => setCreditModal(true)}
                            className="h-10 px-6 rounded-full text-[13px] font-medium bg-muted/5 border border-border/10 text-foreground/80 hover:bg-muted/10 transition-all"
                        >
                            Adicionar Créditos
                        </button>
                    </RoleGuard>
                    <RoleGuard requires="admin">
                        <button
                            onClick={() => setSuspendModal(true)}
                            className="h-10 px-6 rounded-full text-[13px] font-medium border border-amber-500/10 text-amber-500/80 hover:bg-amber-500/5 transition-all"
                        >
                            Suspender
                        </button>
                    </RoleGuard>
                    <RoleGuard requires="dev">
                        <button
                            onClick={() => setBanModal(true)}
                            className="h-10 px-6 rounded-full text-[13px] font-medium border border-red-500/10 text-red-500/80 hover:bg-red-500/5 transition-all"
                        >
                            Banir
                        </button>
                    </RoleGuard>
                </div>
            </div>

            {/* Tabs - Modern Underline Style */}
            <div className="flex items-center gap-2 mb-16 border-b border-border/5">
                {TABS.map((tab, i) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(i)}
                        className={cn(
                            "px-6 py-4 text-[13.5px] font-medium transition-all relative whitespace-nowrap",
                            activeTab === i
                                ? "text-foreground"
                                : "text-muted-foreground/40 hover:text-foreground/80",
                        )}
                    >
                        {tab}
                        {activeTab === i && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content - High Quality Views */}
            <div className="w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {activeTab === 0 && (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
                                {[
                                    { label: "Status", value: u.status === "active" ? "Ativo" : "Restrito", secondary: u.status.toUpperCase() },
                                    { label: "Plano", value: u.plan, secondary: "Assinatura mensal" },
                                    { label: "Créditos", value: u.credits, secondary: "Disponíveis" },
                                    { label: "Privilégio", value: u.role, secondary: "Nível de acesso" },
                                    { label: "Cadastro", value: u.createdAt, secondary: "Data de registro" },
                                    { label: "Último Login", value: u.lastLogin, secondary: u.lastLoginIp },
                                    { label: "Total Copies", value: u.totalCopies.toLocaleString(), secondary: "Entregues" },
                                    { label: "Tokens", value: u.totalTokens, secondary: "Consumo total" },
                                ].map((item) => (
                                    <div key={item.label} className="flex flex-col">
                                        <span className="text-[11px] font-medium text-muted-foreground/30 uppercase tracking-widest mb-4">{item.label}</span>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[28px] font-normal text-foreground/90 font-serif lowercase first-letter:uppercase tracking-tight leading-none">{item.value}</span>
                                            <span className="text-[11px] text-muted-foreground/40 font-medium tabular-nums">{item.secondary}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 1 && (
                            <div className="max-w-xl">
                                <h3 className="text-[20px] font-serif text-foreground/90 mb-10 tracking-tight">Assinatura Atual</h3>
                                <div className="space-y-6">
                                    {[
                                        { label: "Plano", value: u.plan, icon: "Diamond" },
                                        { label: "Status Financeiro", value: "Ativo", color: "text-emerald-500" },
                                        { label: "Valor Mensal", value: "R$ 97,00", tabular: true },
                                        { label: "Próxima Cobrança", value: "14 de Abril, 2025", tabular: true },
                                        { label: "Cartão de Crédito", value: "**** 4242", secondary: "Mastercard" },
                                        { label: "Gateway de Pagamento", value: "Stripe", secondary: "ID: sub_1qSdf4..." },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center justify-between py-4 border-b border-border/5">
                                            <span className="text-[13.5px] font-normal text-muted-foreground/60">{item.label}</span>
                                            <div className="flex flex-col items-end">
                                                <span className={cn("text-[14px] font-medium text-foreground/90", item.color, item.tabular && "tabular-nums")}>
                                                    {item.value}
                                                </span>
                                                {item.secondary && (
                                                    <span className="text-[11px] text-muted-foreground/30 font-medium">{item.secondary}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 2 && (
                            <div className="max-w-2xl">
                                <h3 className="text-[20px] font-serif text-foreground/90 mb-10 tracking-tight">Timeline de Atividade</h3>
                                <div className="space-y-2">
                                    {[
                                        { time: "14:32", msg: "Gerou copy", detail: "Template: Post Instagram" },
                                        { time: "14:28", msg: "Acessou biblioteca", detail: "Busca por \"vendas\"" },
                                        { time: "13:45", msg: "Login realizado", detail: "Sucesso · Mobile Browser" },
                                        { time: "11:20", msg: "Gerou copy", detail: "Template: Email Marketing" },
                                        { time: "10:05", msg: "Alterou configurações", detail: "Troca de foto de perfil" },
                                    ].map((a, i) => (
                                        <div key={i} className="flex items-start gap-8 py-5 border-b border-border/5 group hover:bg-muted/5 -mx-4 px-4 rounded-xl transition-all">
                                            <span className="text-[12px] text-muted-foreground/30 font-mono w-16 pt-1 tabular-nums">{a.time}</span>
                                            <div className="flex flex-col">
                                                <span className="text-[14px] font-medium text-foreground/80 leading-snug">{a.msg}</span>
                                                <span className="text-[12px] text-muted-foreground/50 font-normal">{a.detail}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 3 && (
                            <div className="max-w-xl">
                                <h3 className="text-[20px] font-serif text-foreground/90 mb-10 tracking-tight">Segurança da Conta</h3>
                                <div className="space-y-6">
                                    {[
                                        { label: "Autenticação em 2 Etapas", value: "Desativado", important: true },
                                        { label: "Método de Autenticação", value: "E-mail e Senha" },
                                        { label: "IP de Acesso (Último)", value: u.lastLoginIp, tabular: true },
                                        { label: "Sessões Ativas", value: "2 dispositivos", tabular: true },
                                        { label: "Última Troca de Senha", value: "12 de Dez, 2024", tabular: true },
                                        { label: "Verificação de E-mail", value: "Verificado em Jan 2024", color: "text-emerald-500" },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center justify-between py-4 border-b border-border/5">
                                            <span className="text-[13.5px] font-normal text-muted-foreground/60">{item.label}</span>
                                            <span className={cn("text-[14px] font-medium text-foreground/90", item.color, item.tabular && "tabular-nums")}>
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 4 && (
                            <div className="max-w-2xl">
                                <h3 className="text-[20px] font-serif text-foreground/90 mb-8 tracking-tight">Arquivo Interno (Audit)</h3>
                                <div className="relative">
                                    <textarea
                                        rows={10}
                                        placeholder="Início de novas observações administrativas sobre o perfil..."
                                        className={cn(
                                            "w-full rounded-[20px] border border-border/10 bg-muted/5 p-6",
                                            "text-[14.5px] text-foreground/80 placeholder:text-muted-foreground/20 outline-none resize-none",
                                            "focus:border-border/30 transition-all leading-relaxed shadow-inner",
                                        )}
                                    />
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <button className="h-11 px-10 rounded-full text-[14px] font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
                                        Salvar Observações
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Modals - Already integrated, just style check if needed */}
            <ConfirmModal
                isOpen={creditModal}
                onClose={() => setCreditModal(false)}
                onConfirm={() => setCreditModal(false)}
                title="Conceder Créditos"
                description={`Defina a quantidade de créditos adicionais para ${u.name}.`}
                confirmButtonLabel="Adicionar"
            >
                <div className="flex flex-col gap-4 mt-6">
                    <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/40">Quantidade</label>
                    <input
                        type="number"
                        value={credits}
                        onChange={(e) => setCredits(Number(e.target.value))}
                        className={cn(
                            "h-14 w-full rounded-2xl border border-border/10 bg-muted/5 px-6 font-serif",
                            "text-2xl text-foreground outline-none focus:border-border/30 transition-all",
                        )}
                    />
                </div>
            </ConfirmModal>

            <ConfirmModal
                isOpen={suspendModal}
                onClose={() => setSuspendModal(false)}
                onConfirm={() => setSuspendModal(false)}
                title="Suspender Acesso"
                description={`O usuário ${u.name} não poderá entrar na plataforma até que a restrição seja removida.`}
                confirmButtonLabel="Confirmar Suspensão"
                destructive
            />

            <ConfirmModal
                isOpen={banModal}
                onClose={() => setBanModal(false)}
                onConfirm={() => setBanModal(false)}
                title="Banimento Irreversível"
                description={`Esta ação apagará as permissões de ${u.name} permanentemente. É impossível desfazer.`}
                confirmButtonLabel="Banir Permanentemente"
                destructive
            />
        </div>
    );
}
