import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SkillManager } from "./skills/SkillManager.ts";
import { type PostgrestClient } from "https://esm.sh/@supabase/postgrest-js@1.9.1";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// --- SUBSCRIPTION & CREDITS LOGIC ---
const CREDITS_PER_TOKEN = 250000;
const COPY_BASE_COST = 1.0;
const MIN_CHAT_COST = 0.01;
const MAX_COPY_COST = 3.0;

function calculateCredits(inputTokens: number, outputTokens: number, type: "chat" | "copy") {
    const total = inputTokens + outputTokens;
    if (type === "chat") {
        return Math.max(MIN_CHAT_COST, total / CREDITS_PER_TOKEN);
    }
    const raw = COPY_BASE_COST + (total / CREDITS_PER_TOKEN);
    return Math.min(MAX_COPY_COST, Math.max(COPY_BASE_COST, raw));
}

async function getUserCredits(supabase: PostgrestClient, userId: string) {
    const { data, error } = await supabase
        .from("profiles")
        .select("credits, plan")
        .eq("id", userId)
        .single();
    if (error) throw error;
    return data;
}

async function deductCredits(supabase: any, userId: string, amount: number) {
    const { error } = await supabase.rpc("deduct_user_credits", {
        p_user_id: userId,
        p_amount: amount
    });
    if (error) {
        console.error("[Credits] Error deducting:", error);
    }
}

async function logUsage(supabase: PostgrestClient, log: any) {
    await supabase.from("usage_logs").insert(log);
}

serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const body = await req.json();
        const { projectId, messages, mode = "default", originalMessage } = body;

        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: "messages array is required" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400,
            });
        }

        const authHeader = req.headers.get("Authorization");
        const jwt = authHeader?.replace("Bearer ", "");

        const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
        const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

        // Standard client for auth 
        const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader || "" } }
        });
        // Service client for privileged tasks (storage, bypass RLS)
        const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

        const {
            data: { user },
            error: userError,
        } = await supabaseClient.auth.getUser(jwt);

        if (userError || !user) {
            console.error("[Chat] Auth failed:", userError?.message || "No user found");
            return new Response(JSON.stringify({
                error: "Unauthorized",
                details: userError?.message || "Sua sessão expirou ou o token é inválido."
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 401,
            });
        }

        const userId = user.id;

        // Fetch User Credits early
        const profile = await getUserCredits(supabaseService, userId);
        const userHasCredits = profile && profile.credits >= 0.01;

        if (!userHasCredits) {
            console.warn(`[Credits] User ${userId} blocked. Credits: ${profile?.credits}`);
            return new Response(JSON.stringify({
                error: "NOT_ENOUGH_CREDITS",
                details: "Seus créditos acabaram. Faça um upgrade para continuar usando a IA."
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 402,
            });
        }

        // TITLE GENERATION BLOCK
        if (mode === "title_gen" && originalMessage) {
            const { createClaudeClient, sendClaudeMessage } = await import("./anthropic.ts");
            const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
            if (!anthropicKey) throw new Error("ANTHROPIC_API_KEY is not set");
            const claude = createClaudeClient(anthropicKey);

            const titlePrompt = `Leia a mensagem e gere apenas o título com no máximo 5 palavras. Responda SOMENTE com o texto do título, sem aspas, sem dois pontos, sem rótulos:\n\n"${originalMessage}"`;
            const title = await sendClaudeMessage(claude, [{ role: "user", content: titlePrompt }], {
                model: "claude-3-haiku-20240307",
                maxTokens: 30
            });

            const cleanTitle = title
                .replace(/^.*[:\u003a\uff1a]\s*/, "")
                .replace(/^["'\u00ab\u00bb\u201c\u201d\u201e\u2018\u2019]|["'\u00ab\u00bb\u201c\u201d\u201e\u2018\u2019.;\s]+$/g, "")
                .trim()
                .slice(0, 60);
            if (projectId) {
                await supabaseClient.from("projects").update({ title: cleanTitle }).eq("id", projectId);
            }

            // Calculate and deduct credits for title gen (Chat type)
            // Haiku is cheap, but we apply the minimum chat cost to prevent abuse
            const creditsUsed = calculateCredits(titlePrompt.length / 4, 30, "chat");
            await deductCredits(supabaseService, userId, creditsUsed);
            await logUsage(supabaseService, {
                user_id: userId,
                tokens_input: Math.round(titlePrompt.length / 4),
                tokens_output: 30,
                credits_used: creditsUsed,
                type: "chat",
                skill_id: "title_gen",
                project_id: projectId
            });

            return new Response(JSON.stringify({ title: cleanTitle }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Skill Manager & Routing
        const skillManager = new SkillManager(supabaseService);
        await skillManager.registerSkill("copywriter");
        await skillManager.registerSkill("planner");
        await skillManager.registerSkill("docx_writer");

        let activeSkill = "copywriter";
        if (mode === "planner") activeSkill = "planner";

        if (projectId) {
            const { data: project } = await supabaseClient
                .from("projects")
                .select("id, user_id, title, skill_id")
                .eq("id", projectId)
                .single();

            if (project) {
                if (project.user_id !== userId) {
                    return new Response(JSON.stringify({ error: "Forbidden" }), {
                        headers: { ...corsHeaders, "Content-Type": "application/json" },
                        status: 403,
                    });
                }
                if (project.skill_id === "planner") activeSkill = "planner";
            }
        }

        const type = (activeSkill === "copywriter" || mode === "writer") ? "copy" : "chat";

        const lastUserMessage = messages.filter(m => m.role === "user").pop()?.content || "";
        const systemPrompt = await skillManager.buildPrompt(activeSkill, lastUserMessage, messages);

        // Claude Setup
        const { createClaudeClient, streamClaudeMessage } = await import("./anthropic.ts");
        const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
        const claude = createClaudeClient(anthropicKey!);

        const model = (mode === "writer" || mode === "planner" || mode === "analyst")
            ? "claude-3-5-sonnet-20240620"
            : "claude-3-haiku-20240307";

        const claudeMessages: any[] = [];
        let lastRole = "";
        for (const m of messages.filter((m: any) => m.role !== "system")) {
            if (m.role === lastRole) {
                claudeMessages[claudeMessages.length - 1].content += "\n\n" + m.content;
            } else {
                claudeMessages.push({ role: m.role, content: m.content });
                lastRole = m.role;
            }
        }
        if (claudeMessages.length > 0 && claudeMessages[0].role === "assistant") claudeMessages.shift();

        const claudeStream = await streamClaudeMessage(claude, claudeMessages, {
            model,
            system: systemPrompt,
            maxTokens: 2048
        });

        // Save user message
        if (projectId) {
            const validMessages = messages.filter((m: any) => m.role === 'user');
            const lastUserMsg = validMessages.length > 0 ? validMessages[validMessages.length - 1] : null;
            if (lastUserMsg) {
                await supabaseClient.from("messages").insert({
                    project_id: projectId, user_id: userId, role: "user", content: lastUserMsg.content
                });
            }
        }

        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();

        (async () => {
            const reader = claudeStream.getReader();
            const decoder = new TextDecoder();
            const encoder = new TextEncoder();
            let fullAssistantResponse = "";
            let buffer = "";
            let inputTokens = 0;
            let outputTokens = 0;

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    buffer += chunk;
                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed.startsWith("data: ")) continue;
                        const dataStr = trimmed.slice(6);
                        try {
                            const event = JSON.parse(dataStr);

                            // Track Tokens
                            if (event.type === "message_start") {
                                inputTokens = event.message?.usage?.input_tokens || 0;
                            }
                            if (event.type === "message_delta") {
                                outputTokens = event.usage?.output_tokens || outputTokens;
                            }
                            if (event.type === "message_stop") {
                                // Final sync
                            }

                            if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
                                const text = event.delta.text;
                                fullAssistantResponse += text;
                                await writer.write(encoder.encode(text));
                            }
                        } catch (e) { /* ignore */ }
                    }
                }

                // POST-STREAM CREDIT DEDUCTION
                const creditsUsed = calculateCredits(inputTokens, outputTokens, type);
                console.log(`[Credits] Deducting ${creditsUsed} (Tokens: ${inputTokens} in, ${outputTokens} out) for user ${userId}`);
                await deductCredits(supabaseService, userId, creditsUsed);
                await logUsage(supabaseService, {
                    user_id: userId,
                    tokens_input: inputTokens,
                    tokens_output: outputTokens,
                    credits_used: creditsUsed,
                    type: type,
                    skill_id: activeSkill,
                    project_id: projectId
                });

                // STREAM FINISHED BY AI - NOW TRIGGER DOCX IF NEEDED
                let finalContent = fullAssistantResponse;
                let finalMetadata: any = { model, provider: "anthropic" };

                if (activeSkill === "copywriter") {
                    try {
                        const jsonMatch = fullAssistantResponse.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            const parsed = JSON.parse(jsonMatch[0]);
                            const isWritingStage = parsed.stage === "writing";
                            const hasDocxSkill = parsed.skill === "docx_writer" || parsed.action === "docx_writer" || parsed.tool_call?.name === "docx_writer";
                            const copyText = parsed.copy || parsed.content || parsed.tool_call?.arguments?.content;
                            const titleText = parsed.title || parsed.tool_call?.arguments?.title || projectId || "Opendraft Document";

                            if (copyText && (isWritingStage || hasDocxSkill)) {
                                console.log("[Chat] AI finished copy, creating DOCX link...");
                                const docx = await skillManager.executeSkill("docx_writer", {
                                    title: titleText,
                                    content: copyText,
                                    projectId,
                                    userId,
                                    client: supabaseClient
                                });

                                // Append link to the stream so user sees it live
                                const linkText = `\n\n---\n**📄 Arquivo gerado:** [Baixar Documento .DOCX](${docx.url})`;
                                await writer.write(encoder.encode(linkText));

                                // Update finalContent for DB
                                if (parsed.copy) parsed.copy += linkText;
                                else if (parsed.content) parsed.content += linkText;
                                finalContent = JSON.stringify(parsed);

                                finalMetadata = {
                                    ...finalMetadata,
                                    document: docx,
                                    taskSteps: [
                                        { id: "analyze", label: "Analisando solicitação", status: "done" },
                                        { id: "content", label: "Redigindo conteúdo", status: "done" },
                                        { id: "gen_file", label: "Arquivo DOCX gerado", status: "done" },
                                        { id: "completed", label: "Documento pronto", status: "done" }
                                    ]
                                };
                            }
                        }
                    } catch (e) {
                        console.error("[Chat] DOCX skill auto-run failed:", e);
                    }
                }

                // Save assistant message to DB
                if (projectId && userId && finalContent) {
                    await supabaseClient.from("messages").insert({
                        project_id: projectId, user_id: userId, role: "assistant",
                        content: finalContent, metadata: finalMetadata
                    });
                }
            } catch (err) {
                console.error("[Chat] Stream processing error:", err);
            } finally {
                await writer.close();
            }
        })();

        return new Response(readable, {
            headers: { ...corsHeaders, "Content-Type": "text/plain", "Transfer-Encoding": "chunked" },
        });

    } catch (error) {
        console.error("[Chat] Main error:", error);
        return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
