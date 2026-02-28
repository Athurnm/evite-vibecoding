import { getDoc, syncRsvpToSheet } from './_lib/google.js';
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
            // Defensive: req.body may be a string in vercel dev
            let body = req.body;
            if (typeof body === 'string') {
                try {
                    body = JSON.parse(body);
                } catch (e) {
                    console.error('Failed to parse request body:', body);
                    return res.status(400).json({ error: 'Invalid JSON body' });
                }
            }

            const item = body?.item;
            const sender = body?.sender;

            console.log('Registry POST received:', { item, sender, bodyType: typeof req.body });

            if (!item || !sender) {
                console.error('Registration failed: Missing item or sender', { item, sender, body });
                return res.status(400).json({
                    error: 'Missing item or sender',
                    details: `Item: ${item ? 'Present' : 'Missing'}, Sender: ${sender ? 'Present' : 'Missing'}`
                });
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
            // Check if it's "Other" (Custom) — item won't exist in the sheet
            const existingRow = rows.find(r => r.get('Item Name') === item);

            if (!existingRow) {
                // Custom item: add a new row to the sheet (same format as existing items)
                const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();

                // Use the actual header values from the sheet to avoid newline mismatch
                const headerValues = sheet.headerValues;
                const purchaseHeaderActual = headerValues.find(h => h.toLowerCase().includes('purchased') && h.toLowerCase().includes('true'));

                const newRowData = {
                    'ID': randomId,
                    'Item Name': item,
                    'Purchased By': sender
                };

                // Set the purchase status using the actual header found in the sheet
                if (purchaseHeaderActual) {
                    newRowData[purchaseHeaderActual] = 'TRUE';
                } else {
                    // Fallback to the constant
                    newRowData[PURCHASE_HEADER] = 'TRUE';
                }

                // Add notes column if it exists
                const notesHeader = headerValues.find(h => h.toLowerCase().includes('notes'));
                if (notesHeader) {
                    newRowData[notesHeader] = 'Custom gift added via website';
                }

                console.log('Adding custom item to sheet:', newRowData);
                await sheet.addRow(newRowData);
                console.log('Custom item added successfully:', item);

            } else {
                // Existing Item — update the row in-place
                const status = existingRow.get(PURCHASE_HEADER);
                const isTaken = status && status.toString().toUpperCase().includes('TRUE');
                const currentOwner = existingRow.get('Purchased By');

                // Allow if not taken OR taken by self
                if (isTaken && currentOwner !== sender) {
                    return res.status(400).json({ error: 'Item already purchased by someone else.' });
                }

                existingRow.assign({
                    'Purchased By': sender,
                    [PURCHASE_HEADER]: 'TRUE'
                });
                await existingRow.save();
                console.log('Existing item claimed:', item, 'by:', sender);
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

            // Await the sync to Google Sheets (Vercel kills unawaited promises)
            await syncRsvpToSheet({
                name: sender,
                gift_item_name: item
            });

            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Registry API Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
