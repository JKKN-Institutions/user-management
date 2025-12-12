/**
 * Session Management
 *
 * Handles session creation, validation, and deletion using Supabase.
 * Sessions are stored in Supabase with secure random tokens.
 */

import crypto from 'crypto';
import { cookies } from 'next/headers';
import { supabaseAdmin } from './supabase';
import { User } from './auth';

const SESSION_DURATION_DAYS = 30;
const SESSION_COOKIE_NAME = 'session_token';

/**
 * Session with user data
 */
export interface SessionWithUser {
  sessionId: string;
  userId: string;
  expiresAt: Date;
  user: User;
}

/**
 * Generate a cryptographically secure random token
 */
function generateSecureToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Create a new session for a user
 */
export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = generateSecureToken(32);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

  const { error } = await supabaseAdmin
    .from('sessions')
    .insert({
      user_id: userId,
      session_token: token,
      expires_at: expiresAt.toISOString(),
    });

  if (error) {
    throw new Error(`Failed to create session: ${error.message}`);
  }

  return {
    token,
    expiresAt,
  };
}

/**
 * Set session cookie
 */
export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
}

/**
 * Get session token from cookie
 */
export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Validate session token and return user data
 */
export async function validateSession(token: string): Promise<SessionWithUser | null> {
  if (!token) return null;

  // Get session from database
  const { data: session, error: sessionError } = await supabaseAdmin
    .from('sessions')
    .select('id, user_id, expires_at')
    .eq('session_token', token)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (sessionError || !session) {
    return null;
  }

  // Get user data
  const { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .select('id, email, google_id, full_name, avatar_url, role')
    .eq('id', session.user_id)
    .single();

  if (userError || !user) {
    return null;
  }

  return {
    sessionId: session.id,
    userId: session.user_id,
    expiresAt: new Date(session.expires_at),
    user: {
      id: user.id,
      email: user.email,
      google_id: user.google_id,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      role: user.role,
    },
  };
}

/**
 * Delete session from database
 */
export async function deleteSession(token: string): Promise<void> {
  await supabaseAdmin
    .from('sessions')
    .delete()
    .eq('session_token', token);
}

/**
 * Delete all sessions for a user
 */
export async function deleteAllUserSessions(userId: string): Promise<void> {
  await supabaseAdmin
    .from('sessions')
    .delete()
    .eq('user_id', userId);
}

/**
 * Get current session from cookie and validate
 */
export async function getCurrentSession(): Promise<SessionWithUser | null> {
  const token = await getSessionToken();
  if (!token) return null;
  return validateSession(token);
}
