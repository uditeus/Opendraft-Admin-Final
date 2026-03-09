import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useI18n } from "@/i18n/i18n";
import { getSupabase } from "@/lib/supabase/client";
import { signIn, signInWithGoogle } from "@/lib/supabase/auth";
import { toast } from "sonner";
import {
    Loader2, PenLine, BookOpen, Users, ChevronRight, Check, Plus, Minus,
    Feather, Library, Globe, Mailbox, Layout, Zap, Shield, MessageSquare
} from "lucide-react";
import ShimmeringText from "@/components/ui/shimmering-text";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { QUICK_PROMPTS, PILL_CONFIG } from "@/components/chat/quick-prompts";
import { AppIcon, createAppIcon } from "@/components/icons/AppIcon";

const Pen01Icon = createAppIcon("Pen01Icon");
const Lightbulb = createAppIcon("Lightbulb");
const CalendarClock = createAppIcon("CalendarClock");
const Search = createAppIcon("Search");
const QuillWrite = createAppIcon("QuillWrite");
const Sparkles = createAppIcon("Sparkles");
const Gitbook = createAppIcon("Gitbook");

const PrivacyControlMockup = () => (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-8 bg-cover bg-center" style={{ backgroundImage: "url('https://i.imgur.com/LutTNRr.png')" }}>
        <div className="relative w-full max-w-[500px] flex items-center justify-center gap-8 translate-y-[-10px]">
            {/* Real App Style Button */}
            <div className="bg-white rounded-xl px-5 py-3.5 flex items-center gap-3 text-zinc-700 shadow-lg border border-zinc-200 w-[200px]">
                <QuillWrite className="w-5 h-5 opacity-60" />
                <span className="text-[14px] font-medium flex-1">Usar estilo</span>
                <ChevronRight className="w-4 h-4 opacity-30" />
            </div>

            {/* Real App Style Dropdown - Scrollable */}
            <div className="bg-white rounded-2xl shadow-2xl border border-zinc-100 p-1.5 flex flex-col w-[260px] z-10 max-h-[380px] overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-2 duration-300">
                {[
                    "Normal", "Aprendizado", "Conciso", "Explicativo", "Formal", "Humanizado",
                    "Scientific Persuader", "Joe Karbo", "Claude Hopkins", "David Ogilvy",
                    "Victor Schwab", "John Caples", "Gary Halbert", "Eugene Schwartz",
                    "Lilian Eichler", "Matty Furey", "Ben Settle", "Joseph Sugarman",
                    "Victor O. Schwab", "Dan Kennedy", "Mel Martin", "John Carlton",
                    "Bob Bly", "Doug Danna", "Clayton Makepeace", "Drayton Bird",
                    "Gary Bencivenga", "Robert Collier", "Leo Burnett", "Brian Clark",
                    "Gary Provost", "Jay Abraham", "Jim Rutz"
                ].map((styleName, i) => (
                    <div key={i} className={cn(
                        "flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-colors shrink-0",
                        styleName === "Normal" ? "bg-zinc-50 text-zinc-900" : "text-zinc-600 hover:bg-zinc-50"
                    )}>
                        <QuillWrite className={cn("w-[18px] h-[18px] mt-[-1px]", styleName === "Normal" ? "opacity-80" : "opacity-40")} />
                        <span className={cn("text-[14px] leading-none", styleName === "Normal" ? "font-semibold" : "font-medium")}>{styleName}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const WritingAssistantMockup = () => {
    const [stage, setStage] = React.useState<'idle' | 'user' | 'thinking' | 'streaming' | 'done'>('idle');
    const [streamedText, setStreamedText] = React.useState("");
    const fullText = "Eu te desafio a continuar lendo por mais alguns segundos antes de decidir que isso não é pra você.\n\nSe você já terminou um prato e sentiu que estava bom, mas não marcante, talvez você entenda do que eu tô falando. Não é falta de esforço. Muito menos de vontade. Às vezes a gente faz tudo certo e ainda assim parece que falta alguma coisa que a gente não sabe explicar.";

    React.useEffect(() => {
        let timer: any;
        if (stage === 'idle') {
            timer = setTimeout(() => setStage('user'), 1000);
        } else if (stage === 'user') {
            timer = setTimeout(() => setStage('thinking'), 2000);
        } else if (stage === 'thinking') {
            timer = setTimeout(() => setStage('streaming'), 1500);
        } else if (stage === 'streaming') {
            if (streamedText.length < fullText.length) {
                const chunkSize = Math.floor(Math.random() * 8) + 2;
                timer = setTimeout(() => {
                    setStreamedText(fullText.slice(0, Math.min(streamedText.length + chunkSize, fullText.length)));
                }, 20 + Math.random() * 40);
            } else {
                setStage('done');
            }
        } else if (stage === 'done') {
            // Animation happens only once
        }
        return () => clearTimeout(timer);
    }, [stage, streamedText]);

    return (
        <div className="relative w-full h-full flex items-center justify-center p-8 overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('https://i.imgur.com/gRv10ie.png')" }}>
            <div className="w-full h-full bg-white rounded-3xl shadow-2xl flex flex-col p-8 relative overflow-hidden text-left">
                <AnimatePresence>
                    {(stage !== 'idle') && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="self-end bg-[#F3F4F6] text-zinc-900 px-5 py-3 rounded-2xl rounded-tr-none text-[13.5px] max-w-[85%] mb-8"
                        >
                            escreva uma copy de vendas para um curso de culinária
                        </motion.div>
                    )}

                    {(stage === 'thinking' || stage === 'streaming' || stage === 'done') && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-1.5 text-zinc-500 text-[11px] mb-6 shrink-0"
                        >
                            <ChevronRight className={cn("w-3 h-3 rotate-90 opacity-60", stage === 'thinking' && "animate-pulse")} />
                            <ShimmeringText className="text-[11px] font-medium mx-0 text-zinc-500">
                                {stage === 'thinking' ? "Thinking..." : "Thought for 2.6s"}
                            </ShimmeringText>
                        </motion.div>
                    )}

                    {(stage === 'streaming' || stage === 'done') && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col gap-6 overflow-hidden"
                        >
                            <div className="flex flex-col gap-5 text-[#1a1a1a]">
                                <div className="text-[14.5px] leading-[1.8] text-zinc-600 whitespace-pre-wrap">
                                    {streamedText}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Subtle Gradient Fade at Bottom */}
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
            </div>
        </div>
    );
};

