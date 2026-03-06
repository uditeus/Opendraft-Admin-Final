import { useState, useEffect, useCallback } from "react";
import { getSupabase } from "@/lib/supabase/client";

const ADMIN_SESSION_KEY = "admin_verified_at";
const ADMIN_SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
const ADMIN_ATTEMPTS_KEY = "admin_login_attempts";
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

interface AdminLoginAttempts {
    count: number;
    firstAttemptAt: number;
}

export function useAdminSession() {
    const [adminVerified, setAdminVerified] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    // Check existing session validity
    const checkSession = useCallback(() => {
        const lastVerified = sessionStorage.getItem(ADMIN_SESSION_KEY);
        if (lastVerified) {
            const elapsed = Date.now() - parseInt(lastVerified, 10);
            if (elapsed < ADMIN_SESSION_DURATION) {
                setAdminVerified(true);
                return;
            }
        }
        setAdminVerified(false);
    }, []);

    // Check rate limiting
    const checkLockout = useCallback(() => {
        const raw = sessionStorage.getItem(ADMIN_ATTEMPTS_KEY);
        if (!raw) { setIsLocked(false); return; }

        const attempts: AdminLoginAttempts = JSON.parse(raw);
        const elapsed = Date.now() - attempts.firstAttemptAt;

        if (attempts.count >= MAX_ATTEMPTS && elapsed < LOCKOUT_DURATION) {
            setIsLocked(true);
        } else if (elapsed >= LOCKOUT_DURATION) {
            sessionStorage.removeItem(ADMIN_ATTEMPTS_KEY);
            setIsLocked(false);
        } else {
            setIsLocked(false);
        }
    }, []);

    useEffect(() => {
        checkSession();
        checkLockout();
    }, [checkSession, checkLockout]);

    // Inactivity auto-logout
    useEffect(() => {
        if (!adminVerified) return;

        let timer: ReturnType<typeof setTimeout>;

        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                clearAdminSession();
            }, ADMIN_SESSION_DURATION);
        };

        resetTimer();
        const events = ["mousemove", "keypress", "click", "scroll"];
        events.forEach((e) => document.addEventListener(e, resetTimer));

        return () => {
            clearTimeout(timer);
            events.forEach((e) => document.removeEventListener(e, resetTimer));
        };
    }, [adminVerified]);

    const recordAttempt = () => {
        const raw = sessionStorage.getItem(ADMIN_ATTEMPTS_KEY);
        let attempts: AdminLoginAttempts = raw
            ? JSON.parse(raw)
            : { count: 0, firstAttemptAt: Date.now() };

        const elapsed = Date.now() - attempts.firstAttemptAt;
        if (elapsed >= LOCKOUT_DURATION) {
            attempts = { count: 0, firstAttemptAt: Date.now() };
        }

        attempts.count += 1;
        sessionStorage.setItem(ADMIN_ATTEMPTS_KEY, JSON.stringify(attempts));

        if (attempts.count >= MAX_ATTEMPTS) {
            setIsLocked(true);
        }
    };

    const verifyAdmin = async (password: string): Promise<{ success: boolean; error?: string }> => {
        if (isLocked) {
            return { success: false, error: "Muitas tentativas. Aguarde 15 minutos." };
        }

        try {
            const supabase = getSupabase();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user?.email) {
                return { success: false, error: "Sessão inválida" };
            }

            const { error } = await supabase.auth.signInWithPassword({
                email: user.email,
                password,
            });

            if (error) {
                recordAttempt();
                return { success: false, error: "Senha incorreta" };
            }

            sessionStorage.setItem(ADMIN_SESSION_KEY, Date.now().toString());
            sessionStorage.removeItem(ADMIN_ATTEMPTS_KEY);
            setAdminVerified(true);
            return { success: true };
        } catch {
            recordAttempt();
            return { success: false, error: "Erro ao verificar identidade" };
        }
    };

    const clearAdminSession = () => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        setAdminVerified(false);
    };

    const remainingAttempts = (): number => {
        const raw = sessionStorage.getItem(ADMIN_ATTEMPTS_KEY);
        if (!raw) return MAX_ATTEMPTS;
        const attempts: AdminLoginAttempts = JSON.parse(raw);
        return Math.max(0, MAX_ATTEMPTS - attempts.count);
    };

    return {
        adminVerified,
        isLocked,
        verifyAdmin,
        clearAdminSession,
        remainingAttempts,
    };
}
