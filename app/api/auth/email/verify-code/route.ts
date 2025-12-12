/**
 * Verify Code API
 *
 * POST /api/auth/email/verify-code
 * Body: { email: string, code: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyCode, isAllowedEmailDomain } from '@/lib/verification';
import { supabaseAdmin } from '@/lib/supabase';
import { createSession, setSessionCookie } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedCode = code.trim();

    // Validate domain
    if (!isAllowedEmailDomain(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email domain' }, { status: 403 });
    }

    // Verify the code
    const isValid = await verifyCode(normalizedEmail, normalizedCode);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 401 });
    }

    // Find or create user
    const user = await findOrCreateUserByEmail(normalizedEmail);

    // Create session
    const { token, expiresAt } = await createSession(user.id);
    await setSessionCookie(token, expiresAt);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      },
      redirectTo: '/dashboard',
    });
  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}

/**
 * Find existing user by email or create a new one
 */
async function findOrCreateUserByEmail(email: string) {
  // Check if user exists
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (existingUser) {
    return existingUser;
  }

  // Create new user
  const { data: newUser, error } = await supabaseAdmin
    .from('users')
    .insert({
      email,
      role: 'user',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return newUser;
}
