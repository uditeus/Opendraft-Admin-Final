import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useI18n } from "@/i18n/i18n";
import { Button } from "@/components/ui/button";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { cn } from "@/lib/utils";
import { createAppIcon } from "@/components/icons/AppIcon";

const FileText = createAppIcon("FileText");
const Lightbulb = createAppIcon("Lightbulb");
const CalendarClock = createAppIcon("CalendarClock");
const Search = createAppIcon("Search");
const ChevronDown = createAppIcon("ChevronDown");

import { GLOBAL_IMAGE_URL } from "@/lib/constants";

const HalftoneLayer = () => {
    const { resolvedTheme } = useTheme();
    const bgImage = GLOBAL_IMAGE_URL;
    return (
        <>
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{ backgroundImage: `url(${bgImage})` }}
            />
        </>
    );
};

const SkyBackground = () => (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-700">
        <HalftoneLayer />
    </div>
);

const Index = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { locale, setPreference, tt } = useI18n();
    const [isLangOpen, setIsLangOpen] = React.useState(false);
    const langRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const [draft, setDraft] = React.useState("");
    const [selectedAgent, setSelectedAgent] = React.useState<null | "write" | "explore" | "plan" | "analyze">(null);
    const [selectedStyle, setSelectedStyle] = React.useState<string | null>(null);
    const [activationOrder, setActivationOrder] = React.useState<("style" | "pill")[]>([]);

    const handleSend = () => {
        if (!draft.trim()) return;
        navigate("/signup", { state: { initialPrompt: draft } });
    };

    return (
        <div className="relative flex flex-col selection:bg-primary/10 font-inter transition-colors duration-700">
            {/* Hero Section (Full Screen) */}
            <div className="relative min-h-screen flex flex-col overflow-hidden">
                <SkyBackground />

                {/* Refined Header */}
                <nav className="relative z-20 w-full pt-12 px-6">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        {/* Logo - Text only */}
                        <div className="flex items-center cursor-pointer shrink-0" onClick={() => navigate("/")}>
                            <span className="text-xl font-bold tracking-[0.02em] text-foreground">Opendraft</span>
                        </div>

                        {/* Right Action */}
                        <div className="flex items-center shrink-0">
                            <Button
                                onClick={() => navigate("/login")}
                                className="rounded-full h-10 px-8 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-black/5 dark:shadow-white/5"
                            >
                                {tt("Entrar", "Sign In")}
                            </Button>
                        </div>
                    </div>
                </nav>

                {/* Main Content Area - Centered Hero */}
                <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
                    <div className="w-full max-w-[760px] flex flex-col items-center text-center">
                        {/* Plan Status Pill */}
                        <div
                            onClick={() => navigate("/pricing")}
                            className="mb-8 flex items-center gap-2 rounded-[10px] bg-black/[0.03] dark:bg-white/[0.03] px-4 py-1.5 text-sm cursor-pointer w-fit mx-auto"
                        >
                            <span className="text-zinc-400 dark:text-zinc-500">plano Gratuito</span>
                            <span className="text-zinc-300 dark:text-zinc-700">•</span>
                            <span className="text-zinc-500 dark:text-zinc-400 font-medium underline underline-offset-4 decoration-zinc-300/50 dark:decoration-zinc-700/50">Fazer Upgrade</span>
                        </div>

                        <h1 className="text-[28px] md:text-[32px] font-normal tracking-[0.01em] mb-8 text-foreground leading-[1.1]">
                            Construa textos que vendem
                        </h1>

                        <div className="w-full">
                            <ChatComposer
                                value={draft}
                                onChange={setDraft}
                                onSubmit={handleSend}
                                uiVariant="hero"
                                placeholder="O que vamos construir hoje?"
                                showShiftHint={false}
                                dropdownSide="bottom"
                                selectedAgent={selectedAgent}
                                onSelectAgent={setSelectedAgent}
                                selectedStyle={selectedStyle}
                                onSelectStyle={(style) => {
                                    setSelectedStyle(style);
                                    if (style) {
                                        setActivationOrder(prev => prev.includes("style") ? prev : [...prev, "style"]);
                                    } else {
                                        setActivationOrder(prev => prev.filter(x => x !== "style"));
                                    }
                                }}
                                activationOrder={activationOrder}
                            />
                        </div>
                    </div>
                </main>
            </div>

            {/* Engineering Focus Section (Clean Light Mode) */}
            <section className="w-full bg-white dark:bg-[#09090b] py-40 px-6 transition-colors duration-700">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    {/* Section Label */}
                    <div className="text-center mb-32">
                        <h2 className="text-3xl md:text-[42px] font-normal tracking-[0.01em] text-foreground leading-tight">
                            A ciência da escrita que converte
                        </h2>
                    </div>

                    <div className="flex flex-col lg:flex-row items-end justify-between gap-16 lg:gap-24 w-full">
                        {/* Text Content (Left - Bottom Aligned) */}
                        <div className="flex flex-col space-y-10 flex-1 max-w-lg pb-4">
                            <h3 className="text-[28px] md:text-[36px] font-normal tracking-[-0.01em] text-foreground leading-[1.15]">
                                Copys persuasivas, criadas por agentes especialistas
                            </h3>
                            <p className="text-lg md:text-xl text-foreground/50 font-normal leading-relaxed">
                                Deixe para trás o bloqueio criativo. O Opendraft utiliza agentes treinados nos maiores frameworks de persuasão para criar textos que vendem, de landing pages a campanhas completas, mantendo sempre a voz única da sua marca.
                            </p>
                        </div>

                        {/* Natural Sky Image (800x600) */}
                        <div className="relative flex-none w-[800px] h-[600px] hidden lg:block">
                            <div className="relative w-full h-full rounded-xl shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] bg-sky-50 dark:bg-zinc-950">
                                <div className="absolute inset-0 rounded-xl overflow-hidden border border-white/40 dark:border-white/5 transition-colors duration-700">
                                    {/* Universal Halftone Background */}
                                    {/* Universal Halftone Background */}
                                    <HalftoneLayer />
                                </div>
                            </div>
                        </div>

                        {/* Mobile/Small Screen Fallback */}
                        <div className="relative w-full h-[320px] lg:hidden">
                            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border/40">
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${GLOBAL_IMAGE_URL})` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brand Consistency Section (Image Left, Text Right) */}
            <section className="w-full bg-white dark:bg-[#09090b] py-40 px-6 overflow-hidden transition-colors duration-700">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-16 lg:gap-24 w-full">
                        {/* Natural Sky Image (Left - Bottom Aligned) */}
                        <div className="relative flex-none w-[800px] h-[600px] hidden lg:block order-2 lg:order-1">
                            <div className="relative w-full h-full rounded-xl shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] bg-sky-50 dark:bg-zinc-950">
                                <div className="absolute inset-0 rounded-xl overflow-hidden border border-white/40 dark:border-white/5 transition-colors duration-700">
                                    {/* Universal Halftone Background */}
                                    {/* Universal Halftone Background */}
                                    <HalftoneLayer />
                                </div>
                            </div>
                        </div>

                        {/* Text Content (Right - Bottom Aligned) */}
                        <div className="flex flex-col space-y-10 flex-1 max-w-lg pb-4 order-1 lg:order-2">
                            <h3 className="text-[28px] md:text-[36px] font-normal tracking-[-0.01em] text-foreground leading-[1.15]">
                                A voz da sua marca em escala absoluta
                            </h3>
                            <p className="text-lg md:text-xl text-foreground/50 dark:text-zinc-400 font-normal leading-relaxed">
                                Mantenha a consistência impecável em cada palavra. O Opendraft aprende e replica o tom de voz da sua marca, garantindo que cada copy — de um tweet a um artigo longo — soe autêntica e alinhada aos seus valores.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Frameworks Section (Text Left, Image Right) */}
            <section className="w-full bg-white dark:bg-[#09090b] py-40 px-6 overflow-hidden transition-colors duration-700">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-16 lg:gap-24 w-full">
                        {/* Text Content (Left - Bottom Aligned) */}
                        <div className="flex flex-col space-y-10 flex-1 max-w-lg pb-4">
                            <h3 className="text-[28px] md:text-[36px] font-normal tracking-[-0.01em] text-foreground leading-[1.15]">
                                Frameworks que entregam resultados
                            </h3>
                            <p className="text-lg md:text-xl text-foreground/50 dark:text-zinc-400 font-normal leading-relaxed">
                                Venda mais com técnicas validadas. Nossos agentes aplicam frameworks como AIDA, PAS e Storytelling de forma automática, estruturando seus argumentos para maximizar a conversão em cada parágrafo.
                            </p>
                        </div>

                        {/* Natural Sky Image (Right - Bottom Aligned) */}
                        <div className="relative flex-none w-[800px] h-[600px] hidden lg:block">
                            <div className="relative w-full h-full rounded-xl shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] bg-sky-50 dark:bg-zinc-950">
                                <div className="absolute inset-0 rounded-xl overflow-hidden border border-white/40 dark:border-white/10 transition-colors duration-700">
                                    {/* Universal Halftone Background */}
                                    <HalftoneLayer />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Creation Cycle Section (Image Left, Text Right) */}
            <section className="w-full bg-white dark:bg-[#09090b] py-40 px-6 overflow-hidden transition-colors duration-700">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-16 lg:gap-24 w-full">
                        {/* Natural Sky Image (Left - Bottom Aligned) */}
                        <div className="relative flex-none w-[800px] h-[600px] hidden lg:block order-2 lg:order-1">
                            <div className="relative w-full h-full rounded-xl shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)]">
                                <div className="absolute inset-0 rounded-xl overflow-hidden border border-white/40 dark:border-white/10 transition-colors duration-700">
                                    {/* Universal Halftone Background */}
                                    {/* Universal Halftone Background */}
                                    <HalftoneLayer />
                                </div>
                            </div>
                        </div>

                        {/* Text Content (Right - Bottom Aligned) */}
                        <div className="flex flex-col space-y-10 flex-1 max-w-lg pb-4 order-1 lg:order-2">
                            <h3 className="text-[28px] md:text-[36px] font-normal tracking-[-0.01em] text-foreground leading-[1.15]">
                                Ciclo completo de criação e refinamento
                            </h3>
                            <p className="text-lg md:text-xl text-foreground/50 dark:text-zinc-400 font-normal leading-relaxed">
                                Não apenas rascunhos, mas peças prontas para o mercado. De ajustes finos em títulos a revisões completas de fluxo, os agentes colaboram com você para lapidar cada detalhe até a perfeição.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Multichannel Section (Text Left, Image Right) */}
            <section className="w-full bg-white dark:bg-[#09090b] py-40 px-6 overflow-hidden transition-colors duration-700">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-16 lg:gap-24 w-full">
                        {/* Text Content (Left - Bottom Aligned) */}
                        <div className="flex flex-col space-y-10 flex-1 max-w-lg pb-4">
                            <h3 className="text-[28px] md:text-[36px] font-normal tracking-[-0.01em] text-foreground leading-[1.15]">
                                Performance multicanal e adaptação inteligente
                            </h3>
                            <p className="text-lg md:text-xl text-foreground/50 dark:text-zinc-400 font-normal leading-relaxed">
                                Adapte sua mensagem para qualquer meio em segundos. O Opendraft compreende as nuances de cada canal, ajustando o tone o formato da sua copy para performar no Instagram, e-mail marketing ou Google Ads com precisão cirúrgica.
                            </p>
                        </div>

                        {/* Natural Sky Image (Right - Bottom Aligned) */}
                        <div className="relative flex-none w-[800px] h-[600px] hidden lg:block">
                            <div className="relative w-full h-full rounded-xl shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] bg-sky-50 dark:bg-zinc-950">
                                <div className="absolute inset-0 rounded-xl overflow-hidden border border-white/40 dark:border-white/10 transition-colors duration-700">
                                    {/* Universal Halftone Background */}
                                    <HalftoneLayer />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Multi-interface Grid Section (Reduced Height) */}
            <section className="w-full bg-white dark:bg-[#09090b] py-40 px-6 transition-colors duration-700">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <div className="text-center mb-20 max-w-3xl">
                        <h2 className="text-4xl md:text-[52px] font-normal tracking-[-0.02em] text-foreground leading-[1.1] mb-8">
                            A inteligência que escreve o seu sucesso
                        </h2>
                        <p className="text-lg md:text-xl text-foreground/50 dark:text-zinc-400 font-normal">
                            Opendraft combina agentes especialistas e psicologia de vendas para criar textos que convertem em qualquer plataforma.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full justify-items-center">
                        {/* Card 1 */}
                        <div className="flex flex-col w-full max-w-[425px] bg-zinc-50 dark:bg-zinc-900/40 rounded-xl overflow-hidden border border-black/[0.03] dark:border-white/10 transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] pb-8">
                            {/* Increased Image Area: 425x300 */}
                            <div className="relative w-full h-[300px] overflow-hidden transition-colors duration-700 border-b border-black/[0.03] dark:border-white/10">
                                {/* Universal Halftone Background */}
                                <HalftoneLayer />
                            </div>
                            {/* Precise Text Alignment */}
                            <div className="flex flex-col items-center p-8 text-center space-y-3">
                                <h4 className="text-[20px] font-medium text-foreground tracking-tight">
                                    {tt("Escrita Automática", "Automatic Writing")}
                                </h4>
                                <p className="text-[14px] text-foreground/50 dark:text-zinc-400 leading-relaxed max-w-[320px]">
                                    {tt("Agentes treinados em frameworks de persuasão que escrevem copys que vendem por você.", "Agents trained in persuasion frameworks that write copy that sells for you.")}
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="flex flex-col w-full max-w-[425px] bg-zinc-50 dark:bg-zinc-900/40 rounded-xl overflow-hidden border border-black/[0.03] dark:border-white/10 transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] pb-8">
                            {/* Increased Image Area: 425x300 */}
                            <div className="relative w-full h-[300px] overflow-hidden transition-colors duration-700 border-b border-black/[0.03] dark:border-white/10">
                                {/* Universal Halftone Background */}
                                <HalftoneLayer />
                            </div>
                            {/* Precise Text Alignment */}
                            <div className="flex flex-col items-center p-8 text-center space-y-3">
                                <h4 className="text-[20px] font-medium text-foreground tracking-tight">
                                    {tt("Conversão em Escala", "Scale Conversion")}
                                </h4>
                                <p className="text-[14px] text-foreground/50 dark:text-zinc-400 leading-relaxed max-w-[320px]">
                                    {tt("Gere centenas de variações de anúncios e páginas focadas em maximizar seu ROI.", "Generate hundreds of variations of ads and pages focused on maximizing your ROI.")}
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="flex flex-col w-full max-w-[425px] bg-zinc-50 dark:bg-zinc-900/40 rounded-xl overflow-hidden border border-black/[0.03] dark:border-white/10 transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] pb-8">
                            {/* Increased Image Area: 425x300 */}
                            <div className="relative w-full h-[300px] overflow-hidden transition-colors duration-700 border-b border-black/[0.03] dark:border-white/10">
                                {/* Universal Halftone Background */}
                                <HalftoneLayer />
                            </div>
                            {/* Precise Text Alignment */}
                            <div className="flex flex-col items-center p-8 text-center space-y-3">
                                <h4 className="text-[20px] font-medium text-foreground tracking-tight">
                                    {tt("Otimização Inteligente", "Smart Optimization")}
                                </h4>
                                <p className="text-[14px] text-foreground/50 dark:text-zinc-400 leading-relaxed max-w-[320px]">
                                    {tt("Refine textos existentes com IA para aumentar a clareza e o poder de convencimento.", "Refine existing texts with AI to increase clarity and persuasive power.")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section (Vibrant & Organic Sky) */}
            <section className="relative w-full py-32 px-6 overflow-hidden bg-white dark:bg-[#09090b] transition-colors duration-700">
                {/* Halftone Background Layers */}
                <div className="absolute inset-0">
                    {/* Universal Halftone Background */}
                    {/* Universal Halftone Background */}
                    <HalftoneLayer />
                </div>
                <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
                    <h2 className="text-[32px] md:text-[48px] font-normal tracking-[-0.02em] text-white leading-[1.1] mb-6 max-w-3xl">
                        {tt("Pronto para escalar seu output?", "Ready to scale your output?")}
                    </h2>
                    <p className="text-lg md:text-xl text-white/70 font-normal mb-12 max-w-xl leading-relaxed">
                        {tt("Junte-se à nova era da criação de conteúdo e transforme suas ideias em copys de alta conversão em segundos.", "Join the new era of content creation and transform your ideas into high-converting copy in seconds.")}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button className="h-[48px] px-8 rounded-full bg-white text-black text-[14px] font-medium hover:bg-white/90 transition-all shadow-lg">
                            {tt("Entrar na Lista de Espera", "Join the Waitlist")}
                        </button>
                        <button className="h-[48px] px-8 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md text-[14px] font-medium hover:bg-white/20 transition-all">
                            {tt("Ver Demonstração", "Watch Demo")}
                        </button>
                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer className="bg-white dark:bg-[#09090b] border-t border-black/[0.1] dark:border-white/[0.05] py-24 px-6 relative z-20 transition-colors duration-700">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-24 text-left">
                        {/* Column 1: Product */}
                        <div className="flex flex-col gap-6">
                            <h4 className="text-[11px] font-semibold text-black/40 dark:text-zinc-500 uppercase tracking-[0.1em]">{tt("Produto", "Product")}</h4>
                            <ul className="flex flex-col gap-4">
                                {['Agents', 'Enterprise', 'Code Review', 'Tab', 'CLI', 'Cloud Agents', 'Pricing'].map(item => (
                                    <li key={item}><a href="#" className="text-[14px] text-black/60 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 2: Resources */}
                        <div className="flex flex-col gap-6">
                            <h4 className="text-[11px] font-semibold text-black/40 dark:text-zinc-500 uppercase tracking-[0.1em]">{tt("Recursos", "Resources")}</h4>
                            <ul className="flex flex-col gap-4">
                                {['Download', 'Changelog', 'Docs', 'Forum', 'Status'].map(item => (
                                    <li key={item}><a href="#" className="text-[14px] text-black/60 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3: Company */}
                        <div className="flex flex-col gap-6">
                            <h4 className="text-[11px] font-semibold text-black/40 dark:text-zinc-500 uppercase tracking-[0.1em]">{tt("Empresa", "Company")}</h4>
                            <ul className="flex flex-col gap-4">
                                {['Careers', 'Blog', 'Community', 'Students', 'Brand', 'Opendraft'].map(item => (
                                    <li key={item}><a href="#" className="text-[14px] text-black/60 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 4: Legal */}
                        <div className="flex flex-col gap-6">
                            <h4 className="text-[11px] font-semibold text-black/40 dark:text-zinc-500 uppercase tracking-[0.1em]">{tt("Legal", "Legal")}</h4>
                            <ul className="flex flex-col gap-4">
                                {[{ pt: 'Termos de Serviço', en: 'Terms of Service' }, { pt: 'Privacidade', en: 'Privacy Policy' }, { pt: 'Uso de Dados', en: 'Data Use' }, { pt: 'Segurança', en: 'Security' }].map(item => (
                                    <li key={item.en}><a href="#" className="text-[14px] text-black/60 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">{tt(item.pt, item.en)}</a></li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 5: Connect */}
                        <div className="flex flex-col gap-6">
                            <h4 className="text-[11px] font-semibold text-black/40 dark:text-zinc-500 uppercase tracking-[0.1em]">{tt("Conectar", "Connect")}</h4>
                            <ul className="flex flex-col gap-4">
                                {['X', 'LinkedIn', 'YouTube'].map(item => (
                                    <li key={item}><a href="#" className="text-[14px] text-black/60 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between border-t border-black/[0.05] dark:border-white/[0.05] pt-10 gap-8">
                        <div className="flex items-center gap-6 text-[13px] text-black/40 dark:text-zinc-500">
                            <span>© 2026 Opendraft, Inc.</span>
                            <span className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-black/20 dark:text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                SOC 2 Certified
                            </span>
                        </div>

                        <div className="flex items-center gap-6">
                            {/* Theme Switcher */}
                            <div className="flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.03] p-1 rounded-full border border-black/[0.05] dark:border-white/10">
                                <button
                                    onClick={() => setTheme("system")}
                                    className={cn(
                                        "p-1.5 rounded-full transition-all",
                                        theme === "system"
                                            ? "bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-white"
                                            : "text-black/40 dark:text-zinc-500 hover:text-black dark:hover:text-zinc-300"
                                    )}
                                >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                                </button>
                                <button
                                    onClick={() => setTheme("light")}
                                    className={cn(
                                        "p-1.5 rounded-full transition-all",
                                        theme === "light"
                                            ? "bg-white shadow-sm text-black"
                                            : "text-black/40 dark:text-zinc-500 hover:text-black dark:hover:text-zinc-300"
                                    )}
                                >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                                </button>
                                <button
                                    onClick={() => setTheme("dark")}
                                    className={cn(
                                        "p-1.5 rounded-full transition-all",
                                        theme === "dark"
                                            ? "bg-zinc-800 shadow-sm text-white"
                                            : "text-black/40 dark:text-zinc-500 hover:text-black dark:hover:text-zinc-300"
                                    )}
                                >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                                </button>
                            </div>

                            {/* Language Switcher */}
                            <div className="relative" ref={langRef}>
                                <button
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-black/[0.1] dark:border-white/10 rounded-full text-[13px] text-black/70 dark:text-zinc-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.05] transition-all shadow-sm"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-black/20 dark:bg-zinc-500" />
                                    {locale === "en" ? "English" : "Português"}
                                    <svg className={cn("w-3 h-3 opacity-40 transition-transform", isLangOpen && "rotate-180")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                                </button>

                                {isLangOpen && (
                                    <div className="absolute bottom-full mb-2 right-0 w-32 bg-white dark:bg-zinc-900 border border-black/[0.1] dark:border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
                                        <button
                                            onClick={() => { setPreference("en"); setIsLangOpen(false); }}
                                            className={cn(
                                                "w-full px-4 py-2.5 text-left text-[13px] transition-colors",
                                                locale === "en" ? "bg-black/[0.03] dark:bg-white/[0.08] text-black dark:text-white font-medium" : "text-black/60 dark:text-zinc-400 hover:bg-black/[0.01] dark:hover:bg-white/[0.03] hover:text-black dark:hover:text-white"
                                            )}
                                        >
                                            English
                                        </button>
                                        <button
                                            onClick={() => { setPreference("pt"); setIsLangOpen(false); }}
                                            className={cn(
                                                "w-full px-4 py-2.5 text-left text-[13px] transition-colors",
                                                locale === "pt" ? "bg-black/[0.03] dark:bg-white/[0.08] text-black dark:text-white font-medium" : "text-black/60 dark:text-zinc-400 hover:bg-black/[0.01] dark:hover:bg-white/[0.03] hover:text-black dark:hover:text-white"
                                            )}
                                        >
                                            Português
                                        </button>
                                        <button
                                            onClick={() => { setPreference("auto"); setIsLangOpen(false); }}
                                            className="w-full px-4 py-2.5 text-left text-[13px] text-black/40 dark:text-zinc-500 hover:bg-black/[0.01] dark:hover:bg-white/[0.03] hover:text-black dark:hover:text-white transition-colors"
                                        >
                                            Auto
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Index;
