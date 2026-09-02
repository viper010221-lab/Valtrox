import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Player, TestResult, Tester, StaffMember, Announcement, ServerConfig, UserAccount } from '../types';

// ====================================================================
// Supabase-backed shared database.
// Each collection lives in its own Postgres table. Rows store the FULL
// app object in a `data` jsonb column keyed by `id`. This keeps deeply
// nested fields (player.tiers, player.tierHistory) intact automatically.
//
// Any admin's writes land in Supabase, so every other admin/visitor on
// any device reads the same shared data.

export interface SupabaseDatabasePayload {
  players: Player[];
  testResults: TestResult[];
  testers: Tester[];
  staff: StaffMember[];
  announcements: Announcement[];
  serverConfig?: ServerConfig;
  accounts?: UserAccount[];
}

const DB_TABLE: Record<keyof SupabaseDatabasePayload, string> = {
  players: 'players',
  testResults: 'test_results',
  testers: 'testers',
  staff: 'staff',
  announcements: 'announcements',
  serverConfig: 'server_config',
  accounts: 'accounts',
};

const SINGLE_ROW_TABLES = new Set(['server_config']);

/** Reads one table. For single-row tables, returns [] unless exactly a row exists with a `data` object. */
async function readTable(table: string): Promise<any[]> {
  const { data, error } = await supabase
    .from(table)
    .select('id, data')
    .order('created_at', { ascending: true });
  if (error) throw error;
  if (!data) return [];
  return data.map((row: any) => (typeof row.data === 'object' && row.data !== null ? { ...row.data, id: row.id } : row.data)).filter((d: any) => !!d);
}

/** Upserts an array of app records into a table (INSERT ... ON CONFLICT id). */
async function writeTable(table: string, rows: any[]): Promise<boolean> {
  if (!rows || rows.length === 0) return true;
  const conflictCol = SINGLE_ROW_TABLES.has(table) ? 'id' : 'id';
  const toInsert = rows.map((r: any) => ({
    id: r.id,
    data: r,
    created_at: new Date().toISOString(),
  }));
  const { error } = await supabase
    .from(table)
    .upsert(toInsert, { onConflict: conflictCol });
  return !error;
}

/** Fetches the latest shared database — visible to ALL admins & devices. */
export async function fetchSupabaseDatabase(): Promise<{ success: boolean; data?: SupabaseDatabasePayload; message?: string }> {
  try {
    if (!isSupabaseConfigured()) return { success: false, message: 'Supabase not configured.' };
    const [players, testResults, testers, staff, announcements, serverConfigArr, accounts] = await Promise.all([
      readTable('players'),
      readTable('test_results'),
      readTable('testers'),
      readTable('staff'),
      readTable('announcements'),
      readTable('server_config'),
      readTable('accounts'),
    ]);
    const serverConfig = serverConfigArr[0] as ServerConfig | undefined;
    return {
      success: true,
      data: {
        players,
        testResults,
        testers,
        staff,
        announcements,
        serverConfig,
        accounts: accounts || [],
      },
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error fetching Supabase database.' };
  }
}

/** Persists changed collections to Supabase so every admin sees them immediately. */
export async function saveSupabaseDatabase(data: SupabaseDatabasePayload): Promise<{ success: boolean; message: string }> {
  try {
    if (!isSupabaseConfigured()) return { success: true, message: 'Supabase not configured — skipping remote save.' };
    let allOk = true;
    const tasks: Promise<boolean>[] = [];
    if (data.players) tasks.push(writeTable('players', data.players));
    if (data.testResults) tasks.push(writeTable('test_results', data.testResults));
    if (data.testers) tasks.push(writeTable('testers', data.testers));
    if (data.staff) tasks.push(writeTable('staff', data.staff));
    if (data.announcements) tasks.push(writeTable('announcements', data.announcements));
    if (data.serverConfig) tasks.push(writeTable('server_config', [{ ...data.serverConfig, id: 'default' }]));
    if (data.accounts && data.accounts.length) tasks.push(writeTable('accounts', data.accounts));
    const results = await Promise.all(tasks);
    allOk = results.every(Boolean);
    return allOk
      ? { success: true, message: 'Shared database synchronized via Supabase ✅' }
      : { success: false, message: 'Some tables failed to sync to Supabase.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to save to Supabase.' };
  }
}

let saveTimer: any = null;

/** Debounced background push so rapid edits don't hammer the API. */
export function queueSupabaseSave(data: SupabaseDatabasePayload) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveSupabaseDatabase(data).catch((err) => console.warn('Supabase save error:', err));
  }, 900);
}