import * as React from "react";
import { cn } from "@/lib/utils";

interface ImpersonateBannerProps {
    userName: string;
    onExit: () => void;
}

export function ImpersonateBanner({ userName, onExit }: ImpersonateBannerProps) {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-3 bg-amber-500 px-4 py-2 text-sm font-medium text-black">
            <span>Você está vendo a conta de: <strong>{userName}</strong></span>
            <button
                onClick={onExit}
                className="rounded-md bg-black/20 px-3 py-1 text-xs font-semibold hover:bg-black/30 transition-colors"
            >
                Sair da sessão
            </button>
        </div>
    );
}
