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
            const query = `
        INSERT INTO rsvp (name, guests, adults, children, attendance, wishes)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
            await pool.query(query, [name, guests, adults, children, attendance, wishes]);
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
