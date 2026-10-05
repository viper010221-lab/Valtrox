-- ====================================================================
-- Row Level Security hardening  (Phase 2 -- DO NOT RUN YET)
-- ====================================================================
-- !! READ THIS FIRST !!
--
-- Running this file as-is WILL break the live site. It is the *target
-- state*, not a drop-in fix. There is a hard prerequisite.
--
-- WHY IT CANNOT BE APPLIED YET
-- ----------------------------
-- The site has no server-side authentication. Sign-in works like this:
--
--   1. DataContext.tsx:437 downloads the ENTIRE accounts table
--   2. DataContext.tsx:497 compares the password in the browser:
--        if (account.password !== pass) ...
--   3. AdminDashboardPage.tsx:25 trusts `currentUser.rank` to decide
--      whether to render the admin panel
--
-- Because the browser is the one doing auth, it needs read access to
-- every account (including passwords) and write access to every table.
-- That is the only reason supabase-schema.sql uses `using (true)`.
--
-- So the RLS policies and the auth model are the SAME problem. You
-- cannot safely tighten RLS without first moving authentication to
-- Supabase Auth, which issues a real JWT the database can verify.
--
-- Once sign-in goes through Supabase Auth, `auth.uid()` is trustworthy,
-- these policies become correct, and the anonymous write access that
-- lets anyone self-promote to Owner disappears.
--
-- PREREQUISITE (Phase 1) -- not yet implemented:
--   1. Create users in Supabase Auth (email + password).
--   2. Add a `user_id uuid` column to `accounts` referencing auth.users.
--   3. Sign in via supabase.auth.signInWithPassword(); keep a session JWT.
--   4. Store rank in a table the client cannot write, or validate it
--      server-side -- do not let the client assert its own role.
--
-- Once Phase 1 is live, run the statements below.
-- ====================================================================


-- ====================================================================
-- Step 1 -- Link accounts to real auth users
-- ====================================================================
alter table accounts add column if not exists user_id uuid references auth.users(id) on delete cascade;

create index if not exists accounts_user_id_idx on accounts(user_id);


-- ====================================================================
-- Step 2 -- Remove the anonymous write access
-- ====================================================================
-- These are the policies that let anyone with the publishable key (which
-- is committed in this public repo) edit or delete anything, including
-- promoting themselves to Owner.
drop policy if exists "write players ins"      on players;
drop policy if exists "write players up"       on players;
drop policy if exists "write players del"      on players;
drop policy if exists "write test_results ins" on test_results;
drop policy if exists "write test_results up"  on test_results;
drop policy if exists "write test_results del" on test_results;
drop policy if exists "write testers ins"      on testers;
drop policy if exists "write testers up"       on testers;
drop policy if exists "write testers del"      on testers;
drop policy if exists "write staff ins"        on staff;
drop policy if exists "write staff up"         on staff;
drop policy if exists "write staff del"        on staff;
drop policy if exists "write announcements ins" on announcements;
drop policy if exists "write announcements up"  on announcements;
drop policy if exists "write announcements del" on announcements;
drop policy if exists "write server_config ins" on server_config;
drop policy if exists "write server_config up"  on server_config;
drop policy if exists "write server_config del" on server_config;
drop policy if exists "write accounts ins"      on accounts;
drop policy if exists "write accounts up"       on accounts;
drop policy if exists "write accounts del"      on accounts;


-- ====================================================================
-- Step 3 -- Replace them with authenticated, role-aware policies
-- ====================================================================
-- Public reads stay open: visitors are meant to see players, tiers and
-- announcements. Only WRITES and the accounts table become restricted.

-- A signed-in user may write only the tables admins legitimately edit.
-- `staff` and above is the bar, mirroring the old admin-panel check.
create policy "staff write players" on players
  for all
  using (exists (select 1 from accounts a
                 where a.user_id = auth.uid() and a.rank in ('Staff','Administrator','Owner')))
  with check (exists (select 1 from accounts a
                 where a.user_id = auth.uid() and a.rank in ('Staff','Administrator','Owner')));

create policy "staff write test_results" on test_results
  for all
  using (exists (select 1 from accounts a
                 where a.user_id = auth.uid() and a.rank in ('Staff','Administrator','Owner')))
  with check (exists (select 1 from accounts a
                 where a.user_id = auth.uid() and a.rank in ('Staff','Administrator','Owner')));

create policy "staff write testers" on testers
  for all
  using (exists (select 1 from accounts a
                 where a.user_id = auth.uid() and a.rank in ('Staff','Administrator','Owner')))
  with check (exists (select 1 from accounts a
                 where a.user_id = auth.uid() and a.rank in ('Staff','Administrator','Owner')));

create policy "staff write staff" on staff
  for all
  using (exists (select 1 from accounts a
                 where a.user_id = auth.uid() and a.rank in ('Staff','Administrator','Owner')))
  with check (exists (select 1 from accounts a
                 where a.user_id = auth.uid() and a.rank in ('Staff','Administrator','Owner')));

create policy "staff write announcements" on announcements
  for all
  using (exists (select 1 from accounts a
                 where a.user_id = auth.uid() and a.rank in ('Staff','Administrator','Owner')))
  with check (exists (select 1 from accounts a
                 where a.user_id = auth.uid() and a.rank in ('Staff','Administrator','Owner')));

-- Only the owner may change server config.
create policy "owner write server_config" on server_config
  for all
  using (exists (select 1 from accounts a
                 where a.user_id = auth.uid() and a.rank = 'Owner'))
  with check (exists (select 1 from accounts a
                 where a.user_id = auth.uid() and a.rank = 'Owner'));


-- ====================================================================
-- Step 4 -- Lock down `accounts` (this is the important one)
-- ====================================================================
-- `accounts` holds a plaintext `password` per user, so it must never be
-- world-readable. Previously "public read accounts" ... using (true)
-- meant every visitor could dump every email and password on the site.
drop policy if exists "public read accounts" on accounts;

-- A user may read ONLY their own row.
create policy "read own account" on accounts
  for select
  using (auth.uid() = user_id);

-- Nobody edits their own row through the client. Promotions happen
-- server-side or via /api/accounts, so a user cannot grant themselves a
-- higher rank by writing to their own record.
create policy "update own account safe fields" on accounts
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and rank = (select a2.rank from accounts a2
                                              where a2.user_id = auth.uid()));

-- New accounts are created by the signup path / bot endpoint only.
drop policy if exists "write accounts ins" on accounts;

create policy "admin insert accounts" on accounts
  for insert
  with check (exists (select 1 from accounts a
                     where a.user_id = auth.uid() and a.rank in ('Administrator','Owner')));

create policy "admin delete accounts" on accounts
  for delete
  using (exists (select 1 from accounts a
                 where a.user_id = auth.uid() and a.rank = 'Owner'));


-- ====================================================================
-- Step 5 -- Never expose accounts to Realtime
-- ====================================================================
-- The publication broadcasts row changes to every subscriber. Keep
-- `accounts` out of it so a password column is never streamed to clients.
-- (It is not currently included, but this makes the intent explicit and
-- survives anyone re-running the publication statement in
-- supabase-schema.sql.)
drop publication if exists supabase_realtime;
create publication supabase_realtime
  for table players, test_results, testers, staff, announcements, server_config;


-- ====================================================================
-- After running: rotate every password.
-- ====================================================================
-- These were readable by anyone while the permissive policies were live.
-- Rotate the Supabase service_role key, the owner login, and any user
-- password that was ever stored here.
-- ====================================================================
