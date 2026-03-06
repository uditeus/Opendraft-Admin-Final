import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { useI18n } from "@/i18n/i18n";
import { Button } from "@/components/ui/button";
import { AppIcon, createAppIcon } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { QUICK_PROMPTS, PILL_CONFIG } from "@/components/chat/quick-prompts";

const Pen01Icon = createAppIcon("Pen01Icon");
const Lightbulb = createAppIcon("Lightbulb");
const CalendarClock = createAppIcon("CalendarClock");
const Search = createAppIcon("Search");

// ─────────────────────────────────────────────────────────────────
// Nav items — same as Index.tsx
// ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { id: "tools", label: "Ferramentas", dropdown: false },
    { id: "resources", label: "Recursos", dropdown: false },
    { id: "pricing", label: "Preços", dropdown: false },
];
// Comparison data
// ─────────────────────────────────────────────────────────────────
type Cell = boolean | string | null;
interface Row { label: string; pro: Cell; max: Cell; max5x: Cell; }
interface Section { title: string; rows: Row[]; }

const COMPARISON: Section[] = [
    {
        title: "Recursos e capacidades",
        rows: [
            { label: "Chat via web, iOS, Android e desktop", pro: true, max: true, max5x: true },
            { label: "Geração de copy com IA", pro: true, max: true, max5x: true },
            { label: "Geração de imagem", pro: true, max: true, max5x: true },
            { label: "Análise de documentos e arquivos", pro: true, max: true, max5x: true },
            { label: "Playbooks padrão", pro: true, max: true, max5x: true },
            { label: "Playbooks personalizados", pro: true, max: true, max5x: true },
            { label: "Estilos de escrita personalizados", pro: true, max: true, max5x: true },
            { label: "Exportação (PDF / Docx)", pro: true, max: true, max5x: true },
            { label: "Histórico completo de drafts", pro: true, max: true, max5x: true },
            { label: "Agentes de IA", pro: true, max: true, max5x: true },
            { label: "Integração com ferramentas de marketing", pro: false, max: true, max5x: true },
            { label: "Acesso à API", pro: false, max: true, max5x: true },
            { label: "Suporte via chat", pro: true, max: true, max5x: true },
            { label: "Suporte prioritário", pro: false, max: true, max5x: true },
            { label: "SLA garantido", pro: false, max: false, max5x: true },
        ],
    },
    {
        title: "Atividade e administração",
        rows: [
            { label: "Limite de uso mensal", pro: "Padrão", max: "20× maior", max5x: "100× maior" },
            { label: "Acesso prioritário em instabilidade", pro: true, max: true, max5x: true },
            { label: "Acesso antecipado a novos recursos", pro: true, max: true, max5x: true },
            { label: "Painel de uso da equipe", pro: false, max: true, max5x: true },
            { label: "Gestão de membros e permissões", pro: false, max: false, max5x: true },
            { label: "Compartilhamento de playbooks", pro: false, max: true, max5x: true },
            { label: "Faturamento centralizado", pro: false, max: false, max5x: true },
            { label: "Relatórios de produção", pro: false, max: false, max5x: true },
        ],
    },
    {
        title: "Privacidade e segurança",
        rows: [
            { label: "Dados não usados para treinar modelos", pro: true, max: true, max5x: true },
            { label: "Retenção de dados configurável", pro: false, max: false, max5x: true },
            { label: "SSO / SAML", pro: false, max: false, max5x: true },
            { label: "Auditoria de acessos", pro: false, max: false, max5x: true },
        ],
    },
    {
        title: "Modelos de IA",
        rows: [
            { label: "Opendraft 1.5 Flash", pro: true, max: true, max5x: true },
            { label: "Opendraft 1.5 Pro", pro: true, max: true, max5x: true },
            { label: "Opendraft 2.0 (quando disponível)", pro: true, max: true, max5x: true },
        ],
    },
];

