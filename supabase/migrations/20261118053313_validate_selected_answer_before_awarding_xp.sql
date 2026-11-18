drop function if exists public.complete_mission(text);
drop function if exists private.complete_mission(text);

create or replace function private.complete_mission(
  p_mission_id text,
  p_selected_option text
)
returns table (awarded_xp integer, total_xp integer, current_level integer, already_completed boolean)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_reward integer;
  v_correct_option text;
  v_inserted_id uuid;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select m.reward_xp, m.correct_option
    into v_reward, v_correct_option
    from public.missions m
   where m.id = p_mission_id
     and m.is_active = true;

  if v_reward is null then
    raise exception 'Mission not found or inactive';
  end if;

  if v_correct_option is null or p_selected_option is distinct from v_correct_option then
    raise exception 'Incorrect answer';
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

revoke all on function private.complete_mission(text, text) from public, anon;
grant execute on function private.complete_mission(text, text) to authenticated;

create or replace function public.complete_mission(
  p_mission_id text,
  p_selected_option text
)
returns table (awarded_xp integer, total_xp integer, current_level integer, already_completed boolean)
language sql
security invoker
set search_path = ''
as $$
  select *
  from private.complete_mission(p_mission_id, p_selected_option);
$$;

revoke all on function public.complete_mission(text, text) from public, anon;
grant execute on function public.complete_mission(text, text) to authenticated;
