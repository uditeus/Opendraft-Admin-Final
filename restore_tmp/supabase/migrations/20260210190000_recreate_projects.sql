-- Recreate tables to fix missing relation
drop table if exists public.messages;
drop table if exists public.documents;
drop table if exists public.projects;

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

-- Force cache reload
NOTIFY pgrst, 'reload schema';