const LupaIcon = ({ size = 150 }: { size?: number }) => (
    <div className="flex justify-center">
        <img
            src="https://i.imgur.com/diYys3g.png"
            alt="Lupa Light"
            style={{ width: size, height: 'auto' }}
            className="dark:hidden"
        />
        <img
            src="https://i.imgur.com/78J7t6X.png"
            alt="Lupa Dark"
            style={{ width: size, height: 'auto' }}
            className="hidden dark:block"
        />
    </div>
);

const FlorIcon = ({ size = 60 }: { size?: number }) => (
    <div className="flex justify-start">
        <img
            src="https://i.imgur.com/PosV6lv.png"
            alt="Flor Light"
            style={{ width: size, height: 'auto' }}
            className="dark:hidden"
        />
        <img
            src="https://i.imgur.com/HuozsDZ.png"
            alt="Flor Dark"
            style={{ width: size, height: 'auto' }}
            className="hidden dark:block"
        />
    </div>
);

const LampadaIcon = ({ size = 60 }: { size?: number }) => (
    <div className="flex justify-start">
        <img
            src="https://i.imgur.com/RiX2gNO.png"
            alt="Lampada Light"
            style={{ width: size, height: 'auto' }}
            className="dark:hidden"
        />
        <img
            src="https://i.imgur.com/9M9a6mK.png"
            alt="Lampada Dark"
            style={{ width: size, height: 'auto' }}
            className="hidden dark:block"
        />
    </div>
);

const PLANS = [
    {
        id: "pro", name: "Pro", tagline: "Para uso intensivo diário.", isFree: false,
        price: { monthly: "20", yearly: "16" }, currency: "$", perUser: false,
        cta: "Assinar Pro", headerNote: undefined as string | undefined,
        features: ["Mais uso*", "Acesso ao Opendraft 1.5 Pro", "Acesso antecipado a novos recursos", "Playbooks e agentes personalizados", "Limites maiores"],
    },
    {
        id: "max", name: "Max", tagline: "Para produtores de alto volume.", isFree: false,
        price: { monthly: "100", yearly: "80" }, currency: "$", perUser: false,
        cta: "Assinar Max", headerNote: "Tudo do Pro, mais:",
        features: ["20× mais uso que o Pro*", "Todos os modelos Opendraft", "Suporte prioritário", "Compartilhamento de playbooks", "Acesso à API"],
    },
    {
        id: "max5x", name: "Max 5x", tagline: "Para equipes de alta performance.", isFree: false,
        price: { monthly: "500", yearly: "400" }, currency: "$", perUser: true,
        cta: "Assinar Max 5x", headerNote: "Tudo do Max, mais:",
        features: ["100× mais uso que o Pro*", "Gestão de membros e permissões", "Faturamento centralizado", "SSO / SAML", "SLA garantido"],
    },
];

// ─────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────
const CheckMark = ({ featureList }: { featureList?: boolean }) =>
    featureList ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-zinc-400 dark:text-zinc-500">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ) : (
        <svg width="18" height="18" viewBox="0 0 20 20" className="shrink-0">
            <circle cx="10" cy="10" r="10" fill="currentColor" className="text-zinc-800 dark:text-zinc-200" />
            <polyline points="6,10 9,13 14,7" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                className="stroke-white dark:stroke-zinc-900" />
        </svg>
    );

const XMark = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 dark:text-zinc-600">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

function CellValue({ value }: { value: Cell }) {
    if (value === true) return <div className="flex justify-center"><CheckMark /></div>;
    if (value === false) return <div className="flex justify-center"><XMark /></div>;
    return <span className="text-[12px] text-zinc-500 dark:text-zinc-400 text-center block leading-tight">{value}</span>;
}

