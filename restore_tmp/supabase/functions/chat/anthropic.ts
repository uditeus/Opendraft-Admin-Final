
export interface ClaudeMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

export interface ClaudeConfig {
    apiKey: string;
    model?: "claude-3-haiku-20240307" | "claude-3-5-sonnet-20240620";
    maxTokens?: number;
    system?: string;
}

const DEFAULT_MODEL = "claude-3-haiku-20240307";
const DEFAULT_MAX_TOKENS = 1024;

export function createClaudeClient(apiKey: string) {
    if (!apiKey) throw new Error("Anthropic API Key is missing");
    return { apiKey };
}

export async function sendClaudeMessage(
    client: { apiKey: string },
    messages: ClaudeMessage[],
    config: Omit<ClaudeConfig, "apiKey"> = {}
) {
    const { model = DEFAULT_MODEL, maxTokens = DEFAULT_MAX_TOKENS, system } = config;

    // Filter out system messages from messages array, as Claude handles system prompt separately
    const chatMessages = messages.filter(m => m.role !== "system");

    // If system prompt wasn't passed in config but exists in messages, extract it
    let systemPrompt = system;
    if (!systemPrompt) {
        const sysMsg = messages.find(m => m.role === "system");
        if (sysMsg) systemPrompt = sysMsg.content;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "x-api-key": client.apiKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        body: JSON.stringify({
            model,
            max_tokens: maxTokens,
            system: systemPrompt,
            messages: chatMessages,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Anthropic API Error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.content[0].text;
}

export async function streamClaudeMessage(
    client: { apiKey: string },
    messages: ClaudeMessage[],
    config: Omit<ClaudeConfig, "apiKey"> = {}
) {
    const { model = DEFAULT_MODEL, maxTokens = DEFAULT_MAX_TOKENS, system } = config;

    const chatMessages = messages.filter(m => m.role !== "system");
    let systemPrompt = system;
    if (!systemPrompt) {
        const sysMsg = messages.find(m => m.role === "system");
        if (sysMsg) systemPrompt = sysMsg.content;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "x-api-key": client.apiKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        body: JSON.stringify({
            model,
            max_tokens: maxTokens,
            system: systemPrompt,
            messages: chatMessages,
            stream: true,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Anthropic API Error: ${response.status} - ${error}`);
    }

    // Return the raw stream (or transform it if needed). 
    // Claude sends 'text/event-stream'.
    return response.body;
}
