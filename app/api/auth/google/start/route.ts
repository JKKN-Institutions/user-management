/**
 * GET /api/auth/google/start
 *
 * Initiates Google OAuth2 flow.
 * Generates a state parameter for CSRF protection and redirects to Google.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { getGoogleAuthUrl } from '@/lib/auth';

export async function GET() {
  try {
    // Generate CSRF state token
    const state = crypto.randomBytes(16).toString('hex');

    // Store state in cookie for verification in callback
    const cookieStore = await cookies();
    cookieStore.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
      path: '/',
    });

    // Generate Google OAuth URL and redirect
    const authUrl = getGoogleAuthUrl(state);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error starting OAuth flow:', error);
    const errorMessage = error instanceof Error ? error.message : 'oauth_start_failed';
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorMessage)}`, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
    );
  }
}
