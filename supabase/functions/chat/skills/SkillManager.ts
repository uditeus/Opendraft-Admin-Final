import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { execute as docxExecutor } from "./docx_writer/executor.ts";

export interface SkillConfig {
    name: string;
    description: string;
    max_input_tokens: number;
    max_output_tokens: number;
    use_rag: boolean;
    use_history: boolean;
    is_executor?: boolean;
}

export class SkillManager {
    private skills: Map<string, SkillConfig> = new Map();
    private supabase: any;

    constructor(supabaseClient: any) {
        this.supabase = supabaseClient;
    }

    async registerSkill(name: string) {
        try {
            const configPath = `./${name}/config.json`;
            const configText = await Deno.readTextFile(new URL(configPath, import.meta.url));
            const config: SkillConfig = JSON.parse(configText);
            this.skills.set(name, config);
            console.log(`[SkillManager] Registered skill: ${name}`);
        } catch (err: any) {
            console.error(`[SkillManager] Failed to register skill ${name}:`, err.message);
        }
    }

    async loadSkill(name: string) {
        const config = this.skills.get(name);
        if (!config) throw new Error(`Skill ${name} not registered`);

        const promptPath = `./${name}/system_prompt.txt`;
        const systemPrompt = await Deno.readTextFile(new URL(promptPath, import.meta.url));

        return { config, systemPrompt };
    }

    async getKnowledge(skillName: string, query: string): Promise<string> {
        try {
            const { data, error } = await this.supabase.rpc("match_skill_knowledge", {
                query_text: query,
                skill_name: skillName,
                match_count: 3
            });

            if (error || !data) return "";

            return data.map((d: any) => d.content).join("\n---\n");
        } catch (err: any) {
            console.error(`[SkillManager] RAG error for ${skillName}:`, err);
            return "";
        }
    }

    async buildPrompt(skillName: string, userInput: string, history: any[] = []): Promise<string> {
        const { config, systemPrompt } = await this.loadSkill(skillName);

        let prompt = systemPrompt;

        if (config.use_rag) {
            const knowledge = await this.getKnowledge(skillName, userInput);
            if (knowledge) {
                prompt += `\n\nRELEVANT KNOWLEDGE:\n${knowledge}`;
            }
        }

        return prompt;
    }

    async executeSkill(skillName: string, params: any) {
        const config = this.skills.get(skillName);
        if (!config) throw new Error(`Skill ${skillName} not found`);

        if (skillName === "docx_writer") {
            return await docxExecutor(this.supabase, params);
        }

        throw new Error(`Execution policy for ${skillName} not defined`);
    }
}
