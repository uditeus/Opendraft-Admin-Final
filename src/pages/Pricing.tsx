import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { AppIcon, createAppIcon } from "@/components/icons/AppIcon";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Globe, Check, X, Search } from "lucide-react";

// ─── Plan data (Synchronized with Upgrade.tsx) ───────────────────────────────

const PLANS = [
    {
        id: "pro",
        name: "Pro",
        tagline: "Para uso intensivo diário.",
        price: { monthly: "20", yearly: "16" },
        currency: "$",
        perUser: false,
        cta: "Assinar Pro",
        headerNote: null as string | null,
        mainFeatures: [
            "100 créditos Opendraft*",
            "Acesso ao Opendraft 1.5 Pro",
            "Playbooks e agentes personalizados",
            "Estilos de escrita personalizados",
            "Acesso antecipado a novos recursos",
            "Exportação PDF e Docx",
            "Suporte via chat",
        ],
    },
    {
        id: "max",
        name: "Max",
        tagline: "Para produtores de alto volume.",
        price: { monthly: "100", yearly: "80" },
        currency: "$",
        perUser: false,
        cta: "Assinar Max",
        headerNote: "Tudo do Pro, mais:",
        mainFeatures: [
            "200 créditos Opendraft*",
            "Todos os modelos Opendraft",
            "Integração com ferramentas de marketing",
            "Acesso à API",
            "Suporte prioritário",
            "Compartilhamento de playbooks",
            "Painel de uso da equipe",
        ],
    },
    {
        id: "ultra",
        name: "Ultra",
        tagline: "Para equipes de alta performance.",
        price: { monthly: "500", yearly: "400" },
        currency: "$",
        perUser: true,
        cta: "Assinar Ultra",
        headerNote: "Tudo do Max, mais:",
        mainFeatures: [
            "400 créditos Opendraft*",
            "Gestão de membros e permissões",
            "Faturamento centralizado",
            "Relatórios de produção",
            "Retenção de dados configurável",
            "SSO / SAML",
            "SLA garantido",
        ],
    },
];

// ─── Comparison Data ────────────────────────────────────────────────────────

