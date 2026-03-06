import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signIn, signUp } from "@/lib/supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import logoMark from "@/assets/opendraft-mark-transparent.png";

export default function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);

    // Form states
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [fullName, setFullName] = React.useState("");

    const from = (location.state as any)?.from?.pathname || "/";

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const { error } = await signIn(email, password);
        setIsLoading(false);

        if (error) {
            toast({
                title: "Erro ao entrar",
                description: error.message,
                variant: "destructive",
            });
        } else {
            navigate(from, { replace: true });
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const { error } = await signUp(email, password, fullName);
        setIsLoading(false);

        if (error) {
            toast({
                title: "Erro ao criar conta",
                description: error.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Conta criada!",
                description: "Verifique seu e-mail para confirmar (se necessário) ou faça login.",
            });
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="mb-2 flex justify-center">
                        <div
                            className="h-10 w-10 bg-primary"
                            style={{
                                maskImage: `url(${logoMark})`,
                                maskSize: "contain",
                                maskRepeat: "no-repeat",
                                maskPosition: "center",
                                WebkitMaskImage: `url(${logoMark})`,
                                WebkitMaskSize: "contain",
                                WebkitMaskRepeat: "no-repeat",
                                WebkitMaskPosition: "center",
                            }}
                        />
                    </div>
                    <CardTitle className="text-2xl">OpenDraft</CardTitle>
                    <CardDescription>
                        Entre para acessar seus projetos e skills.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="signin" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="signin">Entrar</TabsTrigger>
                            <TabsTrigger value="signup">Criar conta</TabsTrigger>
                        </TabsList>

                        <TabsContent value="signin">
                            <form onSubmit={handleSignIn} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-mail</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Senha</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Entrando..." : "Entrar"}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="signup">
                            <form onSubmit={handleSignUp} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullname">Nome completo</Label>
                                    <Input
                                        id="fullname"
                                        placeholder="Seu nome"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">E-mail</Label>
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">Senha</Label>
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Criar conta..." : "Criar conta"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
