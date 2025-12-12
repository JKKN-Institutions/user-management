/**
 * Google OAuth2 Authentication Server
 *
 * Implements Google Sign-In with domain restriction for @jkkn.ac.in
 * Uses PostgreSQL for session storage with secure cookie handling.
 */

require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const db = require('./db');

const app = express();

// =============================================================================
// Configuration
// =============================================================================
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const ALLOWED_DOMAIN = process.env.ALLOWED_DOMAIN || 'jkkn.ac.in';
const SESSION_DURATION_DAYS = 30;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

if (!COOKIE_SECRET) {
  console.error('ERROR: COOKIE_SECRET environment variable is required');
  process.exit(1);
}

// Google OAuth2 configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
  console.error('ERROR: Google OAuth credentials not configured');
  console.error('Required: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL');
  process.exit(1);
}

// Initialize Google OAuth2 client
const oauth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL
);

// =============================================================================
// Middleware
// =============================================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET)); // Signed cookies for state parameter
app.use(express.static(path.join(__dirname, 'public')));

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Generate a cryptographically secure random token
 * @param {number} bytes - Number of random bytes (default 32)
 * @returns {string} - Hex-encoded random string
 */
function generateSecureToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Set session cookie with secure options
 * @param {object} res - Express response object
 * @param {string} token - Session token
 * @param {Date} expiresAt - Cookie expiration date
 */
function setSessionCookie(res, token, expiresAt) {
  res.cookie('session_token', token, {
    httpOnly: true,                           // Prevent XSS access
    secure: NODE_ENV === 'production',        // HTTPS only in production
    sameSite: 'lax',                          // CSRF protection
    expires: expiresAt,                       // Match session expiration
    path: '/',                                // Available on all routes
  });
}

/**
 * Clear session cookie
 * @param {object} res - Express response object
 */
