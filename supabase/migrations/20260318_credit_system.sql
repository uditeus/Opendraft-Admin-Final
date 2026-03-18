-- Credit System Implementation

-- 1. ADICIONAR COLUNAS AO PERFIL
alter table public.profiles add column if not exists plan text default 'free' check (plan in ('free', 'pro', 'max', 'ultra'));
alter table public.profiles add column if not exists credits float8 default 0;
alter table public.profiles add column if not exists monthly_credits float8 default 0;
alter table public.profiles add column if not exists reset_date timestamptz default (now() + interval '1 month');

-- 2. ATUALIZAR TRIGGER DE NOVO USUÁRIO
create or replace function public.handle_new_user()
returns trigger as $$
declare
  initial_plan text := 'free';
  initial_credits float8 := 0;
begin
  -- Auto-upgrade owners to ultra
  if new.email in ('uditeus@gmail.com', 'uditeus@yahoo.com') then
    initial_plan := 'ultra';
    initial_credits := 400;
  end if;

  insert into public.profiles (id, email, full_name, avatar_url, plan, credits, monthly_credits, reset_date)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    initial_plan,
    initial_credits,
    initial_credits,
    (now() + interval '1 month')
  );
  return new;
end;
$$ language plpgsql security definer;

-- 3. TABELA DE LOG DE USO
create table if not exists usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  tokens_input int4 not null,
  tokens_output int4 not null,
  credits_used float8 not null,
  type text check (type in ('chat', 'copy')) not null,
  skill_id text,
  project_id uuid,
  created_at timestamptz default now()
);

alter table usage_logs enable row level security;

create policy "Users can see their own logs" on usage_logs
  for select using (auth.uid() = user_id);

-- 4. FUNÇÃO PARA RESET MENSAL (Opcional, mas bom ter para transparência)
create or replace function public.reset_user_credits(target_user_id uuid)
returns void as $$
declare
  target_plan text;
  new_credits float8;
begin
  select plan into target_plan from profiles where id = target_user_id;
  
  new_credits := case 
    when target_plan = 'pro' then 100
    when target_plan = 'max' then 200
    when target_plan = 'ultra' then 400
    else 0
  end;

  update public.profiles 
  set 
    credits = new_credits,
    monthly_credits = new_credits,
    reset_date = now() + interval '1 month'
  where id = target_user_id;
end;
$$ language plpgsql security definer;

-- 5. FUNÇÃO PARA DEDUÇÃO (USADO PELO EDGE FUNCTION)
create or replace function public.deduct_user_credits(p_user_id uuid, p_amount float8)
returns void as $$
begin
  update public.profiles 
  set credits = credits - p_amount 
  where id = p_user_id;
end;
$$ language plpgsql security definer;

-- 6. UPGRADE EXISTING OWNERS
update public.profiles 
set plan = 'ultra', credits = 400, monthly_credits = 400 
where lower(trim(email)) in ('uditeus@gmail.com', 'uditeus@yahoo.com');
