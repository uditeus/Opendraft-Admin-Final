import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n/i18n";
import { getSupabase } from "@/lib/supabase/client";
import { signUp, signInWithGoogle } from "@/lib/supabase/auth";
import { toast } from "sonner";
import { Loader2, ChevronRight, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { ChatTooltip } from "@/components/design-system/chat-tooltip";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: React.ReactNode;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen bg-background font-['Inter']">
            {/* Left: Content */}
            <div className="flex-[0.4] flex flex-col justify-center px-8 lg:px-12">
                <div className="max-w-[400px] w-full mx-auto flex flex-col gap-10">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-3 cursor-pointer w-fit"
                        onClick={() => navigate("/")}
                    >
                        <img
                            src="https://i.imgur.com/wlz2FUz.png"
                            alt="Opendraft Logo"
                            className="h-[24px] w-auto brightness-0 dark:invert"
                        />
                        <span className="text-[22px] font-semibold tracking-tighter text-black dark:text-white leading-none">
                            Opendraft
                        </span>
                    </div>

                    {/* Header */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-[32px] font-semibold tracking-tight leading-tight text-foreground">
                            {title}
                        </h1>
                        <p className="text-[16px] text-muted-foreground leading-relaxed">
                            {subtitle}
                        </p>
                    </div>

                    {/* Form Area */}
                    <div className="flex flex-col gap-6">
                        {children}
                    </div>
                </div>
            </div>

            {/* Right: Image */}
            <div className="hidden lg:block relative flex-[0.6] bg-[#0a0a0a] overflow-hidden">
                <img
                    src="https://i.imgur.com/HxpWPDC.png"
                    alt="Illustration"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

const GoogleIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { tt } = useI18n();

    React.useEffect(() => {
        document.title = "Create account";
    }, []);

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

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStep(2);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setLoading(true);
        try {
            const { error } = await signUp(email.trim().toLowerCase(), password);
            if (error) throw error;
            toast.success("Conta criada! Redirecionando...");
            navigate("/onboarding");
        } catch (err: any) {
            toast.error(err.message || "Erro ao criar conta. Verifique os dados.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title={step === 1 ? "Crie sua conta" : "Defina sua senha"}
            subtitle={step === 1 ? (
                "Junte-se ao Opendraft e comece a escrever com o poder da IA."
            ) : (
                <span className="flex items-center gap-1.5 flex-wrap">
                    Continuando como <span className="text-foreground font-medium">{email}</span>
                    <button
                        onClick={() => setStep(1)}
                        className="text-[13px] text-foreground/60 hover:text-foreground underline underline-offset-4 transition-colors ml-1"
                    >
                        Alterar
                    </button>
                </span>
            )}
        >
            <div className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex flex-col gap-4"
                        >
                            <Button
                                variant="outline"
                                className="h-12 border-border bg-transparent font-medium rounded-[22px] hover:bg-muted/10 transition-colors"
                                onClick={handleGoogle}
                                disabled={loading}
                            >
                                <GoogleIcon className="w-5 h-5 mr-3" />
                                Cadastrar com Google
                            </Button>

                            <div className="relative flex items-center justify-center py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border/60"></div>
                                </div>
                                <span className="relative bg-background px-3 text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                                    ou
                                </span>
                            </div>

                            <form onSubmit={handleNextStep} className="flex flex-col gap-3">
                                <Input
                                    type="email"
                                    placeholder="E-mail profissional"
                                    className="h-12 px-4 bg-transparent border-border rounded-[22px] focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Button
                                    type="submit"
                                    className="h-12 bg-foreground text-background hover:opacity-90 font-medium rounded-[22px]"
                                >
                                    Continuar
                                </Button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex flex-col gap-4"
                        >

                            <form onSubmit={handleSignup} className="flex flex-col gap-3">
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Crie uma senha"
                                        className="h-12 pl-4 pr-12 bg-transparent border-border rounded-[22px] focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <AnimatePresence>
                                        {password.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="absolute right-4 inset-y-0 flex items-center justify-center"
                                            >
                                                <ChatTooltip
                                                    label={showPassword ? "Ocultar senha" : "Ver senha"}
                                                    delayDuration={0}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                                                    >
                                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </ChatTooltip>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <Button
                                    type="submit"
                                    className="h-12 bg-foreground text-background hover:opacity-90 font-medium rounded-[22px]"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    Começar agora
                                </Button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="mt-4 text-[13px] text-muted-foreground text-center">
                    Já tem uma conta?{" "}
                    <Link to="/login" className="text-foreground font-semibold hover:underline transition-all">
                        Faça login
                    </Link>
                </p>

            </div>
        </AuthLayout>
    );
}
