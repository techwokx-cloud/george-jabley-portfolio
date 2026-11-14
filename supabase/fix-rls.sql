-- ═══════════════════════════════════════════════════════════════════════════
-- Portfolio security rules — safe to run any number of times.
-- Fixes: "new row violates row-level security policy for table projects"
-- Admin = the Supabase user whose email matches below (case-insensitive).
-- CHANGE THE EMAIL ONLY IF YOUR ADMIN LOGIN IS DIFFERENT.
-- ═══════════════════════════════════════════════════════════════════════════

create or replace function public.is_admin() returns boolean
language sql stable as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = lower('george.jabley@gmail.com')
$$;

-- tables (created if missing) ------------------------------------------------
create table if not exists public.projects (
  id text primary key, name text not null, tagline text default '', headline text default '',
  description text default '', kind text default 'Web App', categories text[] default '{}',
  status text default 'Concept', url text default '', github text default '', image text default '',
  case_image text default '', highlights text[] default '{}', period text default '',
  featured_pool boolean default false, pinned boolean default false, sort int default 100
);
create table if not exists public.credentials (
  id text primary key, title text not null, issuer text default '', kind text default 'Certificate',
  date text default '', description text default '', image text default '', url text default '', sort int default 100
);
create table if not exists public.site_files ( key text primary key, url text not null default '' );
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text default 'Website',          -- Facebook Ad, LinkedIn, Upwork, Referral, Website, ...
  kind text default 'Other',              -- Remote job, Work abroad, VA client, Project, Other
  name text default '', contact text default '', company text default '', role text default '',
  status text default 'New',              -- New, Applied, Replied, Interview, Offer, Won, Rejected, Closed
  campaign text default '', message text default '', notes text default '', follow_up date
);

-- row level security -----------------------------------------------------------
alter table public.projects    enable row level security;
alter table public.credentials enable row level security;
alter table public.site_files  enable row level security;
alter table public.leads       enable row level security;

do $$
declare t text;
begin
  foreach t in array array['projects','credentials','site_files'] loop
    execute format('drop policy if exists "%1$s public read" on public.%1$s', t);
    execute format('drop policy if exists "%1$s admin write" on public.%1$s', t);
    execute format('create policy "%1$s public read" on public.%1$s for select using (true)', t);
    execute format('create policy "%1$s admin write" on public.%1$s for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- leads: anyone may submit (contact form), only the admin can read / edit
drop policy if exists "leads public insert" on public.leads;
drop policy if exists "leads admin all" on public.leads;
create policy "leads public insert" on public.leads for insert to anon, authenticated
  with check (length(coalesce(message, '')) < 5000 and length(coalesce(name, '')) < 200);
create policy "leads admin all" on public.leads for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- storage buckets ---------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('project-images', 'project-images', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('documents', 'documents', true) on conflict (id) do nothing;

drop policy if exists "project images public read" on storage.objects;
drop policy if exists "project images admin write" on storage.objects;
drop policy if exists "documents public read" on storage.objects;
drop policy if exists "documents admin write" on storage.objects;
create policy "project images public read" on storage.objects for select using (bucket_id = 'project-images');
create policy "project images admin write" on storage.objects for all to authenticated
  using (bucket_id = 'project-images' and public.is_admin()) with check (bucket_id = 'project-images' and public.is_admin());
create policy "documents public read" on storage.objects for select using (bucket_id = 'documents');
create policy "documents admin write" on storage.objects for all to authenticated
  using (bucket_id = 'documents' and public.is_admin()) with check (bucket_id = 'documents' and public.is_admin());