const COMPARISON = [
    {
        title: "Modelos e Inteligência",
        rows: [
            { label: "Opendraft 1.5 Pro (Equilibrado)", pro: true, max: true, max5x: true },
            { label: "Opendraft 1.5 Ultra (Alta Complexidade)", pro: "Limitado", max: true, max5x: true },
            { label: "Janela de contexto estendida (128k)", pro: true, max: true, max5x: true },
            { label: "Janela de contexto massiva (1M+)", pro: false, max: true, max5x: true },
            { label: "Pesquisa na web em tempo real", pro: true, max: true, max5x: true },
            { label: "Visão computacional e análise de imagens", pro: true, max: true, max5x: true },
            { label: "Citações e fontes verificadas", pro: true, max: true, max5x: true },
            { label: "Memória de longo prazo personalizada", pro: false, max: true, max5x: true },
        ],
    },
    {
        title: "Criação e Produtividade",
        rows: [
            { label: "Geração de copy e textos ilimitada", pro: true, max: true, max5x: true },
            { label: "Opendraft Code (Ambiente de código)", pro: true, max: true, max5x: true },
            { label: "Opendraft Canvas (Editor visual)", pro: false, max: true, max5x: true },
            { label: "Geração de imagens (DALL-E 3 / Flux)", pro: "Padrão", max: "Alta Definição", max5x: "Ultra HD" },
            { label: "Análise de documentos (PDF, Docx, CSV)", pro: "Até 10MB", max: "Até 100MB", max5x: "Até 1GB" },
            { label: "Estilos de escrita treináveis", pro: "1 estilo", max: "10 estilos", max5x: "Ilimitados" },
            { label: "Playbooks e automação de prompts", pro: "Pessoais", max: "Compartilhados", max5x: "Enterprise" },
            { label: "Exportação para PDF, Docx e Google Docs", pro: true, max: true, max5x: true },
        ],
    },
    {
        title: "Integrações e Ecossistema",
        rows: [
            { label: "Extensão para Google Chrome", pro: true, max: true, max5x: true },
            { label: "Opendraft para Excel e Sheets", pro: false, max: true, max5x: true },
            { label: "Opendraft para PowerPoint e Slides", pro: false, max: true, max5x: true },
            { label: "Webhooks e integrações customizadas", pro: false, max: true, max5x: true },
            { label: "Acesso total à API Opendraft", pro: false, max: true, max5x: true },
            { label: "SDKs para Python e Node.js", pro: false, max: true, max5x: true },
        ],
    },
    {
        title: "Equipes e Colaboração",
        rows: [
            { label: "Espaços de trabalho compartilhados", pro: false, max: true, max5x: true },
            { label: "Biblioteca de Playbooks da equipe", pro: false, max: true, max5x: true },
            { label: "Painel de analytics e uso", pro: false, max: true, max5x: true },
            { label: "Gestão de membros e permissões", pro: false, max: false, max5x: true },
            { label: "Relatórios de ROI e produtividade", pro: false, max: false, max5x: true },
            { label: "Faturamento centralizado", pro: false, max: false, max5x: true },
        ],
    },
    {
        title: "Segurança e Conformidade",
        rows: [
            { label: "Criptografia de dados em repouso (AES-256)", pro: true, max: true, max5x: true },
            { label: "Dados não usados para treinamento", pro: true, max: true, max5x: true },
            { label: "Single Sign-On (SSO / SAML)", pro: false, max: false, max5x: true },
            { label: "Retenção de dados configurável", pro: false, max: false, max5x: true },
            { label: "Logs de auditoria e conformidade", pro: false, max: false, max5x: true },
            { label: "Conformidade com HIPAA e GDPR", pro: false, max: false, max5x: true },
            { label: "SLA de disponibilidade (99.9%)", pro: false, max: false, max5x: true },
        ],
    },
    {
        title: "Suporte e Sucesso do Cliente",
        rows: [
            { label: "Central de Ajuda e Documentação", pro: true, max: true, max5x: true },
            { label: "Suporte via Chat (Horário Comercial)", pro: true, max: true, max5x: true },
            { label: "Suporte Prioritário 24/7", pro: false, max: true, max5x: true },
            { label: "Gerente de Sucesso Dedicado", pro: false, max: false, max5x: true },
            { label: "Treinamentos e Onboarding", pro: false, max: "Webinars", max5x: "Personalizado" },
        ],
    },
];

// ─── Navbar Component (Synchronized with PaginaTest.tsx) ──────────────────────

