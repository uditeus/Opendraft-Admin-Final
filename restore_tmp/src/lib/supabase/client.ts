import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase credentials. Please check .env.local file.");
}

let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function getSupabase() {
    if (!supabaseClient) {
        supabaseClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
    }
    return supabaseClient;
}
