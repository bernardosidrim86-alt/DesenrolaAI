
create or replace function public.complete_mission(p_mission_id text)
returns table (awarded_xp integer, total_xp integer, current_level integer, already_completed boolean)
language sql
security invoker
set search_path = ''
as $$
  select *
  from private.complete_mission(p_mission_id);
$$;

revoke all on function public.complete_mission(text) from public, anon;
grant execute on function public.complete_mission(text) to authenticated;