function clearSessionCookie(res) {
  res.clearCookie('session_token', {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

/**
 * Verify if email domain is allowed
 * @param {string} email - User's email address
 * @param {string} hd - Google's hosted domain claim (if present)
 * @returns {boolean} - True if domain is allowed
 */
function isAllowedDomain(email, hd) {
  // Check Google's hosted domain claim first (most reliable)
  if (hd === ALLOWED_DOMAIN) {
    return true;
  }

  // Fallback: check email suffix
  if (email && email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`)) {
    return true;
  }

  return false;
}

/**
 * Create or update user in database
 * Handles three cases:
 *   1. User exists with matching google_id -> update profile
 *   2. User exists with matching email but no google_id -> link google_id
 *   3. New user -> create new row
 *
 * @param {object} profile - Google user profile
 * @returns {Promise<string>} - User ID (UUID)
 */
async function upsertUser(profile) {
  const { googleId, email, fullName, avatarUrl } = profile;

  // First, try to find existing user by google_id
  const existingByGoogleId = await db.query(
    `SELECT id FROM public.users WHERE google_id = $1`,
    [googleId]
  );

  if (existingByGoogleId.rows.length > 0) {
    // Case 1: User exists with google_id -> update profile
    const result = await db.query(
      `UPDATE public.users
       SET email = $1, full_name = $2, avatar_url = $3, updated_at = now()
       WHERE google_id = $4
       RETURNING id`,
      [email, fullName, avatarUrl, googleId]
    );
    return result.rows[0].id;
  }

  // Check if user exists by email (without google_id linked)
  const existingByEmail = await db.query(
    `SELECT id, google_id FROM public.users WHERE email = $1`,
    [email]
  );

  if (existingByEmail.rows.length > 0) {
    // Case 2: User exists with email -> link google_id
    const result = await db.query(
      `UPDATE public.users
       SET google_id = $1, full_name = $2, avatar_url = $3, updated_at = now()
       WHERE email = $4
       RETURNING id`,
      [googleId, fullName, avatarUrl, email]
    );
    return result.rows[0].id;
  }

  // Case 3: New user -> create
  const result = await db.query(
    `INSERT INTO public.users (email, google_id, full_name, avatar_url)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [email, googleId, fullName, avatarUrl]
  );
  return result.rows[0].id;
}

/**
 * Create a new session for a user
 * @param {string} userId - User's UUID
 * @returns {Promise<{token: string, expiresAt: Date}>} - Session token and expiration
 */
async function createSession(userId) {
  const token = generateSecureToken(32);

  const result = await db.query(
    `INSERT INTO public.sessions (user_id, session_token, expires_at)
     VALUES ($1, $2, now() + interval '${SESSION_DURATION_DAYS} days')
     RETURNING expires_at`,
    [userId, token]
  );

  return {
    token,
    expiresAt: new Date(result.rows[0].expires_at),
  };
}

/**
 * Get session and user from session token
 * @param {string} token - Session token from cookie
 * @returns {Promise<object|null>} - User object or null if invalid/expired
 */
async function getSessionUser(token) {
  if (!token) return null;

  const result = await db.query(
    `SELECT u.id, u.email, u.full_name, u.avatar_url, s.expires_at
     FROM public.sessions s
     JOIN public.users u ON u.id = s.user_id
     WHERE s.session_token = $1
       AND s.expires_at > now()`,
    [token]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

/**
 * Delete a session from database
 * @param {string} token - Session token to delete
 */
async function deleteSession(token) {
  await db.query(
    `DELETE FROM public.sessions WHERE session_token = $1`,
    [token]
  );
}

// =============================================================================
// Authentication Middleware
// =============================================================================

/**
 * Middleware to require authentication
 * Redirects to home page if not authenticated
 */
async function requireAuth(req, res, next) {
  const token = req.cookies.session_token;

  try {
    const user = await getSessionUser(token);

    if (!user) {
      clearSessionCookie(res);
      return res.redirect('/');
    }

    // Attach user to request for use in route handlers
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    clearSessionCookie(res);
    return res.redirect('/');
  }
}

// =============================================================================
// Routes
// =============================================================================

/**
 * GET / - Home page with Sign in button
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * GET /auth/google - Initiate OAuth flow
 * Generates state parameter for CSRF protection and redirects to Google
 */
app.get('/auth/google', (req, res) => {
  // Generate CSRF state token
  // NOTE: For production, consider storing state in a database or Redis
  // with a short TTL instead of a cookie, to prevent replay attacks
  const state = generateSecureToken(16);

  // Store state in signed cookie (expires in 10 minutes)
  res.cookie('oauth_state', state, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000, // 10 minutes
    signed: true,
  });

  // Generate Google OAuth URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',           // Get refresh token (optional)
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    state: state,                     // CSRF protection
    prompt: 'select_account',         // Always show account selector
    hd: ALLOWED_DOMAIN,               // Hint to show only domain accounts
  });

  res.redirect(authUrl);
});

/**
 * GET /auth/google/callback - OAuth callback
 * Exchanges code for tokens, verifies domain, creates session
 */
app.get('/auth/google/callback', async (req, res) => {
  const { code, state, error } = req.query;

  try {
    // Handle OAuth errors from Google
    if (error) {
      console.error('OAuth error from Google:', error);
      return res.redirect('/error.html?message=oauth_error');
    }

    // Verify state parameter (CSRF protection)
    const storedState = req.signedCookies.oauth_state;
    res.clearCookie('oauth_state');

    if (!state || !storedState || state !== storedState) {
      console.error('State mismatch:', { received: state, expected: storedState });
      return res.redirect('/error.html?message=invalid_state');
    }

    if (!code) {
      return res.redirect('/error.html?message=missing_code');
    }

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Verify ID token and get user info
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Extract user profile
    const profile = {
      googleId: payload.sub,
      email: payload.email,
      fullName: payload.name,
      avatarUrl: payload.picture,
      hd: payload.hd, // Hosted domain (if Google Workspace account)
    };

    // =========================================================================
    // DOMAIN RESTRICTION CHECK
    // =========================================================================
    if (!isAllowedDomain(profile.email, profile.hd)) {
      console.warn('Domain restriction: Access denied for', profile.email);
      return res.redirect(`/error.html?message=domain_restricted&email=${encodeURIComponent(profile.email)}`);
    }

    // Create or update user
    const userId = await upsertUser(profile);

    // Create session
    const session = await createSession(userId);

    // Set session cookie
    setSessionCookie(res, session.token, session.expiresAt);

    // Redirect to dashboard
    res.redirect('/dashboard');

  } catch (error) {
    console.error('OAuth callback error:', error);
    return res.redirect('/error.html?message=authentication_failed');
  }
});

/**
 * GET /dashboard - Protected dashboard page
 * Requires valid session
 */
app.get('/dashboard', requireAuth, (req, res) => {
  // For a simple implementation, serve the static HTML
  // In production, you might render a template with user data
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

/**
 * GET /api/me - Get current user info (JSON API)
 * Requires valid session
 */
app.get('/api/me', requireAuth, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    fullName: req.user.full_name,
    avatarUrl: req.user.avatar_url,
  });
});

/**
 * POST /logout - End session
 * Deletes session from database and clears cookie
 */
app.post('/logout', async (req, res) => {
  const token = req.cookies.session_token;

  try {
    if (token) {
      await deleteSession(token);
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Continue with logout even if DB delete fails
  }

  clearSessionCookie(res);
  res.redirect('/');
});

/**
 * GET /logout - Logout via GET (convenience, redirects to POST behavior)
 * NOTE: In production, logout should only be POST to prevent CSRF
 */
app.get('/logout', async (req, res) => {
  // For demo convenience, allow GET logout
  // In production, remove this route and only use POST
  const token = req.cookies.session_token;

  try {
    if (token) {
      await deleteSession(token);
    }
  } catch (error) {
    console.error('Logout error:', error);
  }

  clearSessionCookie(res);
  res.redirect('/');
});

// =============================================================================
// Error Handling
// =============================================================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// =============================================================================
// Server Startup
// =============================================================================
async function startServer() {
  try {
    // Test database connection
    const result = await db.query('SELECT NOW() as now');
    console.log('Database connected:', result.rows[0].now);

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${NODE_ENV}`);
      console.log(`Allowed domain: @${ALLOWED_DOMAIN}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down...');
  await db.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down...');
  await db.close();
  process.exit(0);
});

startServer();
