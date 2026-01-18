import fs from 'fs';
import pkg from 'pg';
const { Pool } = pkg;

// Load .env manually
const envPath = './.env';
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            // simple parsing, removing quotes if present
            let val = parts.slice(1).join('=').trim();
            if (val.startsWith('"') && val.endsWith('"')) {
                val = val.slice(1, -1);
            }
            process.env[key] = val;
        }
    });
}

async function run() {
    let connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("No connection string found in .env");
        return;
    }

    if (connectionString.includes('?sslmode=require')) {
        connectionString = connectionString.split('?')[0];
    }

    const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        max: 1
    });

    try {
        console.log("--- TABLES ---");
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log(tables.rows.map(r => r.table_name));

        const rsvpTable = tables.rows.find(t => t.table_name === 'rsvp');
        if (rsvpTable) {
            console.log("\n--- COLUMNS in 'rsvp' ---");
            const columns = await pool.query(`
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns 
                WHERE table_name = 'rsvp'
            `);
            console.table(columns.rows);
        } else {
            console.log("Table 'rsvp' does not exist.");
        }

    } catch (e) {
        console.error("DB Error:", e);
    } finally {
        await pool.end();
    }
}

run();
