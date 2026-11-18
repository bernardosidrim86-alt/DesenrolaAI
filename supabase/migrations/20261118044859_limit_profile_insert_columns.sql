
revoke insert on table public.profiles from authenticated;
grant insert (id, display_name, avatar_url) on table public.profiles to authenticated;