// ─────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────
export default function PricingPage() {
    const navigate = useNavigate();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const { tt } = useI18n();
    const billing_options = ["monthly", "yearly"] as const;
    const [billing, setBilling] = React.useState<"monthly" | "yearly">("yearly");
    const [search, setSearch] = React.useState("");
    const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
    const [isLangOpen, setIsLangOpen] = React.useState(false);

    const LANG_DATA: Record<string, { label: string; code: string }> = {
        us: { label: "English", code: "us" },
        br: { label: "Português", code: "br" },
        es: { label: "Español", code: "es" },
        fr: { label: "Français", code: "fr" },
        it: { label: "Italiano", code: "it" },
        de: { label: "Deutsch", code: "de" },
        jp: { label: "日本語", code: "jp" }
    };

    const [selectedLang, setSelectedLang] = React.useState(LANG_DATA.us);
    const [footerInputValue, setFooterInputValue] = React.useState("");
    const [activeFooterPill, setActiveFooterPill] = React.useState<string | null>(null);
    const [collapsedSections, setCollapsedSections] = React.useState<Record<string, boolean>>({});
    const [tableFixed, setTableFixed] = React.useState(false);
    const sentinelRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        document.title = "Planos e Preços | Opendraft";

        const detectLocation = async () => {
            try {
                const response = await fetch('https://freeipapi.com/api/json');
                const data = await response.json();
                const countryCode = data.countryCode.toLowerCase();

                const countryToLang: Record<string, keyof typeof LANG_DATA> = {
                    br: 'br',
                    pt: 'br',
                    es: 'es',
                    mx: 'es',
                    ar: 'es',
                    fr: 'fr',
                    it: 'it',
                    de: 'de',
                    jp: 'jp'
                };

                const detectedLangCode = countryToLang[countryCode] || 'us';
                setSelectedLang(LANG_DATA[detectedLangCode]);
            } catch (error) {
                console.error("Failed to detect location:", error);
            }
        };

        detectLocation();

        const el = sentinelRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    setTableFixed(entry.boundingClientRect.top < 85);
                } else {
                    setTableFixed(false);
                }
            },
            { rootMargin: "-85px 0px 0px 0px", threshold: 0 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const toggleSection = (title: string) => setCollapsedSections(prev => ({ ...prev, [title]: !prev[title] }));

    const quickActions = React.useMemo(() => [
        { id: "write" as const, label: "Escrever", Icon: Pen01Icon, prompts: QUICK_PROMPTS.write.map(p => ({ title: p.title, prompt: p.prompt })) },
        { id: "ideas" as const, label: "Ideias", Icon: Lightbulb, prompts: QUICK_PROMPTS.ideas.map(p => ({ title: p.title, prompt: p.prompt })) },
        { id: "analyze" as const, label: "Analisar", Icon: Search, prompts: QUICK_PROMPTS.analyze.map(p => ({ title: p.title, prompt: p.prompt })) },
    ], []);

    const handleStartFooterDraft = () => {
        const text = footerInputValue.trim();
        if (text) navigate(`/new?initialPrompt=${encodeURIComponent(text)}`);
        else navigate("/login");
    };

    const filtered: Section[] = React.useMemo(() => {
        if (!search.trim()) return COMPARISON;
        const q = search.toLowerCase();
        return COMPARISON
            .map(s => ({ ...s, rows: s.rows.filter(r => r.label.toLowerCase().includes(q)) }))
            .filter(s => s.rows.length > 0);
    }, [search]);

    return (
        <div className="min-h-screen flex flex-col bg-[#FCFCFC] dark:bg-[#0f1011] font-inter transition-colors duration-700 overflow-x-hidden">

            {/* Navbar */}
            <nav className="fixed top-0 w-screen z-50 border-b border-black/[0.05] dark:border-white/[0.05] bg-[#FCFCFC] dark:bg-[#0f1011]">
                <div className="w-full px-6 lg:pl-[263px] lg:pr-[263px] h-[85px] flex items-center justify-between">
                    {/* Left: Logo only */}
                    <Link to="/" className="flex items-center cursor-pointer">
                        <span className="text-[22px] md:text-[24px] font-serif font-medium tracking-tight text-zinc-900 dark:text-zinc-100">Opendraft</span>
                    </Link>

                    {/* Right: Links and Buttons */}
                    <div className="flex items-center gap-6 h-full">
                        <div className="hidden lg:flex items-center gap-6 h-full">
                            {NAV_ITEMS.map((item) => (
                                <div
                                    key={item.id}
                                    className="relative h-full flex items-center"
                                    onMouseEnter={() => item.dropdown && setActiveDropdown(item.id)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    {item.id === "pricing" ? (
                                        <Link
                                            to="/pricing"
                                            className={cn(
                                                "flex items-center gap-1.5 text-[15px] font-medium transition-colors h-full cursor-pointer",
                                                activeDropdown === item.id
                                                    ? "text-zinc-900 dark:text-white"
                                                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <button
                                            className={cn(
                                                "flex items-center gap-1.5 text-[15px] font-medium transition-colors h-full cursor-pointer",
                                                activeDropdown === item.id
                                                    ? "text-zinc-900 dark:text-white"
                                                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                                            )}
                                        >
                                            {item.label}
                                            {item.dropdown && (
                                                <svg
                                                    width="10"
                                                    height="10"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className={cn("opacity-40 transition-transform duration-300", activeDropdown === item.id && "rotate-180")}
                                                >
                                                    <path d="m6 9 6 6 6-6" />
                                                </svg>
                                            )}
                                        </button>
                                    )}

                                    <AnimatePresence />
                                </div>
                            ))}
                            <Link to="/login" className="text-[15px] font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer">
                                Login
                            </Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="hidden md:flex h-[36px] px-5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 font-medium text-[15px] transition-all flex items-center justify-center"
                            >
                                Entrar na Lista
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>



            {/* ════════════ MAIN ════════════ */}
            <main className="flex-1 pt-[85px]">
                <div className="w-screen px-6 lg:pl-[263px] lg:pr-[263px]">

                    {/* Hero */}
                    <div className="flex flex-col items-center text-center pt-36 pb-8">
                        <h1 className="text-[64px] font-serif font-normal leading-none tracking-tight text-zinc-900 dark:text-white mb-28">
                            Preços
                        </h1>
                        {/* Billing toggle */}
                        <div className="inline-flex items-center rounded-xl bg-zinc-100 dark:bg-white/[0.06] p-1 border border-zinc-200/60 dark:border-white/[0.06]">
                            {(["monthly", "yearly"] as const).map(cycle => (
                                <button key={cycle} onClick={() => setBilling(cycle)}
                                    className={cn(
                                        "flex items-center gap-2 h-9 px-6 rounded-lg text-[13px] font-medium transition-all duration-200",
                                        billing === cycle
                                            ? "bg-white dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm"
                                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                                    )}
                                >
                                    {cycle === "monthly" ? "Mensal" : "Anual"}
                                    {cycle === "yearly" && billing !== "yearly" && (
                                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">−20%</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Plan cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                        {PLANS.map(plan => (
                            <div key={plan.id} className="flex flex-col rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] overflow-hidden">
                                <div className="p-8 flex flex-col flex-1">
                                    <h2 className="text-[36px] font-serif font-normal text-zinc-900 dark:text-white leading-none mb-1">{plan.name}</h2>
                                    <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mb-6">{plan.tagline}</p>

                                    {/* Price */}
                                    <div className="mb-6">
                                        {plan.isFree ? (
                                            <>
                                                <div className="text-[28px] font-serif font-normal text-zinc-900 dark:text-white">$0</div>
                                                <div className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5">Grátis para todos</div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-baseline gap-0.5">
                                                    <span className="text-[28px] font-serif font-normal text-zinc-900 dark:text-white">
                                                        {plan.currency}{billing === "yearly" ? plan.price.yearly : plan.price.monthly}
                                                    </span>
                                                </div>
                                                <div className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                                                    Por {plan.perUser ? "usuário/" : ""}mês
                                                    {billing === "yearly" ? " com desconto anual" : ""}
                                                    {billing === "monthly" && (
                                                        <span className="block text-[12px] text-blue-500 dark:text-blue-400 mt-0.5 cursor-pointer" onClick={() => setBilling("yearly")}>
                                                            ${plan.price.yearly}/mês se anual
                                                        </span>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* CTA */}
                                    <button onClick={() => navigate("/login")}
                                        className="h-11 w-full rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium text-[14px] hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all active:scale-[0.98] mb-7">
                                        {plan.cta}
                                    </button>

                                    <div className="border-t border-zinc-100 dark:border-white/[0.05] mb-6" />

                                    {plan.headerNote && (
                                        <p className="text-[12px] font-semibold text-zinc-400 dark:text-zinc-500 mb-4 uppercase tracking-wide">{plan.headerNote}</p>
                                    )}
                                    <div className="space-y-3">
                                        {plan.features.map(f => (
                                            <div key={f} className="flex items-start gap-2.5">
                                                <CheckMark featureList />
                                                <span className="text-[13.5px] text-zinc-600 dark:text-zinc-300 leading-snug">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-[13px] text-zinc-400 dark:text-zinc-500 mb-28">
                        *Limites de uso se aplicam. Preços não incluem impostos aplicáveis.
                    </p>

                    {/* Compare heading */}
                    <div className="flex flex-col items-center mb-16">
                        <div className="mb-6">
                            <LupaIcon />
                        </div>
                        <h2 className="text-[40px] md:text-[52px] font-serif font-normal text-zinc-900 dark:text-white tracking-tight text-center leading-tight">
                            Compare recursos entre os planos
                        </h2>
                    </div>
                </div>

                {/* Comparison table */}
                <div className="w-full">
                    {/* Sentinel: when this crosses 72px from top, header becomes fixed */}
                    <div ref={sentinelRef} className="h-0 w-full" />

                    {/* Table header — fixed:true when sentinel has left viewport */}
                    <div className={cn(
                        "z-40 bg-[#FCFCFC] dark:bg-[#0f1011] border-b border-zinc-200 dark:border-white/[0.06] w-full",
                        tableFixed ? "fixed top-[85px] left-0 right-0" : "relative"
                    )}>
                        <div className="w-screen px-6 lg:pl-[263px] lg:pr-[263px]">
                            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] py-4 items-end">
                                <div className="flex items-center gap-2.5 h-11 px-3.5 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] w-[300px]">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 dark:text-zinc-500 shrink-0">
                                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                                    </svg>
                                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                        placeholder="Pesquisar..."
                                        className="flex-1 bg-transparent text-[13px] outline-none text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-600" />
                                </div>
                                {PLANS.map(plan => (
                                    <div key={plan.id} className="flex flex-col items-center gap-1.5">
                                        <span className="text-[20px] font-serif font-bold text-zinc-900 dark:text-zinc-100 leading-none">{plan.name}</span>
                                        <button onClick={() => navigate("/login")}
                                            className="h-[22px] rounded-full bg-white dark:bg-white text-zinc-900 dark:text-zinc-900 text-[10px] font-semibold hover:bg-zinc-100 transition-all px-3 shadow-sm border border-zinc-200/80 dark:border-transparent whitespace-nowrap">
                                            {plan.cta}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Spacer to prevent layout jump when header goes fixed */}
                    {tableFixed && <div className="h-[74px]" />}

                    {/* Rows */}
                    <div className="w-screen px-6 lg:pl-[263px] lg:pr-[263px] pb-32 focus:outline-none">
                        {filtered.map(section => {
                            const isCollapsed = !!collapsedSections[section.title];
                            return (
                                <div key={section.title} className="mt-6">
                                    {/* Section header — clickable, serif, collapsible */}
                                    <button
                                        onClick={() => toggleSection(section.title)}
                                        className="w-full flex items-center justify-between py-4 border-b border-zinc-200 dark:border-white/[0.06] group"
                                    >
                                        <span className="text-[22px] font-serif font-semibold text-zinc-900 dark:text-white text-left">
                                            {section.title}
                                        </span>
                                        <svg
                                            width="16" height="16" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                            className={cn("text-zinc-400 dark:text-zinc-500 transition-transform duration-300", isCollapsed ? "rotate-0" : "rotate-180")}
                                        >
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </button>

                                    {/* Rows — hidden when collapsed */}
                                    {!isCollapsed && section.rows.map((row, ri) => (
                                        <div key={row.label}
                                            className={cn(
                                                "grid grid-cols-[2fr_1fr_1fr_1fr] border-b hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors",
                                                ri === section.rows.length - 1 ? "border-zinc-200 dark:border-white/[0.06]" : "border-zinc-100 dark:border-white/[0.04]"
                                            )}>
                                            <div className="py-3.5">
                                                <span className="text-[13.5px] text-zinc-700 dark:text-zinc-300">{row.label}</span>
                                            </div>
                                            {[row.pro, row.max, row.max5x].map((val, i) => (
                                                <div key={i} className="py-3.5 flex items-center justify-center">
                                                    <CellValue value={val} />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                        {filtered.length === 0 && (
                            <div className="py-20 text-center text-[14px] text-zinc-400 dark:text-zinc-600">
                                Nenhum recurso encontrado para &ldquo;{search}&rdquo;
                            </div>
                        )}

                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-screen bg-[#131416] text-[#D8D4CF] py-12 border-t border-black/10">
                <div className="w-full px-6 lg:pl-[263px] lg:pr-[263px] flex flex-col justify-between h-full">

                    <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-16">
                        {/* Left Area */}
                        <div className="flex flex-col w-full lg:w-[320px] shrink-0">
                            {/* Logo */}
                            <Link to="/" className="flex items-center mb-[35px] cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                <span className="text-[22px] md:text-[24px] font-serif font-medium tracking-tight text-zinc-100">Opendraft</span>
                            </Link>

                            {/* Footer Composer */}
                            <div className="relative">
                                <div className="relative flex items-center w-full h-[42px] p-1.5 pl-4 rounded-xl bg-white/[0.05] border border-white/[0.06] shadow-sm transition-colors">
                                    <input
                                        type="text"
                                        value={footerInputValue}
                                        onChange={(e) => setFooterInputValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleStartFooterDraft();
                                        }}
                                        placeholder="Comece a vibe-escrever..."
                                        className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-white/30 text-white"
                                    />
                                    <button
                                        onClick={handleStartFooterDraft}
                                        className="ml-2 h-[30px] px-3 rounded-lg bg-[#3E768D] hover:bg-[#2c5a6b] text-white font-medium text-[12px] flex items-center justify-center shadow-sm transition-colors shrink-0"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19V5" /><path d="m5 12 7-7 7 7" /></svg>
                                    </button>
                                </div>

                                <div className="absolute top-full left-0 w-full z-20">
                                    <AnimatePresence mode="wait">
                                        {!activeFooterPill ? (
                                            <motion.div
                                                key="pills"
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="mt-[15px] flex flex-wrap gap-2"
                                            >
                                                {quickActions.map(({ id, label, Icon }) => (
                                                    <button
                                                        key={id}
                                                        onClick={() => setActiveFooterPill(id)}
                                                        className="relative group flex items-center h-[26px] px-3 cursor-pointer shrink-0"
                                                    >
                                                        {/* Static visual background/border that scales on hover */}
                                                        <div className="absolute inset-0 rounded-lg bg-white/[0.05] border border-white/[0.06] transition-transform duration-200 group-hover:scale-[1.04]" />

                                                        {/* Content that remains perfectly still and aligned */}
                                                        <div className="relative flex items-center gap-1.5 z-10 text-[13px] font-medium text-white/50 group-hover:text-white transition-colors pointer-events-none">
                                                            <Icon className="w-[13px] h-[13px] -mt-[0.5px]" />
                                                            <span>{label}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="box"
                                                initial={{ opacity: 0, scale: 0.98, y: -5 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.98, y: -5 }}
                                                className="w-full mt-[15px]"
                                            >
                                                <div className="flex flex-col rounded-xl bg-[#131416] border border-white/10 shadow-xl overflow-hidden text-left">
                                                    {/* Header */}
                                                    <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5">
                                                        <div className="flex items-center gap-2 text-[11.5px] font-medium text-white/40">
                                                            {(() => {
                                                                const qa = quickActions.find(q => q.id === activeFooterPill);
                                                                return qa ? (
                                                                    <div className="flex items-center gap-1.5">
                                                                        <qa.Icon className="w-[13px] h-[13px] -mt-[0.5px]" />
                                                                        <span>{qa.label}</span>
                                                                    </div>
                                                                ) : null;
                                                            })()}
                                                        </div>
                                                        <button
                                                            onClick={() => setActiveFooterPill(null)}
                                                            className="text-white/20 hover:text-white/50 transition-colors cursor-pointer"
                                                        >
                                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    {/* List */}
                                                    <div className="flex flex-col py-0.5">
                                                        {quickActions.find(q => q.id === activeFooterPill)?.prompts.slice(0, 3).map(({ title, prompt }, index, array) => (
                                                            <React.Fragment key={title}>
                                                                <div className="w-full">
                                                                    <Link
                                                                        to="/login"
                                                                        className="w-full flex items-center px-4 py-2.5 text-[13px] text-white/40 hover:text-white/80 transition-colors"
                                                                    >
                                                                        <span>{title}</span>
                                                                    </Link>
                                                                </div>
                                                                {index < array.length - 1 && (
                                                                    <div className="mx-4 border-b border-white/5" />
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Right Area - Grid */}
                        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 text-[14px]">
                            {/* Col 1 */}
                            <div className="flex flex-col gap-8">
                                <div className="flex flex-col gap-3">
                                    <span className="text-white/40 font-medium mb-1 text-[13px]">Produtos</span>
                                    {["Opendraft Pro", "Opendraft Team", "Opendraft API", "Startups"].map(i => <a href="#" key={"p" + i} className="text-[#D8D4CF] hover:underline underline-offset-4 decoration-white/30 transition-all font-medium text-[13px]">{i}</a>)}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <span className="text-white/40 font-medium mb-1 text-[13px]">Soluções</span>
                                    {["Use Cases", "Agentes IA", "Indústrias", "Infoprodutores", "Influenciadores", "Social Medias", "Para negócios", "Para mídia"].map(i => <a href="#" key={"s" + i} className="text-[#D8D4CF] hover:underline underline-offset-4 decoration-white/30 transition-all font-medium text-[13px]">{i}</a>)}
                                </div>
                            </div>

                            {/* Col 2 */}
                            <div className="flex flex-col gap-8">
                                <div className="flex flex-col gap-3">
                                    <span className="text-white/40 font-medium mb-1 text-[13px]">Recursos</span>
                                    {["Blog", "Clientes", "Eventos", "Notícias", "Opendraft Academy", "Cursos", "Tutoriais", "Use Cases"].map(i => <a href="#" key={"r" + i} className="text-[#D8D4CF] hover:underline underline-offset-4 decoration-white/30 transition-all font-medium text-[13px]">{i}</a>)}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <span className="text-white/40 font-medium mb-1 text-[13px]">Comparar</span>
                                    {["vs ChatGPT", "vs Claude", "vs Gemini"].map(i => <a href="#" key={"comp" + i} className="text-[#D8D4CF] hover:underline underline-offset-4 decoration-white/30 transition-all font-medium text-[13px]">{i}</a>)}
                                </div>
                            </div>

                            {/* Col 3 */}
                            <div className="flex flex-col gap-8">
                                <div className="flex flex-col gap-3">
                                    <span className="text-white/40 font-medium mb-1 text-[13px]">Empresa</span>
                                    {["Sobre nós", "Carreiras", "Notícias", "Playbook", "Atualizações", "Afiliados", "Programa de indicação"].map(i => <a href="#" key={"c" + i} className="text-[#D8D4CF] hover:underline underline-offset-4 decoration-white/30 transition-all font-medium text-[13px]">{i}</a>)}
                                </div>
                            </div>

                            {/* Col 4 */}
                            <div className="flex flex-col gap-8">
                                <div className="flex flex-col gap-3">
                                    <span className="text-white/40 font-medium mb-1 text-[13px]">Central de Ajuda</span>
                                    {["Status", "Suporte", "Centro de Confiança", "Central de Ajuda"].map(i => <a href="#" key={"h" + i} className="text-[#D8D4CF] hover:underline underline-offset-4 decoration-white/30 transition-all font-medium text-[13px]">{i}</a>)}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <span className="text-white/40 font-medium mb-1 text-[13px]">Termos e Políticas</span>
                                    {["Termos de serviço", "Política de privacidade", "Gerenciar cookies"].map(i => <a href="#" key={"t" + i} className="text-[#D8D4CF] hover:underline underline-offset-4 decoration-white/30 transition-all font-medium text-[13px]">{i}</a>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer Section */}
                <div className="w-full px-6 lg:px-[263px] mt-24 flex flex-col">
                    <div className="w-full border-t border-white/[0.05]" />
                    <div className="flex flex-col sm:flex-row items-center justify-between w-full pt-10 pb-4 gap-6">
                        {/* Social Links */}
                        <div className="flex items-center gap-6 text-[#9c958d]">
                            <AppIcon name="NewTwitter" size={18} className="hover:text-[#D8D4CF] cursor-pointer transition-colors" />
                            <AppIcon name="Linkedin" size={20} className="hover:text-[#D8D4CF] cursor-pointer transition-colors" />
                            <AppIcon name="Youtube" size={20} className="hover:text-[#D8D4CF] cursor-pointer transition-colors" />
                            <AppIcon name="Instagram" size={20} className="hover:text-[#D8D4CF] cursor-pointer transition-colors" />
                        </div>

                        {/* Language & Theme Controls */}
                        <div className="flex items-center gap-3">
                            {/* Theme Toggle */}
                            <button
                                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                                className="flex items-center justify-center px-3 py-2.5 rounded-xl border border-white/[0.08] bg-transparent hover:bg-white/[0.08] transition-colors cursor-pointer group"
                            >
                                <AppIcon
                                    name={resolvedTheme === "dark" ? "Sun" : "Moon"}
                                    size={18}
                                    className="text-zinc-400 group-hover:text-zinc-200 transition-colors"
                                />
                            </button>

                            {/* Language Dropdown */}
                            <div
                                className="relative shrink-0"
                                onMouseEnter={() => setIsLangOpen(true)}
                                onMouseLeave={() => setIsLangOpen(false)}
                            >
                                <button
                                    className={cn(
                                        "flex items-center justify-between w-[150px] px-4 py-2.5 rounded-xl border border-white/[0.08] bg-transparent hover:bg-white/[0.05] transition-all cursor-pointer group",
                                        isLangOpen && "opacity-0 pointer-events-none"
                                    )}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex-shrink-0 w-3.5 h-3.5 rounded-full overflow-hidden flex items-center justify-center">
                                            <span className={`fi fi-${selectedLang.code} !bg-cover !bg-center !w-full !h-full`} />
                                        </div>
                                        <span className="text-zinc-200 text-[12px] font-medium">{selectedLang.label}</span>
                                    </div>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="m6 9 6 6 6-6" /></svg>
                                </button>

                                <AnimatePresence>
                                    {isLangOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute bottom-0 right-0 w-[150px] border border-white/[0.08] bg-[#141517] rounded-xl overflow-hidden z-50 flex flex-col py-0"
                                        >
                                            <div className="flex flex-col">
                                                {Object.values(LANG_DATA).filter(lang => lang.code !== selectedLang.code).map((lang) => (
                                                    <button
                                                        key={lang.code}
                                                        onClick={() => {
                                                            setSelectedLang(lang);
                                                            setIsLangOpen(false);
                                                        }}
                                                        className="w-full text-left px-4 py-3 text-[12px] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.08] transition-all flex items-center gap-2.5 group"
                                                    >
                                                        <div className="flex-shrink-0 w-3.5 h-3.5 rounded-full overflow-hidden flex items-center justify-center">
                                                            <span className={`fi fi-${lang.code} !bg-cover !bg-center !w-full !h-full`} />
                                                        </div>
                                                        <span>{lang.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="border-t border-white/[0.05]">
                                                <button
                                                    onClick={() => setIsLangOpen(false)}
                                                    className="flex items-center justify-between w-full px-4 py-3 hover:bg-white/[0.08] transition-colors group"
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex-shrink-0 w-3.5 h-3.5 rounded-full overflow-hidden flex items-center justify-center">
                                                            <span className={`fi fi-${selectedLang.code} !bg-cover !bg-center !w-full !h-full`} />
                                                        </div>
                                                        <span className="text-zinc-200 text-[12px] font-medium transition-colors">{selectedLang.label}</span>
                                                    </div>
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 transition-colors"><path d="m6 9 6 6 6-6" /></svg>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
