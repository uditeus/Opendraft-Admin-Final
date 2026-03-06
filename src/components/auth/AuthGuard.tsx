import * as React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { AppIcon } from "@/components/icons/AppIcon";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="flex h-screen w-full items-center justify-center bg-background" />;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Se o usuário está logado mas ainda não terminou o onboarding (ou é uma conta antiga sem a flag)
    if (!user.user_metadata?.onboarding_completed && location.pathname !== "/getting-started") {
        return <Navigate to="/getting-started" replace />;
    }

    return <>{children}</>;
}
