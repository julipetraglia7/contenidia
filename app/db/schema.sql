-- Contenidia — Esquema Fase 1
-- Correr en Supabase → SQL Editor → New query → pegar todo → Run.

-- =====================================================================
-- 1. Tablas
-- =====================================================================

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand_colors jsonb not null default '{
    "bg":"#191919",
    "card":"#211a1a",
    "border":"#5a3a38",
    "ink":"#f7f7df",
    "accent":"#a91917",
    "accentSoft":"#d28379"
  }'::jsonb,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plannings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  label text not null,
  month int check (month between 1 and 12),
  year int check (year >= 2020),
  status text not null default 'draft' check (status in ('draft', 'published')),
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  planning_id uuid not null references public.plannings(id) on delete cascade,
  type text not null check (type in ('post', 'carousel', 'gif', 'story', 'reel', 'tiktok')),
  date date,
  week_number int,
  title text,
  copy text,
  hashtags text,
  theme_axis text,
  cta text,
  media jsonb not null default '[]'::jsonb,
  "order" int not null default 0,
  status text not null default 'idea' check (status in ('idea', 'in_review', 'approved')),
  is_collaborative boolean not null default false,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- 2. Indexes
-- =====================================================================
create index if not exists idx_clients_owner on public.clients(owner_id);
create index if not exists idx_plannings_client on public.plannings(client_id);
create index if not exists idx_plannings_owner on public.plannings(owner_id);
create index if not exists idx_content_items_planning on public.content_items(planning_id);
create index if not exists idx_content_items_date on public.content_items(date);

-- =====================================================================
-- 3. Trigger updated_at automático
-- =====================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists clients_updated_at on public.clients;
create trigger clients_updated_at before update on public.clients
  for each row execute function public.set_updated_at();

drop trigger if exists plannings_updated_at on public.plannings;
create trigger plannings_updated_at before update on public.plannings
  for each row execute function public.set_updated_at();

drop trigger if exists content_items_updated_at on public.content_items;
create trigger content_items_updated_at before update on public.content_items
  for each row execute function public.set_updated_at();

-- =====================================================================
-- 4. Row Level Security — cada usuario solo ve/edita lo suyo
-- =====================================================================
alter table public.clients enable row level security;
alter table public.plannings enable row level security;
alter table public.content_items enable row level security;

drop policy if exists "clients_owner_all" on public.clients;
create policy "clients_owner_all" on public.clients
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "plannings_owner_all" on public.plannings;
create policy "plannings_owner_all" on public.plannings
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "content_items_owner_all" on public.content_items;
create policy "content_items_owner_all" on public.content_items
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- =====================================================================
-- 5. Storage bucket para media (imágenes, gifs, videos)
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('content-media', 'content-media', true)
on conflict (id) do nothing;

drop policy if exists "content_media_owner_upload" on storage.objects;
create policy "content_media_owner_upload" on storage.objects
  for insert with check (bucket_id = 'content-media' and auth.uid() is not null);

drop policy if exists "content_media_public_read" on storage.objects;
create policy "content_media_public_read" on storage.objects
  for select using (bucket_id = 'content-media');

drop policy if exists "content_media_owner_delete" on storage.objects;
create policy "content_media_owner_delete" on storage.objects
  for delete using (bucket_id = 'content-media' and auth.uid() = owner);
