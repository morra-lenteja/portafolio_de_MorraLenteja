-- Crear primero la cuenta de Morra en Authentication > Users.
-- Ejecutar este archivo completo en el SQL Editor del proyecto.
begin;
create table if not exists public.portfolio_settings (
  id integer primary key check (id = 1),
  config jsonb not null
);
insert into public.portfolio_settings (id, config)
values (1, '{"open":true,"delivery":"A convenir con la artista","packages":[{"label":"1 emote","mxn":100,"usd":5},{"label":"5 emotes","mxn":400,"usd":20}]}'::jsonb)
on conflict (id) do nothing;
alter table public.portfolio_settings enable row level security;
revoke all on public.portfolio_settings from anon, authenticated;
grant select on public.portfolio_settings to anon, authenticated;
grant update (config) on public.portfolio_settings to authenticated;
drop policy if exists "portfolio_public_read" on public.portfolio_settings;
create policy "portfolio_public_read" on public.portfolio_settings for select to anon, authenticated using (id = 1);
drop policy if exists "portfolio_admin_update" on public.portfolio_settings;
do $$
declare admin_id uuid;
begin
  select id into admin_id from auth.users where lower(email) = 'morra.lenteja@gmail.com';
  if admin_id is null then raise exception 'Primero crea la cuenta de Morra en Authentication > Users'; end if;
  execute format('create policy "portfolio_admin_update" on public.portfolio_settings for update to authenticated using (id = 1 and (select auth.uid()) = %L::uuid) with check (id = 1 and (select auth.uid()) = %L::uuid)', admin_id, admin_id);
end $$;
commit;
