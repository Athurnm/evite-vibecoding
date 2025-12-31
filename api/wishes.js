import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    if (request.method !== 'GET') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { rows } = await sql`
        SELECT name, wishes 
        FROM rsvp 
        WHERE wishes IS NOT NULL AND wishes != '' 
        ORDER BY timestamp DESC 
        LIMIT 20
    `;
        return response.status(200).json(rows);
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}
