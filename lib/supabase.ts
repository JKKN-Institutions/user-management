/**
 * Supabase Admin Client
 *
 * Uses the service role key for server-side operations.
 * This client bypasses Row Level Security (RLS).
 * Only use in server-side code (API routes, server components).
 */

import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false },
  }
);
