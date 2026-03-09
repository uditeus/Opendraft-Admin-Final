import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabase } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2, MessageSquare, ShieldCheck, ThumbsUp } from "lucide-react";

function StreamingText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
    const words = text.split(" ");

    return (
        <motion.span
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: 0.015,
                        delayChildren: delay
                    }
                }
            }}
            className={className}
        >
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    variants={{
                        hidden: { opacity: 0, y: 2 },
                        visible: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.15 }}
                    className="inline-block mr-[0.25em]"
                >
                    {word}
                </motion.span>
            ))}
        </motion.span>
    );
}

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState<"terms" | "intro" | "name" | "topics">("terms");
    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [agreedTerms, setAgreedTerms] = useState(false);
    const [agreedMarketing, setAgreedMarketing] = useState(false);
    const [showTermsError, setShowTermsError] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const supabase = getSupabase();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserEmail(user.email || null);
            } else {
                navigate("/login");
            }
        };
        checkUser();
    }, [navigate]);

    const handleContinue = async () => {
        if (step === "terms") {
            if (!agreedTerms) {
                setShowTermsError(true);
                return;
            }
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            setStep("intro");
            setLoading(false);
        } else if (step === "intro") {
            setStep("name");
        }
    };

    const handleNameSubmit = async () => {
        if (!name.trim()) {
            toast.error("Por favor, me diga seu nome.");
            return;
        }
        setStep("topics");
    };

    const handleFinish = async () => {
        if (selectedTopics.length === 0) {
            toast.error("Selecione pelo menos um tópico.");
            return;
        }

        setLoading(true);
        try {
            const supabase = getSupabase();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Update user metadata to mark onboarding as complete
                const { error: authError } = await supabase.auth.updateUser({
                    data: {
                        onboarding_completed: true,
                        role: 'user' // Default role
                    }
                });

                if (authError) throw authError;

                // Update the profile in the profiles table (public)
                const { error: profileError } = await supabase
                    .from('profiles')
                    // @ts-ignore - bypassing strict type error for profiles update
                    .update({
                        full_name: name,
                    } as any)
                    .eq('id', user.id);

                if (profileError) {
                    console.error("Error updating profile:", profileError);
                }

                toast.success("Tudo pronto! Bem-vindo.");
                navigate("/new");
            }
        } catch (err: any) {
            toast.error("Erro ao salvar suas preferências. Tente novamente.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleTopic = (topic: string) => {
        setSelectedTopics(prev =>
            prev.includes(topic)
                ? prev.filter(t => t !== topic)
                : [...prev, topic]
        );
    };

    const topicsList = [
        {
            id: "infoprodutor", label: "Infoprodutor", icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                </svg>
            )
        },
        {
            id: "copywriter", label: "Copywriter", icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
            )
        },
        {
            id: "trafego", label: "Gestor de Tráfego", icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
                </svg>
            )
        },
        {
            id: "social-media", label: "Social Media", icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
            )
        },
        {
            id: "influencer", label: "Criador / Influencer", icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
            )
        },
        {
            id: "agencia", label: "Agência", icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
                </svg>
            )
        },
        {
            id: "empreendedor", label: "Empreendedor / CEO", icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0 2c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5z" />
                </svg>
            )
        },
        {
            id: "consultor", label: "Consultor / Mentor", icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
            )
        },
        {
            id: "desenvolvedor", label: "Desenvolvedor", icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                </svg>
            )
        },
        {
            id: "designer", label: "Designer", icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
            )
        },
        {
            id: "outro", label: "Outros", icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
                </svg>
            )
        },
    ];

    const handleSignOut = async () => {
        const supabase = getSupabase();
        await supabase.auth.signOut();
        navigate("/entrar");
    };

    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.25,
                delayChildren: 0.15
            }
        }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center pt-8 pb-10 px-6 overflow-x-hidden overflow-y-auto font-['Inter']">
            {/* Logo Section - Only on terms step */}
            {step === "terms" && (
                <div className="flex items-center gap-2 mb-12">
                    <span className="text-[24px] font-semibold text-foreground tracking-tight font-['Inter']">Opendraft</span>
                </div>
            )}

            <AnimatePresence mode="wait">
                {step === "terms" ? (
                    <motion.div
                        key="terms"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex-1 flex flex-col items-center justify-center w-full max-w-[450px]"
                    >
                        <div className="flex flex-col items-center gap-1.5 text-center mb-6">
                            <h1 className="font-serif text-foreground text-[38px] leading-tight tracking-tight">
                                Vamos criar sua conta
                            </h1>
                            <p className="text-muted-foreground text-[16px]">
                                Algumas coisas para você revisar
                            </p>
                        </div>

                        <div className="w-[450px] h-[250px] bg-card border border-border rounded-[28px] p-7 flex flex-col justify-between backdrop-blur-sm overflow-hidden translate-y-2 shadow-sm">
                            <div className="flex flex-col gap-5">
                                <div className="relative">
                                    <div className="flex items-start gap-3 group cursor-pointer" onClick={() => { setAgreedTerms(!agreedTerms); setShowTermsError(false); }}>
                                        <div className="mt-[1.5px]">
                                            <Checkbox
                                                id="terms"
                                                checked={agreedTerms}
                                                onCheckedChange={(checked) => { setAgreedTerms(checked as boolean); setShowTermsError(false); }}
                                                className={cn(
                                                    "border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground rounded-[4px] h-4 w-4 transition-colors",
                                                    showTermsError && !agreedTerms && "border-destructive bg-destructive/10"
                                                )}
                                            />
                                        </div>
                                        <label htmlFor="terms" className="text-[12px] text-muted-foreground leading-[1.6] cursor-pointer group-hover:text-foreground transition-colors">
                                            Concordo com os <span className="text-foreground underline underline-offset-2">Termos do Consumidor</span> e a <span className="text-foreground underline underline-offset-2">Política de Uso Aceitável</span> da Opendraft e confirmo que tenho pelo menos 18 anos de idade.
                                        </label>
                                    </div>

                                    <AnimatePresence>
                                        {showTermsError && !agreedTerms && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -4 }}
                                                className="absolute -bottom-5 left-7 text-destructive text-[11px] font-medium"
                                            >
                                                Concorde com os termos para continuar
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex items-start gap-3 group cursor-pointer" onClick={() => setAgreedMarketing(!agreedMarketing)}>
                                    <div className="mt-[1.5px]">
                                        <Checkbox
                                            id="marketing"
                                            checked={agreedMarketing}
                                            onCheckedChange={(checked) => setAgreedMarketing(checked as boolean)}
                                            className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground rounded-[4px] h-4 w-4 transition-colors"
                                        />
                                    </div>
                                    <label htmlFor="marketing" className="text-[12px] text-muted-foreground leading-[1.6] cursor-pointer group-hover:text-foreground transition-colors">
                                        Receba ocasionalmente e-mails com atualizações de produtos e ofertas promocionais. Você pode cancelar a qualquer momento.
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={handleContinue}
                                className="w-full h-11 rounded-full bg-primary text-primary-foreground text-[14px] font-semibold hover:bg-primary/90 transition-all font-['Inter'] mt-4"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Continuar"}
                            </button>
                        </div>
                    </motion.div>
                ) : step === "intro" ? (
                    <motion.div
                        key="intro"
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: -20 }}
                        variants={containerVariants}
                        className="flex-1 flex flex-col w-full max-w-[650px] pt-32"
                    >
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-2">
                            <h2 className="font-serif text-foreground text-[32px] leading-tight mb-1 tracking-tight">
                                <StreamingText text="Olá, eu sou o Opendraft." />
                            </h2>
                            <p className="text-muted-foreground text-[18px] leading-relaxed mb-1 font-light">
                                <StreamingText text="Sou seu assistente de IA para trabalhar, imaginar e pensar profundamente." delay={0.4} />
                            </p>
                            <p className="text-muted-foreground text-[16px] mb-6">
                                <StreamingText text="Aqui estão algumas coisas que você deveria saber sobre mim:" delay={1.2} />
                            </p>
                        </motion.div>

                        <div className="space-y-6 mb-10">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 1.8 }}
                                className="flex gap-4 items-start"
                            >
                                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground shrink-0 mt-0.5">
                                    <path d="M20 9c-.795-3.985-4.487-7-8.92-7C6.064 2 2 5.855 2 10.61c0 2.285.938 4.36 2.469 5.9c.336.34.561.803.47 1.28a4.75 4.75 0 0 1-.986 2.114a5.95 5.95 0 0 0 3.835-.591c.412-.218.619-.326.764-.348c.102-.016.235-.001.448.035" />
                                    <path d="M11 16.262c0 2.905 2.463 5.261 5.5 5.261q.537 0 1.064-.098c.253-.047.379-.071.467-.058c.088.014.213.08.463.213c.706.376 1.53.509 2.323.361a2.9 2.9 0 0 1-.598-1.291c-.055-.292.081-.575.286-.782A5.12 5.12 0 0 0 22 16.262C22 13.356 19.537 11 16.5 11S11 13.356 11 16.262Z" />
                                </svg>
                                <div>
                                    <h4 className="text-foreground text-[16px] font-semibold mb-1">
                                        <StreamingText text="Pergunte-me qualquer coisa" delay={1.8} />
                                    </h4>
                                    <p className="text-muted-foreground text-[14px] leading-relaxed">
                                        <StreamingText text="Converse comigo sobre qualquer assunto, desde perguntas simples até ideias complexas! Proteções mantêm nosso chat seguro." delay={2.1} />
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 3.2 }}
                                className="flex gap-4 items-start"
                            >
                                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground shrink-0 mt-0.5">
                                    <path d="M18.709 3.495C16.817 2.554 14.5 2 12 2s-4.816.554-6.709 1.495c-.928.462-1.392.693-1.841 1.419S3 6.342 3 7.748v3.49c0 5.683 4.542 8.842 7.173 10.196c.734.377 1.1.566 1.827.566s1.093-.189 1.827-.566C16.457 20.08 21 16.92 21 11.237V7.748c0-1.406 0-2.108-.45-2.834s-.913-.957-1.841-1.419" />
                                    <path d="M9.525 13.474a3.5 3.5 0 0 0 4.95-4.95m-4.95 4.95a3.5 3.5 0 1 1 4.95-4.95m-4.95 4.95l4.95-4.95" />
                                </svg>
                                <div>
                                    <h4 className="text-foreground text-[16px] font-semibold mb-1">
                                        <StreamingText text="Chats sem anúncios" delay={3.2} />
                                    </h4>
                                    <p className="text-muted-foreground text-[14px] leading-relaxed">
                                        <StreamingText text="Não vou mostrar anúncios para você. Meu foco é ser genuinamente útil." delay={3.5} />
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 4.4 }}
                                className="flex gap-4 items-start"
                            >
                                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground shrink-0 mt-0.5">
                                    <path d="M19.396 10.867a1.227 1.227 0 0 1 1.69 0c.467.45.467.118 0 1.63l-1.126 1.085m-.564-2.715l1.127-1.086c.467-.45.467-1.18 0-1.63a1.227 1.227 0 0 0-1.69 0l-.845.815m1.408 1.9l-3.099 2.988m1.69-4.888a1.12 1.12 0 0 0 0-1.629a1.227 1.227 0 0 0-1.69 0l-4.768 4.596l.003-1.763c.001-.773-.696-1.374-1.482-1.287c-.61.066-1.098.522-1.186 1.108l-.563 4.452c-.107.851-.66 1.791-1.29 2.398m10.988-7.875l-2.818 2.716M12.353 22l.656-.632c.3-.29.707-.448 1.13-.475c.488-.031 1.134-.104 1.525-.272c.674-.29 1.287-.88 2.511-2.06l3.475-3.35a1.12 1.12 0 0 0 0-1.629a1.227 1.227 0 0 0-1.69 0m-2.536 2.444l2.535-2.444m-6.475-9.485a1.215 1.215 0 0 0 0-1.737a1.264 1.264 0 0 0-1.767 0L6.733 7.265l.004-1.884c.001-.825-.726-1.465-1.56-1.373a1.4 1.4 0 0 0-1.24 1.182L3.35 9.942c-.113.909-.691 1.91-1.349 2.558m11.484-8.403l.883-.869a1.264 1.264 0 0 1 1.767 0c.244.24.366.555.366.87m-3.016 0L11 6.54" />
                                </svg>
                                <div>
                                    <h4 className="text-foreground text-[16px] font-semibold mb-1">
                                        <StreamingText text="Você pode melhorar o Opendraft para todos" delay={4.4} />
                                    </h4>
                                    <p className="text-muted-foreground text-[14px] leading-relaxed">
                                        <StreamingText text="Usamos suas conversas e sessões de programação para treinar e melhorar o Opendraft. Você pode alterar essa configuração a qualquer momento em suas Configurações de Privacidade." delay={4.8} />
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 6.2 }}
                        >
                            <button
                                onClick={handleContinue}
                                className="px-8 py-3 rounded-full bg-primary text-primary-foreground text-[15px] font-semibold hover:bg-primary/90 transition-all shadow-lg"
                            >
                                <StreamingText text="Entendi" delay={6.2} />
                            </button>
                        </motion.div>
                    </motion.div>
                ) : step === "name" ? (
                    <motion.div
                        key="name"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex-1 flex flex-col w-full max-w-[650px] pt-32"
                    >
                        <div className="w-full mb-8">
                            <h2 className="text-foreground text-[32px] font-serif tracking-tight leading-tight">
                                <StreamingText text="Antes de começarmos, como devo chamá-lo?" />
                            </h2>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="w-full flex items-center gap-3 p-2 bg-card border border-border rounded-full shadow-sm"
                        >
                            <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground shrink-0">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                                placeholder="Seu nome"
                                className="flex-1 bg-transparent border-none outline-none text-foreground text-[15px] px-2 py-1 placeholder:text-muted-foreground"
                                autoFocus
                            />
                            <button
                                onClick={handleNameSubmit}
                                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
                            >
                                <motion.svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </motion.svg>
                            </button>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="topics"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex-1 flex flex-col w-full max-w-[650px] pt-32"
                    >
                        <div className="w-full mb-8">
                            <h2 className="text-foreground text-[32px] font-serif tracking-tight leading-tight mb-2">
                                <StreamingText text={`Legal, ${name}! Em qual destes perfis você mais se encaixa?`} />
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-2.5 mb-10">
                            {topicsList.map((topic, index) => (
                                <motion.button
                                    key={topic.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                                    onClick={() => toggleTopic(topic.label)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all text-left cursor-pointer group",
                                        selectedTopics.includes(topic.label)
                                            ? "bg-primary border-primary text-primary-foreground shadow-sm"
                                            : "bg-transparent border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <div className={cn(
                                        "flex items-center justify-center transition-colors shrink-0",
                                        selectedTopics.includes(topic.label) ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                                    )}>
                                        {topic.icon}
                                    </div>
                                    <span className="text-[14px] font-medium">{topic.label}</span>
                                </motion.button>
                            ))}
                        </div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            onClick={handleFinish}
                            className="w-fit px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-[14px] font-semibold hover:bg-primary/90 transition-all shadow-lg"
                        >
                            Vamos lá
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer Status - Only on terms step */}
            {step === "terms" && (
                <div className="flex flex-col items-center gap-1.5 mb-2 mt-auto">
                    <p className="text-[11px] text-muted-foreground">
                        Email verified as <span className="text-foreground">{userEmail}</span>
                    </p>
                    <button
                        onClick={handleSignOut}
                        className="text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                    >
                        Usar outro e-mail
                    </button>
                </div>
            )}
        </div>
    );
}
