-- Recreate tables to fix missing relation
drop table if exists public.messages;
drop table if exists public.documents;
drop table if exists public.projects;
drop table if exists public.skills;

-- 2. SKILLS (Global, read-only for clients)
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  category text,
  system_prompt text,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.skills enable row level security;

create policy "Skills are viewable by everyone" on public.skills
  for select using (true);

-- 3. PROJECTS
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  mode text check (mode in ('chat', 'workspace')) default 'chat',
  skill_id uuid references public.skills(id),
  is_favorite boolean default false,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table public.projects enable row level security;

create policy "Users can CRUD their own projects" on public.projects
  for all using (auth.uid() = user_id);

-- 4. MESSAGES
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text check (role in ('user', 'assistant', 'system')) not null,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

create policy "Users can CRUD their own messages" on public.messages
  for all using (auth.uid() = user_id);

-- 5. DOCUMENTS
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null unique,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text default '',
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table public.documents enable row level security;

create policy "Users can CRUD their own documents" on public.documents
  for all using (auth.uid() = user_id);

-- SEED DATA FOR SKILLS (Simplified from appsData.ts)
insert into public.skills (slug, name, description, category) values
('assistente-de-copy', 'Assistente de Copy', 'Uso livre — tudo de copy', 'Geral'),
('tutor-de-copywriting', 'Tutor de Copywriting', 'Educativo — feedback e aprendizado', 'Geral'),
('gerador-de-ideias', 'Gerador de Ideias', 'Ângulos, ganchos e campanhas', 'Geral'),
('planejador-estrategico', 'Planejador Estratégico', 'Planejar mensagens, ofertas e campanhas', 'Geral'),
('analisador-de-copy', 'Analisador de Copy', 'Diagnóstico e melhorias', 'Geral'),
('assistente-de-whatsapp', 'Assistente de WhatsApp', 'Mensagens, funis, objeções, follow-up e mais', 'WhatsApp'),
('assistente-de-email', 'Assistente de E-mail', 'Avulsos, sequências, vendas e nutrição', 'Email'),
('stories-instagram', 'Stories para Instagram', 'Sequências e roteiros de stories', 'Instagram'),
('carrossel-instagram', 'Carrossel Instagram', 'Títulos, slides e CTA', 'Instagram'),
('legendas-instagram', 'Legendas Instagram', 'Legendas com tom e CTA', 'Instagram'),
('roteiros-de-video', 'Roteiros de Vídeo', 'Reels, Shorts e TikTok', 'Instagram'),
('threads-twitter', 'Threads no Twitter', 'Viral, opinativo, educativo e mais', 'Threads'),
('gerador-de-ofertas', 'Gerador de Ofertas', 'Promessas, mecanismos, bônus', 'Vendas'),
('copy-para-vendas', 'Copy para Vendas', 'Copy de venda para páginas e mensagens', 'Vendas')
on conflict (slug) do nothing;

-- Force cache reload
NOTIFY pgrst, 'reload schema';
