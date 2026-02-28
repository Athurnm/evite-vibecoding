import getPool from './_lib/db.js';
import { getRsvpDoc, syncRsvpToSheet } from './_lib/google.js';

export default async function handler(req, res) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { secret } = req.query;
    if (secret !== 'wedding123') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const doc = await getRsvpDoc();
        const sheet = doc.sheetsById[1439114200] || doc.sheetsByTitle['response'] || doc.sheetsByIndex[0];

        // 1. Initialize headers
        await sheet.setHeaderRow([
            'Name',
            'Attendance',
            'Total Guests',
            'Adults',
            'Children',
            'Wishes',
            'Gift Item',
            'Submitted At',
            'Updated At'
        ]);

        // 2. Fetch all existing RSVPs from the database
        const pool = getPool();
        const result = await pool.query('SELECT * FROM rsvp_submissions');

        let successCount = 0;

        // 3. Backfill to Google Sheets using our helper
        // Sequential processing prevents rate limits and handles finding rows reliably
        for (const row of result.rows) {
            await syncRsvpToSheet({
                name: row.name,
                attendance: row.attendance,
                guests: row.guests,
                adults: row.adults,
                children: row.children,
                wishes: row.wishes,
                gift_item_name: row.gift_item_name
            });
            successCount++;
        }

        return res.status(200).json({
            message: 'Sheet initialized and backfill complete',
            syncedRows: successCount
        });

    } catch (e) {
        console.error('Backfill Error:', e);
        return res.status(500).json({ error: e.message });
    }
}
