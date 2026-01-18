import { getDoc } from './_lib/google.js';
import getPool from './_lib/db.js';

export default async function handler(req, res) {
    try {
        const doc = await getDoc();
        const sheet = doc.sheetsByIndex[0];
        const PURCHASE_HEADER = 'Purchased \n(TRUE/FALSE)';
        const pool = getPool();

        if (req.method === 'GET') {
            const rows = await sheet.getRows();
            const { name } = req.query; // Current user

            // Fetch User's DB State to know what they own
            let userOwnedItem = null;
            if (name) {
                const dbRes = await pool.query('SELECT gift_item_name FROM rsvp_submissions WHERE name = $1', [name]);
                if (dbRes.rows.length > 0) {
                    userOwnedItem = dbRes.rows[0].gift_item_name;
                }
            }

            const items = rows.reduce((acc, row) => {
                const itemName = row.get('Item Name');
                const purchasedStatus = row.get(PURCHASE_HEADER);
                const isPurchased = purchasedStatus && purchasedStatus.toString().toUpperCase().includes('TRUE');
                const purchasedBy = row.get('Purchased By');

                // Logic:
                // 1. If it's NOT purchased -> Show it.
                // 2. If it IS purchased, but by THIS user (based on DB state or Sheet name match) -> Show it (so they can see they picked it).

                // Flexible check: matches DB record OR matches name in column
                const isOwnedByCurrentUser = (userOwnedItem && userOwnedItem === itemName) || (purchasedBy === name);

                if (itemName && (!isPurchased || isOwnedByCurrentUser)) {
                    acc.push({
                        item: itemName,
                        link: row.get('Link to purchase'),
                        selected: isOwnedByCurrentUser // Flag for frontend
                    });
                }
                return acc;
            }, []);

            return res.status(200).json(items);
        }

        if (req.method === 'POST') {
            const { item, sender } = req.body; // 'sender' is the name key
            if (!item || !sender) {
                return res.status(400).json({ error: 'Missing item or sender' });
            }

            const rows = await sheet.getRows();

            // 1. Release previous item if any
            // Check DB for previous selection
            const dbRes = await pool.query('SELECT gift_item_name FROM rsvp_submissions WHERE name = $1', [sender]);
            const previousItemName = dbRes.rows.length > 0 ? dbRes.rows[0].gift_item_name : null;

            if (previousItemName && previousItemName !== item) {
                // Find and release in Sheet
                const prevRow = rows.find(r => r.get('Item Name') === previousItemName);
                if (prevRow) {
                    prevRow.assign({
                        'Purchased By': '',
                        [PURCHASE_HEADER]: 'FALSE'
                    });
                    await prevRow.save();
                }
            }

            // 2. Claim New Item
            // Check if it's "Other" (Custom)
            const isCustom = (item === 'other') || !rows.some(r => r.get('Item Name') === item);

            if (isCustom) {
                // For "Other", we usually just add a new row. 
                // But if they are changing "Other" to "Other", we might just add another? 
                // Or we accept it. Let's follow existing logic for custom item creation.
                // NOTE: Existing logic generated ID.

                // If they are submitting a custom item, `item` itself might be the custom text?
                // In main.js: if item === 'other', item = custom_item (the text).

                // So here 'item' IS the custom text.
                const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
                await sheet.addRow({
                    'ID': randomId,
                    'Item Name': item,
                    'Purchased By': sender,
                    [PURCHASE_HEADER]: 'TRUE',
                    'Notes include other relevant infos': 'Custom items added via website'
                });

            } else {
                // Existing Item
                const targetRow = rows.find(r => r.get('Item Name') === item);
                if (targetRow) {
                    const status = targetRow.get(PURCHASE_HEADER);
                    const isTaken = status && status.toString().toUpperCase().includes('TRUE');
                    const currentOwner = targetRow.get('Purchased By');

                    // Allow if not taken OR taken by self
                    if (isTaken && currentOwner !== sender) {
                        return res.status(400).json({ error: 'Item already purchased by someone else.' });
                    }

                    targetRow.assign({
                        'Purchased By': sender,
                        [PURCHASE_HEADER]: 'TRUE'
                    });
                    await targetRow.save();
                }
            }

            // 3. Update DB State
            // ensure row exists in rsvp_submissions or created
            const query = `
                INSERT INTO rsvp_submissions (name, gift_item_name, updated_at)
                VALUES ($1, $2, NOW())
                ON CONFLICT (name) 
                DO UPDATE SET 
                    gift_item_name = EXCLUDED.gift_item_name,
                    updated_at = NOW();
            `;
            await pool.query(query, [sender, item]);

            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Registry API Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
