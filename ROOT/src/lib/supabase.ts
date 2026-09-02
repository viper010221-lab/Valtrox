/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase client for client-side reads/writes.
// NOTE: the key is the `publishable`/ancn public key — intentionally public so browsers can read data.
// Row Level Security (RLS) policies gate what each role can read/write.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://vycjsyytldyxxvprukrr.supabase.co',
  supabaseUrl
    ? supabaseAnonKey || 'sb_publishable_jITqLqnli5zGD52m5M0NRA_C0_HDAI6'
    : 'sb_publishable_jITqLqnli5zGD52m5M0NRA_C0_HDAI6'
);

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseUrl.startsWith('https://') && supabaseAnonKey);
}