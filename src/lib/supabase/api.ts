import { getSupabase } from "./client";
import { Database } from "./types";

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type Document = Database["public"]["Tables"]["documents"]["Row"];
export type Skill = Database["public"]["Tables"]["skills"]["Row"];

/* PROJECTS */

export async function createProject(
    userId: string,
    title: string,
    mode: "chat" | "workspace" = "chat",
    skillId?: string,
    id?: string
) {
    const supabase = getSupabase();
    return supabase
        .from("projects")
        .insert({
            id,
            user_id: userId,
            title,
            mode,
            skill_id: skillId,
            is_favorite: false,
        })
        .select()
        .single();
}

export async function getProject(projectId: string) {
    const supabase = getSupabase();
    return supabase.from("projects").select("*").eq("id", projectId).single();
}

export async function listProjects(userId: string, filters?: { filter?: "todos" | "recentes" | "favoritos"; query?: string }) {
    const supabase = getSupabase();
    let query = supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

    if (filters?.filter === "favoritos") {
        query = query.eq("is_favorite", true);
    } else if (filters?.filter === "recentes") {
        // Supabase filtering for "recent" is manual or based on date range.
        // simpler to just fetch and filter, but for now let's just return ordered by updated_at
        // which effectively shows recent first.
        // If "recent" strictly means "last 7 days", we can add .gt('updated_at', ...)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        query = query.gt("updated_at", sevenDaysAgo.toISOString());
    }

    if (filters?.query) {
        query = query.ilike("title", `%${filters.query}%`);
    }

    return query;
}



export async function updateProject(projectId: string, updates: Partial<Project>) {
    const supabase = getSupabase();
    return supabase.from("projects").update(updates).eq("id", projectId).select().single();
}

export async function deleteProject(projectId: string) {
    const supabase = getSupabase();
    return supabase.from("projects").delete().eq("id", projectId);
}

/* MESSAGES */

export async function listMessages(projectId: string) {
    const supabase = getSupabase();
    return supabase
        .from("messages")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true })
        .order("role", { ascending: false }); // 'user' > 'assistant' - ensures user first if same timestamp
}

export async function appendMessage(
    projectId: string,
    userId: string,
    role: "user" | "assistant" | "system",
    content: string,
    metadata: any = {}
) {
    const supabase = getSupabase();

    // Optimistic update isn't possible here without React Query mutation caching,
    // but we will return the message to be added to local state.

    // Also update project updated_at
    await supabase
        .from("projects")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", projectId);

    return supabase
        .from("messages")
        .insert({
            project_id: projectId,
            user_id: userId,
            role,
            content,
            metadata,
        })
        .select()
        .single();
}

export async function updateMessageMetadata(messageId: string, metadata: any) {
    const supabase = getSupabase();
    return supabase
        .from("messages")
        .update({ metadata })
        .eq("id", messageId)
        .select()
        .single();
}

/* DOCUMENTS */

export async function getDocument(projectId: string) {
    const supabase = getSupabase();
    return supabase.from("documents").select("*").eq("project_id", projectId).single();
}

export async function upsertDocument(projectId: string, userId: string, content: string) {
    const supabase = getSupabase();

    // Upsert requires a constraint. We have a unique constraint on project_id.
    return supabase
        .from("documents")
        .upsert(
            {
                project_id: projectId,
                user_id: userId,
                content,
                updated_at: new Date().toISOString(),
            },
            { onConflict: "project_id" }
        )
        .select()
        .single();
}

/* PLAYBOOKS */

export async function listPlaybooks() {
    const supabase = getSupabase();
    return supabase.from("skills").select("*").eq("is_active", true).order("name");
}

export async function chatWithAI(projectId: string, message: string) {
    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) throw new Error("No active session");

    const { data, error } = await supabase.functions.invoke("chat", {
        body: { projectId, message },
    });

    if (error) {
        console.error("Supabase Function Error:", error);
        throw new Error(error.message || "Unknown error calling Edge Function");
    }

    if (data?.error) {
        throw new Error(data.error);
    }

    return data;
}

export async function generateTitle(projectId: string, message: string) {
    const supabase = getSupabase();

    // We use the same chat function but can pass a "title" mode or just a prompt?
    // Let's us a dedicated prompt.
    // Actually, let's create a specialized invoke for title generation or reuse chat with mode='title'.
    // The chat function as implemented expects 'messages' and 'mode'.
    // Let's pass mode="title_gen".

    try {
        const { data, error } = await supabase.functions.invoke("chat", {
            body: {
                projectId,
                messages: [{ role: "user", content: "Generate title" }], // Placeholder, logic in backend
                originalMessage: message, // Pass original context
                mode: "title_gen"
            },
        });

        if (error) {
            console.warn("Title gen failed:", error);
            return null;
        }
        return data?.title;
    } catch (e) {
        console.warn("Title gen exception:", e);
        return null;
    }
}

/* USER / PROFILE */

export async function updateUserOnboarding(userId: string, data: { name: string; role?: string; theme?: "light" | "dark"; source?: string; goals?: string[] }) {
    const supabase = getSupabase();

    // 1. Update Auth Metadata (so it's available in session)
    const updateData: { full_name: string; onboarding_completed: boolean; role?: string; theme?: string; source?: string; goals?: string[] } = {
        full_name: data.name,
        onboarding_completed: true,
    };
    if (data.role) updateData.role = data.role;
    if (data.theme) updateData.theme = data.theme;
    if (data.source) updateData.source = data.source;
    if (data.goals) updateData.goals = data.goals;

    const { error: authError } = await supabase.auth.updateUser({
        data: updateData,
    });

    if (authError) {
        console.error("Error updating auth metadata:", authError);
    }

    // 2. Update Public Profile
    const { error: profileError } = await supabase
        .from("profiles")
        .update({
            full_name: data.name,
        })
        .eq("id", userId);

    if (profileError) {
        console.error("Error updating profile:", profileError);
    }

    return { authError, profileError };
}
