import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAdminSession } from "@/hooks/useAdminSession";
import { useRole } from "@/hooks/useRole";
import { AppIcon } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";

export default function AdminLogin() {
    const { user } = useAuth();
    const { verify, error, remainingAttempts, lockoutEnd } = useAdminSession();
    const { isAdmin } = useRole();
    const navigate = useNavigate();
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const ok = await verify(password);
        setLoading(false);
        if (ok) navigate("/admin");
    };

    const isLocked = lockoutEnd ? Date.now() < lockoutEnd : false;

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background text-foreground selection:bg-foreground selection:text-background">
            <div className="w-full max-w-sm px-8">
                {/* Logo */}
                <div className="flex flex-col items-center justify-center gap-6 mb-16">
                    <div className="h-12 w-12 rounded-full bg-foreground flex items-center justify-center">
                        <AppIcon name="Settings" className="h-6 w-6 text-background" />
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-serif tracking-tight">Opendraft</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">Admin Panel</span>
                    </div>
                </div>

                {/* Cardless Login Form */}
                <div className="flex flex-col">
                    <h1 className="text-2xl font-serif text-foreground mb-4">Verificar identidade</h1>
                    <p className="text-sm text-muted-foreground mb-12 leading-relaxed">
                        Para acessar o painel administrativo, confirme sua senha de acesso.
                    </p>

                    {user && (
                        <div className="mb-10 pb-6 border-b border-border/10">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">OPERADOR AUTENTICADO</span>
                            <p className="text-sm font-semibold text-foreground">{user.email}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                        <div className="relative group">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLocked}
                                autoFocus
                                className={cn(
                                    "h-14 w-full bg-transparent border-b border-border/20 px-0",
                                    "text-xl font-serif text-foreground placeholder:text-muted-foreground/20 outline-none",
                                    "focus:border-foreground transition-all duration-300",
                                    "disabled:opacity-50",
                                )}
                                placeholder="Sua senha"
                            />
                            <div className="absolute -bottom-[1px] left-0 w-0 h-[1px] bg-foreground transition-all duration-500 group-focus-within:w-full" />
                        </div>

                        {error && (
                            <p className="text-xs font-bold text-red-500 uppercase tracking-widest">{error}</p>
                        )}

                        {isLocked && lockoutEnd && (
                            <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                                Bloqueado temporário ({Math.ceil((lockoutEnd - Date.now()) / 60000)} min)
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={!password || loading || isLocked}
                            className={cn(
                                "h-14 w-full rounded-full text-sm font-bold transition-all duration-300 tracking-widest uppercase",
                                "bg-foreground text-background hover:opacity-90 active:scale-[0.98]",
                                "disabled:opacity-10 disabled:pointer-events-none",
                            )}
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-current/20 border-t-current rounded-full animate-spin mx-auto" />
                            ) : (
                                "VERIFICAR"
                            )}
                        </button>

                        <p className="text-[10px] text-center font-bold text-muted-foreground/40 uppercase tracking-widest leading-loose">
                            Sessão administrativa protegida.<br />
                            Expiração automática por inatividade.
                        </p>
                    </form>
                </div>

                {/* Back link */}
                <button
                    type="button"
                    onClick={() => window.location.href = "/"}
                    className="flex items-center justify-center gap-2 mx-auto mt-20 text-[11px] font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all"
                >
                    <AppIcon name="ArrowLeft" className="h-4 w-4" />
                    Voltar ao Opendraft
                </button>
            </div>
        </div>
    );
}
