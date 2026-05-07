-- Blog app schema for Supabase
-- Run in Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.posts (
  id text primary key,
  title text not null,
  excerpt text not null,
  content text not null,
  date date not null default now(),
  read_time text not null,
  tags text[] not null default '{}',
  cover_emoji text not null default '📝',
  photo_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.posts add column if not exists photo_urls text[] not null default '{}';

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id text not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  content text not null check (char_length(content) > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  post_id text not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create table if not exists public.saves (
  id uuid primary key default gen_random_uuid(),
  post_id text not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.saves enable row level security;

drop policy if exists "Anyone can read posts" on public.posts;
create policy "Anyone can read posts"
on public.posts for select
using (true);

drop policy if exists "Authenticated users can create posts" on public.posts;
create policy "Authenticated users can create posts"
on public.posts for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can manage comments" on public.comments;
create policy "Authenticated users can manage comments"
on public.comments for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Anyone can read comments" on public.comments;
create policy "Anyone can read comments"
on public.comments for select
using (true);

drop policy if exists "Authenticated users can manage likes" on public.likes;
create policy "Authenticated users can manage likes"
on public.likes for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Anyone can read likes" on public.likes;
create policy "Anyone can read likes"
on public.likes for select
using (true);

drop policy if exists "Authenticated users can manage saves" on public.saves;
create policy "Authenticated users can manage saves"
on public.saves for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can read own saves" on public.saves;
create policy "Users can read own saves"
on public.saves for select
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- Demo posts: run seed_blog_posts.sql in the SQL editor so comments/likes match post IDs
-- (see scripts/emit-seed-sql.ts to regenerate from src/data/blogPosts.ts).

drop policy if exists "Public can read post images" on storage.objects;
create policy "Public can read post images"
on storage.objects for select
using (bucket_id = 'post-images');

drop policy if exists "Authenticated users can upload post images" on storage.objects;
create policy "Authenticated users can upload post images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'post-images');