const OpendraftNavbar = ({ isDark }: { isDark: boolean }) => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const navigate = useNavigate();

    const menuItems = [
        {
            id: 'produto',
            label: 'Produto',
            dropdown: {
                main: ['Visão Geral', 'IA Generativa', 'Opendraft Pro', 'Templates', 'Histórico', 'Enterprise'],
                links: ['Novidades', 'Roadmap', 'Segurança'],
                extra: ['Documentação', 'API Reference']
            }
        },
        {
            id: 'recursos',
            label: 'Recursos',
            dropdown: {
                main: ['Central de Ajuda', 'Blog', 'Comunidade', 'Eventos', 'Webinars', 'Estudos de Case'],
                links: ['Newsletter', 'Podcasts', 'Vídeos'],
                extra: ['Suporte', 'Contato']
            }
        },
        {
            id: 'soluções',
            label: 'Soluções',
            dropdown: {
                main: ['Marketing', 'Vendas', 'Educação', 'Desenvolvedores', 'Finanças', 'RH'],
                links: ['Startups', 'Agências', 'Pequenas Empresas'],
                extra: ['Consultoria', 'Parceiros']
            }
        },
        {
            id: 'funcionalidades',
            label: 'Funcionalidades',
            dropdown: {
                main: ['Editor de Texto', 'Análise de IA', 'Exportação Inteligente', 'Time Real', 'Workflow', 'Customização'],
                links: ['Extensões', 'Mobile App', 'Desktop App'],
                extra: ['Beta Program', 'Open Source']
            }
        },
        { id: 'preços', label: 'Preços' },
    ];

    return (
        <nav
            data-fixed
            className={cn(
                "fixed top-0 left-0 right-0 z-[60] h-[52px] flex items-center bg-background text-foreground border-b border-border/5"
            )}
            onMouseLeave={() => setActiveMenu(null)}
        >
            <div className="max-w-[1440px] mx-auto w-full flex items-center px-8 text-[14px] font-normal tracking-tight font-inter">
                <div className="flex items-center gap-10">
                    <div
                        className="flex items-center gap-2 cursor-pointer transition-all hover:opacity-100"
                        onClick={() => navigate('/')}
                    >
                        <img
                            src="https://i.imgur.com/wlz2FUz.png"
                            alt="Opendraft Logo"
                            className="h-[18px] w-auto brightness-0 dark:invert"
                        />
                        <span className="text-[18px] font-semibold tracking-tighter text-black dark:text-white">
                            Opendraft
                        </span>
                    </div>

                    <div className="flex items-center gap-5 ml-2">
                        {menuItems.map((item) => (
                            <div key={item.id} className="relative">
                                <div
                                    className={cn(
                                        "py-2 px-1 cursor-pointer transition-colors text-foreground/60 hover:text-foreground font-medium",
                                        (activeMenu === item.id || (item.id === 'preços')) && "text-foreground opacity-100"
                                    )}
                                    onMouseEnter={() => {
                                        if (item.dropdown) {
                                            setActiveMenu(item.id);
                                        } else {
                                            setActiveMenu(null);
                                        }
                                    }}
                                    onClick={() => {
                                        if (item.id === 'preços') navigate('/pricing');
                                    }}
                                >
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-6">
                    <div
                        className="py-2 px-1 cursor-pointer transition-colors text-foreground/60 hover:text-foreground font-medium text-[14px]"
                        onClick={() => navigate('/login')}
                    >
                        Entrar
                    </div>

                    <div
                        className={cn(
                            "flex items-center cursor-pointer transition-all text-foreground/40 hover:text-foreground",
                            activeMenu === 'search' && "text-foreground opacity-100"
                        )}
                        onClick={() => setActiveMenu(activeMenu === 'search' ? null : 'search')}
                    >
                        <Search size={16} strokeWidth={2.5} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {activeMenu && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-[52px] left-0 right-0 bottom-0 bg-black/5 dark:bg-black/20 backdrop-blur-[3px] z-[35]"
                        onMouseEnter={() => setActiveMenu(null)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {activeMenu && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute top-[52px] left-0 right-0 overflow-hidden z-40 bg-background border-b border-border/5"
                    >
                        {activeMenu === 'search' ? (
                            <div className="max-w-[1440px] mx-auto px-8 py-16 font-inter">
                                <div className="flex items-center gap-4 mb-10 text-foreground/85 max-w-[1000px]">
                                    <Search size={24} strokeWidth={2.5} className="opacity-40" />
                                    <input
                                        type="text"
                                        placeholder="Buscar em opendraft.com"
                                        className="bg-transparent text-[24px] font-semibold tracking-tight outline-none w-full placeholder:opacity-40 text-foreground placeholder:text-foreground"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-[1440px] mx-auto px-8 py-20 flex justify-start font-inter">
                                <div className="flex gap-32 lg:gap-48">
                                    <div className="space-y-6">
                                        <div className="flex flex-col gap-4 text-[32px] md:text-[40px] font-semibold leading-[1.05] tracking-tight text-foreground">
                                            {menuItems.find(i => i.id === activeMenu)?.dropdown?.main.map((title, idx) => (
                                                <a key={idx} href="#" className="hover:opacity-40 transition-opacity text-foreground">{title}</a>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-20 pt-2">
                                        <div className="space-y-8 min-w-[160px]">
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">Últimos Avanços</p>
                                            <div className="flex flex-col gap-4 text-[14px] font-medium text-foreground">
                                                {menuItems.find(i => i.id === activeMenu)?.dropdown?.links.map((title, idx) => (
                                                    <a key={idx} href="#" className="hover:opacity-60 transition-opacity text-foreground">{title}</a>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-8 min-w-[160px]">
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">Recursos</p>
                                            <div className="flex flex-col gap-4 text-[14px] font-medium text-foreground">
                                                {menuItems.find(i => i.id === activeMenu)?.dropdown?.extra.map((title, idx) => (
                                                    <a key={idx} href="#" className="hover:opacity-60 transition-opacity text-foreground">{title}</a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function PricingPage() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
    const [searchTerm, setSearchTerm] = useState("");
    const [collapsedSections, setCollapsedSections] = useState<string[]>([]);
    const navigate = useNavigate();

    const toggleSection = (title: string) => {
        setCollapsedSections(prev =>
            prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
        );
    };

    const filteredComparison = useMemo(() => {
        if (!searchTerm) return COMPARISON;
        return COMPARISON.map(section => ({
            ...section,
            rows: section.rows.filter(row =>
                row.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
        })).filter(section => section.rows.length > 0);
    }, [searchTerm]);

    useEffect(() => {
        setMounted(true);
        document.title = "Preços | Opendraft";
    }, []);

    const isDark = mounted ? resolvedTheme === 'dark' : true;

    return (
        <div className={cn(
            "min-h-screen w-full font-inter bg-background text-foreground"
        )}>
            <OpendraftNavbar isDark={isDark} />

            <main className="max-w-[1440px] mx-auto px-8 pt-[200px] pb-32">
                {/* Centered Headline */}
                <div className="text-center mb-16">
                    <h1 className="text-[48px] font-medium tracking-tight text-foreground mb-12">
                        Preços
                    </h1>

                    {/* Billing toggle from Upgrade.tsx */}
                    <div className="inline-flex items-center bg-zinc-100 dark:bg-[#181a1b] rounded-xl p-0.5 border border-black/[0.06] dark:border-white/[0.05]">
                        {(["yearly", "monthly"] as const).map((cycle) => (
                            <button
                                key={cycle}
                                onClick={() => setBilling(cycle)}
                                className={cn(
                                    "flex items-center px-6 h-8 rounded-lg text-[13px] font-medium transition-all duration-200",
                                    billing === cycle
                                        ? "bg-white dark:bg-[#131416] text-zinc-900 dark:text-zinc-100 shadow-sm"
                                        : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                )}
                            >
                                {cycle === "yearly" ? "Anual" : "Mensal"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cards (Identical to Upgrade.tsx, but wider) */}
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            className={cn(
                                "flex flex-col rounded-xl shadow-sm min-h-[600px] overflow-hidden transition-all duration-300",
                                isDark
                                    ? "bg-[#26292b] border-transparent shadow-black/20"
                                    : "bg-white border border-black/[0.06]"
                            )}
                        >
                            <div className="p-9 pb-7">
                                <p className="text-[24px] font-semibold text-foreground tracking-tight mb-0.5">
                                    {plan.name}
                                </p>
                                <p className="text-[13px] text-muted-foreground mb-5">
                                    {plan.tagline}
                                </p>

                                <div className="mb-5">
                                    <div className="flex items-end gap-1.5">
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={billing + plan.id}
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                transition={{ duration: 0.12 }}
                                                className="text-[38px] font-bold leading-none tracking-tight text-foreground"
                                            >
                                                {plan.currency}{billing === "yearly" ? plan.price.yearly : plan.price.monthly}
                                            </motion.span>
                                        </AnimatePresence>
                                        <span className="text-[12px] text-muted-foreground mb-1.5 leading-tight">
                                            /mês{plan.perUser && ", por usuário"}
                                        </span>
                                    </div>
                                    <AnimatePresence>
                                        {billing === "yearly" && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="text-[12px] text-muted-foreground mt-1 overflow-hidden"
                                            >
                                                cobrado anualmente
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full h-10 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-100 text-[13.5px] font-medium transition-all cursor-pointer"
                                >
                                    {plan.cta}
                                </button>
                            </div>

                            <div className="px-9 pb-9 pt-1 border-t border-border flex flex-col flex-1">
                                {plan.headerNote && (
                                    <p className="text-[12px] font-medium text-muted-foreground mb-3 pt-5">
                                        {plan.headerNote}
                                    </p>
                                )}
                                {!plan.headerNote && <div className="pt-5" />}
                                <ul className="flex flex-col gap-2.5">
                                    {plan.mainFeatures.map((feat) => (
                                        <li key={feat} className="flex items-start gap-2.5">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                                className="shrink-0 mt-0.5 text-zinc-400 dark:text-zinc-500">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            <span className="text-[13px] text-muted-foreground leading-snug">
                                                {feat}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detailed Comparison Table (Claude Style) */}
                <div className="w-full pt-32 mt-32 border-t border-border/10 overflow-visible font-inter">
                    <div className="text-center mb-24">
                        <h2 className="text-[48px] font-medium tracking-tight text-foreground dark:text-white">
                            Compare os recursos entre os planos
                        </h2>
                    </div>

                    <div className="w-full mb-12 flex items-center justify-between">
                        <div className="relative w-full max-w-[240px]">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type="text"
                                placeholder="Buscar recurso"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-9 pl-10 pr-4 bg-background dark:bg-white/5 border border-border/50 rounded-full text-[13px] text-foreground dark:text-white outline-none focus:border-white/20 transition-colors hover:cursor-default"
                            />
                        </div>

                        <div className="flex gap-40 pr-12">
                            <div className="w-20 text-center text-[14px] font-bold text-foreground/60 dark:text-white/60">Pro</div>
                            <div className="w-20 text-center text-[14px] font-bold text-foreground/60 dark:text-white/60">Max</div>
                            <div className="w-20 text-center text-[14px] font-bold text-foreground/60 dark:text-white/60">Max 5x</div>
                        </div>
                    </div>

                    <div className="space-y-0">
                        {filteredComparison.map((section) => {
                            const isCollapsed = collapsedSections.includes(section.title);
                            return (
                                <div key={section.title} className="border-t border-border/10">
                                    <button
                                        onClick={() => toggleSection(section.title)}
                                        className="w-full flex items-center justify-between py-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors group"
                                    >
                                        <h3 className="text-[15px] font-semibold text-foreground dark:text-white tracking-tight">{section.title}</h3>
                                        <div className="text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors">
                                            {isCollapsed ? (
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 1V11M1 6H11" /></svg>
                                            ) : (
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M1 6H11" /></svg>
                                            )}
                                        </div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {!isCollapsed && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-10 space-y-0.5">
                                                    {section.rows.map((row, idx) => (
                                                        <div
                                                            key={row.label + idx}
                                                            className="grid grid-cols-[1fr_auto] items-center py-2.5 px-2 rounded-lg transition-colors group"
                                                        >
                                                            <div className="text-[14px] text-foreground/60 dark:text-white/60 group-hover:text-foreground dark:group-hover:text-white transition-colors">{row.label}</div>
                                                            <div className="flex gap-40 pr-10">
                                                                <div className="w-20 flex justify-center">
                                                                    {typeof row.pro === 'boolean' ? (
                                                                        row.pro ? <div className="w-2 h-2 rounded-full bg-foreground/60" /> : <div className="w-1.5 h-[1.5px] bg-foreground/10" />
                                                                    ) : (
                                                                        <span className="text-[12px] font-medium text-foreground/50">{row.pro}</span>
                                                                    )}
                                                                </div>
                                                                <div className="w-20 flex justify-center">
                                                                    {typeof row.max === 'boolean' ? (
                                                                        row.max ? <div className="w-2 h-2 rounded-full bg-foreground/60" /> : <div className="w-1.5 h-[1.5px] bg-foreground/10" />
                                                                    ) : (
                                                                        <span className="text-[12px] font-medium text-foreground/50">{row.max}</span>
                                                                    )}
                                                                </div>
                                                                <div className="w-20 flex justify-center">
                                                                    {typeof row.max5x === 'boolean' ? (
                                                                        row.max5x ? <div className="w-2 h-2 rounded-full bg-foreground/60" /> : <div className="w-1.5 h-[1.5px] bg-foreground/10" />
                                                                    ) : (
                                                                        <span className="text-[12px] font-medium text-foreground/50">{row.max5x}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* Footer Section */}
            <footer className="w-full bg-white dark:bg-[#181a1b] pt-24 pb-12 border-t border-zinc-100 dark:border-zinc-800">
                <div className="max-w-[1440px] mx-auto px-8">
                    {/* Main Footer Links */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
                        {/* Column 1: Produto */}
                        <div className="flex flex-col gap-6">
                            <h4 className="text-[14px] font-semibold text-zinc-900 dark:text-white tracking-tight">Produto</h4>
                            <ul className="flex flex-col gap-4">
                                <li><a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Playbooks de criação</a></li>
                                <li><a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Inteligência Artificial</a></li>
                                <li><a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Chat Estratégico</a></li>
                                <li><a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Opendraft Mobile</a></li>
                                <li><a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Preços</a></li>
                            </ul>
                        </div>

                        {/* Column 2: Recursos */}
                        <div className="flex flex-col gap-6">
                            <h4 className="text-[14px] font-semibold text-zinc-900 dark:text-white tracking-tight">Recursos</h4>
                            <ul className="flex flex-col gap-4">
                                <li><a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Central de Ajuda</a></li>
                                <li><a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Blog & Artigos</a></li>
                                <li><a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Documentação API</a></li>
                                <li><a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Status do Sistema</a></li>
                                <li><a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Comunidade</a></li>
                            </ul>
                        </div>

                        {/* Column 3: Empresa */}
                        <div className="flex flex-col gap-6">
                            <h4 className="text-[14px] font-semibold text-zinc-900 dark:text-white tracking-tight">Empresa</h4>
                            <ul className="flex flex-col gap-4">
                                <li><a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Sobre a Opendraft</a></li>
                                <li><a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Nossa Missão</a></li>
                                <li><a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Carreiras</a></li>
                                <li><a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Imprensa</a></li>
                                <li><a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Segurança</a></li>
                            </ul>
                        </div>

                        {/* Column 4: Legal */}
                        <div className="flex flex-col gap-6">
                            <h4 className="text-[14px] font-semibold text-zinc-900 dark:text-white tracking-tight">Termos e Políticas</h4>
                            <ul className="flex flex-col gap-4">
                                <li><a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Termos de Uso</a></li>
                                <li><a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Política de Privacidade</a></li>
                                <li><a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Configurações de Cookies</a></li>
                                <li><a href="#" className="text-[14px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Acessibilidade</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Utility Bar */}
                    <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-zinc-100 dark:border-zinc-800 gap-8">
                        {/* Social Icons */}
                        <div className="flex items-center gap-6">
                            <a href="#" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" /></svg>
                            </a>
                            <a href="#" className="text-zinc-400 hover:text-[#5865F2] transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                </svg>
                            </a>
                            <a href="#" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                            </a>
                            <a href="#" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            </a>
                        </div>

                        {/* Copyright */}
                        <div className="flex items-center gap-4 text-[13px] text-zinc-400">
                            <span>Opendraft © 2024–2026</span>
                            <span className="hidden md:block">•</span>
                            <a href="#" className="hover:text-zinc-900 dark:hover:text-white">Gerenciar cookies</a>
                        </div>

                        {/* Static Language Indicator (Unclickable) */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-full border border-zinc-200/50 dark:border-zinc-700/50 opacity-60">
                            <Globe className="w-3.5 h-3.5 text-zinc-500" />
                            <span className="text-[12px] font-semibold text-zinc-600 dark:text-zinc-400">Português (BR)</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
