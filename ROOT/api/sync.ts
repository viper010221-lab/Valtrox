// ====================================================================
// Whole-dataset sync  ->  POST /api/sync
// ====================================================================
// Lets the Discord bot push its full state of the competitive data to the
// website. The bot is the source of truth for these fields; the website
// only reads.
//
// SCOPE -- what this endpoint may write
//   accounts, players, test_results, testers, staff
//
// DELIBERATELY NOT WRITABLE: `announcements` and `server_config`. Those
// drive site chrome and config, so a bot bug must not be able to rewrite
// them. Manage those from the admin panel.
//
// SECURITY MODEL
//   - Same shared-secret auth as /api/accounts (`x-bot-secret`, compared in
//     constant time).
//   - service_role stays server-side; never returned to the bot.
//   - Passwords are stripped from every response, and never echoed back
//     in a diff.
//   - `dryRun: true` reports what WOULD change without writing anything.
//     Use this first.
//
// MERGE, NOT REPLACE (default)
//   Records are matched by id and merged field-by-field. A record the bot
//   omits is left completely untouched, so a partial sync can never delete
//   rows the bot doesn't know about.
//
//   PROTECTED FIELDS: `tiers` and `tierHistory` on a player are only
//   overwritten when the incoming record explicitly contains them as
//   objects. An absent or non-object value is ignored and the stored
//   competitive record is preserved. This is the difference between a bot
//   sync and the loss of every player's testing history.
//
// REPLACE MODE (`replace: true`)
//   Deletes rows absent from the payload. Powerful, and the only mode that
//   can remove records. Requires `confirmReplace: true` as well, so it
//   cannot happen by accident.
//
// EXAMPLE
//   curl -X POST https://bedrockunion.vercel.app/api/sync \
//        -H 'content-type: application/json' \
//        -H "x-bot-secret: $BOT_API_SECRET" \
//        -d '{"dryRun":true,"collections":{"players":[ ... ]}}'
// ====================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { timingSafeEqual } from 'node:crypto';

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
  readonly headersSent?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Bot-facing collection name -> physical table name.
const TABLE_BY_COLLECTION: Record<string, string> = {
  accounts: 'accounts',
  players: 'players',
  testResults: 'test_results',
  testers: 'testers',
  staff: 'staff',
};

// Tables this endpoint refuses to touch no matter what is sent.
const PROTECTED_TABLES = new Set(['announcements', 'server_config']);

// Per-collection row cap, to stop one bad payload from rewriting the site.
const MAX_ROWS_PER_COLLECTION = 5000;

/** Fields that hold a player's competitive record; never clobbered by accident. */
const PROTECTED_PLAYER_FIELDS = ['tiers', 'tierHistory'] as const;

const VALID_RANKS = [
  'Player', 'VIP', 'MVP', 'MVP+', 'MVP++',
  'Content Creator', 'Content Creator+',
  'Tier Tester', 'Bedrock Union Partner',
  'Moderator', 'Administrator', 'Developer', 'Owner',
];
const VALID_GAMEMODES = ['Bedfight', 'Skywars', 'Mace', 'Fireball Fight'];
const VALID_TIERS = [
  'HT1', 'MT1', 'LT1', 'HT2', 'MT2', 'LT2', 'HT3', 'MT3', 'LT3',
  'HT4', 'MT4', 'LT4', 'HT5', 'MT5', 'LT5', 'Unranked', 'Untested',
];

// --- Helpers --------------------------------------------------------

function header(req: ApiRequest, name: string): string {
  const raw = req.headers?.[name] ?? req.headers?.[name.toLowerCase()];
  return Array.isArray(raw) ? raw[0] ?? '' : raw ?? '';
}

/** Constant-time comparison; a plain === leaks the secret by response timing. */
function secretMatches(provided: string, expected: string): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

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

/** Fails closed: a missing key must never degrade to a public client. */
function getAdminClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Unwraps the `{ id, data, created_at }` row shape used by every table. */
function toRecord(row: { id: string; data: unknown }): Record<string, unknown> {
  if (row.data && typeof row.data === 'object') {
    return { ...(row.data as Record<string, unknown>), id: row.id };
  }
  return { id: row.id };
}

function stripPassword(record: Record<string, unknown>): Record<string, unknown> {
  const { password: _p, ...rest } = record;
  return rest;
}

/**
 * Shallow-ish equality on JSON. Used only to report "unchanged", so key
 * order must not produce false positives.
 */
function sameJson(a: unknown, b: unknown): boolean {
  try {
    return JSON.stringify(sortKeys(a)) === JSON.stringify(sortKeys(b));
  } catch {
    return false;
  }
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(value as object).sort()) {
      out[k] = sortKeys((value as Record<string, unknown>)[k]);
    }
    return out;
  }
  return value;
}

