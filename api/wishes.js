import getPool from './_lib/db.js';

export default async function handler(request, response) {
    if (request.method !== 'GET') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const pool = getPool();
        // Fetch valid wishes from the new persistent table
        const result = await pool.query('SELECT name, wishes FROM rsvp_submissions WHERE wishes IS NOT NULL AND wishes != \'\' ORDER BY updated_at DESC LIMIT 20');

        return response.status(200).json(result.rows);
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}
