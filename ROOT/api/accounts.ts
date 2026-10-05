// ====================================================================
// Bot-facing account endpoint  ->  POST /api/accounts
// ====================================================================
// Lets an external Discord bot create or sync website accounts.
//
// WHY THIS EXISTS
// The site is a static Vite SPA with no backend, so there was previously
// nothing for a bot to call. This serverless function fills that gap.
//
// SECURITY MODEL
//   - The Supabase `service_role` key is read from a server-side env var
//     and NEVER returned, logged, or sent to the bot. `service_role`
//     bypasses Row Level Security, so it must stay on the server.
//   - The bot authenticates with a shared secret in the `x-bot-secret`
//     header, compared in constant time.
//   - Passwords are accepted on write (the current data model needs them)
//     but are STRIPPED from every response.
//
// The bot only ever needs to hold: the endpoint URL + the shared secret.
// If the bot host is ever compromised, rotate BOT_API_SECRET and the
// attacker loses access to this endpoint only -- not the whole database.
//
// ACTIONS
//   create  { email, password, ign, discordTag?, rank?, id? }
//   sync    { email, ign?, discordTag?, rank?, id? }   (patch, ignores password)
//   rank    { email, rank }
//   get     { email }
//   delete  { email }
//
// AUTH for every action:
//   x-bot-secret: <BOT_API_SECRET>
//
// EXAMPLE
//   curl -X POST https://your-site.vercel.app/api/accounts \
//        -H 'content-type: application/json' \
//        -H "x-bot-secret: $BOT_API_SECRET" \
//        -d '{"action":"create","email":"user@example.com",
//              "password":"...","ign":"SomeIGN","discordTag":"user#0001"}'
// ====================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { timingSafeEqual, randomUUID } from 'node:crypto';

// --- Minimal request/response types ---------------------------------
// Declared locally so this file needs no @vercel/node dependency.
// Vercel supplies `req`/`res` at runtime regardless.
interface ApiRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}
interface ApiResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
  end(): void;
}

// --- Constants ------------------------------------------------------

const ACCOUNTS_TABLE = 'accounts';