// --- Validation -----------------------------------------------------

/**
 * Validates and normalises one record for a collection.
 * Returns null when acceptable, or a human-readable reason to reject it.
 */
/** Either a normalised record, or a human-readable reason to reject it. */
interface Validated {
  ok: boolean;
  record?: Record<string, unknown>;
  reason?: string;
}

function validateRecord(collection: string, input: unknown): Validated {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, reason: 'record is not an object' };
  }
  const raw = { ...(input as Record<string, unknown>) };

  // Every collection needs a usable id.
  let id = String(raw.id ?? '').trim();
  if (!id) {
    if (collection === 'accounts' && raw.email) id = String(raw.email).trim().toLowerCase();
    else return { ok: false, reason: 'missing "id"' };
  }
  if (id.length > 200) return { ok: false, reason: '"id" is too long' };

  switch (collection) {
    case 'accounts': {
      const email = String(raw.email ?? id).trim().toLowerCase();
      if (!EMAIL_RE.test(email)) return { ok: false, reason: `invalid email "${email}"` };
      if (raw.password !== undefined && raw.password !== null) {
        const pw = String(raw.password);
        if (pw.length < 8) return { ok: false, reason: '"password" must be at least 8 characters' };
        raw.password = pw;
      }
      if (raw.rank !== undefined && !VALID_RANKS.includes(String(raw.rank))) {
        return { ok: false, reason: `invalid rank "${String(raw.rank)}"` };
      }
      raw.id = email;
      raw.email = email;
      // A bot sync must never mint an Owner.
      if (raw.rank === 'Owner') raw.rank = 'Administrator';
      return { ok: true, record: raw };
    }

    case 'players': {
      const ign = String(raw.ign ?? '').trim();
      if (!ign) return { ok: false, reason: 'missing "ign"' };
      raw.id = id;
      raw.ign = ign;
      if (raw.rank !== undefined && !VALID_RANKS.includes(String(raw.rank))) {
        return { ok: false, reason: `invalid rank "${String(raw.rank)}"` };
      }
      if (raw.status !== undefined && !['Active', 'Inactive', 'Banned'].includes(String(raw.status))) {
        return { ok: false, reason: `invalid status "${String(raw.status)}"` };
      }
      // Validate tiers when supplied as an object; otherwise preserve.
      if (raw.tiers !== undefined && raw.tiers !== null) {
        if (typeof raw.tiers !== 'object' || Array.isArray(raw.tiers)) {
          return { ok: false, reason: '"tiers" must be an object' };
        }
        const tiers = raw.tiers as Record<string, unknown>;
        for (const [gm, tr] of Object.entries(tiers)) {
          if (!VALID_GAMEMODES.includes(gm)) return { ok: false, reason: `unknown gamemode "${gm}"` };
          if (!VALID_TIERS.includes(String(tr))) return { ok: false, reason: `unknown tier "${String(tr)}" for ${gm}` };
        }
      }
      return { ok: true, record: raw };
    }

    case 'testResults': {
      if (raw.gamemode !== undefined && !VALID_GAMEMODES.includes(String(raw.gamemode))) {
        return { ok: false, reason: `unknown gamemode "${String(raw.gamemode)}"` };
      }
      for (const f of ['previousTier', 'newTier'] as const) {
        if (raw[f] !== undefined && !VALID_TIERS.includes(String(raw[f]))) {
          return { ok: false, reason: `unknown ${f} "${String(raw[f])}"` };
        }
      }
      raw.id = id;
      return { ok: true, record: raw };
    }

    case 'testers': {
      if (!String(raw.name ?? '').trim()) return { ok: false, reason: 'missing "name"' };
      raw.id = id;
      return { ok: true, record: raw };
    }

    case 'staff': {
      if (!String(raw.name ?? '').trim()) return { ok: false, reason: 'missing "name"' };
      if (raw.role !== undefined && !VALID_RANKS.includes(String(raw.role))) {
        return { ok: false, reason: `invalid role "${String(raw.role)}"` };
      }
      raw.id = id;
      return { ok: true, record: raw };
    }

    default:
      return { ok: false, reason: `unknown collection "${collection}"` };
  }
}

// --- Merge ----------------------------------------------------------

/**
 * Produces the row to store for one incoming record.
 *
 * `PROTECTED_PLAYER_FIELDS` are copied from the existing row unless the
 * incoming record provides them as real objects. This is what stops a
 * sync from erasing tier history.
 */
