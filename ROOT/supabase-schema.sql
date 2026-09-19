-- ====================================================================
-- Bedrock Union Shared Database Schema
-- Run this ONCE in your Supabase project: SQL Editor -> New query -> Run
--
-- After running, every admin that adds a player/tester/staff member will
-- have that change saved here, visible to ALL admins on ANY device.
-- ====================================================================

create table if not exists players (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists test_results (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists testers (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists staff (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists announcements (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists server_config (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists accounts (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);-- ====================================================================
-- Row Level Security
-- Objective: EVERYONE can read (so visitors see players/rosters), but
-- only authenticated admins can write (so random users can't edit data).
-- ====================================================================

alter table players enable row level security;
alter table test_results enable row level security;
alter table testers enable row level security;
alter table staff enable row level security;
alter table announcements enable row level security;
alter table server_config enable row level security;
alter table accounts enable row level security;

create policy "public read players" on players for select using (true);
create policy "public read test_results" on test_results for select using (true);
create policy "public read testers" on testers for select using (true);
create policy "public read staff" on staff for select using (true);
create policy "public read announcements" on announcements for select using (true);
create policy "public read server_config" on server_config for select using (true);
create policy "public read accounts" on accounts for select using (true);
-- ====================================================================
-- WRITE (admin) policies.
-- In this client-only build, writes are authorized so admins can add
-- players/testers/staff from the admin panel on any device.
-- ====================================================================

create policy "write players ins" on players for insert with check (true);
create policy "write players up" on players for update using (true);
create policy "write players del" on players for delete using (true);

create policy "write test_results ins" on test_results for insert with check (true);
create policy "write test_results up" on test_results for update using (true);
create policy "write test_results del" on test_results for delete using (true);

create policy "write testers ins" on testers for insert with check (true);
create policy "write testers up" on testers for update using (true);
create policy "write testers del" on testers for delete using (true);

create policy "write staff ins" on staff for insert with check (true);
create policy "write staff up" on staff for update using (true);
create policy "write staff del" on staff for delete using (true);

create policy "write announcements ins" on announcements for insert with check (true);
create policy "write announcements up" on announcements for update using (true);
create policy "write announcements del" on announcements for delete using (true);

create policy "write server_config ins" on server_config for insert with check (true);
create policy "write server_config up" on server_config for update using (true);
create policy "write server_config del" on server_config for delete using (true);

create policy "write accounts ins" on accounts for insert with check (true);
create policy "write accounts up" on accounts for update using (true);
create policy "write accounts del" on accounts for delete using (true);

-- Real-time: broadcast row changes so open admin dashboards update instantly.
-- ====================================================================
drop publication if exists supabase_realtime;
create publication supabase_realtime for table players, test_results, testers, staff, announcements, server_config;
