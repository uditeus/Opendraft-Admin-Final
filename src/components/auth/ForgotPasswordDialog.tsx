import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordForEmail } from "@/lib/supabase/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ForgotPasswordDialogProps {
    children: React.ReactNode;
    defaultEmail?: string;
}

export function ForgotPasswordDialog({ children, defaultEmail = "" }: ForgotPasswordDialogProps) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState(defaultEmail);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            const { error } = await resetPasswordForEmail(email);
            if (error) throw error;
            toast.success("Link de recuperação enviado para seu email!");
            setOpen(false);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Esqueceu a senha?</DialogTitle>
                    <DialogDescription>
                        Digite seu email para receber um link de recuperação.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="reset-email">Seu email</Label>
                        <Input
                            id="reset-email"
                            placeholder="nome@exemplo.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enviar link
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
