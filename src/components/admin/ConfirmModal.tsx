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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-sidebar-border/40 bg-background p-6 shadow-xl">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-[16px] font-semibold text-foreground">{title}</h3>
                        {description && (
                            <p className="text-[13px] text-muted-foreground mt-1">{description}</p>
                        )}
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <AppIcon name="X" className="h-[18px] w-[18px]" />
                    </button>
                </div>

                {/* Custom content */}
                {children && <div className="mb-4">{children}</div>}

                {/* Typed confirmation */}
                {needsConfirmation && (
                    <div className="mb-4">
                        <p className="text-[12px] text-muted-foreground mb-2">
                            Digite <span className="font-mono font-semibold text-foreground">{confirmText}</span> para confirmar
                        </p>
                        <input
                            value={typed}
                            onChange={(e) => setTyped(e.target.value)}
                            className={cn(
                                "h-10 w-full rounded-lg border border-sidebar-border/40 bg-sidebar-accent/10 px-3",
                                "text-sm text-foreground placeholder:text-muted-foreground/50 outline-none",
                                "focus:border-sidebar-primary/40 transition-colors",
                            )}
                            placeholder={confirmText}
                        />
                    </div>
                )}

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className={cn(
                            "chat-focus h-9 px-4 rounded-lg text-sm font-medium transition-colors",
                            "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/20",
                        )}
                    >
                        Cancelar
                    </button>
                    <button
                        disabled={!confirmed || loading}
                        onClick={onConfirm}
                        className={cn(
                            "chat-focus h-9 px-4 rounded-lg text-sm font-medium transition-colors",
                            "disabled:opacity-40 disabled:pointer-events-none",
                            destructive
                                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                                : "bg-sidebar-primary text-sidebar-primary-foreground hover:opacity-90",
                        )}
                    >
                        {loading ? (
                            <div className="h-4 w-4 border-2 border-current/20 border-t-current rounded-full animate-spin" />
                        ) : (
                            confirmButtonLabel
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
