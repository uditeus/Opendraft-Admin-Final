import * as React from "react";
import { useRole, type Role } from "@/hooks/useRole";

interface RoleGuardProps {
    requires: Role;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function RoleGuard({ requires, children, fallback = null }: RoleGuardProps) {
    const { hasRole, loading } = useRole();

    // While loading, render nothing (not the fallback — which might be a Navigate that triggers a redirect)
    if (loading) return null;

    if (!hasRole(requires)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
