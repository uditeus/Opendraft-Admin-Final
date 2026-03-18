import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { ChatComposer } from "@/components/chat/ChatComposer";
import { AppIcon, createAppIcon } from "@/components/icons/AppIcon";
import { PILL_CONFIG, QUICK_PROMPTS } from "@/components/chat/quick-prompts";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, X, Check, Globe } from "lucide-react";

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
                {/* Left Side: Logo + Main Nav */}
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
                                        activeMenu === item.id && "text-foreground opacity-100"
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

                {/* Spacer to push items to right */}
                <div className="flex-1" />

                {/* Right Side: Login + Search */}
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
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Backdrop Blur Overlay */}
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
                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
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
}

const WritingAssistantMockup = ({ bgImage = "https://i.imgur.com/HxpWPDC.png" }: { bgImage?: string }) => {
    const fullText = "Eu te desafio a continuar lendo por mais alguns segundos antes de decidir que isso não é pra você.\n\nSe você já terminou um prato e sentiu que estava bom, mas não marcante, talvez você entenda do que eu tô falando. Não é falta de esforço. Muito menos de vontade. Às vezes a gente faz tudo certo e ainda assim parece que falta alguma coisa que a gente não sabe explicar.";

    return (
        <div className="relative w-full h-full flex items-center justify-center p-8 overflow-hidden bg-cover bg-center rounded-xl" style={{ backgroundImage: `url('${bgImage}')` }}>
            <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl flex flex-col p-8 relative overflow-hidden text-left border border-white/20 dark:border-white/5">
                <div className="self-end bg-[#F3F4F6] dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-5 py-3 rounded-2xl rounded-tr-none text-[13.5px] max-w-[85%] mb-8">
                    escreva uma copy de vendas para um curso de culinária
                </div>

                <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-[11px] mb-6 shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-90 opacity-60">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <span className="text-[11px] font-medium opacity-80">
                        Thought for 2.6s
                    </span>
                </div>

                <div className="flex flex-col gap-6 overflow-hidden">
                    <div className="flex flex-col gap-5">
                        <div className="text-[14.5px] leading-[1.8] text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">
                            {fullText}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SmartDraftMockup = ({ bgImage = "https://i.imgur.com/HxpWPDC.png" }: { bgImage?: string }) => (
    <div className="relative w-full h-full flex items-end justify-center px-4 md:px-8 overflow-hidden bg-cover bg-center rounded-xl" style={{ backgroundImage: `url('${bgImage}')` }}>
        <div className="w-[90%] md:w-[85%] h-[90%] bg-white dark:bg-zinc-900 rounded-t-2xl shadow-2xl flex flex-col p-6 sm:p-8 relative overflow-hidden text-left border-x border-t border-white/20 dark:border-white/5 translate-y-8">
            <h1 className="text-[18px] md:text-[20px] font-bold leading-tight text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight truncate">
                Copy de vendas para Curso de Culinária Profissional
            </h1>

            <div className="space-y-5">
                <p className="text-[13px] md:text-[14px] text-zinc-600 dark:text-zinc-400 leading-[1.6]">
                    Você já sentiu que, por mais que siga a receita passo a passo, o resultado final ainda parece "vazio"? Falta aquele brilho, aquela explosão de sabor que você encontra nos melhores restaurantes. Muita gente acredita que o segredo está em ingredientes caros ou equipamentos de última geração. Mas a verdade é muito mais simples: a culinária é uma linguagem, e a maioria de nós só sabe repetir palavras sem entender a sintaxe.
                </p>
                <p className="text-[13px] md:text-[14px] text-zinc-600 dark:text-zinc-400 leading-[1.6]">
                    Imagine entrar na sua cozinha e não precisar mais de um livro aberto. Saber exatamente como equilibrar a acidez de um tomate com a doçura de uma cebola caramelizada, ou como usar o calor residual para atingir o ponto perfeito de uma carne. É sobre isso que este treinamento trata. Não vamos te dar apenas receitas; vamos te ensinar a pensar como um chef, treinando seu paladar e sua intuição para transformar qualquer ingrediente básico em uma experiência memorável para quem você ama.
                </p>
                <p className="text-[13px] md:text-[14px] text-zinc-600 dark:text-zinc-400 leading-[1.6]">
                    É hora de deixar de ser um mero replicador de fórmulas e começar a criar. Seus amigos e familiares vão notar a diferença imediatamente, não apenas no sabor, mas na sua confiança entre as panelas. A partir de hoje, cada refeição é uma oportunidade de contar uma história. E a sua história começa aqui, no domínio absoluto das técnicas que separam o amador do mestre.
                </p>
            </div>
        </div>
    </div>
);

const SmartDiscoveryMockup = () => (
    <div className="relative w-full h-full flex items-center justify-center p-8 sm:p-12 overflow-hidden bg-cover bg-center rounded-xl" style={{ backgroundImage: "url('https://i.imgur.com/HxpWPDC.png')" }}>
        <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl flex flex-col p-8 md:p-10 overflow-hidden border border-white/20 dark:border-white/5">
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
                        <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-sm relative transition-all duration-500 group-hover:shadow-md">
                            <img
                                src={p.img}
                                alt={p.name}
                                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 opacity-90 dark:opacity-80"
                            />
                        </div>
                        <span className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors truncate">{p.name}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);


const LANGUAGES_LIST = [
    { native: "Malay", english: "Malay", id: "ms" },
    { native: "മലയാളം", english: "Malayalam", id: "ml" },
    { native: "मराठी", english: "Marathi", id: "mr" },
    { native: "Norsk Bokmål", english: "Norwegian Bokmål", id: "nb" },
    { native: "فارسی", english: "Persian", id: "fa" },
    { native: "Polski", english: "Polish", id: "pl" },
    { native: "Português Brasil", nativeSub: "Brazil", english: "Portuguese", id: "pt-BR", active: true },
    { native: "Português Portugal", nativeSub: "Portugal", english: "Portuguese", id: "pt-PT" },
    { native: "Română", english: "Romanian", id: "ro" },
    { native: "Русский", english: "Russian", id: "ru" },
    { native: "Slovenčina", english: "Slovak", id: "sk" },
    { native: "Slovenščina", english: "Slovenian", id: "sl" },
    { native: "Español Latinoamérica", english: "Spanish Latin America", id: "es-419" },
    { native: "Español España", english: "Spanish Spain", id: "es-ES" },
    { native: "Kiswahili", english: "Swahili", id: "sw" },
];

const PaginaTest = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted ? resolvedTheme === 'dark' : false;
    const navigate = useNavigate();

    // States for Composer to "act like the app"
    const [draft, setDraft] = useState("");
    const [selectedAgent, setSelectedAgent] = useState<null | "write" | "explore" | "plan" | "analyze">(null);
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [activePill, setActivePill] = useState<null | "write" | "ideas" | "plan" | "analyze">(null);
    const [selectedPlaybook, setSelectedPlaybook] = useState<string | null>(null);
    const [activationOrder, setActivationOrder] = useState<("style" | "pill" | "playbook" | "agent")[]>([]);
    const [activeFeatureTab, setActiveFeatureTab] = useState("Criativo");
    const [typing, setTyping] = useState(false);

    const FEATURES_TABS = useMemo(() => [
        {
            id: "Criativo",
            label: "Criativo",
            icon: "Pen01Icon",
            title: "Criativos que param o scroll",
            description: "A Opendraft entende como as pessoas pensam, o que desperta curiosidade e o que faz alguém continuar assistindo até o final. Ela organiza a ideia, constrói ganchos fortes e encaixa os argumentos no ritmo certo da conversa para transformar atenção em cliques e resultados reais.",
            bgImage: "https://i.imgur.com/HxpWPDC.png",
            mockupText: "Imagine um anúncio que não parece um anúncio. Que interrompe o scroll pela curiosidade e não pela chatice. Começamos com um gancho emocional forte: 'A maioria dos produtores de conteúdo está perdendo dinheiro por um erro de 3 segundos'.\n\nEssa abordagem gera interrupção de padrão imediata, foca em uma dor específica e termina com uma chamada de ação natural que não soa vendedora."
        },
        {
            id: "Oferta",
            label: "Oferta",
            icon: "AlignBoxMiddleCenter",
            title: "Ofertas que dão vontade de comprar",
            description: "Começa quando a promessa fica clara e específica. A Opendraft ajuda a estruturar um mecanismo único, mostrar o problema que a pessoa sente — mas ainda não soube explicar — e apresentar a sua solução de um jeito que faz sentido imediatamente, eliminando as principais objeções de compra.",
            bgImage: "https://i.imgur.com/HxpWPDC.png",
            mockupText: "O segredo de uma oferta irresistível não é o preço, é o valor percebido. Estruturamos o seu produto como a única solution lógica para o seu cliente.\n\n'O sistema Opendraft não é apenas uma ferramenta de escrita, é o seu novo estrategista de vendas que nunca dorme'. Destacamos o mecanismo único, eliminamos as principais objeções e criamos escassez real baseada no valor."
        },
        {
            id: "Funil",
            label: "Funil",
            icon: "Filter",
            title: "Funil estratégico que fatura",
            description: "Cada etapa tem intenção, cada mensagem tem função. Do primeiro contato até o momento da compra, tudo é construído para conduzir, convencer e converter. Organizamos a jornada do seu cliente para que cada palavra dita aproxime ele da decisão final de compra.",
            bgImage: "https://i.imgur.com/HxpWPDC.png",
            mockupText: "Um funil não é uma linha reta, é uma construção de confiança. Desde o primeiro e-mail de boas-vindas até a página de finalização de compra.\n\n'Seja bem-vindo ao futuro da escrita estratégica. Nas próximas horas, você vai descobrir por que seu texto atual não converte o tanto que deveria'. Aquecemos a audiência fria e geramos um pico de interesse no momento exato."
        },
        {
            id: "Ideia",
            label: "Ideia",
            icon: "Idea01",
            title: "Ideias quando a mente trava",
            description: "Criatividade não é esperar inspiração cair do céu, é ter estrutura para provocar novas possibilidades. A Opendraft analisa seu objetivo, seu público e seu contexto para sugerir ângulos, ganchos e abordagens únicas que você não encontraria sozinho.",
            bgImage: "https://i.imgur.com/HxpWPDC.png",
            mockupText: "Ideias que geram compartilhamento são aquelas que dizem o que todos sentem, mas ninguém disse ainda. 'Por que tentar ser original em tudo está matando sua criatividade'.\n\nExploramos variações desse mesmo ângulo para garantir ressonância cultural, formatos adaptáveis para diferentes redes e provocações que estimulam o engajamento genuíno da sua audiência."
        }
    ], []);

    useEffect(() => {
        // Sync with next-themes was here, now controlled by resolvedTheme
    }, []);

    // Body class for portal styling is now handled by next-themes and CSS variables
    // No manual classList manipulation here to avoid hydration flashes

    // Sync activationOrder
    useEffect(() => {
        setActivationOrder(prev => {
            const order = [...prev];
            if (activePill && !order.includes("pill")) order.push("pill");
            else if (!activePill && order.includes("pill")) order.splice(order.indexOf("pill"), 1);
            if (selectedStyle && !order.includes("style")) order.push("style");
            else if (!selectedStyle && order.includes("style")) order.splice(order.indexOf("style"), 1);
            if (selectedPlaybook && !order.includes("playbook")) order.push("playbook");
            else if (!selectedPlaybook && order.includes("playbook")) order.splice(order.indexOf("playbook"), 1);
            if (selectedAgent && !order.includes("agent")) order.push("agent");
            else if (!selectedAgent && order.includes("agent")) order.splice(order.indexOf("agent"), 1);
            return order;
        });
    }, [activePill, selectedStyle, selectedPlaybook, selectedAgent]);

    const quickActions = useMemo(() => [
        { id: "write" as const, label: PILL_CONFIG.write.label, Icon: createAppIcon("Pen01Icon"), prompts: QUICK_PROMPTS.write.map(p => ({ title: p.title, prompt: p.prompt })) },
        { id: "ideas" as const, label: PILL_CONFIG.ideas.label, Icon: createAppIcon("Lightbulb"), prompts: QUICK_PROMPTS.ideas.map(p => ({ title: p.title, prompt: p.prompt })) },
        { id: "plan" as const, label: PILL_CONFIG.plan.label, Icon: createAppIcon("CalendarClock"), prompts: QUICK_PROMPTS.plan.map(p => ({ title: p.title, prompt: p.prompt })) },
        { id: "analyze" as const, label: PILL_CONFIG.analyze.label, Icon: createAppIcon("Search"), prompts: QUICK_PROMPTS.analyze.map(p => ({ title: p.title, prompt: p.prompt })) },
    ], []);

    const handleSend = () => {
        if (!draft.trim() && attachments.length === 0) return;
        setTyping(true);
        setTimeout(() => {
            setDraft("");
            setAttachments([]);
            setTyping(false);
            setActivePill(null);
            setSelectedPlaybook(null);
        }, 1500);
    };

    return (
        <div className={cn(
            "min-h-screen w-full font-inter bg-background text-foreground"
        )}>
            <OpendraftNavbar isDark={isDark} />

            <main className="max-w-[1440px] mx-auto px-8 pt-[240px] pb-32">
                <div className="flex flex-col gap-10 items-start">
                    {/* Hero Content */}
                    <div className="w-full flex flex-col items-start">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className={cn(
                                "text-[48px] font-medium tracking-tight leading-[1.1] mb-6 max-w-[900px]",
                                isDark ? "text-white" : "text-[#1d1d1f]"
                            )}
                        >
                            Escreva textos que fazem pessoas comprar, clicar e compartilhar
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className={cn(
                                "text-[18px] font-medium leading-relaxed opacity-60 mb-10 max-w-[700px]",
                                isDark ? "text-white/80" : "text-[#1d1d1f]/80"
                            )}
                        >
                            Transforme qualquer ideia em copy persuasiva, roteiros virais e conteúdo que prende atenção
                        </motion.p>

                        {/* Composer directly below subheadline - Flush Left */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="w-full max-w-[760px] -ml-6"
                        >
                            <ChatComposer
                                value={draft}
                                onChange={setDraft}
                                onSubmit={handleSend}
                                disabled={typing}
                                placeholder="O que você quer criar?"
                                uiVariant="hero"
                                selectedAgent={selectedAgent}
                                onSelectAgent={setSelectedAgent}
                                selectedStyle={selectedStyle}
                                onSelectStyle={setSelectedStyle}
                                activePill={activePill}
                                onSelectPill={setActivePill as any}
                                activationOrder={activationOrder}
                                attachments={attachments}
                                onAttach={(f) => setAttachments(p => [...p, ...f])}
                                onRemoveAttachment={(idx) => setAttachments(p => p.filter((_, i) => i !== idx))}
                                contextPill={activePill ? {
                                    label: PILL_CONFIG[activePill].label,
                                    Icon: quickActions.find(q => q.id === activePill)!.Icon,
                                    onClear: () => setActivePill(null)
                                } : null}
                                playbookContext={selectedPlaybook ? {
                                    label: "Playbook",
                                    onClear: () => setSelectedPlaybook(null)
                                } : null}
                                dropdownSide="bottom"
                                showShiftHint={false}
                                isDark={isDark}
                            />

                            {/* Suggestions Section - Flush Left with Headline */}
                            <div className="mt-3 min-h-[140px] ml-6">
                                <AnimatePresence mode="wait">
                                    {!activePill && draft.length === 0 ? (
                                        <motion.div
                                            key="actions"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="flex flex-wrap items-center gap-3"
                                        >
                                            {quickActions.map(({ id, label, Icon }) => (
                                                <Button
                                                    key={id}
                                                    variant="outline"
                                                    size="sm"
                                                    className="group h-10 rounded-full px-5 bg-[hsl(var(--chat-composer))] border-border/60 dark:border-none text-foreground/70 hover:bg-[hsl(var(--chat-hover))] hover:text-foreground shadow-sm transition-all"
                                                    onClick={() => setActivePill(id)}
                                                >
                                                    <Icon className="h-4.5 w-4.5 text-muted-foreground group-hover:text-foreground" />
                                                    <span className="text-[13px] font-medium ml-2">{label}</span>
                                                </Button>
                                            ))}
                                        </motion.div>
                                    ) : activePill && draft.length === 0 ? (
                                        <motion.div
                                            key="prompts"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="w-full"
                                        >
                                            <ul className="flex flex-col gap-1 -ml-7">
                                                {quickActions.find(q => q.id === activePill)?.prompts.map(({ title, prompt }) => (
                                                    <li key={title}>
                                                        <Button
                                                            variant="ghost"
                                                            className="group w-full justify-start px-7 py-2.5 text-foreground/60 hover:text-foreground hover:bg-transparent active:bg-transparent text-[14px] font-normal transition-all"
                                                            onClick={() => setDraft(prompt)}
                                                        >
                                                            <span className="truncate group-hover:font-medium">{title}</span>
                                                        </Button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Features Section */}
                <section className="w-full pt-64">
                    <div className="flex flex-col items-center text-center mb-48">
                        <h2 className="text-[48px] font-medium tracking-tight text-foreground leading-tight mb-8">
                            Escrever bem virou vantagem competitiva
                        </h2>
                    </div>

                    <div className="space-y-48">
                        {/* Feature 1 */}
                        <div className="flex flex-col md:flex-row items-end justify-between px-0">
                            <div className="w-full md:w-[700px] shrink-0 aspect-[1.4/1] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800/50">
                                <WritingAssistantMockup bgImage="https://i.imgur.com/HxpWPDC.png" />
                            </div>
                            <div className="w-full md:w-1/3 space-y-6 pb-2">
                                <h3 className="text-[30px] font-medium tracking-tight text-foreground leading-tight">
                                    IA que escreve igual gente
                                </h3>
                                <p className="text-[17px] text-foreground/60 leading-relaxed font-normal">
                                    A Opendraft transforma ideias ainda cruas em textos claros, naturais e persuasivos. Ela entende a intenção por trás do que você quer dizer e organiza tudo de um jeito que faz sentido para quem está lendo. Em vez de gerar aquele texto robótico cheio de frases bonitas que não dizem nada, usa princípios reais de copywriting para criar mensagens que prendem atenção, geram cliques e fazem pessoas agir.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex flex-col md:flex-row-reverse items-end justify-between px-0">
                            <div className="w-full md:w-[700px] shrink-0 aspect-[1.4/1] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800/50">
                                <SmartDraftMockup bgImage="https://i.imgur.com/HxpWPDC.png" />
                            </div>
                            <div className="w-full md:w-1/3 space-y-6 pb-2">
                                <h3 className="text-[30px] font-medium tracking-tight text-foreground leading-tight">
                                    Rascunho inteligente e editável
                                </h3>
                                <p className="text-[17px] text-foreground/60 leading-relaxed font-normal">
                                    Sua ideia não precisa nascer perfeita. Na Opendraft você pode gerar variações, testar novos ganchos, mudar estruturas e ajustar o tone até encontrar a versão que realmente convence. É um espaço para criar junto com a IA, onde você escreve, refina e evolui cada palavra enquanto o texto vai ganhando forma. Você continua no controle da ideia e do estilo.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex flex-col md:flex-row items-end justify-between px-0">
                            <div className="w-full md:w-[700px] shrink-0 aspect-[1.4/1] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800/50">
                                <SmartDiscoveryMockup />
                            </div>
                            <div className="w-full md:w-1/3 space-y-6 pb-2">
                                <h3 className="text-[30px] font-medium tracking-tight text-foreground leading-tight">
                                    Comece com a estrutura certa
                                </h3>
                                <p className="text-[17px] text-foreground/60 leading-relaxed font-normal">
                                    Nem todo texto tem o mesmo objetivo. Por isso a Opendraft traz playbooks prontos para situações reais da internet, como viralizar no TikTok, vender no WhatsApp, criar páginas de vendas ou roteiros para YouTube. Em vez de começar do zero, você parte de estruturas que já funcionam.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* How You Can Use Opendraft Section */}
            <section className="w-full pt-48 pb-32 px-0 bg-background overflow-visible">
                <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center mb-16">
                    <h2 className="text-[48px] font-medium tracking-tight text-foreground leading-tight">
                        Como você pode usar a Opendraft
                    </h2>
                </div>
                <div className="max-w-[1440px] mx-auto w-full px-8">
                    {(() => {
                        const activeTabContent = FEATURES_TABS.find(t => t.id === activeFeatureTab);
                        return (
                            <div className="flex flex-col md:flex-row items-start justify-between relative min-h-[400vh]">
                                {/* Left: Sequential full-screen features */}
                                <div className="w-full md:w-1/3 z-10">
                                    {FEATURES_TABS.map(tab => {
                                        const isActive = activeFeatureTab === tab.id;
                                        return (
                                            <motion.div
                                                key={tab.id}
                                                onViewportEnter={() => setActiveFeatureTab(tab.id)}
                                                viewport={{ margin: "-50% 0px -50% 0px" }}
                                                className="h-screen flex flex-col justify-end pb-[calc(50vh-250px)] gap-6"
                                            >
                                                <h4 className={cn(
                                                    "text-[30px] font-medium tracking-tight transition-all duration-700",
                                                    isActive ? "text-foreground opacity-100" : "text-foreground opacity-10"
                                                )}>
                                                    {tab.label}
                                                </h4>
                                                <p className={cn(
                                                    "text-[17px] text-foreground font-normal leading-relaxed transition-all duration-700",
                                                    isActive ? "opacity-60" : "opacity-10"
                                                )}>
                                                    {tab.description}
                                                </p>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Right: Sticky Mockup */}
                                <div className="hidden md:flex md:w-[700px] sticky top-0 h-screen items-center z-20">
                                    <div
                                        className="w-full aspect-[1.4/1] p-8 pb-0 flex items-end justify-center overflow-hidden relative border border-white/5 rounded-xl transition-all duration-700 shadow-2xl shadow-black/40 bg-zinc-800/10"
                                        style={{ backgroundImage: `url('${activeTabContent?.bgImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                    >
                                        <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />

                                        <div className="w-full h-[95%] relative flex justify-center items-end z-10 px-8">
                                            <AnimatePresence mode="popLayout">
                                                <motion.div
                                                    key={activeFeatureTab}
                                                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                                                    className="w-full max-w-[540px] h-full bg-white dark:bg-zinc-900 rounded-t-[20px] shadow-2xl border-t border-l border-r border-black/10 dark:border-white/10 overflow-hidden relative translate-y-[4px]"
                                                >
                                                    <div className="p-8 md:p-10 text-left absolute inset-0 overflow-y-auto no-scrollbar bg-gradient-to-b from-transparent to-black/5 dark:to-white/5">
                                                        <h3 className="text-[30px] font-medium text-zinc-900 dark:text-zinc-100 leading-[1.1] tracking-[-0.02em] mb-6">
                                                            {activeTabContent?.title || "Carregando..."}
                                                        </h3>
                                                        <div className="space-y-6">
                                                            {(activeTabContent?.mockupText || "").split('\n\n').map((para: string, idx: number) => (
                                                                <p key={idx} className="text-[15px] md:text-[16px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                                                    {para}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </section>

            <main className="max-w-[1440px] mx-auto px-8 pb-32 bg-background">
                <div className="flex flex-col gap-10 items-start">

                    {/* Multi-Interface / 3 Steps Section */}
                    <section className="w-full py-32 bg-white dark:bg-[#181a1b] overflow-hidden">
                        <div className="max-w-[1440px] mx-auto px-0">
                            <div className="text-center mb-24">
                                <h2 className="text-[48px] font-medium tracking-tight text-zinc-900 dark:text-white leading-tight">
                                    Um processo simples em 3 passos
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Step 1 */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="bg-[#F7F7F7] dark:bg-[#232527] rounded-xl p-4 flex flex-col h-full border border-transparent"
                                >
                                    <div className="rounded-xl overflow-hidden aspect-[1.2/1] relative border border-black/5 mb-2">
                                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://i.imgur.com/HxpWPDC.png')" }} />
                                        <div className="absolute inset-0 bg-black/10" />

                                        {/* Real ChatComposer sticking to the right wall and cropped */}
                                        <div className="absolute inset-0 flex items-center justify-end pointer-events-none overflow-hidden">
                                            <div className="w-[200%] scale-[1.1] origin-right translate-x-[35%] relative">
                                                {/* Absolute Full Shield - No Interaction Allowed */}
                                                <div className="absolute inset-0 z-50 cursor-default bg-transparent pointer-events-auto" />
                                                <ChatComposer
                                                    value="escreva uma copy de vendas para..."
                                                    onChange={() => { }}
                                                    onSubmit={() => { }}
                                                    placeholder="O que você quer criar?"
                                                    uiVariant="hero"
                                                    activationOrder={[]}
                                                    attachments={[]}
                                                    onAttach={() => { }}
                                                    onRemoveAttachment={() => { }}
                                                    disabled={true}
                                                    isDark={isDark}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-3 py-4 space-y-2">
                                        <h3 className="text-[30px] font-medium text-zinc-900 dark:text-white leading-tight tracking-tight">Envie um prompt</h3>
                                        <p className="text-[17px] text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed">
                                            Diga o que você precisa criar e deixe a inteligência da Opendraft entender seu contexto.
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Step 2 */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="bg-[#F7F7F7] dark:bg-[#232527] rounded-xl p-4 flex flex-col h-full border border-transparent"
                                >
                                    <div className="rounded-xl overflow-hidden aspect-[1.2/1] relative border border-black/5 mb-2">
                                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://i.imgur.com/HxpWPDC.png')" }} />
                                        <div className="absolute inset-0 bg-black/10" />
                                        <div className="absolute inset-x-4 inset-y-6 flex items-center justify-center">
                                            <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl flex flex-col p-8 relative overflow-hidden text-left border border-white/20 dark:border-none">
                                                {/* User Message - Exact 1:1 App Style */}
                                                <div className="self-end bg-[#F3F4F6] dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-5 py-3 rounded-2xl rounded-tr-none text-[13.5px] max-w-[85%] mb-8 font-medium">
                                                    escreva uma copy de vendas para um curso de culinária
                                                </div>

                                                {/* AI Thought - Exact 1:1 App Style */}
                                                <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-[11px] mb-2 shrink-0">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-90 opacity-60">
                                                        <polyline points="9 18 15 12 9 6" />
                                                    </svg>
                                                    <span className="text-[11px] font-medium opacity-80">
                                                        Thought for 2.6s
                                                    </span>
                                                </div>

                                                {/* AI Response - Exact 1:1 App Style */}
                                                <div className="flex flex-col overflow-hidden">
                                                    <div className="text-[14.5px] leading-[1.6] text-zinc-600 dark:text-zinc-400 font-medium whitespace-pre-wrap">
                                                        Eu te desafio a continuar lendo por mais alguns segundos antes de decidir que isso não é pra você.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-3 py-4 space-y-2">
                                        <h3 className="text-[30px] font-medium text-zinc-900 dark:text-white leading-tight tracking-tight">Resultado da IA</h3>
                                        <p className="text-[17px] text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed">
                                            Receba estruturas de alta conversão baseadas em playbooks que já foram testados no mercado.
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Step 3 */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="bg-[#F7F7F7] dark:bg-[#232527] rounded-xl p-4 flex flex-col h-full border border-transparent"
                                >
                                    <div className="rounded-xl overflow-hidden aspect-[1.2/1] relative border border-black/5 mb-2">
                                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://i.imgur.com/HxpWPDC.png')" }} />
                                        <div className="absolute inset-0 bg-black/10" />
                                        <div className="absolute inset-x-6 bottom-0 top-6 bg-white dark:bg-zinc-900 rounded-t-2xl shadow-2xl border-x border-t dark:border-none flex flex-col p-8 translate-y-2">
                                            <h4 className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-4 tracking-tight">
                                                Copy de vendas para Curso de Culinária
                                            </h4>
                                            <div className="space-y-3 overflow-hidden opacity-90">
                                                <p className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                                    Você já sentiu que, por mais que siga a receita passo a passo, o resultado final ainda parece "vazio"? Falta aquele brilho, aquela explosão de sabor que você encontra nos melhores restaurantes.
                                                </p>
                                                <p className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                                    Muita gente acredita que o segredo está em ingredientes caros ou equipamentos de última geração. Mas a verdade é muito mais simples: a culinária é uma linguagem, e a maioria de nós só sabe repetir palavras sem entender a sintaxe.
                                                </p>
                                                <p className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                                    Imagine entrar na sua cozinha e não precisar mais de um livro aberto. Saber exatamente como equilibrar a acidez de um tomate com a doçura de uma cebola caramelizada...
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-3 py-4 space-y-2">
                                        <h3 className="text-[30px] font-medium text-zinc-900 dark:text-white leading-tight tracking-tight">Refine e use a copy</h3>
                                        <p className="text-[17px] text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed">
                                            Ajuste o tom, mude ganchos e copie o resultado final para usar onde você precisar.
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* Final CTA Section */}
                    <section className="w-full py-20 bg-white dark:bg-[#181a1b]">
                        <div className="max-w-[1440px] mx-auto px-0">
                            <div className="w-full py-32 bg-[#F9F9FB] dark:bg-[#232527] rounded-xl flex flex-col items-center text-center border border-transparent">
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                    className="text-[40px] font-medium tracking-tight text-zinc-900 dark:text-white leading-[1.1] max-w-[700px] mb-12"
                                >
                                    Crie textos estratégicos com a inteligência da Opendraft
                                </motion.h2>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                >
                                    <Button
                                        onClick={() => navigate('/login')}
                                        className="bg-[#EEEEEE] hover:bg-[#E5E5E5] dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-full px-8 py-5 text-[14px] font-medium transition-all border-none shadow-none"
                                    >
                                        Começar agora
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </section>

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
            </main>
        </div>
    );
};

export default PaginaTest;
