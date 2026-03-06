import * as React from "react";
import { User, Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";
import { useTheme } from "next-themes";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(null);
    const [session, setSession] = React.useState<Session | null>(null);
    const [loading, setLoading] = React.useState(true);
    const { setTheme } = useTheme();

    React.useEffect(() => {
        const supabase = getSupabase();

        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user?.user_metadata?.theme) {
                setTheme(session.user.user_metadata.theme);
            }
            setLoading(false);
        }).catch((err) => {
            console.error("Auth initialization error:", err);
            setSession(null);
            setUser(null);
            setLoading(false);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            // Apply theme on sign in
            if (event === 'SIGNED_IN' && session?.user?.user_metadata?.theme) {
                setTheme(session.user.user_metadata.theme);
            }

            setLoading(false);
        });

        // Periodic token refresh — keeps session warm (every 10 min)
        const refreshInterval = setInterval(async () => {
            const { data, error } = await supabase.auth.refreshSession();
            if (error) {
                console.warn("[AuthProvider] Periodic refresh failed:", error.message);
            } else if (data.session) {
                setSession(data.session);
                setUser(data.session.user);
            }
        }, 10 * 60 * 1000);

        return () => {
            subscription.unsubscribe();
            clearInterval(refreshInterval);
        };
    }, [setTheme]);

    const signOut = async () => {
        const supabase = getSupabase();
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
