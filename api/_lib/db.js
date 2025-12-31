import pkg from 'pg';
const { Pool } = pkg;

let pool;

export default function getPool() {
    if (pool) return pool;

    let connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error('Database configuration missing. check POSTGRES_URL or DATABASE_URL.');
    }

    // Workaround: Vercel/Neon sometimes append ?sslmode=require which conflicts with our manual config
    // We prefer manual config to force rejectUnauthorized: false
    if (connectionString.includes('?sslmode=require')) {
        connectionString = connectionString.split('?')[0];
    }

    pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        },
        max: 1
    });

    return pool;
}
