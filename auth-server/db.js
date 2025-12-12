/**
 * PostgreSQL Database Connection Pool
 *
 * Uses node-postgres (pg) with connection pooling for efficient database access.
 * All queries should use parameterized queries to prevent SQL injection.
 */

const { Pool } = require('pg');

// Create a connection pool using the DATABASE_URL environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Pool configuration
  max: 20,                    // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,   // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection cannot be established
});

// Log pool errors (don't crash the application)
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

/**
 * Execute a parameterized query
 * @param {string} text - SQL query with $1, $2, etc. placeholders
 * @param {Array} params - Array of parameter values
 * @returns {Promise<object>} - Query result
 */
async function query(text, params) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    // Log slow queries in development
    if (process.env.NODE_ENV === 'development' && duration > 100) {
      console.log('Slow query:', { text, duration: `${duration}ms`, rows: result.rowCount });
    }

    return result;
  } catch (error) {
    console.error('Database query error:', { text, error: error.message });
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 * Remember to release the client after use!
 * @returns {Promise<object>} - Pool client
 */
async function getClient() {
  const client = await pool.connect();
  const originalQuery = client.query.bind(client);
  const originalRelease = client.release.bind(client);

  // Track if client has been released
  let released = false;

  // Wrap release to prevent double-release
  client.release = () => {
    if (released) {
      console.warn('Client already released');
      return;
    }
    released = true;
    return originalRelease();
  };

  return client;
}

/**
 * Close all connections in the pool
 * Call this when shutting down the server
 */
async function close() {
  await pool.end();
}

module.exports = {
  query,
  getClient,
  close,
  pool, // Export pool for direct access if needed
};
