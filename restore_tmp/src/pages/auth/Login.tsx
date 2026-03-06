import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/supabase/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ForgotPasswordDialog } from "@/components/auth/ForgotPasswordDialog";

export default function Login() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState(searchParams.get("email") || "");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setLoading(true);
        try {
            const { error } = await signIn(email, password);
            if (error) throw error;
            toast.success("Login realizado com sucesso!");
            navigate("/new");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Bem-vindo de volta</h1>
                <p className="text-[15px] leading-6 text-muted-foreground">
                    Entre com seu email para acessar sua conta
                </p>
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

                <form onSubmit={handleLogin}>
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
                                disabled={loading}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Senha</Label>
                                <ForgotPasswordDialog defaultEmail={email}>
                                    <button type="button" className="text-xs text-muted-foreground hover:underline">
                                        Esqueceu a senha?
                                    </button>
                                </ForgotPasswordDialog>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                disabled={loading}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button disabled={loading} className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
                            {loading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Entrar
                        </Button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    Não tem uma conta?{" "}
                    <Link to="/signup" className="text-[15px] leading-6 font-semibold text-primary hover:underline">
                        Criar conta
                    </Link>
                </div>
            </div>
        </div>
    );
}
