import * as React from "react";
import { cn } from "@/lib/utils";
import { AppIcon } from "@/components/icons/AppIcon";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description?: string;
    confirmText?: string;
    confirmButtonLabel?: string;
    destructive?: boolean;
    loading?: boolean;
    children?: React.ReactNode;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText,
    confirmButtonLabel = "Confirmar",
    destructive = false,
    loading = false,
    children,
}: ConfirmModalProps) {
    const [typed, setTyped] = React.useState("");

    React.useEffect(() => {
        if (!isOpen) setTyped("");
    }, [isOpen]);

    if (!isOpen) return null;

    const needsConfirmation = !!confirmText;
    const confirmed = !needsConfirmation || typed === confirmText;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity" onClick={onClose} />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md rounded-[32px] border border-border/10 bg-background p-10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col mb-8 text-center items-center">
                    <h3 className="text-2xl font-serif font-normal text-foreground mb-4">{title}</h3>
                    {description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                    )}
                </div>

                {/* Custom content */}
                {children && <div className="mb-8">{children}</div>}

                {/* Typed confirmation */}
                {needsConfirmation && (
                    <div className="mb-10">
                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-3 text-center">
                            Write <span className="text-foreground/60">{confirmText}</span> to confirm
                        </p>
                        <input
                            value={typed}
                            onChange={(e) => setTyped(e.target.value)}
                            autoFocus
                            className={cn(
                                "h-14 w-full border-b border-border/20 bg-transparent px-0 text-center",
                                "text-xl font-serif text-foreground placeholder:text-muted-foreground/20 outline-none",
                                "focus:border-foreground transition-all duration-300",
                            )}
                            placeholder={confirmText}
                        />
                    </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col gap-4">
                    <button
                        disabled={!confirmed || loading}
                        onClick={onConfirm}
                        className={cn(
                            "h-14 w-full rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300",
                            "disabled:opacity-10 disabled:pointer-events-none",
                            destructive
                                ? "bg-red-500 text-white hover:opacity-90"
                                : "bg-foreground text-background hover:opacity-90",
                        )}
                    >
                        {loading ? (
                            <div className="h-5 w-5 border-2 border-current/20 border-t-current rounded-full animate-spin mx-auto" />
                        ) : (
                            confirmButtonLabel.toUpperCase()
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        className="h-14 w-full rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all"
                    >
                        CANCEL
                    </button>
                </div>
            </div>
        </div>
    );
}