function mergeRecord(
  collection: string,
  incoming: Record<string, unknown>,
  existing: Record<string, unknown> | null
): Record<string, unknown> {
  if (!existing) {
    const fresh: Record<string, unknown> = { ...incoming };
    if (collection === 'players') {
      // A brand-new roster row needs a complete, renderable shape.
      fresh.points ??= 1000;
      fresh.region ??= 'NA';
      fresh.device ??= 'KBM';
      fresh.bio ??= 'Competitive Minecraft Bedrock player on Bedrock Union.';
      fresh.verified ??= true;
      fresh.status ??= 'Active';
      fresh.joinDate ??= new Date().toISOString().split('T')[0];
      fresh.matchesPlayed ??= 0;
      fresh.winRate ??= 0;
      fresh.scrimWins ??= 0;
      fresh.tourneyTrophies ??= 0;
      fresh.tierHistory ??= [];
      if (!fresh.tiers || typeof fresh.tiers !== 'object') {
        fresh.tiers = Object.fromEntries(VALID_GAMEMODES.map((g) => [g, 'Untested']));
      }
    }
    if (collection === 'accounts') fresh.createdAt ??= new Date().toISOString();
    return fresh;
  }

  const merged: Record<string, unknown> = { ...existing, ...incoming };

  if (collection === 'players') {
    for (const field of PROTECTED_PLAYER_FIELDS) {
      const value = incoming[field];
      const provided = value !== undefined && value !== null && typeof value === 'object';
      if (!provided) merged[field] = existing[field];
    }
    // Never let a sync demote or blank the owner's identity.
    if (String(existing.rank) === 'Owner' && incoming.rank !== undefined) {
      merged.rank = 'Owner';
    }
  }

  if (collection === 'accounts') {
    // Preserve an existing password when the bot does not send one.
    if (incoming.password === undefined || incoming.password === null) {
      merged.password = existing.password;
    }
    if (String(existing.rank) === 'Owner' && incoming.rank !== undefined) {
      merged.rank = 'Owner';
    }
    merged.createdAt ??= existing.createdAt;
  }

  return merged;
}

// --- Collection sync ------------------------------------------------

interface CollectionReport {
  table: string;
  received: number;
  created: number;
  updated: number;
  unchanged: number;
  deleted: number;
  rejected: Array<{ id: string; reason: string }>;
  protectedFieldsKept: number;
}