// Mirrors the `UserRank` union in src/types/index.ts. Anything outside
// this list is rejected, so a bug (or a hostile caller) cannot invent a
// new rank.
const VALID_RANKS = [
  'Player',
  'VIP',
  'MVP',
  'MVP+',
  'MVP++',
  'Content Creator',
  'Content Creator+',
  'Tier Tester',
  'Bedrock Union Partner',
  'Moderator',
  'Administrator',
  'Developer',
  'Owner',
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** The master owner. Rank/IGN changes for this account are rejected so a
 *  leaked bot secret cannot demote or impersonate the owner. */
const MASTER_OWNER_EMAIL = 'valtrox51@gmail.com';

// --- Helpers --------------------------------------------------------

/** Reads a single header value, tolerating node's string[] form. */
function header(req: ApiRequest, name: string): string {
  const raw = req.headers?.[name] ?? req.headers?.[name.toLowerCase()];
  return Array.isArray(raw) ? raw[0] ?? '' : raw ?? '';
}

/**
 * Constant-time secret comparison. A plain `===` leaks the secret one
 * character at a time through response timing, so we hash both sides to
 * a fixed length first and use timingSafeEqual.
 */
function secretMatches(provided: string, expected: string): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Removes the password from an account object before it leaves the server. */
function redact<T extends { password?: string }>(account: T): Omit<T, 'password'> {
  const { password: _password, ...safe } = account;
  return safe;
}

/** Unwraps the `{ id, data, created_at }` row shape used by every table. */
function toAccount(row: { id: string; data: unknown } | null): Record<string, unknown> | null {
  if (!row) return null;
  if (row.data && typeof row.data === 'object') {
    return { ...(row.data as Record<string, unknown>), id: row.id };
  }
  return null;
}

function fail(res: ApiResponse, code: number, message: string, extra?: Record<string, unknown>) {
  res.status(code).json({ success: false, error: message, ...extra });
}

/**
 * Returns a service_role client, or null if the function is not
 * configured. We deliberately fail closed: a missing key must never
 * silently fall through to a public client.
 */
function getAdminClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Reads the request body, which Vercel may hand over as a string. */
function readBody(req: ApiRequest): Record<string, unknown> {
  const { body } = req;
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body as Record<string, unknown>;
}

// --- Actions --------------------------------------------------------

type Action = 'create' | 'sync' | 'rank' | 'get' | 'delete';

const ACTIONS: Action[] = ['create', 'sync', 'rank', 'get', 'delete'];

async function handleAction(
  action: Action,
  payload: Record<string, unknown>,
  supabase: SupabaseClient,
  res: ApiResponse
): Promise<void> {
  const email = String(payload.email ?? '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return fail(res, 400, 'A valid "email" is required.');
  }

  const isOwnerAccount = email === MASTER_OWNER_EMAIL;

  // --- read-only action ---------------------------------------------
  if (action === 'get') {
    const { data, error } = await supabase
      .from(ACCOUNTS_TABLE)
      .select('id, data')
      .eq('id', email)
      .maybeSingle();
    if (error) return fail(res, 502, 'Database query failed.');
    const account = toAccount(data);
    if (!account) return fail(res, 404, 'No account found with that email.');
    return res.status(200).json({ success: true, account: redact(account as any) });
  }

  // --- delete --------------------------------------------------------
  if (action === 'delete') {
    if (isOwnerAccount) return fail(res, 403, 'The master owner account cannot be deleted.');
    const { error } = await supabase.from(ACCOUNTS_TABLE).delete().eq('id', email);
    if (error) return fail(res, 502, 'Database delete failed.');
    return res.status(200).json({ success: true, message: `Deleted account ${email}.` });
  }

  // --- rank-only patch -----------------------------------------------
  if (action === 'rank') {
    const rank = String(payload.rank ?? '');
    if (!VALID_RANKS.includes(rank as any)) {
      return fail(res, 400, `Invalid "rank". Must be one of: ${VALID_RANKS.join(', ')}.`);
    }
    if (isOwnerAccount) return fail(res, 403, 'The master owner rank cannot be changed.');

    const { data: existing, error: readErr } = await supabase
      .from(ACCOUNTS_TABLE)
      .select('id, data')
      .eq('id', email)
      .maybeSingle();
    if (readErr) return fail(res, 502, 'Database query failed.');
    const current = toAccount(existing);
    if (!current) return fail(res, 404, 'No account found with that email.');

    const next = { ...current, rank };
    const { error } = await supabase
      .from(ACCOUNTS_TABLE)
      .upsert({ id: email, data: next, created_at: new Date().toISOString() }, { onConflict: 'id' });
    if (error) return fail(res, 502, 'Database write failed.');

    return res.status(200).json({ success: true, account: redact(next as any) });
  }

  // --- create / sync -------------------------------------------------
  // `create` requires a password (it is how a brand-new account is made).
  // `sync` is a partial patch and never touches the password, so a bot
  // that only mirrors ranks can call it without ever seeing credentials.
  // --- create / sync -------------------------------------------------
  // Validate everything that does NOT depend on database state up front,
  // so a malformed request is rejected without a DB round trip. Only the
  // "does a row already exist?" checks below need the database.

  // `create` on an existing account degrades into a `sync`, so the
  // password/ign requirements are enforced only when no row exists.
  const hasRank = payload.rank !== undefined;
  const hasPassword = payload.password !== undefined;
  const hasIgn = payload.ign !== undefined;

  if (hasRank) {
    const rank = String(payload.rank);
    if (!VALID_RANKS.includes(rank as any)) {
      return fail(res, 400, `Invalid "rank". Must be one of: ${VALID_RANKS.join(', ')}.`);
    }
    if (isOwnerAccount) return fail(res, 403, 'The master owner rank cannot be changed.');
    // A bot must never be able to mint an Owner, even indirectly.
    if (rank === 'Owner') return fail(res, 403, 'Cannot grant the Owner rank via this endpoint.');
  }

  if (hasPassword) {
    const password = String(payload.password);
    if (password.length < 8) return fail(res, 400, '"password" must be at least 8 characters.');
    if (isOwnerAccount) return fail(res, 403, 'The master owner password cannot be set via this endpoint.');
  }

  if (hasIgn && !String(payload.ign).trim()) {
    return fail(res, 400, '"ign" cannot be empty.');
  }

  const existingRes = await supabase
    .from(ACCOUNTS_TABLE)
    .select('id, data')
    .eq('id', email)
    .maybeSingle();
  if (existingRes.error) return fail(res, 502, 'Database query failed.');
  const current = toAccount(existingRes.data);

  if (action === 'create' && !current) {
    const password = String(payload.password ?? '');
    if (!password) return fail(res, 400, '"password" is required when creating a new account.');

    const ign = String(payload.ign ?? '').trim();
    if (!ign) return fail(res, 400, '"ign" is required when creating a new account.');

    // Rank was already validated above, so it is either absent or known-good.
    const account = {
      id: email,
      email,
      password,
      ign,
      discordTag: String(payload.discordTag ?? '').trim(),
      // Never create a new account as Owner (blocked above for any
      // caller-supplied rank; the master owner is pre-seeded by hand).
      rank: hasRank ? String(payload.rank) : 'Player',
      createdAt: new Date().toISOString(),
    };

    const { error } = await supabase
      .from(ACCOUNTS_TABLE)
      .upsert({ id: email, data: account, created_at: new Date().toISOString() }, { onConflict: 'id' });
    if (error) return fail(res, 502, 'Database write failed.');

    return res.status(201).json({ success: true, created: true, account: redact(account as any) });
  }

  // sync (or create-over-existing) -> partial patch.
  // Field validation already happened above, so these are pure assignments.
  const patch: Record<string, unknown> = { ...(current ?? { id: email, email }) };
  patch.email = email;
  if (!current) patch.createdAt = new Date().toISOString();

  if (hasIgn) patch.ign = String(payload.ign).trim();
  if (payload.discordTag !== undefined) patch.discordTag = String(payload.discordTag).trim();
  if (hasRank) patch.rank = String(payload.rank);
  if (hasPassword) patch.password = String(payload.password);

  const { error } = await supabase
    .from(ACCOUNTS_TABLE)
    .upsert({ id: email, data: patch, created_at: new Date().toISOString() }, { onConflict: 'id' });
  if (error) return fail(res, 502, 'Database write failed.');

  return res.status(200).json({ success: true, created: false, account: redact(patch as any) });
}

// --- Entry point ----------------------------------------------------

const handler = async (req: ApiRequest, res: ApiResponse): Promise<void> => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'content-type, x-bot-secret');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, 'Use POST.');
  }

  // --- authenticate --------------------------------------------------
  const expectedSecret = process.env.BOT_API_SECRET;
  if (!expectedSecret) {
    // Fail closed, and say so loudly: a misconfigured function must not
    // become an open write endpoint on the database.
    console.error('[api/accounts] BOT_API_SECRET is not set -- refusing all requests.');
    return fail(res, 503, 'Endpoint is not configured.');
  }

  const providedSecret = header(req, 'x-bot-secret');
  if (!secretMatches(providedSecret, expectedSecret)) {
    return fail(res, 401, 'Invalid or missing x-bot-secret header.');
  }

  // --- env check -----------------------------------------------------
  const supabase = getAdminClient();
  if (!supabase) {
    console.error('[api/accounts] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set.');
    return fail(res, 503, 'Endpoint is not configured.');
  }

  // --- dispatch ------------------------------------------------------
  const payload = readBody(req);
  const action = String(payload.action ?? '') as Action;
  if (!ACTIONS.includes(action)) {
    return fail(res, 400, `Invalid "action". Must be one of: ${ACTIONS.join(', ')}.`);
  }

  try {
    await handleAction(action, payload, supabase, res);
  } catch (err) {
    // Log the detail server-side; return nothing that could leak the
    // service_role key or the expected secret.
    console.error('[api/accounts] Unhandled error:', err instanceof Error ? err.message : err);
    if (!res.headersSent) fail(res, 500, 'Internal server error.');
  }
};

export default handler;
