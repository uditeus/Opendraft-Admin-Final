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
        <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
            <div className="w-full max-w-sm px-6">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <AppIcon name="Settings" className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg font-semibold tracking-tight">Opendraft</span>
                </div>

                {/* Card */}
                <div className="rounded-xl border border-sidebar-border/40 bg-sidebar-accent/10 p-6">
                    <h1 className="text-[16px] font-semibold text-foreground">Verificar identidade</h1>
                    <p className="text-[13px] text-muted-foreground mt-1">
                        Para acessar o painel admin, confirme sua senha.
                    </p>
                    {user && (
                        <p className="text-[13px] text-foreground/80 mt-1 font-medium">{user.email}</p>
                    )}

                    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
                        <div>
                            <label className="text-[12px] font-medium text-muted-foreground mb-1.5 block">Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLocked}
                                className={cn(
                                    "h-10 w-full rounded-lg border border-sidebar-border/40 bg-sidebar-accent/10 px-3",
                                    "text-sm text-foreground placeholder:text-muted-foreground/50 outline-none",
                                    "focus:border-sidebar-primary/40 transition-colors",
                                    "disabled:opacity-50",
                                )}
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <p className="text-[12px] text-red-400">{error}</p>
                        )}

                        {isLocked && lockoutEnd && (
                            <p className="text-[12px] text-amber-400">
                                Muitas tentativas. Tente novamente em {Math.ceil((lockoutEnd - Date.now()) / 60000)} min.
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={!password || loading || isLocked}
                            className={cn(
                                "chat-focus h-10 w-full rounded-lg text-sm font-medium transition-colors",
                                "bg-sidebar-primary text-sidebar-primary-foreground hover:opacity-90",
                                "disabled:opacity-40 disabled:pointer-events-none",
                            )}
                        >
                            {loading ? (
                                <div className="h-4 w-4 border-2 border-current/20 border-t-current rounded-full animate-spin mx-auto" />
                            ) : (
                                "Verificar identidade"
                            )}
                        </button>

                        <p className="text-[11px] text-muted-foreground text-center">
                            Sessão admin expira em 30 minutos por inatividade
                        </p>
                    </form>
                </div>

                {/* Back link */}
                <button
                    type="button"
                    onClick={() => window.location.href = "/"}
                    className="flex items-center gap-2 mx-auto mt-6 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                    <AppIcon name="ArrowLeft" className="h-3.5 w-3.5" />
                    Voltar ao app
                </button>
            </div>
        </div>
    );
}
