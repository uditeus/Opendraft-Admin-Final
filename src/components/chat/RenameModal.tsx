import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n/i18n";

interface RenameModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    onRename: (newName: string) => void;
}

export function RenameModal({ open, onOpenChange, title, onRename }: RenameModalProps) {
    const [value, setValue] = React.useState(title);
    const { tt } = useI18n();

    React.useEffect(() => {
        if (open) setValue(title);
    }, [open, title]);

    const handleSave = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (value.trim()) {
            onRename(value);
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[420px] gap-0 p-5 [&>button]:hidden rounded-[24px] border-none shadow-elev-3 bg-white dark:bg-zinc-900"
            >
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-[16px] font-semibold tracking-tight text-foreground/90">
                        {tt("Mudar nome do chat", "Rename chat")}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSave} className="space-y-5">
                    <Input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="h-11 rounded-xl border-border/40 bg-background/50 px-4 text-sm focus-visible:ring-1 focus-visible:ring-primary/20"
                        autoFocus
                    />

                    <DialogFooter className="flex gap-2 sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="h-9 rounded-xl px-4 text-xs font-medium border-border/40 hover:bg-muted/50"
                        >
                            {tt("Cancelar", "Cancel")}
                        </Button>
                        <Button
                            type="submit"
                            className="h-9 rounded-xl px-5 text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition-all"
                        >
                            {tt("Salvar", "Save")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
