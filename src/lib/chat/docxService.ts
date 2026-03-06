import { getSupabase } from "@/lib/supabase/client";
import type { DocumentData, TaskStep } from "@/components/chat/types";

export type DocGenProgress = {
    steps: TaskStep[];
    document?: DocumentData;
    error?: string;
};

export type DocGenProgressCallback = (progress: DocGenProgress) => void;

/**
 * Detects whether the user's message is a copy/document writing request.
 */
export function isCopyRequest(message: string): boolean {
    const lower = message.toLowerCase();
    const keywords = [
        "escreva", "escreve", "crie", "criar", "cria", "elabore",
        "elabora", "monte", "faça", "fazer", "gere", "gerar",
        "produza", "produz", "redija", "redige", "desenvolva",
        "copy", "copies", "email", "carta", "vendas", "vende", "landing page",
        "página", "anúncio", "ad ", "anuncio", "post", "legenda", "social media",
        "roteiro", "script", "texto", "conteúdo", "headline", "descrição", "pitch",
        "vsl", "docx", "documento"
    ];

    const hasKeyword = keywords.some(k => lower.includes(k));

    // Heuristic: if message asks for a copy or contains copy-related intent
    const hasCopyContext = lower.includes("copy") ||
        lower.includes("para") ||
        lower.includes("sobre") ||
        lower.includes("docx") ||
        lower.includes("documento") ||
        lower.includes("texto");

    return hasKeyword && (hasCopyContext || lower.length > 20);
}

/**
 * Calls the generate-docx Edge Function to create and upload a DOCX.
 */
export async function generateDocx(params: {
    title: string;
    content: string;
    projectId?: string;
    fileName?: string;
}): Promise<DocumentData> {
    const supabase = getSupabase();

    const { data, error } = await supabase.functions.invoke("generate-docx", {
        body: params,
    });

    if (error || data?.error) {
        console.error("Supabase Function Error (generate-docx):", error || data?.error);
        throw new Error(error?.message || data?.error || "DOCX generation failed");
    }

    return {
        title: params.title,
        fileName: data.fileName,
        url: data.url,
        sizeBytes: data.sizeBytes,
        storagePath: data.storagePath,
    };
}

/**
 * Extracts a document title from the AI's response text.
 * Looks for patterns like "## Title" at the top, or uses the first line.
 */
export function extractDocumentTitle(aiResponse: string, fallback = "Documento"): string {
    const lines = aiResponse.split("\n").map(l => l.trim()).filter(Boolean);

    for (const line of lines.slice(0, 5)) {
        // ## Title format
        if (line.startsWith("## ")) return line.slice(3).trim();
        if (line.startsWith("# ")) return line.slice(2).trim();
        // **Title** bold format as first line
        if (line.startsWith("**") && line.endsWith("**") && line.length < 100) {
            return line.slice(2, -2);
        }
    }

    return fallback;
}
