import { getSupabase } from "@/lib/supabase/client";

/**
 * Get a fresh access token, always trying refresh first.
 */
async function getFreshToken(): Promise<string> {
    const supabase = getSupabase();

    // 1. Try refreshing the session first — this guarantees a fresh JWT
    console.log("[getFreshToken] Attempting refreshSession()...");
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

    if (refreshData?.session?.access_token) {
        const token = refreshData.session.access_token;
        console.log(`[getFreshToken] ✅ Got fresh token via refreshSession(). Length: ${token.length}, Expires: ${new Date((refreshData.session.expires_at || 0) * 1000).toISOString()}`);
        return token;
    }

    if (refreshError) {
        console.error("[getFreshToken] ❌ refreshSession() failed:", refreshError.message, refreshError);
    }

    // 2. Fallback: try getSession() in case refresh failed but session is still valid
    console.log("[getFreshToken] Trying getSession() fallback...");
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        console.warn(`[getFreshToken] ⚠️ Using cached token. Length: ${session.access_token.length}, Expires: ${new Date((session.expires_at || 0) * 1000).toISOString()}`);
        return session.access_token;
    }

    console.error("[getFreshToken] ❌ No session available at all. User needs to re-login.");
    throw new Error("Sessão expirada. Por favor, faça login novamente.");
}

/**
 * Execute the actual fetch to the edge function.
 */
async function callEdgeFunction(
    token: string,
    projectId: string | null,
    messages: any[],
    mode: string,
    onChunk: (chunk: string) => void,
    signal?: AbortSignal,
): Promise<{ response: Response; status: number }> {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const response = await fetch(
        `${supabaseUrl}/functions/v1/chat`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                apikey: anonKey,
            },
            body: JSON.stringify({
                projectId,
                messages,
                mode,
                stream: true,
            }),
            signal,
        }
    );

    return { response, status: response.status };
}

export async function sendMessage(
    projectId: string | null,
    messages: any[],
    mode: string = "default",
    onChunk: (chunk: string) => void,
    signal?: AbortSignal,
    accessToken?: string
): Promise<string> {
    // 1. Get a fresh token
    let token = accessToken || await getFreshToken();
    console.log(`[sendMessage] Using token: ${token.substring(0, 30)}... (length: ${token.length})`);
    console.log(`[sendMessage] Project: ${projectId}, Messages: ${messages.length}, Mode: ${mode}`);

    // 2. First attempt
    let result: { response: Response; status: number };
    try {
        console.log(`[sendMessage] Calling fetch for ${projectId}...`);
        result = await callEdgeFunction(token, projectId, messages, mode, onChunk, signal);
        console.log(`[sendMessage] Response received. Status: ${result.status}, OK: ${result.response.ok}`);
    } catch (fetchErr: any) {
        console.error("[sendMessage] Fetch failed:", fetchErr);
        throw new Error(`Erro de conexão: ${fetchErr.message}`);
    }

    // 3. If we got 401, log the full error response body, then refresh and retry
    if (result.status === 401) {
        // Read the error body before retrying
        let errorBody = "(could not read)";
        try { errorBody = await result.response.clone().text(); } catch (_) { }
        console.error(`[sendMessage] ❌ 401 on first attempt. Error body: ${errorBody}`);
        console.warn("[sendMessage] Force-refreshing token and retrying...");
        try {
            token = await getFreshToken();
            console.log(`[sendMessage] Retry token: ${token.substring(0, 30)}... (length: ${token.length})`);
            result = await callEdgeFunction(token, projectId, messages, mode, onChunk, signal);
            console.log(`[sendMessage] Retry attempt status: ${result.status}`);
            if (result.status === 401) {
                let retryBody = "(could not read)";
                try { retryBody = await result.response.clone().text(); } catch (_) { }
                console.error(`[sendMessage] ❌ 401 on RETRY too. Error body: ${retryBody}`);
            }
        } catch (retryErr: any) {
            console.error("[sendMessage] Retry fetch failed:", retryErr);
            throw new Error(`Erro de autenticação: não foi possível renovar a sessão. Faça login novamente.`);
        }
    }

    const { response } = result;

    // 4. Handle non-OK responses
    if (!response.ok) {
        let errorMsg = `HTTP ${response.status}`;
        try {
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                const err = await response.json();
                errorMsg = err.error || err.details || err.message || JSON.stringify(err);
            } else {
                errorMsg = await response.text();
            }
        } catch (e) {
            try { errorMsg = await response.text(); } catch (e2) { /* ignore */ }
        }

        console.error("[sendMessage] Error response:", errorMsg);

        if (errorMsg.includes("Invalid JWT") || errorMsg.includes("Unauthorized")) {
            throw new Error(`Erro de autenticação persistente. Saia e entre novamente na sua conta.`);
        }

        throw new Error(errorMsg);
    }

    if (!response.body) {
        throw new Error("Sem corpo de resposta do servidor.");
    }

    // 5. Stream the response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            fullText += chunk;
            onChunk(chunk);
        }
    } catch (err: any) {
        console.error("[sendMessage] Stream error:", err);
        if (err.name === 'AbortError') throw err;
        throw new Error(`Erro no stream: ${err.message}`);
    }

    return fullText;
}

