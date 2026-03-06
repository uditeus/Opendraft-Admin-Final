/**
 * Centralized mock data for Admin Panel
 * This allows keeping components clean and ready for real API integration.
 */

// ── Dashboard & Metrics ──────────────────────────────────────

export const DASHBOARD_CHART_DATA = Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}`,
    users: Math.floor(40 + Math.random() * 30),
    revenue: Math.floor(600 + Math.random() * 400),
}));

export const RECENT_ACTIVITY = [
    { type: "signup", user: "Pedro Lima", time: "2 min atrás", detail: "Criou conta via Google" },
    { type: "upgrade", user: "Bruno Mendes", time: "18 min atrás", detail: "Free → Pro" },
    { type: "generation", user: "Ana Costa", time: "32 min atrás", detail: "Gerou copy (1.2K tokens)" },
    { type: "cancel", user: "Carlos Silva", time: "1h atrás", detail: "Cancelou plano Pro" },
    { type: "ticket", user: "Julia Santos", time: "2h atrás", detail: "Abriu ticket #T-1042" },
    { type: "signup", user: "Fernanda Alves", time: "3h atrás", detail: "Criou conta via email" },
    { type: "generation", user: "Maria Oliveira", time: "4h atrás", detail: "Gerou 3 copies (4.8K tokens)" },
    { type: "upgrade", user: "Ricardo Santos", time: "5h atrás", detail: "Pro → Max" },
];

export const ACTIVITY_TYPE_CONFIG: Record<string, { icon: string; color: string }> = {
    signup: { icon: "User", color: "text-blue-400" },
    upgrade: { icon: "ArrowUp", color: "text-emerald-500" },
    generation: { icon: "Sparkles", color: "text-purple-400" },
    cancel: { icon: "X", color: "text-red-400" },
    ticket: { icon: "MessageSquare", color: "text-amber-400" },
};

// ── Users ──────────────────────────────────────────────────

export const ADMIN_USERS_LIST = Array.from({ length: 64 }, (_, i) => ({
    id: `usr_${i + 1}`,
    name: [
        "Bruno Mendes", "Carla Silva", "João Ribeiro", "Maria Lima", "Felipe Araujo",
        "Ana Costa", "Lucas Rocha", "Juliana Souza", "Pedro Santos", "Gabriela Dias",
        "Thiago Ferreira", "Beatriz Nunes", "Rafael Moreira", "Isabela Barros", "Mateus Vieira",
        "Camila Almeida",
    ][i % 16],
    email: `user${i + 1}@example.com`,
    plan: ["Free", "Pro", "Max", "Max 5x"][i % 4],
    status: i === 5 ? "suspended" : i === 12 ? "banned" : "active",
    role: i === 0 ? "owner" : i <= 2 ? "dev" : i <= 5 ? "admin" : "user",
    credits: Math.floor(Math.random() * 500),
    createdAt: `${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}/${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}/2024`,
    lastLogin: i % 3 === 0 ? "Hoje" : i % 3 === 1 ? "Ontem" : `${Math.floor(Math.random() * 14) + 2}d atrás`,
}));

// ── Tickets ────────────────────────────────────────────────

export const ADMIN_TICKETS = [
    { id: "T-1042", user: "Bruno Mendes", email: "bruno@example.com", subject: "Não consigo exportar PDF", status: "open", priority: "high", created: "05/03/2025 14:32", lastReply: "—" },
    { id: "T-1041", user: "Ana Costa", email: "ana@example.com", subject: "Erro ao gerar copy com imagem anexa", status: "open", priority: "medium", created: "05/03/2025 11:18", lastReply: "—" },
    { id: "T-1040", user: "Pedro Lima", email: "pedro@example.com", subject: "Cobrado duas vezes no cartão", status: "replied", priority: "urgent", created: "04/03/2025 22:05", lastReply: "05/03/2025 09:12" },
    { id: "T-1039", user: "Julia Santos", email: "julia@example.com", subject: "Como faço upgrade do plano?", status: "replied", priority: "low", created: "04/03/2025 16:47", lastReply: "04/03/2025 17:30" },
    { id: "T-1038", user: "Carlos Silva", email: "carlos@example.com", subject: "IA respondendo em inglês", status: "resolved", priority: "medium", created: "03/03/2025 10:22", lastReply: "04/03/2025 08:14" },
];

// ── Analytics ──────────────────────────────────────────────

export const GROWTH_FUNNEL = [
    { name: "Visitantes", value: 48200 },
    { name: "Signups", value: 3420 },
    { name: "Trial", value: 1840 },
    { name: "Paid", value: 1076 },
];

export const RETENTION_COHORTS = [
    { cohort: "Janeiro 2024", d1: "82%", d7: "65%", d30: "48%" },
    { cohort: "Fevereiro 2024", d1: "85%", d7: "72%", d30: "52%" },
    { cohort: "Março 2024", d1: "88%", d7: "75%", d30: "58%" },
];

export const ACQUISITION_SOURCES = [
    { source: "Google", medium: "organic", campaign: "—", users: 4210, conversions: 312, revenue: "R$ 18.720", cac: "R$ 7,69", ratio: "75.7x", convRate: "7.4%" },
    { source: "Twitter/X", medium: "social", campaign: "launch_q1", users: 2840, conversions: 187, revenue: "R$ 11.220", cac: "R$ 9,63", ratio: "51.7x", convRate: "6.6%" },
    { source: "Direct", medium: "none", campaign: "—", users: 3100, conversions: 201, revenue: "R$ 12.060", cac: "—", ratio: "—", convRate: "6.5%" },
    { source: "YouTube", medium: "video", campaign: "tutorial_series", users: 1920, conversions: 142, revenue: "R$ 8.520", cac: "R$ 22,54", ratio: "27.2x", convRate: "7.4%" },
    { source: "Newsletter", medium: "email", campaign: "weekly_digest", users: 890, conversions: 98, revenue: "R$ 5.880", cac: "R$ 4,08", ratio: "132x", convRate: "11%" },
    { source: "Instagram", medium: "social", campaign: "reels_ads", users: 1640, conversions: 89, revenue: "R$ 5.340", cac: "R$ 23,60", ratio: "16.5x", convRate: "5.4%" },
];
