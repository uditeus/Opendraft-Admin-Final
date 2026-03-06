import * as React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRole } from "@/hooks/useRole";
import { useAdminSession } from "@/hooks/useAdminSession";

export function AdminGuard() {
    const { user, loading: authLoading } = useAuth();
    const { isAdmin, loading: roleLoading } = useRole();
    const { adminVerified } = useAdminSession();

    if (authLoading || roleLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#0f1011]">
                <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    // Not logged in — redirect to admin login
    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    // Not admin role — redirect to admin login
    if (!isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    // TEMPORARY: skip session verification for development
    // Uncomment the block below to require re-authentication:
    // if (!adminVerified) {
    //     return <Navigate to="/admin/login" replace />;
    // }

    return <Outlet />;
}
