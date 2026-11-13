-- Run once in Supabase → SQL Editor.
-- 1) Replace YOUR_ADMIN_EMAIL (3 places) with the email of the Supabase user you will sign in with.

create table if not exists public.projects (
  id            text primary key,
  name          text not null,
  tagline       text default '',
  headline      text default '',
  description   text default '',
  kind          text default 'Web App',
  categories    text[] default '{}',
  status        text default 'Concept',
  url           text default '',
  github        text default '',
  image         text default '',
  case_image    text default '',
  highlights    text[] default '{}',
  period        text default '',
  featured_pool boolean default false,
  pinned        boolean default false,
  sort          int default 100,
  updated_at    timestamptz default now()
);

alter table public.projects enable row level security;

-- Anyone can read projects (the public site); only your admin account can change them.
drop policy if exists "projects public read" on public.projects;
create policy "projects public read" on public.projects for select using (true);

drop policy if exists "projects admin write" on public.projects;
create policy "projects admin write" on public.projects for all to authenticated
  using ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL')
  with check ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL');

-- Image storage (public read, admin-only write)
insert into storage.buckets (id, name, public) values ('project-images', 'project-images', true)
on conflict (id) do nothing;

drop policy if exists "project images public read" on storage.objects;
create policy "project images public read" on storage.objects for select using (bucket_id = 'project-images');

drop policy if exists "project images admin write" on storage.objects;
create policy "project images admin write" on storage.objects for all to authenticated
  using (bucket_id = 'project-images' and (auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL')
  with check (bucket_id = 'project-images' and (auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL');

-- ═══ Update 5: certificates / hackathons / events + resume file ═══
create table if not exists public.credentials (
  id          text primary key,
  title       text not null,
  issuer      text default '',
  kind        text default 'Certificate',
  date        text default '',
  description text default '',
  image       text default '',
  url         text default '',
  sort        int default 100
);
alter table public.credentials enable row level security;
drop policy if exists "credentials public read" on public.credentials;
create policy "credentials public read" on public.credentials for select using (true);
drop policy if exists "credentials admin write" on public.credentials;
create policy "credentials admin write" on public.credentials for all to authenticated
  using ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL') with check ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL');

create table if not exists public.site_files (
  key text primary key,
  url text not null default ''
);
alter table public.site_files enable row level security;
drop policy if exists "site_files public read" on public.site_files;
create policy "site_files public read" on public.site_files for select using (true);
drop policy if exists "site_files admin write" on public.site_files;
create policy "site_files admin write" on public.site_files for all to authenticated
  using ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL') with check ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL');

-- Certificates / CV storage (public read, admin-only write)
insert into storage.buckets (id, name, public) values ('documents', 'documents', true) on conflict (id) do nothing;
drop policy if exists "documents public read" on storage.objects;
create policy "documents public read" on storage.objects for select using (bucket_id = 'documents');
drop policy if exists "documents admin write" on storage.objects;
create policy "documents admin write" on storage.objects for all to authenticated
  using (bucket_id = 'documents' and (auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL')
  with check (bucket_id = 'documents' and (auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL');