const SmartDiscoveryMockup = () => (
    <div className="relative w-full h-full flex items-center justify-center p-8 sm:p-12 overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('https://i.imgur.com/nZ3NtlG.png')" }}>
        {/* Inner White Container (The APP UI) */}
        <div className="w-full h-full bg-white rounded-[32px] shadow-2xl flex flex-col p-8 overflow-hidden border border-white/20">
            {/* Playbooks Grid - Literal Static UI */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 overflow-hidden pb-6">
                {[
                    { name: "WhatsApp X1", img: "https://i.imgur.com/Q3Uoxoim.png" },
                    { name: "Criativo UGC", img: "https://i.imgur.com/UTCu7QRm.png" },
                    { name: "Thread Twitter", img: "https://i.imgur.com/uEUzLp9m.png" },
                    { name: "Construtor de Funil", img: "https://i.imgur.com/gLfFbPFm.png" },
                    { name: "Reels de Crescimento", img: "https://i.imgur.com/5urT1bCm.png" },
                    { name: "E-mail marketing", img: "https://i.imgur.com/ipkTgrvm.png" },
                    { name: "Sequência de Stories", img: "https://i.imgur.com/0PhDg8Tm.png" },
                    { name: "Text Sales Letter", img: "https://i.imgur.com/ngjMpahm.png" },
                    { name: "TikTok Shop", img: "https://i.imgur.com/lDveRUAm.png" }
                ].map((p, i) => (
                    <div key={i} className="flex flex-col gap-3">
                        <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-100 shadow-sm relative">
                            <div className="absolute inset-0 bg-zinc-200 animate-pulse" />
                            <img
                                src={p.img}
                                alt={p.name}
                                className="w-full h-full object-cover relative z-10"
                                loading="lazy"
                                decoding="async"
                                onLoad={(e) => {
                                    (e.target as HTMLImageElement).previousElementSibling?.classList.add('hidden');
                                }}
                            />
                        </div>
                        <span className="text-[12.5px] font-bold text-zinc-800 truncate px-1 text-center">{p.name}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

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

const MegafoneIcon = ({ size = 150 }: { size?: number }) => (
    <div className="flex justify-center">
        <img
            src="/icons/megafone-light.png"
            alt="Megafone Light"
            style={{ width: size, height: 'auto' }}
            className="dark:hidden"
        />
        <img
            src="/icons/megafone-dark.png"
            alt="Megafone Dark"
            style={{ width: size, height: 'auto' }}
            className="hidden dark:block"
        />
    </div>
);

function GoogleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

const NAV_ITEMS = [
    { id: "tools", label: "Ferramentas", dropdown: false },
    { id: "resources", label: "Recursos", dropdown: false },
    { id: "pricing", label: "Preços", dropdown: false },
];

const LANG_DATA: Record<string, { label: string; code: string }> = {
    us: { label: "English", code: "us" },
    br: { label: "Português", code: "br" },
    es: { label: "Español", code: "es" },
    fr: { label: "Français", code: "fr" },
    it: { label: "Italiano", code: "it" },
    de: { label: "Deutsch", code: "de" },
    jp: { label: "日本語", code: "jp" }
};

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

export default function Login() {
    const navigate = useNavigate();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const { tt } = useI18n();
    const [step, setStep] = React.useState<"email" | "password" | "success">("email");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
    const [activeFeature, setActiveFeature] = React.useState(0);
    const [pricingTab, setPricingTab] = React.useState<"monthly" | "yearly">("yearly");
    const [selectedLang, setSelectedLang] = React.useState(LANG_DATA.us);

    React.useEffect(() => {
        document.title = "Entrar ou Criar conta | Opendraft";

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
    }, []);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Footer states
    const [footerInputValue, setFooterInputValue] = useState("");
    const [activeFooterPill, setActiveFooterPill] = useState<string | null>(null);
    const [isLangOpen, setIsLangOpen] = useState(false);

    const quickActions = useMemo(() => [
        { id: "write" as const, label: "Escrever", Icon: Pen01Icon, prompts: QUICK_PROMPTS.write.map(p => ({ title: p.title, prompt: p.prompt })) },
        { id: "ideas" as const, label: "Ideias", Icon: Lightbulb, prompts: QUICK_PROMPTS.ideas.map(p => ({ title: p.title, prompt: p.prompt })) },
        { id: "analyze" as const, label: "Analisar", Icon: Search, prompts: QUICK_PROMPTS.analyze.map(p => ({ title: p.title, prompt: p.prompt })) },
    ], []);

    const handleStartFooterDraft = () => {
        const text = footerInputValue.trim();
        if (text) navigate(`/new?initialPrompt=${encodeURIComponent(text)}`);
        else navigate("/login");
    };

    const handleGoogle = async () => {
        setLoading(true);
        try {
            const { error } = await signInWithGoogle();
            if (error) throw error;
        } catch (err: any) {
            toast.error(err.message || "Erro ao entrar com Google");
            setLoading(false);
        }
    };

    const handleContinue = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedEmail = email.trim().toLowerCase();
        if (!trimmedEmail) return;

        setLoading(true);
        try {
            const supabase = getSupabase();

            // Debugging user existence check
            console.log("Checking if user exists for:", trimmedEmail);

            // Check if user exists in profiles (public table)
            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("id")
                .ilike("email", trimmedEmail)
                .maybeSingle();

            if (profileError) {
                console.error("Profile check error:", profileError);
            }

            console.log("Profile result:", profile);

            if (profile) {
                // User exists, ask for password
                setStep("password");
                toast.info("Bem-vindo de volta! Entre com sua senha.");
            } else {
                // New user code sends magic link
                const { error } = await supabase.auth.signInWithOtp({
                    email: trimmedEmail,
                    options: {
                        emailRedirectTo: `${window.location.origin}/new`,
                    },
                });
                if (error) throw error;
                setStep("success");
                toast.success("Link de verificação enviado!");
            }
        } catch (err: any) {
            console.error("Login process error:", err);
            toast.error(err.message || "Erro ao processar login");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) return;

        setLoading(true);
        try {
            const { error } = await signIn(email.trim(), password);
            if (error) throw error;
            navigate("/new");
        } catch (err: any) {
            toast.error(err.message || "Senha incorreta ou erro no servidor");
        } finally {
            setLoading(false);
        }
    };

    const features = [
        {
            icon: <Pen01Icon className="h-5 w-5" />,
            title: "Criar com o Opendraft",
            description: "Utilize uma inteligência artificial treinada para criar, editar e refinar seus textos com agilidade e inteligência absoluta.",
        },
        {
            icon: <QuillWrite className="h-5 w-5" />,
            title: "Estilos de escrita",
            description: "Escreva como um mestre. Aplique os estilos e as técnicas de escrita dos maiores copywriters da história em suas produções.",
        },
        {
            icon: <Gitbook className="h-5 w-5" />,
            title: "Playbooks",
            description: "Acesse uma biblioteca de playbooks com estruturas de copy validadas pelo mercado para criar funis, anúncios e scripts que convertem.",
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#FCFCFC] dark:bg-[#131416] transition-colors duration-700 overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-screen z-50 border-b border-black/[0.05] dark:border-white/[0.05] bg-[#FCFCFC] dark:bg-[#131416]">
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

            {/* ── SECTION 1: LOGIN SPLIT (100vh) ────────────────── */}
            <section className="min-h-screen w-screen flex shrink-0 pt-[85px] px-6 lg:pl-[263px] lg:pr-[263px] relative overflow-hidden">
                {/* LEFT: Content */}
                <div className="relative z-10 flex flex-1 flex-col items-start justify-center">
                    <div className="w-full max-w-[440px] flex flex-col items-start text-left gap-10">
                        <h1 className="font-serif text-zinc-900 dark:text-[#E8E6E3] text-[48px] leading-[1.1] tracking-tight">
                            A arte de convencer<br />pessoas atravessa<br />gerações
                        </h1>

                        {/* Card Form */}
                        <div className="w-full max-w-[440px] bg-white dark:bg-[#131416] border border-zinc-200 dark:border-white/10 rounded-[32px] p-8 flex flex-col gap-6 relative min-h-[360px] items-center justify-center">
                            <AnimatePresence mode="wait">
                                {step === "email" ? (
                                    <motion.div
                                        key="email-step"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full flex flex-col gap-6"
                                    >
                                        <form onSubmit={handleContinue} className="flex flex-col gap-4 w-full">
                                            {/* Google */}
                                            <button
                                                type="button"
                                                onClick={handleGoogle}
                                                disabled={loading}
                                                className="flex items-center justify-center gap-3 h-12 w-full rounded-xl bg-white dark:bg-transparent border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-[15px] font-medium hover:bg-zinc-50 dark:hover:bg-white/5 transition-all disabled:opacity-60"
                                            >
                                                <GoogleIcon className="h-[20px] w-[20px]" />
                                                Continuar com Google
                                            </button>

                                            {/* Divider */}
                                            <div className="flex items-center justify-center py-0.5">
                                                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-widest">ou</span>
                                            </div>

                                            {/* Email */}
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Digite seu e-mail"
                                                required
                                                autoComplete="email"
                                                disabled={loading}
                                                className="h-12 w-full rounded-xl bg-zinc-50 dark:bg-[#2C2C2C] border border-transparent px-4 text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:bg-white dark:focus:bg-[#323232] transition-all"
                                            />

                                            {/* Continue */}
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex items-center justify-center gap-2 h-12 w-full rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[15px] font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all disabled:opacity-50"
                                            >
                                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                                Continuar com e-mail
                                            </button>
                                        </form>

                                        <p className="text-[12px] text-zinc-500 dark:text-zinc-500 leading-relaxed text-center px-4">
                                            Ao continuar, você reconhece a <Link to="/privacy" className="underline hover:text-zinc-900 dark:hover:text-[#E8E6E3] transition-colors">Política de Privacidade</Link> da Opendraft.
                                        </p>
                                    </motion.div>
                                ) : step === "password" ? (
                                    <motion.div
                                        key="password-step"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full flex flex-col gap-6"
                                    >
                                        <div className="flex flex-col gap-2">
                                            <h2 className="text-[20px] font-serif text-zinc-900 dark:text-white">Bem-vindo de volta</h2>
                                            <p className="text-[14px] text-zinc-500 dark:text-zinc-400">Entre com sua senha para {email}</p>
                                        </div>

                                        <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4 w-full">
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Sua senha"
                                                required
                                                autoFocus
                                                disabled={loading}
                                                className="h-12 w-full rounded-xl bg-zinc-50 dark:bg-[#2C2C2C] border border-transparent px-4 text-[15px] text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:bg-white dark:focus:bg-[#323232] transition-all"
                                            />

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex items-center justify-center gap-2 h-12 w-full rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[15px] font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all disabled:opacity-50"
                                            >
                                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                                Entrar
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setStep("email")}
                                                className="text-[13px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                            >
                                                Usar outro e-mail
                                            </button>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="w-full flex flex-col items-center text-center gap-6 py-4"
                                    >
                                        <div className="flex items-center justify-center">
                                            <Mailbox className="w-9 h-9 text-[#3e768d]" strokeWidth={1.5} />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <p className="text-[15px] text-zinc-500 dark:text-zinc-400">
                                                Para continuar, clique no link enviado para
                                            </p>
                                            <p className="text-[17px] font-semibold text-zinc-900 dark:text-zinc-200">
                                                {email}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-1 mt-2">
                                            <p className="text-[12px] text-zinc-500">Não está vendo o email na sua caixa de entrada?</p>
                                            <button
                                                onClick={handleContinue}
                                                disabled={loading}
                                                className="text-[13px] font-medium text-zinc-900 dark:text-zinc-400 underline underline-offset-4 hover:text-zinc-600 dark:hover:text-white transition-colors disabled:opacity-50"
                                            >
                                                Tentar enviar novamente
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Image */}
                <div className="hidden lg:flex flex-1 w-full justify-center md:justify-end items-center text-zinc-900 dark:text-zinc-100 relative lg:-mr-20 lg:-mt-16 scale-135 md:scale-150 transition-all duration-500">
                    <div className="relative w-full max-w-[1300px]">
                        <img
                            src={resolvedTheme === 'dark' ? 'https://i.imgur.com/FzItyhr.png' : 'https://i.imgur.com/XGe9Tiz.png'}
                            alt="Opendraft Login Illustration"
                            className="w-full h-auto object-contain transition-all duration-700"
                        />
                    </div>
                </div>
            </section>

            {/* ── SECTION 2: CONHEÇA O OPENDRAFT ──────────────────── */}
            <section className="py-32 w-screen bg-white dark:bg-[#131416] flex flex-col items-center px-6 lg:pl-[263px] lg:pr-[263px]">
                <div className="w-full flex flex-col items-center gap-16 text-center">
                    {/* Headers */}
                    <div className="flex flex-col items-center gap-6 max-w-[800px]">
                        <div className="mb-4">
                            <LampadaIcon size={150} />
                        </div>
                        <h2 className="font-serif text-zinc-900 dark:text-[#E8E6E3] text-[36px] leading-[1.2] tracking-tight">
                            Conheça o Opendraft
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400 text-[20px] leading-relaxed max-w-[720px]">
                            O Opendraft é seu assistente de IA de última geração criado para ser seguro, preciso e protegido, tudo para você fazer seu melhor trabalho.
                        </p>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-20 w-full items-center">
                        {/* Dynamic Mockup Container */}
                        <div className="relative aspect-[16/10] w-full rounded-[32px] overflow-hidden shadow-2xl bg-zinc-100">
                            {activeFeature === 0 && <WritingAssistantMockup />}
                            {activeFeature === 1 && <PrivacyControlMockup />}
                            {activeFeature === 2 && <SmartDiscoveryMockup />}
                        </div>

                        {/* Feature List */}
                        <div className="flex flex-col text-left">
                            {features.map((f, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex flex-col gap-4 py-8 border-b border-zinc-100 dark:border-white/5 transition-colors cursor-pointer group",
                                        i === activeFeature ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                                    )}
                                    onClick={() => setActiveFeature(i)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "transition-colors",
                                            i === activeFeature ? "text-zinc-900 dark:text-white" : "text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400"
                                        )}>
                                            {f.icon}
                                        </div>
                                        <h3 className="text-[22px] font-medium tracking-tight">
                                            {f.title}
                                        </h3>
                                    </div>
                                    <AnimatePresence mode="wait">
                                        {i === activeFeature && (
                                            <motion.p
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                                className="text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[440px] overflow-hidden"
                                            >
                                                {f.description}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 3: CONFERIR PLANOS ─────────────────────── */}
            <section className="py-32 w-screen bg-white dark:bg-[#131416] flex flex-col items-center px-6 lg:pl-[263px] lg:pr-[263px]">
                <div className="w-full flex flex-col items-center gap-12 text-center">

                    {/* Header */}
                    <div className="flex flex-col items-center gap-8">
                        <div className="mb-4">
                            <FlorIcon size={150} />
                        </div>
                        <h2 className="font-serif text-zinc-900 dark:text-[#E8E6E3] text-[36px] tracking-tight">
                            Conferir planos
                        </h2>

                        {/* Billing toggle */}
                        <div className="inline-flex items-center rounded-xl bg-zinc-100 dark:bg-white/[0.06] p-1 border border-zinc-200/60 dark:border-white/[0.06]">
                            {(["monthly", "yearly"] as const).map(cycle => (
                                <button key={cycle} onClick={() => setPricingTab(cycle)}
                                    className={cn(
                                        "flex items-center gap-2 h-9 px-6 rounded-lg text-[13px] font-medium transition-all duration-200",
                                        pricingTab === cycle
                                            ? "bg-white dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm"
                                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                                    )}
                                >
                                    {cycle === "monthly" ? "Mensal" : "Anual"}
                                    {cycle === "yearly" && pricingTab !== "yearly" && (
                                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">−20%</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Plan cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6 w-full text-left">
                        {PLANS.map(plan => (
                            <div key={plan.id} className="flex flex-col rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] overflow-hidden">
                                <div className="p-8 flex flex-col flex-1">
                                    <h2 className="text-[36px] font-serif font-normal text-zinc-900 dark:text-white leading-none mb-1">{plan.name}</h2>
                                    <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mb-6">{plan.tagline}</p>

                                    {/* Price */}
                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-0.5">
                                            <span className="text-[28px] font-serif font-normal text-zinc-900 dark:text-white">
                                                {plan.currency}{pricingTab === "yearly" ? plan.price.yearly : plan.price.monthly}
                                            </span>
                                        </div>
                                        <div className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                                            Por {plan.perUser ? "usuário/" : ""}mês
                                            {pricingTab === "yearly" ? " com desconto anual" : ""}
                                            {pricingTab === "monthly" && (
                                                <span className="block text-[12px] text-blue-500 dark:text-blue-400 mt-0.5 cursor-pointer" onClick={() => setPricingTab("yearly")}>
                                                    ${plan.price.yearly}/mês se anual
                                                </span>
                                            )}
                                        </div>
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

                    <p className="text-center text-[13px] text-zinc-400 dark:text-zinc-500">
                        *Limites de uso se aplicam. Preços não incluem impostos aplicáveis.
                    </p>
                </div>
            </section>

            {/* ── SECTION 4: FAQ ─────────────────────────────────── */}
            <section className="py-32 w-screen bg-white dark:bg-[#131416] flex flex-col items-center px-6 lg:pl-[263px] lg:pr-[263px]">
                <div className="w-full max-w-[800px] flex flex-col items-center gap-16 text-center">
                    <div className="mb-4">
                        <MegafoneIcon size={150} />
                    </div>
                    <h2 className="font-serif text-zinc-900 dark:text-white text-[36px] tracking-tight">
                        Perguntas frequentes
                    </h2>

                    <div className="w-full flex flex-col">
                        {[
                            {
                                q: "O que é o Opendraft e como ele funciona?",
                                a: "O Opendraft é um recurso de inteligência artificial, treinado para ser seguro, preciso e protegido. É o assistente em que você pode confiar para realizar o seu melhor trabalho. Você pode usar o Opendraft para uso pessoal ou criar uma conta Equipe para colaborar com os colegas. Saiba mais sobre o Opendraft."
                            },
                            {
                                q: "Para que devo usar o Opendraft?",
                                a: "Se você pode imaginar, o Opendraft pode ajudar a realizar. O Opendraft processa grandes volumes de informação, gera ideias, cria textos e códigos, explica assuntos, orienta em situações difíceis, simplifica tarefas para você se dedicar ao que é mais importante e muito mais."
                            },
                            {
                                q: "Quanto custa para usar?",
                                a: "O Opendraft oferece planos gratuitos para experimentação e planos Pro, Max e Max 5x para usuários que precisam de mais poder, limites maiores e recursos avançados. Confira a nossa seção de preços acima para mais detalhes."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="border-b border-white/10">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full py-6 flex items-center justify-between text-left group"
                                >
                                    <span className={cn(
                                        "text-[18px] transition-colors",
                                        openFaq === i
                                            ? "text-zinc-900 dark:text-white"
                                            : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white"
                                    )}>
                                        {faq.q}
                                    </span>
                                    {openFaq === i ? (
                                        <Minus className="h-5 w-5 text-zinc-500" />
                                    ) : (
                                        <Plus className="h-5 w-5 text-zinc-500" />
                                    )}
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <p className="pb-8 text-[15px] text-zinc-500 dark:text-zinc-400 text-left leading-relaxed max-w-[680px]">
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SECTION 5: FOOTER (Identical to Pricing.tsx) ──── */}
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
