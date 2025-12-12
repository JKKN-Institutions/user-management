/**
 * GET /api/auth/google/callback
 *
 * Handles Google OAuth2 callback.
 * Exchanges code for tokens, validates domain, creates/updates user,
 * creates session, and redirects to dashboard.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getGoogleUserFromCode,
  isAllowedDomain,
  findOrCreateUser,
} from '@/lib/auth';
import { createSession, setSessionCookie } from '@/lib/session';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  try {
    // Handle OAuth errors from Google
    if (error) {
      console.error('OAuth error from Google:', error);
      return NextResponse.redirect(new URL('/login?error=oauth_cancelled', APP_URL));
    }

    // Verify state parameter (CSRF protection)
    const cookieStore = await cookies();
    const storedState = cookieStore.get('oauth_state')?.value;
    cookieStore.delete('oauth_state');

    if (!state || !storedState || state !== storedState) {
      console.error('State mismatch:', { received: state, expected: storedState });
      return NextResponse.redirect(new URL('/login?error=invalid_state', APP_URL));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=missing_code', APP_URL));
    }

    // Exchange code for tokens and get user profile
    const profile = await getGoogleUserFromCode(code);

    // Check domain restriction
    if (!isAllowedDomain(profile.email, profile.hd)) {
      console.warn('Domain restriction: Access denied for', profile.email);
      return NextResponse.redirect(new URL('/login?error=domain', APP_URL));
    }

    // Find or create user (now returns user object)
    const user = await findOrCreateUser(profile);

    // Create session using user.id
    const session = await createSession(user.id);

    // Set session cookie
    await setSessionCookie(session.token, session.expiresAt);

    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', APP_URL));
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(new URL('/login?error=authentication_failed', APP_URL));
  }
}
