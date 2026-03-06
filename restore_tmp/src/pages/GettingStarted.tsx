import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/icons/AppIcon";
import { useAuth } from "@/components/auth/AuthProvider";
import { updateUserOnboarding } from "@/lib/supabase/api";
import { getSupabase } from "@/lib/supabase/client";
import {
    Sparkles, Palette, Briefcase, Mic, Code, Megaphone, GraduationCap, MoreHorizontal,
    Volume2, BookOpen, Music, Speaker, FileAudio, FileVolume, MessageSquare, FileText, Image, Radio, Check
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ShimmeringText } from "@/components/ui/shimmering-text";
import { motion, AnimatePresence } from "framer-motion";
import { sounds } from "@/lib/audio/sounds";

export default function GettingStarted() {
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [step, setStep] = useState(0); // 0: Theme, 1: Name, 2: Source, 3: Role, 4: Goals, 5: Pricing
    const [name, setName] = useState("");
    const [source, setSource] = useState("");
    const [role, setRole] = useState("");
    const [goals, setGoals] = useState<string[]>([]);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
    const [saving, setSaving] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

    // Finishing state
    const [isFinishing, setIsFinishing] = useState(false);
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

    const phrases = [
        "Configurando sua experiência...",
        "Personalizando o ambiente...",
        "Preparando tudo para você..."
    ];

    useEffect(() => {
        if (isFinishing) {
            const interval = setInterval(() => {
                setCurrentPhraseIndex((prev) => {
                    if (prev < phrases.length - 1) return prev + 1;
                    return prev;
                });
            }, 1800);

            const timeout = setTimeout(() => {
                if (user) {
                    getSupabase().auth.refreshSession().finally(() => {
                        navigate("/new");
                    });
                } else {
                    navigate("/signup");
                }
            }, phrases.length * 1800 + 500);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [isFinishing, navigate]);

    // Only used for visual selection state before confirming
    const [selectedThemeState, setSelectedThemeState] = useState<"light" | "dark" | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Play sound on step change
    useEffect(() => {
        if (mounted && step > 0) {
            sounds.playTransition();
        }
    }, [step, mounted]);

    // Initialize selected theme from current theme
    useEffect(() => {
        if (mounted && !selectedThemeState) {
            setSelectedThemeState(theme === "dark" ? "dark" : "light");
        }
    }, [mounted, theme]);

    const handleThemeSelect = async (t: "light" | "dark") => {
        setSelectedCardId(t);
        setSelectedThemeState(t);
        setTheme(t);


        // Wait for animation
        setTimeout(async () => {
            if (user) {
                await updateUserOnboarding(user.id, {
                    name: name || user.user_metadata?.full_name || "",
                    theme: t
                });
            }
            setStep(1);
            setSelectedCardId(null);
        }, 250);
    };

    const handleContinue = async () => {
        if (step === 0) {
            if (user && selectedThemeState) {
                // Save theme preference
                await updateUserOnboarding(user.id, {
                    name: name || user.user_metadata?.full_name || "",
                    theme: selectedThemeState
                });
            }
            setStep(1);
        } else if (step === 1) {
            if (user) {
                await updateUserOnboarding(user.id, { name });
            }
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        } else if (step === 3) {
            setStep(4);
        } else if (step === 4) {
            setStep(5);
        } else {
            // Finish
            navigate("/");
        }
    };

    const handleSourceSelect = async (val: string) => {
        setSelectedCardId(val);
        setSource(val);
        setTimeout(() => {
            setStep(3);
            setSelectedCardId(null);
        }, 400);
    };

    const handleRoleSelect = async (selectedRole: string) => {
        setSelectedCardId(selectedRole);
        setRole(selectedRole);
        setTimeout(() => {
            setStep(4);
            setSelectedCardId(null);
        }, 400);
    };

    const handleGoalToggle = (goalId: string) => {
        setGoals(prev =>
            prev.includes(goalId)
                ? prev.filter(g => g !== goalId)
                : [...prev, goalId]
        );
    };

    // Submit all data and finish
    const handleFinish = async () => {
        if (saving || isFinishing) return;
        setSaving(true);
        setIsFinishing(true);

        // Save in background
        if (user) {
            await updateUserOnboarding(user.id, { name, role, source, goals, theme: selectedThemeState || "light" });
        } else {
            // Save locally for signup to pick up
            sessionStorage.setItem("pendingOnboarding", JSON.stringify({ name, role, source, goals, theme: selectedThemeState || "light" }));
        }
    };

    if (!mounted) return null;

    if (isFinishing) {
        return (
            <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 font-sans text-foreground overflow-hidden">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center gap-6"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPhraseIndex}
                            initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                            transition={{ duration: 0.5 }}
                        >
                            <ShimmeringText className="text-lg font-medium tracking-tight text-center">
                                {phrases[currentPhraseIndex]}
                            </ShimmeringText>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-8 font-sans text-foreground overflow-x-hidden">
            <div className="flex w-full max-w-5xl flex-col items-center gap-12 text-center">
                <AnimatePresence mode="wait">
                    {/* Step 0: Theme Selection */}
                    {step === 0 && (
                        <motion.div
                            key="step0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center gap-8"
                        >
                            <div className="space-y-2">
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    Escolha seu tema
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Alterne entre os estilos a qualquer momento
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-8">
                                {/* Light Theme Option */}
                                <motion.button
                                    onClick={() => handleThemeSelect("light")}
                                    className="group flex flex-col items-center gap-3 outline-none"
                                    animate={selectedCardId === "light" ? { scale: 1.05 } : {}}
                                    disabled={!!selectedCardId}
                                >
                                    <div className={cn(
                                        "relative w-[220px] h-[140px] overflow-hidden rounded-xl border-2 transition-all duration-300 shadow-sm",
                                        "bg-[#F4F4F5]", // Zinc-100ish for preview bg
                                        selectedThemeState === "light"
                                            ? "border-foreground ring-4 ring-foreground/10 scale-[1.02]"
                                            : "border-transparent ring-1 ring-border group-hover:ring-foreground/30 group-hover:scale-[1.02]"
                                    )}>
                                        {/* Mock UI - Light */}
                                        <div className="absolute inset-x-4 top-4 bottom-0 bg-white rounded-t-lg shadow-sm border border-zinc-200/50 p-3 space-y-2">
                                            <div className="flex gap-1.5 mb-1">
                                                <div className="h-2 w-2 rounded-full bg-red-400/80" />
                                                <div className="h-2 w-2 rounded-full bg-amber-400/80" />
                                                <div className="h-2 w-2 rounded-full bg-green-400/80" />
                                            </div>
                                            <div className="flex gap-2 h-full">
                                                <div className="w-1/4 h-full bg-zinc-100 rounded-sm" />
                                                <div className="flex-1 h-full space-y-1.5">
                                                    <div className="h-2 w-3/4 bg-zinc-100 rounded-full" />
                                                    <div className="h-16 w-full bg-zinc-50 rounded-sm border border-zinc-100" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "text-sm font-medium transition-colors",
                                        selectedThemeState === "light" ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                                    )}>
                                        Modo Claro
                                    </span>
                                </motion.button>

                                {/* Dark Theme Option */}
                                <motion.button
                                    onClick={() => handleThemeSelect("dark")}
                                    className="group flex flex-col items-center gap-3 outline-none"
                                    animate={selectedCardId === "dark" ? { scale: 1.05 } : {}}
                                    disabled={!!selectedCardId}
                                >
                                    <div className={cn(
                                        "relative w-[220px] h-[140px] overflow-hidden rounded-xl border-2 transition-all duration-300 shadow-sm",
                                        "bg-[#18181B]", // Zinc-950 for preview bg
                                        selectedThemeState === "dark"
                                            ? "border-foreground ring-4 ring-foreground/10 scale-[1.02]"
                                            : "border-transparent ring-1 ring-border group-hover:ring-foreground/30 group-hover:scale-[1.02]"
                                    )}>
                                        {/* Mock UI - Dark */}
                                        <div className="absolute inset-x-4 top-4 bottom-0 bg-[#09090b] rounded-t-lg shadow-xl border border-zinc-800/50 p-3 space-y-2">
                                            <div className="flex gap-1.5 mb-1">
                                                <div className="h-2 w-2 rounded-full bg-zinc-700" />
                                                <div className="h-2 w-2 rounded-full bg-zinc-700" />
                                                <div className="h-2 w-2 rounded-full bg-zinc-700" />
                                            </div>
                                            <div className="flex gap-2 h-full">
                                                <div className="w-1/4 h-full bg-zinc-800/50 rounded-sm" />
                                                <div className="flex-1 h-full space-y-1.5">
                                                    <div className="h-2 w-3/4 bg-zinc-800 rounded-full" />
                                                    <div className="h-16 w-full bg-zinc-900/50 rounded-sm border border-zinc-800" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "text-sm font-medium transition-colors",
                                        selectedThemeState === "dark" ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                                    )}>
                                        Modo Escuro
                                    </span>
                                </motion.button>
                            </div>

                            <Button
                                onClick={() => setStep(1)}
                                className="h-9 px-8 rounded-md text-xs font-medium shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Continuar
                            </Button>

                        </motion.div>
                    )}

                    {/* Step 1: Name Input */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-start gap-8 w-full max-w-[420px] text-left"
                        >
                            <div className="space-y-1.5 w-full">
                                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                    Personalize sua experiência
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Isso ajuda a adaptar o Opendraft para você.
                                </p>
                            </div>

                            <div className="w-full space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium">
                                        Como devemos te chamar?
                                    </Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Seu nome completo"
                                        className="h-9 rounded-md border-input bg-background px-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        autoFocus
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Checkbox id="terms" className="mt-0.5" />
                                        <Label
                                            htmlFor="terms"
                                            className="text-xs text-muted-foreground font-normal leading-snug cursor-pointer select-none"
                                        >
                                            Ao marcar esta caixa, você confirma ter atingido a idade de 18 anos (ou a maioridade legal onde você vive).
                                        </Label>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Checkbox id="marketing" className="mt-0.5" />
                                        <Label
                                            htmlFor="marketing"
                                            className="text-xs text-muted-foreground font-normal leading-snug cursor-pointer select-none"
                                        >
                                            Quero receber atualizações, ofertas especiais e e-mails promocionais e entendo que posso cancelar a assinatura a qualquer momento.
                                        </Label>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleContinue}
                                    className="h-9 px-6 rounded-md text-xs font-medium shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    disabled={!name.trim()}
                                >
                                    Continuar
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Source Selection */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-start gap-8 w-full max-w-[800px] text-left"
                        >
                            <div className="space-y-1.5 w-full">
                                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                    Como você soube da Opendraft?
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Selecione a opção que melhor te descreve.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                                {[
                                    { id: "friends", label: "Amigos ou Escola", icon: "UserIcon" },
                                    { id: "newsletter", label: "Newsletter ou Blog", icon: "Pencil01Icon" },
                                    { id: "podcast", label: "Podcast", icon: "Mic" },
                                    { id: "ai", label: "ChatGPT, Claude, etc.", icon: "BrainIcon" },
                                    { id: "work", label: "Do trabalho", icon: "Building02Icon" },
                                    { id: "news", label: "Nas notícias", icon: "FileText" },
                                    { id: "x", label: "X (Twitter)", icon: "X" },
                                    { id: "linkedin", label: "LinkedIn", icon: "Share04Icon" },
                                    { id: "instagram", label: "Instagram", icon: "Camera01Icon" },
                                    { id: "youtube", label: "YouTube", icon: "Play" },
                                    { id: "google", label: "Google", icon: "Search" },
                                    { id: "tiktok", label: "TikTok", icon: "Stop" },
                                    { id: "facebook", label: "Facebook", icon: "MessageCircle" },
                                    { id: "forgot", label: "Não me lembro", icon: "HelpCircle" },
                                    { id: "other", label: "Outro", icon: "MoreHorizontal" }
                                ].map((r) => (
                                    <motion.button
                                        key={r.id}
                                        onClick={() => handleSourceSelect(r.id)}
                                        className={cn(
                                            "flex flex-row items-center gap-4 p-4 h-[72px] rounded-xl border text-left transition-all duration-200 outline-none hover:bg-muted/50",
                                            source === r.id
                                                ? "border-foreground bg-secondary/30 ring-1 ring-foreground/20"
                                                : "border-border bg-background hover:border-foreground/30"
                                        )}
                                        animate={selectedCardId ? (selectedCardId === r.id ? { scale: 1.1, opacity: 1 } : { opacity: 0, scale: 0.5, filter: "blur(4px)" }) : {}}
                                        transition={{ duration: 0.3 }}
                                        disabled={!!selectedCardId}
                                    >
                                        <AppIcon name={r.icon as any} className="w-5 h-5 text-muted-foreground shrink-0" />
                                        <span className={cn(
                                            "text-xs font-medium leading-tight",
                                            source === r.id ? "text-foreground" : "text-muted-foreground"
                                        )}>{r.label}</span>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="flex items-center gap-6 w-full pt-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium px-2"
                                >
                                    Voltar
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium px-2"
                                >
                                    Pular
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Role Selection */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-start gap-8 w-full max-w-[800px] text-left"
                        >
                            <div className="space-y-1.5 w-full">
                                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                    Qual delas melhor descreve você?
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Selecione a opção que melhor te descreve.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                                {[
                                    { id: "personal", label: "Uso pessoal", icon: Sparkles },
                                    { id: "creator", label: "Criador", icon: Palette },
                                    { id: "content_business", label: "Negócio de conteúdo", icon: Briefcase },
                                    { id: "voice_actor", label: "Dublador", icon: Mic },
                                    { id: "engineer", label: "Engenheiro", icon: Code },
                                    { id: "marketing", label: "Profissional de marketing", icon: Megaphone },
                                    { id: "education", label: "Educação", icon: GraduationCap },
                                    { id: "other", label: "Outro", icon: MoreHorizontal }
                                ].map((r) => (
                                    <motion.button
                                        key={r.id}
                                        onClick={() => handleRoleSelect(r.id)}
                                        className={cn(
                                            "flex flex-row items-center gap-4 p-4 h-[72px] rounded-xl border text-left transition-all duration-200 outline-none hover:bg-muted/50",
                                            role === r.id
                                                ? "border-foreground bg-secondary/30 ring-1 ring-foreground/20"
                                                : "border-border bg-background hover:border-foreground/30"
                                        )}
                                        animate={selectedCardId ? (selectedCardId === r.id ? { scale: 1.1, opacity: 1 } : { opacity: 0, scale: 0.5, filter: "blur(4px)" }) : {}}
                                        transition={{ duration: 0.3 }}
                                        disabled={!!selectedCardId}
                                    >
                                        <r.icon className="w-5 h-5 text-muted-foreground shrink-0" />
                                        <span className={cn(
                                            "text-xs font-medium leading-tight",
                                            role === r.id ? "text-foreground" : "text-muted-foreground"
                                        )}>{r.label}</span>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="flex items-center gap-6 w-full pt-4">
                                <button
                                    onClick={() => setStep(2)}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium px-2"
                                >
                                    Voltar
                                </button>
                                <button
                                    onClick={() => setStep(4)}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium px-2"
                                >
                                    Pular
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Goals Selection */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-start gap-8 w-full max-w-[900px] text-left"
                        >
                            <div className="space-y-1.5 w-full">
                                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                    O que você gostaria de fazer com a Opendraft?
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Selecione todas as opções que se aplicam.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full">
                                {[
                                    { id: "tts", label: "Text to Speech", icon: Volume2 },
                                    { id: "audiobooks", label: "Audiolivros", icon: BookOpen },
                                    { id: "music", label: "Música", icon: Music },
                                    { id: "sfx", label: "Efeitos sonoros", icon: Speaker },
                                    { id: "dubbing", label: "Dublagem", icon: FileAudio },
                                    { id: "voiceover", label: "Locuções", icon: FileVolume },
                                    { id: "voice_cloning", label: "Voice Cloning", icon: MessageSquare },
                                    { id: "stt", label: "Fala para texto", icon: FileText },
                                    { id: "image_video", label: "Imagem & Video", icon: Image },
                                    { id: "podcasts", label: "Podcasts", icon: Radio }
                                ].map((r) => {
                                    const isSelected = goals.includes(r.id);
                                    return (
                                        <button
                                            key={r.id}
                                            onClick={() => handleGoalToggle(r.id)}
                                            className={cn(
                                                "flex flex-row items-center gap-4 p-4 h-[72px] rounded-xl border text-left transition-all duration-200 outline-none hover:bg-muted/50",
                                                isSelected
                                                    ? "border-foreground bg-secondary/30 ring-1 ring-foreground/20"
                                                    : "border-border bg-background hover:border-foreground/30"
                                            )}
                                        >
                                            <r.icon className="w-5 h-5 text-muted-foreground shrink-0" />
                                            <span className={cn(
                                                "text-xs font-medium leading-tight",
                                                isSelected ? "text-foreground" : "text-muted-foreground"
                                            )}>{r.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex items-center justify-between w-full pt-4">
                                <button
                                    onClick={() => setStep(3)}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium px-2"
                                >
                                    Voltar
                                </button>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setStep(5)}
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium px-2"
                                    >
                                        Pular
                                    </button>
                                    <Button
                                        onClick={handleContinue}
                                        className="h-9 px-6 rounded-md text-xs font-medium shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        disabled={goals.length === 0}
                                    >
                                        Continuar
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}


                    {/* Step 5: Pricing */}
                    {step === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center gap-8 w-full text-left"
                        >

                            <div className="flex w-full max-w-5xl items-end justify-between">
                                <div className="space-y-2 text-left">
                                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                        Faça mais com a Opendraft
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        Selecione um plano com base nas suas necessidades
                                    </p>
                                </div>

                                {/* Billing Switch */}
                                <div className="flex items-center gap-3">
                                    <div className="inline-flex h-9 items-center rounded-full bg-muted p-1">
                                        <button
                                            onClick={() => setBillingCycle("monthly")}
                                            className={cn(
                                                "flex items-center justify-center rounded-full px-4 text-xs font-medium transition-all duration-200 h-full",
                                                billingCycle === "monthly"
                                                    ? "bg-background text-foreground shadow-sm"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            Mensal
                                        </button>
                                        <button
                                            onClick={() => setBillingCycle("yearly")}
                                            className={cn(
                                                "flex items-center justify-center rounded-full px-4 text-xs font-medium transition-all duration-200 h-full",
                                                billingCycle === "yearly"
                                                    ? "bg-background text-foreground shadow-sm"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            Anual
                                        </button>
                                    </div>
                                    <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:text-green-400">
                                        2 meses grátis
                                    </span>
                                </div>
                            </div>

                            {/* Plans Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl items-stretch">
                                {/* Criador Plan */}
                                <div className="flex flex-col p-6 rounded-2xl border bg-background hover:border-foreground/20 transition-all duration-200">
                                    <div className="space-y-4 mb-6">
                                        <h3 className="text-lg font-semibold">Criador</h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm font-medium text-muted-foreground">R$</span>
                                            <span className="text-4xl font-bold tracking-tight">
                                                {billingCycle === "yearly" ? "69" : "89"}
                                            </span>
                                            <span className="text-sm text-muted-foreground">/mês</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed h-10">
                                            Produza copy com consistência
                                        </p>
                                    </div>
                                    <div className="space-y-3 mb-8 flex-1 text-left">
                                        {[
                                            "100 créditos por mês",
                                            "50 copies completas",
                                            "Playbooks e Estilos padrão",
                                            "20 chats ativos",
                                            "Histórico completo",
                                            "Exportação de docs (PDF/Docx)"
                                        ].map((feat, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-background shrink-0">
                                                    <Check className="w-3 h-3" strokeWidth={3} />
                                                </div>
                                                <span className="text-xs font-medium">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full rounded-full h-10 font-medium"
                                        onClick={handleFinish}
                                    >
                                        Selecionar plano
                                    </Button>
                                </div>

                                {/* Estrategista Plan */}
                                <div className="flex flex-col p-6 rounded-2xl border bg-background hover:border-foreground/20 transition-all duration-200">
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold">Estrategista</h3>
                                            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-semibold">
                                                Economize {billingCycle === "yearly" ? "33%" : "0%"}
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm font-medium text-muted-foreground">R$</span>
                                            <span className="text-4xl font-bold tracking-tight">
                                                {billingCycle === "yearly" ? "99" : "149"}
                                            </span>
                                            <span className="text-sm text-muted-foreground">/mês</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed h-10">
                                            Modo estratégico completo
                                        </p>
                                    </div>
                                    <div className="space-y-3 mb-8 flex-1 text-left">
                                        {[
                                            "200 créditos por mês",
                                            "100 copies completas",
                                            "Playbooks personalizados",
                                            "Estilos personalizados",
                                            "Chats ilimitados",
                                            "Variações automáticas (3)",
                                            "Prioridade na fila"
                                        ].map((feat, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-background shrink-0">
                                                    <Check className="w-3 h-3" strokeWidth={3} />
                                                </div>
                                                <span className="text-xs font-medium">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full rounded-full h-10 font-medium"
                                        onClick={handleFinish}
                                    >
                                        Selecionar plano
                                    </Button>
                                </div>

                                {/* Autoridade Plan */}
                                <div className="flex flex-col p-6 rounded-2xl border bg-background hover:border-foreground/20 transition-all duration-200">
                                    <div className="space-y-4 mb-6">
                                        <h3 className="text-lg font-semibold">Autoridade</h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm font-medium text-muted-foreground">R$</span>
                                            <span className="text-4xl font-bold tracking-tight">
                                                {billingCycle === "yearly" ? "199" : "299"}
                                            </span>
                                            <span className="text-sm text-muted-foreground">/mês</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed h-10">
                                            Domine sua produção em escala
                                        </p>
                                    </div>
                                    <div className="space-y-3 mb-8 flex-1 text-left">
                                        {[
                                            "400 créditos por mês",
                                            "200 copies completas",
                                            "Playbooks e Estilos ilimitados",
                                            "Chats ilimitados",
                                            "Variações ilimitadas",
                                            "Prioridade máxima",
                                            "Suporte prioritário"
                                        ].map((feat, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-background shrink-0">
                                                    <Check className="w-3 h-3" strokeWidth={3} />
                                                </div>
                                                <span className="text-xs font-medium">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full rounded-full h-10 font-medium"
                                        onClick={handleFinish}
                                    >
                                        Selecionar plano
                                    </Button>
                                </div>
                            </div>

                            {/* Footer Text */}
                            <div className="text-center pb-8">
                                <button
                                    onClick={handleFinish}
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Pular
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pagination Dots */}
                <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-2 pointer-events-none">
                    <div className="flex gap-2 pointer-events-auto">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <button
                                key={i}
                                onClick={() => i < step && setStep(i)}
                                disabled={i >= step}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300",
                                    step === i ? "w-8 bg-foreground" : "w-2 bg-border",
                                    i < step && "cursor-pointer hover:bg-foreground/50"
                                )}
                                aria-label={`Go to step ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
