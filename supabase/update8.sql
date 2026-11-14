-- Update 8: job applications tracker. Run once in Supabase > SQL Editor (needs fix-rls.sql run before: it defines is_admin()).
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company text default '', role text default '', job_url text default '', source text default '',
  kind text default 'Remote job', location text default '',
  status text default 'Saved',               -- Saved, Applied, Follow-up sent, Interview, Offer, Rejected, No reply, Closed
  applied_on date, follow_up date,
  contact_name text default '', contact_email text default '',
  job_description text default '', cover_letter text default '', followup_text text default '', notes text default ''
);
alter table public.applications enable row level security;
drop policy if exists "applications admin all" on public.applications;
create policy "applications admin all" on public.applications for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
