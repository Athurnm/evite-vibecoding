import pool from '../lib/db.js';

export default async function handler(request, response) {
    if (request.method !== 'GET') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const query = `
        SELECT name, wishes 
        FROM rsvp 
        WHERE wishes IS NOT NULL AND wishes != '' 
        ORDER BY timestamp DESC 
        LIMIT 20
    `;
        const result = await pool.query(query);
        return response.status(200).json(result.rows);
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}
