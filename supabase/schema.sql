-- =============================================================================
-- Degas Concepts CMS — database schema
-- Run once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Safe to re-run: every statement is idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Admin allow-list
-- Only users listed here can sign in to /admin or change content.
-- Add an admin (after creating the user under Authentication → Users):
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'you@example.com';
-- -----------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Keeps updated_at current on every update.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Content tables
-- -----------------------------------------------------------------------------
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1), -- single row
  name text not null,
  short_name text not null,
  tagline text not null,
  vision text not null,
  mission text not null,
  phone text not null,
  whatsapp text not null,
  email text not null,
  linkedin text not null,
  rc_number text not null,
  working_hours text not null,
  payment_options text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  icon text not null default 'Code2',
  summary text not null,
  description text not null,
  included text[] not null default '{}',
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.core_values (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  icon text not null default 'ShieldCheck',
  description text not null,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  description text not null,
  overview text,
  approach text,
  highlights text[] not null default '{}',
  services_label text,
  cover_image text,
  featured boolean not null default false,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  experience text not null default '',
  bio text not null default '',
  linkedin text,
  image_url text,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at triggers
do $$
declare t text;
begin
  foreach t in array array['site_settings', 'services', 'core_values', 'projects', 'clients', 'team_members']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format(
      'create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      t
    );
  end loop;
end;
$$;

-- -----------------------------------------------------------------------------
-- Row level security
-- Everyone can read published content; only admins can read drafts or write.
-- -----------------------------------------------------------------------------
alter table public.admins enable row level security;
drop policy if exists "Admins can see their own row" on public.admins;
create policy "Admins can see their own row" on public.admins
  for select to authenticated using (user_id = auth.uid());

alter table public.site_settings enable row level security;
drop policy if exists "Public read" on public.site_settings;
create policy "Public read" on public.site_settings for select using (true);
drop policy if exists "Admin write" on public.site_settings;
create policy "Admin write" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

do $$
declare t text;
begin
  foreach t in array array['services', 'core_values', 'projects', 'clients', 'team_members']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "Public read published" on public.%I', t);
    execute format(
      'create policy "Public read published" on public.%I for select using (published or public.is_admin())',
      t
    );
    execute format('drop policy if exists "Admin write" on public.%I', t);
    execute format(
      'create policy "Admin write" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      t
    );
  end loop;
end;
$$;

-- -----------------------------------------------------------------------------
-- Image storage: public "media" bucket, admins upload/replace/delete.
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880, -- 5 MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/svg+xml']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins read media" on storage.objects;
create policy "Admins read media" on storage.objects
  for select to authenticated using (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admins upload media" on storage.objects;
create policy "Admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admins update media" on storage.objects;
create policy "Admins update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admins delete media" on storage.objects;
create policy "Admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
