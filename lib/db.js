import pkg from 'pg';
const { Pool } = pkg;

// Create a singleton pool
// Vercel/Supabase will provide POSTGRES_URL or DATABASE_URL
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('Missing POSTGRES_URL or DATABASE_URL environment variable');
}

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false // Required for Vercel/Supabase usually
    },
    max: 1 // Vercel Serverless implies ephemeral, keep connection count low
});

export default pool;
