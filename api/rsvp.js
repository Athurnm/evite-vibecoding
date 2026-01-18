import getPool from './_lib/db.js';
import { createObjectCsvStringifier } from 'csv-writer';

export default async function handler(request, response) {
    let pool;
    try {
        pool = getPool();
    } catch (e) {
        return response.status(500).json({ error: e.message });
    }

    if (request.method === 'POST') {
        // Submit RSVP
        const { name, guests, adults, children, attendance, wishes } = request.body;

        if (!name || !attendance) {
            return response.status(400).json({ error: 'Name and attendance are required' });
        }

        try {
            // Upsert into rsvp_submissions (State)
            const query = `
                INSERT INTO rsvp_submissions (name, guests, adults, children, attendance, wishes, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, NOW())
                ON CONFLICT (name) 
                DO UPDATE SET 
                    guests = EXCLUDED.guests,
                    adults = EXCLUDED.adults,
                    children = EXCLUDED.children,
                    attendance = EXCLUDED.attendance,
                    wishes = EXCLUDED.wishes,
                    updated_at = NOW();
            `;
            await pool.query(query, [name, guests, adults, children, attendance, wishes]);

            // Optional: Also insert into historical 'rsvp' table if you want to keep a log of every click
            // But for now, let's focus on the new requirement.

            return response.status(200).json({ message: 'RSVP submitted successfully' });
        } catch (error) {
            return response.status(500).json({ error: error.message });
        }
    }

    if (request.method === 'GET' && request.url.includes('download')) {
        // Export CSV
        try {
            const result = await pool.query('SELECT * FROM rsvp ORDER BY timestamp DESC');
            const rows = result.rows;

            const csvStringifier = createObjectCsvStringifier({
                header: [
                    { id: 'id', title: 'ID' },
                    { id: 'name', title: 'Name' },
                    { id: 'guests', title: 'Total Guests' },
                    { id: 'adults', title: 'Adults' },
                    { id: 'children', title: 'Children' },
                    { id: 'attendance', title: 'Attendance' },
                    { id: 'wishes', title: 'Wishes' },
                    { id: 'timestamp', title: 'Timestamp' }
                ]
            });

            const header = csvStringifier.getHeaderString();
            const records = csvStringifier.stringifyRecords(rows);

            response.setHeader('Content-Type', 'text/csv');
            response.setHeader('Content-Disposition', 'attachment; filename=\"rsvp_data.csv\"');
            return response.send(header + records);
        } catch (error) {
            return response.status(500).json({ error: error.message });
        }
    }

    // Handle default GET
    return response.status(405).json({ error: 'Method not allowed' });
}
