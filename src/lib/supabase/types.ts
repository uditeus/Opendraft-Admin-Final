export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    full_name: string | null;
                    avatar_url: string | null;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    created_at?: string;
                };
            };
            projects: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string;
                    description: string | null;
                    mode: "chat" | "workspace";
                    skill_id: string | null;
                    is_favorite: boolean;
                    updated_at: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    title: string;
                    description?: string | null;
                    mode?: "chat" | "workspace";
                    skill_id?: string | null;
                    is_favorite?: boolean;
                    updated_at?: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    title?: string;
                    description?: string | null;
                    mode?: "chat" | "workspace";
                    skill_id?: string | null;
                    is_favorite?: boolean;
                    updated_at?: string;
                    created_at?: string;
                };
            };
            skills: {
                Row: {
                    id: string;
                    slug: string;
                    name: string;
                    description: string | null;
                    category: string | null;
                    system_prompt: string | null;
                    is_active: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    slug: string;
                    name: string;
                    description?: string | null;
                    category?: string | null;
                    system_prompt?: string | null;
                    is_active?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    slug?: string;
                    name?: string;
                    description?: string | null;
                    category?: string | null;
                    system_prompt?: string | null;
                    is_active?: boolean;
                    created_at?: string;
                };
            };
            messages: {
                Row: {
                    id: string;
                    project_id: string;
                    user_id: string;
                    role: "user" | "assistant" | "system";
                    content: string;
                    metadata: Json;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    project_id: string;
                    user_id: string;
                    role: "user" | "assistant" | "system";
                    content: string;
                    metadata?: Json;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    project_id?: string;
                    user_id?: string;
                    role?: "user" | "assistant" | "system";
                    content?: string;
                    metadata?: Json;
                    created_at?: string;
                };
            };
            documents: {
                Row: {
                    id: string;
                    project_id: string;
                    user_id: string;
                    content: string;
                    updated_at: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    project_id: string;
                    user_id: string;
                    content?: string;
                    updated_at?: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    project_id?: string;
                    user_id?: string;
                    content?: string;
                    updated_at?: string;
                    created_at?: string;
                };
            };
        };
    };
}
