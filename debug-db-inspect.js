import getPool from './api/_lib/db.js';
// Mock response object to avoid crashing if db.js uses it (it doesn't seems to)
// and strict env loading

import dotenv from 'dotenv';
dotenv.config();

async function run() {
    const pool = getPool();
    try {
        console.log("--- TABLES ---");
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log(tables.rows.map(r => r.table_name));

        console.log("\n--- COLUMNS in 'rsvp' ---");
        try {
            const columns = await pool.query(`
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns 
                WHERE table_name = 'rsvp'
            `);
            console.table(columns.rows);
        } catch (e) {
            console.log("Table 'rsvp' might not exist or error querying it.");
        }

    } catch (e) {
        console.error("DB Error:", e);
    } finally {
        await pool.end();
    }
}
run();
