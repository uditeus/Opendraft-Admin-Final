import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/supabase/auth";
import { updateUserOnboarding } from "@/lib/supabase/api";
import { getSupabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, TicketPercent } from "lucide-react";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const referralCode = searchParams.get("referral_code");

    const handleContinue = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) return;

        if (!showPassword) {
            // Step 1: Just show password field
            // Simple validation
            if (!email.includes("@")) {
                toast.error("Digite um email válido.");
                return;
            }
            setShowPassword(true);
            return;
        }

        // Step 2: SignUp
        if (!password) return;

        setLoading(true);
        try {
            const { data, error } = await signUp(email, password);
            if (error) throw error;

            // Check for pending onboarding data from /getting-started
            const pendingParams = sessionStorage.getItem("pendingOnboarding");
            if (pendingParams && data?.user) {
                try {
                    const onboardingData = JSON.parse(pendingParams);
                    await updateUserOnboarding(data.user.id, onboardingData);
                    sessionStorage.removeItem("pendingOnboarding");
                    await getSupabase().auth.refreshSession();
                } catch (e) {
                    console.error("Failed to parse or save pending onboarding:", e);
                }
            }

            toast.success("Conta criada! Redirecionando...");
            navigate("/new");
        } catch (error: any) {
            if (error.message.includes("already registered") || error.message.includes("User already exists")) {
                toast.info("Este email já possui conta. Redirecionando para login...");
                navigate(`/login?email=${encodeURIComponent(email)}`);
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Criar sua conta</h1>
                {referralCode && (
                    <div className="mt-4 flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-transparent text-slate-900/80">
                            <TicketPercent className="h-5 w-5" strokeWidth={1.5} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none text-slate-900">
                                Crie sua conta e ganhe 10 créditos grátis!
                            </p>
                            <p className="text-xs text-slate-500">
                                Você está se cadastrando com um convite exclusivo do Opendraft
                            </p>
                        </div>
                    </div>
                )}
                {!referralCode && (
                    <p className="text-[15px] leading-6 text-muted-foreground">
                        Entre com seus dados para criar sua conta
                    </p>
                )}
            </div>

            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Button variant="outline" className="w-full gap-2" disabled={loading}>
                        <GoogleIcon className="h-4 w-4" />
                        Continuar com Google
                    </Button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Ou
                        </span>
                    </div>
                </div>

                <form onSubmit={handleContinue}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                placeholder="nome@exemplo.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={loading || showPassword}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {showPassword && (
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(false)}
                                    className="text-xs text-muted-foreground text-right hover:text-primary"
                                >
                                    Editar
                                </button>
                            )}
                        </div>

                        {showPassword && (
                            <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <Label htmlFor="password">Senha</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    disabled={loading}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        )}

                        <Button disabled={loading} className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
                            {loading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {showPassword ? "Criar sua conta" : "Continuar"}
                        </Button>
                    </div>
                </form>

                <p className="px-8 text-center text-[15px] leading-6 text-muted-foreground">
                    Ao continuar, você concorda com os{" "}
                    <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
                        Termos de Serviço
                    </Link>{" "}
                    e{" "}
                    <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
                        Política de Privacidade
                    </Link>
                    .
                </p>

                <div className="text-center text-sm">
                    Já tem uma conta?{" "}
                    <Link to="/login" className="text-[15px] leading-6 font-semibold text-primary hover:underline">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
