create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  total_xp integer not null default 0 check (total_xp >= 0),
  current_level integer not null default 1 check (current_level >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.missions (
  id text primary key,
  category text not null,
  title text not null,
  description text not null,
  reward_xp integer not null check (reward_xp between 1 and 1000),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.mission_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mission_id text not null references public.missions(id) on delete restrict,
  xp_awarded integer not null check (xp_awarded between 1 and 1000),
  completed_at timestamptz not null default now(),
  constraint mission_completions_user_mission_unique unique (user_id, mission_id)
);

create index mission_completions_user_completed_idx
  on public.mission_completions (user_id, completed_at desc);

alter table public.profiles enable row level security;
alter table public.missions enable row level security;
alter table public.mission_completions enable row level security;

grant select, insert on public.profiles to authenticated;
grant update (display_name, avatar_url, updated_at) on public.profiles to authenticated;
grant select on public.missions to anon, authenticated;
grant select on public.mission_completions to authenticated;

create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can create their own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "Users can update allowed fields on their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Active missions are visible to everyone"
  on public.missions for select
  to anon, authenticated
  using (is_active = true);

create policy "Users can read their own mission completions"
  on public.mission_completions for select
  to authenticated
  using ((select auth.uid()) = user_id);

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.complete_mission(p_mission_id text)
returns table (awarded_xp integer, total_xp integer, current_level integer, already_completed boolean)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_reward integer;
  v_inserted_id uuid;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select m.reward_xp
    into v_reward
    from public.missions m
   where m.id = p_mission_id
     and m.is_active = true;

  if v_reward is null then
    raise exception 'Mission not found or inactive';
  end if;

  insert into public.profiles (id)
  values (v_user_id)
  on conflict (id) do nothing;

  insert into public.mission_completions (user_id, mission_id, xp_awarded)
  values (v_user_id, p_mission_id, v_reward)
  on conflict (user_id, mission_id) do nothing
  returning id into v_inserted_id;

  if v_inserted_id is not null then
    update public.profiles p
       set total_xp = p.total_xp + v_reward,
           current_level = 1 + floor((p.total_xp + v_reward)::numeric / 500)::integer,
           updated_at = now()
     where p.id = v_user_id;
  end if;

  return query
  select
    case when v_inserted_id is null then 0 else v_reward end,
    p.total_xp,
    p.current_level,
    (v_inserted_id is null)
  from public.profiles p
  where p.id = v_user_id;
end;
$$;

revoke all on function private.complete_mission(text) from public, anon;
grant execute on function private.complete_mission(text) to authenticated;

insert into public.missions (id, category, title, description, reward_xp, sort_order)
values
  ('autonomia-decisao-01', 'Autonomia', 'Uma decisão de cada vez', 'Pratique avaliar opções e consequências antes de fazer uma compra importante.', 100, 1),
  ('dinheiro-escolhas-01', 'Dinheiro e consumo', 'Entenda suas escolhas', 'Comece a observar seus gastos e diferencie necessidade de vontade.', 100, 2),
  ('comunicacao-limites-01', 'Comunicação e relações', 'Aprenda a dizer não', 'Pratique comunicar limites com clareza e respeito.', 100, 3)
on conflict (id) do update
set category = excluded.category,
    title = excluded.title,
    description = excluded.description,
    reward_xp = excluded.reward_xp,
    sort_order = excluded.sort_order,
    is_active = true;
