import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getSupabase } from "@/lib/supabase/client";

const OWNER_EMAILS = ["uditeus@gmail.com", "uditeus@yahoo.com", "uditeus@hotmail.com"];

export interface Profile {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string;
    plan: 'free' | 'pro' | 'max' | 'ultra';
    credits: number;
    monthly_credits: number;
    reset_date: string;
}

export function useProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setProfile(null);
            setLoading(false);
            return;
        }

        const supabase = getSupabase();

        // 1. Initial Fetch & Repair if Admin
        const fetchProfileAndRepair = async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (!error && data) {
                const currentProfile = data as Profile;
                setProfile(currentProfile);

                // 3. ADMIN SELF-REPAIR
                const isOwner = user?.email && OWNER_EMAILS.includes(user.email.toLowerCase());
                if (isOwner && (currentProfile.plan === 'free' || currentProfile.credits === 0)) {
                    console.log("[useProfile] Repairing owner account to Ultra/400...");
                    const { data: repaired, error: repairError } = await supabase
                        .from("profiles")
                        .update({ plan: 'ultra', credits: 400, monthly_credits: 400 })
                        .eq("id", user.id)
                        .select()
                        .single();

                    if (!repairError && repaired) {
                        setProfile(repaired as Profile);
                    }
                }
            }
            setLoading(false);
        };

        fetchProfileAndRepair();

        // 2. Real-time Subscription
        const channel = supabase
            .channel(`profile:${user.id}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "profiles",
                    filter: `id=eq.${user.id}`,
                },
                (payload) => {
                    setProfile(payload.new as Profile);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    return {
        profile,
        loading,
        credits: profile?.credits ?? 0,
        maxCredits: profile?.monthly_credits ?? 0,
        plan: profile?.plan ?? 'free'
    };
}
