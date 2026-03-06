import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

export type Role = "user" | "admin" | "dev" | "owner";

const ROLE_HIERARCHY: Record<Role, number> = {
    user: 0,
    admin: 1,
    dev: 2,
    owner: 3,
};

// TEMPORARY: hardcoded owner emails until migration is run
// After running 20260305_admin_roles.sql, replace this with a Supabase query
const OWNER_EMAILS = ["uditeus@gmail.com", "uditeus@yahoo.com"];

function getRoleFromEmail(email: string | undefined): Role {
    if (!email) return "user";
    if (OWNER_EMAILS.includes(email.toLowerCase())) return "owner";
    return "user";
}

export function useRole() {
    const { user, loading: authLoading } = useAuth();
    const [role, setRole] = useState<Role>("user");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setRole("user");
            setLoading(false);
            return;
        }

        // Use email-based role assignment (temporary)
        const detectedRole = getRoleFromEmail(user.email);
        setRole(detectedRole);
        setLoading(false);
    }, [user, authLoading]);

    return {
        role,
        loading,
        isUser: role === "user",
        isAdmin: ROLE_HIERARCHY[role] >= ROLE_HIERARCHY["admin"],
        isDev: ROLE_HIERARCHY[role] >= ROLE_HIERARCHY["dev"],
        isOwner: role === "owner",
        hasRole: (required: Role) => ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[required],
        canManage: (targetRole: Role) => ROLE_HIERARCHY[role] > ROLE_HIERARCHY[targetRole],
    };
}
