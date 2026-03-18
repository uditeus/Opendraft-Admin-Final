import { OpendraftResponse } from "@/components/chat/types";

/**
 * Parses an OpendraftResponse JSON from assistant message content.
 * Handles cases where the JSON might be wrapped in text or markdown blocks.
 */
export function parseOpendraftResponse(content: string): OpendraftResponse | null {
    if (!content) return null;

    // Try direct parse first
    try {
        const parsed = JSON.parse(content.trim());
        if (typeof parsed === 'object' && parsed !== null && ('stage' in parsed || 'suggestions' in parsed)) {
            return parsed;
        }
    } catch (e) {
        // Not direct JSON
    }

    // Try to find JSON block { ... }
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        try {
            const parsed = JSON.parse(jsonMatch[0]);
            if (typeof parsed === 'object' && parsed !== null) {
                return parsed;
            }
        } catch (e) {
            // Invalid JSON in block
        }
    }

    return null;
}

/**
 * Extracts the primary displayable text from a structured response.
 * Includes a fallback for streaming (incomplete) JSON.
 */
export function getDisplayContent(content: string): string {
    const parsed = parseOpendraftResponse(content);
    if (parsed) return parsed.copy || (parsed as any).content || parsed.debrief || parsed.thinking || content;

    // Streaming fallback: if it looks like structured JSON, try to extract fields
    const trimmed = content.trim();
    if (trimmed.startsWith('{')) {
        // Handle text content extraction
        const contentMatch = content.match(/"(copy|content|thinking|debrief)":\s*"((?:[^"\\]|\\.)*)"/);
        if (contentMatch && contentMatch[2]) {
            let extracted = contentMatch[2];
            extracted = extracted.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            return extracted;
        }

        // Handle suggestions array extraction during streaming
        const suggestionsMatch = content.match(/"suggestions":\s*\[\s*([^\]]*)\s*\]/);
        if (suggestionsMatch && suggestionsMatch[1]) {
            try {
                // Try to parse the partial array
                const arrayContent = suggestionsMatch[1];
                // Handle partial array: "item 1", "item 2", "it
                const items = arrayContent.split(',').map(s => {
                    const m = s.match(/"([^"]*)"/);
                    return m ? m[1] : null;
                }).filter(Boolean) as string[];
                if (items.length > 0) return content; // This function returns content for further parsing
            } catch (e) { /* ignore partial arrays */ }
        }
    }

    return content;
}

/**
 * Generates heuristic suggestions as a fallback if the AI doesn't provide them.
 */
export function generateFallbackSuggestions(content: string): string[] {
    const text = (content || "").toLowerCase();

    // Minimal fallback for empty or start states
    if (text.length < 5) {
        return [
            "Quero escrever um anúncio",
            "Crie um e-mail de vendas",
            "Ideias de post para Instagram"
        ];
    }

    return [
        "Continue o raciocínio",
        "Dê exemplos práticos",
        "Explique com mais detalhes"
    ];
}

/**
 * Gets suggestions from content (JSON) or falls back to heuristics.
 */
export function getDisplaySuggestions(content: string, metadataSuggestions?: string[] | null): string[] {
    if (metadataSuggestions && metadataSuggestions.length > 0) return metadataSuggestions;

    const parsed = parseOpendraftResponse(content);
    if (parsed?.suggestions && parsed.suggestions.length > 0) return parsed.suggestions;

    // Fallback to heuristics if it's not a structured JSON or suggestions are empty
    return generateFallbackSuggestions(content);
}
