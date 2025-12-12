-- ============================================================================
-- Google OAuth Authentication - Database Migrations
-- ============================================================================
-- Run this file against your PostgreSQL database:
--   psql $DATABASE_URL -f migrations.sql
-- Or manually execute in your database client
-- ============================================================================

-- Note: This migration assumes the public.users table already exists.
-- If it doesn't, uncomment and customize the users table creation below.

-- ============================================================================
-- OPTIONAL: Users table (uncomment if needed)
-- ============================================================================
/*
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  google_id text UNIQUE,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Index for faster Google ID lookups
CREATE INDEX IF NOT EXISTS idx_users_google_id ON public.users(google_id);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
*/

-- ============================================================================
-- Sessions table (required)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_token text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone NOT NULL
);

-- Index for faster session token lookups (critical for auth middleware performance)
CREATE INDEX IF NOT EXISTS idx_sessions_token ON public.sessions(session_token);

-- Index for cleaning up expired sessions
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON public.sessions(expires_at);

-- Index for finding sessions by user (useful for "logout all devices" feature)
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);

-- ============================================================================
-- Cleanup function for expired sessions (optional but recommended)
-- ============================================================================
-- This function deletes sessions that have expired.
-- You can call it periodically via a cron job or pg_cron extension.

CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.sessions
  WHERE expires_at < now();

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Example: Upsert user on Google Sign-In
-- ============================================================================
-- This is the pattern used in server.js for creating/updating users.
-- It handles three cases:
--   1. User exists with matching google_id -> update profile
--   2. User exists with matching email but no google_id -> link google_id
--   3. New user -> create new row
--
-- Example usage (for reference, actual implementation is in server.js):
/*
INSERT INTO public.users (email, google_id, full_name, avatar_url, updated_at)
VALUES ($1, $2, $3, $4, now())
ON CONFLICT (google_id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = now()
RETURNING id;
*/

-- ============================================================================
-- Grant permissions (adjust as needed for your database user)
-- ============================================================================
-- GRANT SELECT, INSERT, UPDATE, DELETE ON public.sessions TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE ON public.users TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
