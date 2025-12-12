/**
 * Email Verification Code Management
 *
 * Handles verification code generation, storage, and validation.
 */

import crypto from 'crypto';
import { supabaseAdmin } from './supabase';

const CODE_LENGTH = 6;
const CODE_EXPIRY_MINUTES = 2;

/**
 * Generate a 6-digit verification code
 */
export function generateVerificationCode(): string {
  const code = crypto.randomInt(0, 1000000).toString().padStart(CODE_LENGTH, '0');
  return code;
}

/**
 * Get allowed domain from environment
 */
export function getAllowedDomain(): string {
  return process.env.ALLOWED_DOMAIN || 'jkkn.ac.in';
}

/**
 * Check if email domain is allowed
 */
export function isAllowedEmailDomain(email: string): boolean {
  const allowedDomain = getAllowedDomain();
  return email.toLowerCase().endsWith(`@${allowedDomain}`);
}

/**
 * Store a verification code in the database
 */
export async function createVerificationCode(email: string): Promise<string> {
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

  // Invalidate any existing unused codes for this email
  await supabaseAdmin
    .from('verification_codes')
    .update({ used_at: new Date().toISOString() })
    .eq('email', email.toLowerCase())
    .is('used_at', null);

  // Insert new code
  const { error } = await supabaseAdmin.from('verification_codes').insert({
    email: email.toLowerCase(),
    code,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    throw new Error(`Failed to create verification code: ${error.message}`);
  }

  return code;
}

/**
 * Verify a code and mark it as used
 * Returns true if the code is valid
 */
export async function verifyCode(email: string, code: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('verification_codes')
    .select('id, expires_at')
    .eq('email', email.toLowerCase())
    .eq('code', code)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data) {
    return false;
  }

  // Mark as used
  await supabaseAdmin
    .from('verification_codes')
    .update({ used_at: new Date().toISOString() })
    .eq('id', data.id);

  return true;
}

/**
 * Check rate limiting - max 3 codes per email per 10 minutes
 */
export async function checkRateLimit(email: string): Promise<boolean> {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const { count, error } = await supabaseAdmin
    .from('verification_codes')
    .select('*', { count: 'exact', head: true })
    .eq('email', email.toLowerCase())
    .gt('created_at', tenMinutesAgo.toISOString());

  if (error) {
    return false;
  }

  return (count || 0) < 3;
}

/**
 * Clean up expired verification codes (can be called periodically)
 */
export async function cleanupExpiredCodes(): Promise<void> {
  await supabaseAdmin
    .from('verification_codes')
    .delete()
    .lt('expires_at', new Date().toISOString());
}