async function syncCollection(
  supabase: SupabaseClient,
  collection: string,
  rows: unknown[],
  opts: { dryRun: boolean; replace: boolean }
): Promise<CollectionReport> {
  const table = TABLE_BY_COLLECTION[collection];
  const report: CollectionReport = {
    table,
    received: rows.length,
    created: 0,
    updated: 0,
    unchanged: 0,
    deleted: 0,
    rejected: [],
    protectedFieldsKept: 0,
  };

  // Validate everything before writing anything.
  const accepted: Array<{ incoming: Record<string, unknown>; id: string }> = [];
  for (const row of rows) {
    const result = validateRecord(collection, row);
    const asRecord = (row ?? {}) as Record<string, unknown>;
    const rowLabel = String(asRecord.id ?? asRecord.email ?? asRecord.ign ?? '?');

    if (!result.ok || !result.record) {
      report.rejected.push({ id: rowLabel, reason: result.reason ?? 'invalid record' });
      continue;
    }
    accepted.push({ incoming: result.record, id: String(result.record.id ?? rowLabel) });
  }

  const existingRes = await supabase
    .from(table)
    .select('id, data')
    .order('created_at', { ascending: true });
  if (existingRes.error) throw new Error(`could not read ${table}: ${existingRes.error.message}`);

  const existingById = new Map<string, Record<string, unknown>>();
  for (const row of existingRes.data ?? []) {
    existingById.set(row.id, toRecord(row));
  }

  const writes: Array<{ id: string; data: Record<string, unknown> }> = [];
  const seenIds = new Set<string>();

  for (const { incoming, id } of accepted) {
    seenIds.add(id);
    const existing = existingById.get(id) ?? null;

    // Count protected fields that were ignored on this row.
    if (collection === 'players' && existing) {
      for (const field of PROTECTED_PLAYER_FIELDS) {
        const v = incoming[field];
        if (v === undefined || v === null || typeof v !== 'object') {
          report.protectedFieldsKept++;
        }
      }
    }

    const merged = mergeRecord(collection, incoming, existing);
    if (!existing) report.created++;
    else if (sameJson(stripPassword(existing), stripPassword(merged))) report.unchanged++;
    else report.updated++;

    if (!sameJson(stripPassword(existing ?? {}), stripPassword(merged))) {
      writes.push({ id, data: merged });
    }
  }

  // Replace mode: anything not in this payload is removed.
  const deletions: string[] = [];
  if (opts.replace) {
    for (const existingId of existingById.keys()) {
      if (!seenIds.has(existingId)) deletions.push(existingId);
    }
    report.deleted = deletions.length;
  }

  if (opts.dryRun) return report;

  if (writes.length) {
    const { error } = await supabase
      .from(table)
      .upsert(
        writes.map((w) => ({ id: w.id, data: w.data, created_at: new Date().toISOString() })),
        { onConflict: 'id' }
      );
    if (error) throw new Error(`write to ${table} failed: ${error.message}`);
  }

  if (deletions.length) {
    const { error } = await supabase
      .from(table)
      .delete()
      .in('id', deletions);
    if (error) throw new Error(`delete from ${table} failed: ${error.message}`);
  }

  return report;
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
    return res.status(405).json({ success: false, error: 'Use POST.' });
  }

  const expectedSecret = process.env.BOT_API_SECRET;
  if (!expectedSecret) {
    console.error('[api/sync] BOT_API_SECRET is not set -- refusing all requests.');
    return res.status(503).json({ success: false, error: 'Endpoint is not configured.' });
  }
  if (!secretMatches(header(req, 'x-bot-secret'), expectedSecret)) {
    return res.status(401).json({ success: false, error: 'Invalid or missing x-bot-secret header.' });
  }

  const supabase = getAdminClient();
  if (!supabase) {
    console.error('[api/sync] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set.');
    return res.status(503).json({ success: false, error: 'Endpoint is not configured.' });
  }

  const payload = readBody(req);
  const dryRun = payload.dryRun === true;
  const wantsReplace = payload.replace === true;

  // Replace mode can delete records, so demand an explicit second flag.
  if (wantsReplace && payload.confirmReplace !== true) {
    return res.status(400).json({
      success: false,
      error: 'Replace mode deletes records absent from the payload. Re-send with "confirmReplace": true to proceed.',
    });
  }

  const collections = payload.collections;
  if (!collections || typeof collections !== 'object' || Array.isArray(collections)) {
    return res.status(400).json({
      success: false,
      error: `"collections" object is required, e.g. {"collections":{"players":[...]}}. Writable: ${Object.keys(TABLE_BY_COLLECTION).join(', ')}.`,
    });
  }

  const entries = Object.entries(collections as Record<string, unknown>);
  if (!entries.length) {
    return res.status(400).json({ success: false, error: '"collections" is empty.' });
  }

  const unknown = entries.map(([k]) => k).filter((k) => !(k in TABLE_BY_COLLECTION));
  if (unknown.length) {
    return res.status(400).json({
      success: false,
      error: `Unknown collection(s): ${unknown.join(', ')}. Writable: ${Object.keys(TABLE_BY_COLLECTION).join(', ')}.`,
    });
  }

  // `announcements` and `server_config` are not in TABLE_BY_COLLECTION, so
  // the check above already rejects them. Named explicitly here so the
  // intent survives a future edit that adds them to the writable map.
  const blocked = entries.map(([k]) => k).filter((k) => PROTECTED_TABLES.has(k));
  if (blocked.length) {
    return res.status(403).json({
      success: false,
      error: `"${blocked.join(', ')}" cannot be written through this endpoint. Manage it from the admin panel.`,
    });
  }

  const reports: CollectionReport[] = [];
  for (const [collection, value] of entries) {
    const rows = Array.isArray(value) ? value : [];
    if (!Array.isArray(value)) {
      reports.push({
        table: TABLE_BY_COLLECTION[collection],
        received: 0,
        created: 0,
        updated: 0,
        unchanged: 0,
        deleted: 0,
        protectedFieldsKept: 0,
        rejected: [{ id: collection, reason: 'value must be an array of records' }],
      });
      continue;
    }
    if (rows.length > MAX_ROWS_PER_COLLECTION) {
      return res.status(413).json({
        success: false,
        error: `"${collection}" has ${rows.length} rows, above the ${MAX_ROWS_PER_COLLECTION} limit for a single sync.`,
      });
    }
    try {
      reports.push(await syncCollection(supabase, collection, rows, { dryRun, replace: wantsReplace }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      console.error(`[api/sync] ${collection} failed:`, message);
      return res.status(502).json({ success: false, error: `Sync failed on "${collection}".`, detail: message });
    }
  }

  const totals = reports.reduce(
    (acc, r) => ({
      created: acc.created + r.created,
      updated: acc.updated + r.updated,
      unchanged: acc.unchanged + r.unchanged,
      deleted: acc.deleted + r.deleted,
      rejected: acc.rejected + r.rejected.length,
    }),
    { created: 0, updated: 0, unchanged: 0, deleted: 0, rejected: 0 }
  );

  return res.status(200).json({
    success: true,
    dryRun,
    replace: wantsReplace,
    collections: reports,
    totals,
    // Never echo account passwords back to the bot.
    note: 'Account passwords are never returned.',
  });
};

export default handler;