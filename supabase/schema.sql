-- Enable RLS
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- 1. PROFILES
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

-- Handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. SKILLS (Global, read-only for clients)
create table skills (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  category text,
  system_prompt text,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table skills enable row level security;

create policy "Skills are viewable by everyone" on skills
  for select using (true);

-- 3. PROJECTS
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  mode text check (mode in ('chat', 'workspace')) default 'chat',
  skill_id uuid references skills(id),
  is_favorite boolean default false,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table projects enable row level security;

create policy "Users can CRUD their own projects" on projects
  for all using (auth.uid() = user_id);

-- 4. MESSAGES
create table messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text check (role in ('user', 'assistant', 'system')) not null,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table messages enable row level security;

create policy "Users can CRUD their own messages" on messages
  for all using (auth.uid() = user_id);

-- 5. DOCUMENTS
create table documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null unique,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text default '',
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table documents enable row level security;

create policy "Users can CRUD their own documents" on documents
  for all using (auth.uid() = user_id);

-- SEED DATA FOR SKILLS (Simplified from appsData.ts)
insert into skills (slug, name, description, category) values
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
