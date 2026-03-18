-- Enable pgvector extension
create extension if not exists vector;

-- Table for skill-specific knowledge
create table if not exists public.skill_knowledge (
    id uuid primary key default gen_random_uuid(),
    skill_name text not null,
    content text not null,
    embedding vector(1536), -- Assuming OpenAI/Anthropic size, adjust if needed
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);

-- Index for vector search
create index on public.skill_knowledge using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- RPC function for knowledge retrieval
create or replace function public.match_skill_knowledge(
    query_text text,
    skill_name text,
    match_count int default 3
)
returns table (
    id uuid,
    content text,
    similarity float
)
language plpgsql
as $$
begin
    -- In a real scenario, query_text would be converted to embedding first.
    -- For now, this is a placeholder for text-based fallback or future vector integration.
    return query
    select
        sk.id,
        sk.content,
        1.0 as similarity -- Mock similarity for now
    from public.skill_knowledge sk
    where sk.skill_name = match_skill_knowledge.skill_name
      and sk.content ilike '%' || query_text || '%'
    limit match_count;
end;
$$;
