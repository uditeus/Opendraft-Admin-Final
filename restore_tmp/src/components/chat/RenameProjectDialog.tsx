import * as React from "react";
import { AppIcon } from "@/components/icons/AppIcon";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/components/chat/store"; // Adjust path if needed
import { toast } from "sonner";

interface RenameProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    currentTitle?: string;
}

export function RenameProjectDialog({
    open,
    onOpenChange,
    projectId,
    currentTitle = "",
}: RenameProjectDialogProps) {
    const [title, setTitle] = React.useState(currentTitle);
    const { patchThread } = useChatStore();
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            setTitle(currentTitle);
        }
    }, [open, currentTitle]);

    const handleSave = async () => {
        if (!title.trim()) return;

        try {
            setLoading(true);
            await patchThread(projectId, { title: title.trim() });
            toast.success("Conversa renomeada com sucesso.");
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to rename:", error);
            toast.error("Erro ao renomear conversa.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-6 gap-0">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-medium">Renomear conversa</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    <Input
                        id="name"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Nome da conversa"
                        className="h-12 rounded-xl bg-transparent border border-border/60 focus-visible:ring-1 focus-visible:ring-ring/20 focus-visible:ring-offset-0 text-[15px] placeholder:text-muted-foreground/40"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave();
                        }}
                        autoFocus
                    />

                    <DialogFooter className="mt-4">
                        <Button
                            onClick={handleSave}
                            disabled={loading || !title.trim()}
                            className="rounded-full px-6 h-10 bg-primary text-primary-foreground font-medium transition-all hover:opacity-90 shadow-sm"
                        >
                            {loading ? "Salvando..." : "Renomear"}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
