import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { useI18n } from "@/i18n/i18n";
import { Button } from "@/components/ui/button";
import { AppIcon, createAppIcon } from "@/components/icons/AppIcon";
import { GLOBAL_IMAGE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useInView } from "framer-motion";
import HeroIllustration from "@/components/HeroIllustration";
import { QUICK_PROMPTS, PILL_CONFIG } from "@/components/chat/quick-prompts";
import ShimmeringText from "@/components/ui/shimmering-text";

const Download = createAppIcon("Download");
const ArrowRight = createAppIcon("ArrowRight");

const Pen01Icon = createAppIcon("Pen01Icon");
const Lightbulb = createAppIcon("Lightbulb");
const CalendarClock = createAppIcon("CalendarClock");
const Search = createAppIcon("Search");

const WritingAssistantMockup = ({ bgImage = "https://i.imgur.com/gRv10ie.png" }: { bgImage?: string }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    const [stage, setStage] = React.useState<'idle' | 'user' | 'thinking' | 'streaming' | 'done'>('idle');
    const [streamedText, setStreamedText] = React.useState("");
    const fullText = "Eu te desafio a continuar lendo por mais alguns segundos antes de decidir que isso não é pra você.\n\nSe você já terminou um prato e sentiu que estava bom, mas não marcante, talvez você entenda do que eu tô falando. Não é falta de esforço. Muito menos de vontade. Às vezes a gente faz tudo certo e ainda assim parece que falta alguma coisa que a gente não sabe explicar.";

    React.useEffect(() => {
        if (!isInView) return;

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
    }, [stage, streamedText, isInView]);

    return (
        <div ref={ref} className="relative w-full h-full flex items-center justify-center p-8 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url('${bgImage}')` }}>
            <div className="w-full h-full bg-white rounded-3xl shadow-2xl flex flex-col p-8 relative overflow-hidden text-left border border-white/20">
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
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("rotate-90 opacity-60", stage === 'thinking' && "animate-pulse")}>
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
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

const SmartDraftMockup = ({ bgImage = "https://i.imgur.com/gRv10ie.png" }: { bgImage?: string }) => (
    <div className="relative w-full h-full flex items-end justify-center px-4 md:px-8 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url('${bgImage}')` }}>
        <div className="w-[90%] md:w-[85%] h-[90%] bg-white rounded-t-2xl shadow-2xl flex flex-col p-6 sm:p-8 relative overflow-hidden text-left border-x border-t border-white/20 font-sans translate-y-8">
            <h1 className="text-[18px] md:text-[20px] font-bold leading-tight text-zinc-900 mb-6 tracking-tight font-sans truncate">
                Copy de vendas para Curso de Culinária Profissional
            </h1>

            <div className="space-y-5">
                <p className="text-[13px] md:text-[14px] text-zinc-600 leading-[1.6] font-sans">
                    Você já sentiu que, por mais que siga a receita passo a passo, o resultado final ainda parece "vazio"? Falta aquele brilho, aquela explosão de sabor que você encontra nos melhores restaurantes. Muita gente acredita que o segredo está em ingredientes caros ou equipamentos de última geração. Mas a verdade é muito mais simples: a culinária é uma linguagem, e a maioria de nós só sabe repetir palavras sem entender a sintaxe.
                </p>
                <p className="text-[13px] md:text-[14px] text-zinc-600 leading-[1.6] font-sans">
                    Imagine entrar na sua cozinha e não precisar mais de um livro aberto. Saber exatamente como equilibrar a acidez de um tomate com a doçura de uma cebola caramelizada, ou como usar o calor residual para atingir o ponto perfeito de uma carne. É sobre isso que este treinamento trata. Não vamos te dar apenas receitas; vamos te ensinar a pensar como um chef, treinando seu paladar e sua intuição para transformar qualquer ingrediente básico em uma experiência memorável para quem você ama.
                </p>
                <p className="text-[13px] md:text-[14px] text-zinc-600 leading-[1.6] font-sans">
                    É hora de deixar de ser um mero replicador de fórmulas e começar a criar. Seus amigos e familiares vão notar a diferença imediatamente, não apenas no sabor, mas na sua confiança entre as panelas. A partir de hoje, cada refeição é uma oportunidade de contar uma história. E a sua história começa aqui, no domínio absoluto das técnicas que separam o amador do mestre.
                </p>
            </div>
        </div>
    </div>
);

const SmartDiscoveryMockup = () => (
    <div className="relative w-full h-full flex items-center justify-center p-8 sm:p-12 overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('https://i.imgur.com/nZ3NtlG.png')" }}>
        <div className="w-full h-full bg-white rounded-[32px] shadow-2xl flex flex-col p-8 md:p-10 overflow-hidden border border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 h-full items-start">
                {[
                    { name: "WhatsApp X1", img: "https://i.imgur.com/Q3Uoxoim.png" },
                    { name: "Criativo UGC", img: "https://i.imgur.com/UTCu7QRm.png" },
                    { name: "Thread Twitter", img: "https://i.imgur.com/uEUzLp9m.png" },
                    { name: "Funil de Vendas", img: "https://i.imgur.com/gLfFbPFm.png" },
                    { name: "Reels de Crescimento", img: "https://i.imgur.com/5urT1bCm.png" },
                    { name: "E-mail marketing", img: "https://i.imgur.com/ipkTgrvm.png" }
                ].map((p, i) => (
                    <div key={i} className="flex flex-col gap-3 group">
                        <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100 shadow-sm relative transition-all duration-500 group-hover:shadow-md">
                            <img
                                src={p.img}
                                alt={p.name}
                                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        <span className="text-[12px] font-medium text-zinc-500 group-hover:text-zinc-900 transition-colors truncate">{p.name}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const Index = () => {
    const navigate = useNavigate();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const { tt } = useI18n();

    const [activePill, setActivePill] = React.useState<string | null>(null);
    const [activeFooterPill, setActiveFooterPill] = React.useState<string | null>(null);
    const [inputValue, setInputValue] = React.useState("");
    const [footerInputValue, setFooterInputValue] = React.useState("");
    const [activeFeatureTab, setActiveFeatureTab] = React.useState("Criativo");
    const [isLangOpen, setIsLangOpen] = React.useState(false);
    const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

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

    React.useEffect(() => {
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

    const NAV_ITEMS = [
        { id: "tools", label: "Ferramentas", dropdown: false },
        { id: "resources", label: "Recursos", dropdown: false },
        { id: "pricing", label: "Preços", dropdown: false },
    ];


    const FEATURES_TABS = React.useMemo(() => [
        {
            id: "Criativo",
            label: "Criativo",
            icon: "CreativeMarket",
            title: "Criativo",
            description: "Criativos que param o scroll. Porque na internet atenção é tudo, a Opendraft entende como as pessoas pensam, o que desperta curiosidade e o que faz alguém continuar assistindo até o final. Ela organiza a ideia, constrói ganchos fortes e encaixa os argumentos no ritmo certo da conversa. O texto parece algo que alguém realmente falaria, não um anúncio tentando vender. No fim parece só mais um post interessante no feed, mas por trás existe estrutura e intenção para gerar clique, comentário e venda.",
            bgImage: "https://i.imgur.com/EEl2zJp.png"
        },
        {
            id: "Oferta",
            label: "Oferta",
            icon: "AlignBoxMiddleCenter",
            title: "Oferta",
            description: "Ofertas que dão vontade de comprar começam quando a promessa fica clara e específica. A Opendraft ajuda a estruturar um mecanismo único, mostrar o problema que a pessoa sente mas ainda não soube explicar e apresentar a solução de um jeito que faz sentido imediatamente. A dor aparece de forma real, a promessa ganha forma e a oferta passa a parecer a escolha lógica. Quando tudo se encaixa, o clique deixa de ser impulso e vira decisão.",
            bgImage: "https://i.imgur.com/LutTNRr.png"
        },
        {
            id: "Funil",
            label: "Funil",
            icon: "Filter",
            title: "Funil",
            description: "Funil bonito não paga conta. Esse paga. Cada etapa tem intenção, cada mensagem tem função. Do primeiro contato até o momento da compra, tudo é construído para conduzir, convencer e converter. Não é uma sequência aleatória de textos. É estratégia aplicada palavra por palavra para transformar atenção em faturamento.",
            bgImage: "https://i.imgur.com/gRv10ie.png"
        },
        {
            id: "Ideia",
            label: "Ideia",
            icon: "Idea01",
            title: "Ideia",
            description: "Ideias quando você não tem nenhuma. Criatividade não é esperar inspiração cair do céu. É ter estrutura para provocar novas possibilidades. A Opendraft analisa seu objetivo, seu público e seu contexto para sugerir ângulos, formatos e abordagens que fazem sentido. Quando a mente trava, o processo continua.",
            bgImage: "https://i.imgur.com/nZ3NtlG.png"
        }
    ], []);

    const quickActions = React.useMemo(() => [
        { id: "write" as const, label: "Escrever", Icon: Pen01Icon, prompts: QUICK_PROMPTS.write.map(p => ({ title: p.title, prompt: p.prompt })) },
        { id: "ideas" as const, label: "Ideias", Icon: Lightbulb, prompts: QUICK_PROMPTS.ideas.map(p => ({ title: p.title, prompt: p.prompt })) },
        { id: "analyze" as const, label: "Analisar", Icon: Search, prompts: QUICK_PROMPTS.analyze.map(p => ({ title: p.title, prompt: p.prompt })) },
    ], []);

    React.useEffect(() => {
        document.title = "A IA para quem resolve problemas | Opendraft";
    }, []);

    const handleStartDraft = () => {
        const text = inputValue.trim();
        if (text) {
            // In a real flow, you might want to pass this to login or straight to new draft if auth logic allows it. The placeholder below lets them go stringht to app layout.
            navigate(`/new?initialPrompt=${encodeURIComponent(text)}`);
        } else {
            navigate("/login");
        }
    }

    const handleStartFooterDraft = () => {
        const text = footerInputValue.trim();
        if (text) {
            navigate(`/new?initialPrompt=${encodeURIComponent(text)}`);
        } else {
            navigate("/login");
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#FCFCFC] dark:bg-[#131416] font-inter transition-colors duration-700 overflow-x-hidden">

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

            {/* Main Content */}
            <main className="flex-1 w-full pt-[85px]">

                {/* Hero Section */}
                <section className="w-screen px-6 lg:pl-[263px] lg:pr-[263px] min-h-[calc(100vh-72px)] pt-12 pb-32 md:pt-[2vh] md:pb-[14vh] flex flex-col md:flex-row items-center justify-between gap-16">
                    <div className="flex-1 max-w-xl text-left">
                        <h1 className="text-[40px] md:text-[64px] font-serif font-medium leading-[1.05] tracking-[-0.02em] text-zinc-900 dark:text-white mb-6">
                            Seu espaço para vibe-escrever melhor
                        </h1>
                        <p className="text-[16px] md:text-[18px] font-normal text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10 max-w-md">
                            Transforme ideias complexas em mensagens claras, persuasivas e prontas para vender.
                        </p>

                        <div className="w-full max-w-[475px] relative">
                            <div className="relative flex items-center w-full h-[52px] p-2 pl-4 rounded-xl bg-transparent border border-zinc-200 dark:border-white/10 shadow-sm transition-colors">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleStartDraft();
                                    }}
                                    placeholder="Comece a vibe-escrever..."
                                    className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-zinc-500 dark:text-white"
                                />
                                <Button
                                    onClick={handleStartDraft}
                                    className="ml-2 h-[36px] px-4 rounded-lg bg-[#3E768D] hover:bg-[#2c5a6b] text-white font-medium text-[14px] flex items-center gap-1.5 shadow-sm"
                                >
                                    Começar <span className="text-[16px] leading-none mb-0.5">↑</span>
                                </Button>
                            </div>

                            <div className="absolute top-full left-0 w-full z-20">
                                <AnimatePresence mode="wait">
                                    {!activePill ? (
                                        <motion.div
                                            key="pills"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="mt-3 flex flex-wrap gap-2 pl-1"
                                        >
                                            {quickActions.map(({ id, label, Icon }) => (
                                                <button
                                                    key={id}
                                                    onClick={() => setActivePill(id)}
                                                    className="relative group flex items-center h-[26px] px-3 cursor-pointer shrink-0"
                                                >
                                                    {/* Static visual background/border that scales on hover */}
                                                    <div className="absolute inset-0 rounded-lg bg-[#e9ecef] dark:bg-[#252528] border border-zinc-200 dark:border-white/[0.06] transition-transform duration-200 group-hover:scale-[1.04]" />

                                                    {/* Content that remains perfectly still and aligned */}
                                                    <div className="relative flex items-center gap-1.5 z-10 text-[13px] font-medium text-zinc-900 dark:text-white pointer-events-none">
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
                                            className="w-full mt-4"
                                        >
                                            <div className="flex flex-col rounded-xl bg-transparent border border-zinc-200 dark:border-white/10 shadow-xl overflow-hidden text-left backdrop-blur-sm">
                                                {/* Header */}
                                                <div className="flex items-center justify-between px-5 pt-4 pb-3">
                                                    <div className="flex items-center gap-2 text-[12px] font-medium text-zinc-500 dark:text-zinc-500/80">
                                                        {(() => {
                                                            const qa = quickActions.find(q => q.id === activePill);
                                                            return qa ? (
                                                                <div className="flex items-center gap-2">
                                                                    <qa.Icon className="w-[15px] h-[15px] -mt-[0.5px]" />
                                                                    <span>{qa.label}</span>
                                                                </div>
                                                            ) : null;
                                                        })()}
                                                    </div>
                                                    <button
                                                        onClick={() => setActivePill(null)}
                                                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                                                    >
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* List */}
                                                <div className="flex flex-col py-1">
                                                    {quickActions.find(q => q.id === activePill)?.prompts.slice(0, 3).map(({ title, prompt }, index, array) => (
                                                        <React.Fragment key={title}>
                                                            <div className="w-full">
                                                                <Link
                                                                    to="/login"
                                                                    className="w-full flex items-center px-5 py-2.5 text-[15px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
                                                                >
                                                                    <span>{title}</span>
                                                                </Link>
                                                            </div>
                                                            {index < array.length - 1 && (
                                                                <div className="mx-5 border-b border-zinc-200/60 dark:border-white/5" />
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
                    <div className="flex-1 w-full flex justify-center md:justify-end items-center text-zinc-900 dark:text-zinc-100 relative lg:-mr-48 scale-105 md:scale-115">
                        <HeroIllustration
                            className="w-full h-auto transition-all duration-500"
                        />
                    </div>
                </section>


                {/* Alternating Features Section */}
                <section className="w-screen bg-[#f7f7f7] dark:bg-[#181a1b] py-32 flex flex-col items-center">
                    <div className="w-full px-6 lg:pl-[263px] lg:pr-[263px] flex flex-col items-center">
                        <div className="w-full max-w-none text-center mb-24">
                            <img
                                src={resolvedTheme === 'dark' ? '/icons/mapa-dark.png' : '/icons/mapa-light.png'}
                                alt="Mapa Icon"
                                className="w-[150px] h-[150px] mx-auto mb-4 object-contain"
                            />
                            <h2 className="text-[36px] md:text-[52px] font-serif font-medium text-zinc-900 dark:text-[#E8E6E3] leading-[1.1] tracking-tight">
                                Escrever bem virou vantagem competitiva
                            </h2>
                        </div>

                        <div className="flex flex-col gap-32 w-full max-w-none">
                            {/* Feature 1: Image Left, Text Right */}
                            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
                                <div className="w-full md:w-1/2 aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl bg-[#6fa585]">
                                    <WritingAssistantMockup bgImage="https://i.imgur.com/LutTNRr.png" />
                                </div>
                                <div className="w-full md:w-1/2 flex flex-col gap-6 text-left">
                                    <h3 className="text-[28px] md:text-[36px] font-serif font-medium text-zinc-900 dark:text-[#E8E6E3] tracking-tight">
                                        A inteligência artificial que<br />escreve igual gente
                                    </h3>
                                    <p className="text-[16px] md:text-[17px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                                        A Opendraft escreve do jeito que as pessoas realmente falam, entendendo a intenção por trás das palavras e percebendo o que está escondido dentro de uma ideia ainda crua. Assim, ela ajuda a transformar um pensamento solto em algo claro, direto e interessante de ler. Em vez de gerar aquele texto robótico cheio de frase bonita que não diz nada, a Opendraft usa princípios de copywriting, persuasão e ritmo de leitura para construir algo que realmente prende atenção. No fim parece uma conversa natural entre pessoas, mas por trás existe estratégia. É uma escrita pensada para gerar clique, resposta e venda sem perder o tom humano.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2: Text Left, Image Right */}
                            <div className="flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-24">
                                <div className="w-full md:w-1/2 flex flex-col gap-6 text-left">
                                    <h3 className="text-[28px] md:text-[36px] font-serif font-medium text-zinc-900 dark:text-[#E8E6E3] tracking-tight">
                                        Rascunho inteligente e editável
                                    </h3>
                                    <p className="text-[16px] md:text-[17px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                                        Sua ideia não precisa nascer perfeita. Na Opendraft você pode gerar variações, testar novos ganchos, mudar estruturas e ajustar o tom até encontrar a versão que realmente convence. É um espaço para criar junto com a IA, onde você escreve, refina e evolui cada palavra enquanto o texto vai ganhando forma. Você continua no controle da ideia e do estilo, enquanto a ferramenta ajuda a organizar o pensamento, fortalecer os argumentos e direcionar a mensagem para performar melhor.
                                    </p>
                                </div>
                                <div className="w-full md:w-1/2 aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl bg-[#F1F3F5]">
                                    <SmartDraftMockup bgImage="https://i.imgur.com/gRv10ie.png" />
                                </div>
                            </div>

                            {/* Feature 3: Image Left, Text Right */}
                            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
                                <div className="w-full md:w-1/2 aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl bg-[#a6a192]">
                                    <SmartDiscoveryMockup />
                                </div>
                                <div className="w-full md:w-1/2 flex flex-col gap-6 text-left">
                                    <h3 className="text-[28px] md:text-[36px] font-serif font-medium text-zinc-900 dark:text-[#E8E6E3] tracking-tight">
                                        Comece com a estrutura certa
                                    </h3>
                                    <p className="text-[16px] md:text-[17px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                                        Nem todo texto tem o mesmo propósito, e cada objetivo pede uma abordagem diferente. Por isso a Opendraft traz playbooks pensados para situações reais da internet, como viralizar no TikTok, vender no WhatsApp, montar uma página de vendas, lançar um produto ou criar roteiro para YouTube. Em vez de começar do zero tentando adivinhar o caminho, você já parte de estruturas que fazem sentido. Sabe aqueles vídeos das fitas clareadoras de dente que aparecem o tempo todo no TikTok, com antes e depois e alguém dizendo que descobriu “por acaso”? Existe um roteiro ali. Um gancho que segura atenção, uma pequena história, uma demonstração rápida e um final que faz a pessoa comentar ou querer testar também. A Opendraft ajuda você a entender essas estruturas e adaptar para o seu produto, transformando uma ideia solta em algo que prende, circula e converte.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* How you can use Section */}
                <section className="w-screen bg-[#f7f7f7] dark:bg-[#131416] py-24 flex flex-col items-center">
                    <div className="w-full max-w-[1100px] mx-auto px-6 flex flex-col items-center">
                        <img
                            src={resolvedTheme === 'dark' ? '/icons/dado-dark.png' : '/icons/dado-light.png'}
                            alt="Dado Icon"
                            className="w-[150px] h-[150px] mx-auto mb-4 object-contain"
                        />

                        <h2 className="text-[36px] md:text-[52px] font-serif font-medium text-zinc-900 dark:text-[#E8E6E3] tracking-[-0.01em] mb-12 text-center">
                            Como você pode usar a Opendraft
                        </h2>

                        {/* Main Mockup Area */}
                        {(() => {
                            const activeTabContent = FEATURES_TABS.find(t => t.id === activeFeatureTab);
                            return (
                                <div className="w-full flex flex-col items-start mt-6">
                                    {/* Tabs Aligned Left Above Card */}
                                    <div className="flex flex-wrap items-center justify-start gap-1 p-1 bg-black/5 dark:bg-[#2a2a2d] rounded-xl mb-6 relative z-10">
                                        {FEATURES_TABS.map(tab => {
                                            const isActive = activeFeatureTab === tab.id;
                                            return (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveFeatureTab(tab.id)}
                                                    className={cn(
                                                        "flex items-center gap-2 px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-300 cursor-pointer",
                                                        isActive
                                                            ? "bg-white dark:bg-[#1c1c1c] text-zinc-900 dark:text-zinc-100 shadow-sm"
                                                            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5"
                                                    )}
                                                >
                                                    <AppIcon name={tab.icon as any} className="w-[14px] h-[14px] opacity-80" />
                                                    {tab.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div
                                        className="w-full h-[550px] rounded-[32px] p-6 pb-0 md:p-12 md:pb-0 flex items-end justify-center overflow-hidden transition-colors duration-500 relative bg-cover bg-center"
                                        style={{ backgroundImage: `url('${activeTabContent?.bgImage}')` }}
                                    >
                                        <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                                            <pattern id="wavy-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                                                <path d="M0 50 Q 25 25, 50 50 T 100 50" fill="none" stroke="currentColor" strokeWidth="2" />
                                                <path d="M0 100 Q 25 75, 50 100 T 100 100" fill="none" stroke="currentColor" strokeWidth="2" />
                                                <path d="M0 0 Q 25 -25, 50 0 T 100 0" fill="none" stroke="currentColor" strokeWidth="2" />
                                            </pattern>
                                            <rect x="0" y="0" width="100%" height="100%" fill="url(#wavy-pattern)" className="text-black dark:text-white" />
                                        </svg>

                                        <div className="w-full h-full md:h-[95%] relative flex gap-6 px-4 md:px-12 items-end">
                                            {/* Left Column: Tiny Dark Cards */}
                                            <div className="hidden md:flex flex-col gap-4 w-[280px] shrink-0 mb-12">
                                                {/* Card 1: Prompt */}
                                                <div className="w-full bg-[#1c1c1c] rounded-2xl p-5 border border-white/5 shadow-lg text-left">
                                                    <p className="text-[13px] text-zinc-300 leading-relaxed font-normal">
                                                        Analise o desempenho do meu conteúdo e dados de audiência. Quais padrões devem guiar minha estratégia de conteúdo?
                                                    </p>
                                                </div>

                                                {/* Card 2: Attachments */}
                                                <div className="w-full bg-[#1c1c1c] rounded-2xl p-5 border border-white/5 shadow-lg text-left flex flex-col gap-4">
                                                    <span className="text-[12px] font-medium text-zinc-400 block">Anexos</span>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="border border-white/10 rounded-xl p-3.5 flex flex-col justify-between min-h-[105px] h-auto bg-white/[0.02]">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[12px] font-medium text-zinc-200 leading-tight">Relatório de Insights<br />de Audiência</span>
                                                                <span className="text-[11px] text-zinc-500">3.6 mb</span>
                                                            </div>
                                                            <span className="text-[11px] font-bold text-zinc-400 uppercase mt-2">pdf</span>
                                                        </div>
                                                        <div className="border border-white/10 rounded-xl p-3.5 flex flex-col justify-between min-h-[105px] h-auto bg-white/[0.02]">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[12px] font-medium text-zinc-200 leading-tight">Relatório de Análise<br />de Conteúdo</span>
                                                                <span className="text-[11px] text-zinc-500">105 linhas</span>
                                                            </div>
                                                            <span className="text-[11px] font-bold text-zinc-400 uppercase mt-2">csv</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column: Large White Document */}
                                            <div className="flex-1 h-full bg-[#FCFBF9] rounded-t-[20px] shadow-2xl border-t border-l border-r border-black/10 overflow-hidden relative">
                                                <div className="p-8 md:p-12 text-left absolute inset-0 overflow-hidden bg-gradient-to-b from-transparent to-white/50">
                                                    <h3 className="text-[32px] md:text-[36px] lg:text-[40px] font-serif font-normal text-zinc-900 leading-[1.05] tracking-[-0.02em] mb-6">
                                                        Análise de estratégia de conteúdo:<br />
                                                        Padrões de desempenho e<br />
                                                        recomendações estratégicas
                                                    </h3>
                                                    <h4 className="text-[22px] md:text-[24px] font-serif font-medium text-zinc-800 mb-4">Principais padrões de desempenho</h4>
                                                    <h5 className="text-[18px] md:text-[20px] font-serif font-medium text-zinc-800 mb-4">Tipos de conteúdo com melhor desempenho</h5>
                                                    <p className="text-[15px] md:text-[16px] font-medium text-zinc-800 mb-3">Estudos de caso dominam as conversões</p>
                                                    <ul className="list-disc pl-5 space-y-2 text-[14px] md:text-[15px] text-zinc-700 font-normal">
                                                        <li>Histórias de sucesso de clientes alcançam taxas de conversão de 15,4-16,8%</li>
                                                        <li>Geram a maior atribuição de receita ($4.560 - $5.240 por peça)</li>
                                                        <li>Forte engajamento em todos os segmentos de público</li>
                                                        <li><span className="font-semibold text-zinc-900">Padrão:</span> Provas reais ressoam universalmente</li>
                                                    </ul>
                                                    <p className="text-[15px] md:text-[16px] font-medium text-zinc-800 mt-6 mb-3">Ferramentas e recursos de produtos se destacam</p>
                                                    <ul className="list-disc pl-5 space-y-2 text-[14px] md:text-[15px] text-zinc-700 font-normal">
                                                        <li>Calculadora de ROI alcançou 25,3% de taxa de conversão (maior no geral)</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full flex flex-col md:flex-row justify-between items-start mt-10 md:mt-12 gap-4 md:gap-8 px-2 md:px-0">
                                        <h3 className="text-[28px] md:text-[32px] font-serif font-medium text-zinc-900 dark:text-[#E8E6E3] w-full md:w-[28%] tracking-tight">
                                            {activeTabContent?.title}
                                        </h3>
                                        <p className="text-[16px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal w-full md:w-[72%] lg:max-w-[850px]">
                                            {activeTabContent?.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })()}

                    </div>
                </section>

                {/* Final CTA & Newsletter Section */}
                <section className="w-screen bg-[#FCFCFC] dark:bg-[#0f1011] py-24 md:py-32 flex flex-col items-center">
                    <div className="w-full px-6 lg:pl-[263px] lg:pr-[263px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        {/* Left: Start Building */}
                        <div className="flex flex-col items-start text-left">
                            <h2 className="text-[36px] md:text-[52px] font-serif font-medium text-zinc-900 dark:text-white leading-tight tracking-tight mb-10">
                                Comece a vibe-escrever
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => navigate("/pricing")}
                                    className="px-8 h-[48px] rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-medium text-[15px] hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
                                >
                                    Ver preços
                                </button>
                                <button
                                    className="px-8 h-[48px] rounded-xl bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white font-medium text-[15px] hover:bg-zinc-200 dark:hover:bg-white/15 transition-colors"
                                >
                                    Falar com vendas
                                </button>
                            </div>
                        </div>

                        {/* Right: Waitlist Card */}
                        <div className="w-full lg:justify-self-end max-w-[580px] h-auto md:h-[360px] bg-zinc-100 dark:bg-[#181a1b] rounded-[32px] p-8 md:p-12 flex flex-col justify-center items-start text-left border border-zinc-200 dark:border-transparent">
                            <div className="flex flex-col items-start gap-4 w-full -mt-6">
                                <div className="flex flex-col items-start w-full">
                                    <img
                                        src={resolvedTheme === 'dark' ? '/icons/balao-dark.png' : '/icons/balao-light.png'}
                                        alt="Balao Icon"
                                        className="w-[110px] h-[110px] md:w-[150px] h-[150px] object-contain -ml-9 -mt-[7px]"
                                    />
                                    <div className="flex flex-col items-start gap-2 -mt-4 md:-mt-8 relative z-10 w-full">
                                        <h3 className="text-[25px] font-serif font-medium text-zinc-900 dark:text-white tracking-tight leading-tight">
                                            Entre na lista de espera
                                        </h3>
                                        <p className="text-[17px] text-zinc-500 dark:text-zinc-400 leading-snug font-normal">
                                            O Opendraft está em beta fechado. Garanta seu lugar na fila para ser um dos primeiros a experimentar.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-start gap-2 w-full">
                                    <div className="relative flex items-center w-full p-1.5 rounded-2xl bg-zinc-200/60 dark:bg-white/[0.05] transition-all">
                                        <input
                                            type="email"
                                            placeholder="Seu melhor e-mail"
                                            className="flex-1 bg-transparent px-4 py-2.5 text-[15px] text-zinc-900 dark:text-white outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                                        />
                                        <button className="w-11 h-11 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>

                                    <p className="text-[12px] text-zinc-500 dark:text-zinc-600 leading-relaxed px-1">
                                        Ao entrar na lista, você receberá atualizações sobre o status do sistema e o convite exclusivo.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
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
};

export default Index;
