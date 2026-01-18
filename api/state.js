import getPool from './_lib/db.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ error: 'Name parameter is required' });
    }

    try {
        const pool = getPool();
        const result = await pool.query('SELECT * FROM rsvp_submissions WHERE name = $1', [name]);

        let state = {
            rsvp: null,
            registry: null
        };

        if (result.rows.length > 0) {
            const row = result.rows[0];
            state.rsvp = {
                name: row.name, // Should match query
                attendance: row.attendance,
                guests: row.guests,
                adults: row.adults,
                children: row.children,
                wishes: row.wishes
            };

            if (row.gift_item_name) {
                state.registry = {
                    item_name: row.gift_item_name
                };
            }
        }

        return res.status(200).json(state);
    } catch (error) {
        console.error('State API Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
