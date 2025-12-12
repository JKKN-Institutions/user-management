/**
 * POST /api/auth/logout
 *
 * Logs out the user by deleting the session from database
 * and clearing the session cookie.
 */

import { NextResponse } from 'next/server';
import {
  getSessionToken,
  deleteSession,
  clearSessionCookie,
} from '@/lib/session';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST() {
  try {
    const token = await getSessionToken();

    if (token) {
      // Delete session from database
      await deleteSession(token);
    }

    // Clear session cookie
    await clearSessionCookie();

    // Redirect to login page
    return NextResponse.redirect(new URL('/login', APP_URL), {
      status: 303, // See Other - appropriate for POST redirect
    });
  } catch (error) {
    console.error('Logout error:', error);

    // Still clear cookie and redirect even if DB delete fails
    await clearSessionCookie();

    return NextResponse.redirect(new URL('/login', APP_URL), {
      status: 303,
    });
  }
}
