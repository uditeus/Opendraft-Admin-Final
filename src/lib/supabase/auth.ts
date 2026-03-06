import { getSupabase } from "./client";

export async function signUp(email: string, password: string, fullName?: string) {
    const supabase = getSupabase();
    return supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    });
}

export async function signIn(email: string, password: string) {
    const supabase = getSupabase();
    return supabase.auth.signInWithPassword({
        email,
        password,
    });
}

export async function signOut() {
    const supabase = getSupabase();
    return supabase.auth.signOut();
}

export async function getSession() {
    const supabase = getSupabase();
    return supabase.auth.getSession();
}

export async function getUser() {
    const supabase = getSupabase();
    return supabase.auth.getUser();
}

export async function signInWithGoogle() {
    const supabase = getSupabase();
    return supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${window.location.origin}/new`,
        },
    });
}

export async function resetPasswordForEmail(email: string) {
    const supabase = getSupabase();
    return supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
    });
}
