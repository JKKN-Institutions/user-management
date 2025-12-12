/**
 * Authentication Helper Functions
 *
 * Handles Google OAuth2 flow and user management using Supabase.
 */

import { OAuth2Client } from 'google-auth-library';
import { supabaseAdmin } from './supabase';

// Lazy-initialized Google OAuth2 client
let _oauth2Client: OAuth2Client | null = null;

function getOAuth2Client(): OAuth2Client {
  if (!_oauth2Client) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId) {
      throw new Error('GOOGLE_CLIENT_ID environment variable is not set');
    }
    if (!clientSecret) {
      throw new Error('GOOGLE_CLIENT_SECRET environment variable is not set');
    }
    if (!redirectUri) {
      throw new Error('GOOGLE_REDIRECT_URI environment variable is not set');
    }

    _oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
  }
  return _oauth2Client;
}

// Allowed domain for sign-in (lazy evaluated)
function getAllowedDomain(): string {
  return process.env.ALLOWED_DOMAIN || 'jkkn.ac.in';
}

/**
 * Google user profile from OAuth
 */
export interface GoogleProfile {
  googleId: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  hd?: string; // Hosted domain
}

/**
 * User from database
 */
export interface User {
  id: string;
  email: string;
  google_id: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role?: string;
}

/**
 * Generate Google OAuth authorization URL
 */
export function getGoogleAuthUrl(state: string): string {
  return getOAuth2Client().generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    state,
    prompt: 'select_account',
    hd: getAllowedDomain(),
  });
}

/**
 * Exchange authorization code for tokens and get user profile
 */
export async function getGoogleUserFromCode(code: string): Promise<GoogleProfile> {
  const client = getOAuth2Client();
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  if (!tokens.id_token) {
    throw new Error('No ID token received from Google');
  }

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Invalid ID token payload');
  }

  return {
    googleId: payload.sub,
    email: payload.email || '',
    fullName: payload.name || '',
    avatarUrl: payload.picture || '',
    hd: payload.hd,
  };
}

/**
 * Check if email domain is allowed
 */
export function isAllowedDomain(email: string, hd?: string): boolean {
  const allowedDomain = getAllowedDomain();
  if (hd === allowedDomain) {
    return true;
  }
  if (email && email.toLowerCase().endsWith(`@${allowedDomain}`)) {
    return true;
  }
  return false;
}

/**
 * Find or create user from Google profile
 * Returns the user object
 */
export async function findOrCreateUser(profile: GoogleProfile): Promise<User> {
  const { googleId, email, fullName, avatarUrl } = profile;

  // 1. Check if user exists by google_id
  const { data: userByGoogleId } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('google_id', googleId)
    .single();

  if (userByGoogleId) {
    // Update profile info and return
    await supabaseAdmin
      .from('users')
      .update({
        email,
        full_name: fullName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('google_id', googleId);

    return userByGoogleId;
  }

  // 2. Check if user exists by email (link google_id)
  const { data: userByEmail } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (userByEmail) {
    // Link Google ID to existing user
    await supabaseAdmin
      .from('users')
      .update({
        google_id: googleId,
        full_name: fullName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userByEmail.id);

    return { ...userByEmail, google_id: googleId };
  }

  // 3. Create new user
  const { data: newUser, error } = await supabaseAdmin
    .from('users')
    .insert({
      email,
      google_id: googleId,
      full_name: fullName,
      avatar_url: avatarUrl,
      role: 'user',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return newUser;
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, email, google_id, full_name, avatar_url, role')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}
