import pkg from 'pg';
const { Pool } = pkg;

let pool;

export default function getPool() {
    if (pool) return pool;

    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error('Database configuration missing. check POSTGRES_URL or DATABASE_URL.');
    }

    pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        },
        max: 1 // Serverless optimization
    });

    return pool;
}
