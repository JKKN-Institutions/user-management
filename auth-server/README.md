# JKKN Google OAuth Authentication Server

A Node.js Express server implementing Google OAuth2 Sign-In with domain restriction for `@jkkn.ac.in` accounts.

## Features

- Google OAuth2 authentication using `google-auth-library`
- Domain restriction to `@jkkn.ac.in` accounts only
- PostgreSQL session storage with secure tokens
- HttpOnly, SameSite cookies for session management
- CSRF protection via state parameter
- 30-day session lifetime
- User account linking (existing users by email get Google ID linked)

## Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- Google Cloud Console project with OAuth2 credentials

## Quick Start

### 1. Clone and Install Dependencies

```bash
cd auth-server
npm install
```

### 2. Set Up Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth client ID**
5. Select **Web application**
6. Add authorized redirect URI: `http://localhost:3001/auth/google/callback`
7. Copy the Client ID and Client Secret

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your values
```

Required environment variables:

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | OAuth2 Client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth2 Client Secret |
| `GOOGLE_CALLBACK_URL` | Full callback URL (e.g., `http://localhost:3001/auth/google/callback`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `COOKIE_SECRET` | Random 32+ character string for signing cookies |
| `PORT` | Server port (default: 3001) |
| `NODE_ENV` | `development` or `production` |
| `ALLOWED_DOMAIN` | Allowed email domain (default: `jkkn.ac.in`) |

Generate a secure cookie secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Set Up Database

Ensure your PostgreSQL database has the `users` table with at least these columns:
- `id` (uuid, primary key)
- `email` (text, unique)
- `google_id` (text, nullable, unique)
- `full_name` (text, nullable)
- `avatar_url` (text, nullable)

Run the migrations to create the sessions table:

```bash
# Using psql directly
psql $DATABASE_URL -f migrations.sql

# Or using npm script (requires psql in PATH)
npm run migrate
```

### 5. Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will start at `http://localhost:3001`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Home page with sign-in button |
| GET | `/auth/google` | Initiates OAuth flow |
| GET | `/auth/google/callback` | OAuth callback handler |
| GET | `/dashboard` | Protected dashboard (requires auth) |
| GET | `/api/me` | Returns current user JSON (requires auth) |
| POST | `/logout` | Ends session and clears cookie |
| GET | `/logout` | Convenience logout (demo only) |

## File Structure

```
auth-server/
├── package.json        # Dependencies and scripts
├── .env.example        # Environment variable template
├── db.js              # PostgreSQL connection pool
├── server.js          # Express app and routes
├── migrations.sql     # Database schema
├── README.md          # This file
└── public/
    ├── index.html     # Sign-in page
    ├── dashboard.html # Protected dashboard
    └── error.html     # Error pages
```

## Security Features

1. **Session Tokens**: Generated using `crypto.randomBytes(32)` (256-bit entropy)
2. **Cookie Security**:
   - `HttpOnly`: Prevents JavaScript access
   - `SameSite=Lax`: CSRF protection
   - `Secure`: HTTPS-only in production
3. **State Parameter**: CSRF protection for OAuth flow (stored in signed cookie)
4. **Domain Restriction**: Validates both `hd` claim and email suffix
5. **Parameterized Queries**: All SQL uses parameterized queries to prevent injection

## Production Considerations

### What to Change for Production

1. **HTTPS Required**
   - Deploy behind a reverse proxy (nginx, Cloudflare) with TLS
   - The `Secure` cookie flag is automatically enabled when `NODE_ENV=production`

2. **State Parameter Storage**
   - Currently uses signed cookies
   - For production, consider storing in Redis/database with short TTL

3. **Session Management**
   - Add periodic cleanup job for expired sessions (`cleanup_expired_sessions()` function is provided)
   - Consider implementing "logout all devices" functionality

4. **Rate Limiting**
   - Add rate limiting middleware (e.g., `express-rate-limit`)
   - Protect `/auth/google` endpoint against abuse

5. **Logging & Monitoring**
   - Replace `console.log` with structured logging (e.g., Winston, Pino)
   - Add APM monitoring (e.g., Sentry, DataDog)

6. **Error Handling**
   - Implement proper error pages
   - Don't expose stack traces in production

7. **CORS**
   - If API is accessed from different domains, configure CORS properly

8. **Database**
   - Use connection pooling (already configured)
   - Consider read replicas for high traffic
   - Set up automated backups

### Environment Variables Checklist

```bash
# Production .env
NODE_ENV=production
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/google/callback
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require
COOKIE_SECRET=<64-char-random-hex>
PORT=3001
ALLOWED_DOMAIN=jkkn.ac.in
```

## Troubleshooting

### "redirect_uri_mismatch" Error
- Ensure the callback URL in Google Cloud Console matches `GOOGLE_CALLBACK_URL` exactly
- Include the full path: `http://localhost:3001/auth/google/callback`

### "Access Denied" for Valid Users
- Verify the user's email domain is `@jkkn.ac.in`
- Check that `ALLOWED_DOMAIN` is set correctly

### Database Connection Errors
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check firewall/network access

### Session Not Persisting
- Verify `COOKIE_SECRET` is set
- Check browser isn't blocking cookies
- Ensure the domain matches between pages

## License

MIT
