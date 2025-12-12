/**
 * Supabase Admin Client
 *
 * Uses the service role key for server-side operations.
 * This client bypasses Row Level Security (RLS).
 * Only use in server-side code (API routes, server components).
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false },
      }
    );
  }
  return _supabaseAdmin;
}

export const supabaseAdmin = {
  from: (table: string) => getSupabaseAdmin().from(table),
};
