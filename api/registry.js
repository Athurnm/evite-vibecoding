import { getDoc } from './_lib/google.js';

export default async function handler(req, res) {
    try {
        const doc = await getDoc();
        const sheet = doc.sheetsByIndex[0];

        // Define the header with newline exactly as found in the sheet
        const PURCHASE_HEADER = 'Purchased \n(TRUE/FALSE)';

        if (req.method === 'GET') {
            const rows = await sheet.getRows();

            // Expected Headers: 
            // ID | Item Name | Purchased By | Priority | Link to purchase | Notes... | Purchased \n(TRUE/FALSE)

            const items = rows.reduce((acc, row) => {
                const name = row.get('Item Name');
                const purchasedStatus = row.get(PURCHASE_HEADER);

                // Check if already purchased (TRUE)
                // Case-insensitive check for "TRUE"
                const isPurchased = purchasedStatus && purchasedStatus.toString().toUpperCase().includes('TRUE');

                // Include if NOT purchased
                if (name && !isPurchased) {
                    acc.push({
                        item: name,
                        link: row.get('Link to purchase')
                    });
                }
                return acc;
            }, []);

            return res.status(200).json(items);
        }

        if (req.method === 'POST') {
            const { item, sender } = req.body;
            if (!item || !sender) {
                return res.status(400).json({ error: 'Missing item or sender' });
            }

            const rows = await sheet.getRows();

            // Find the item
            const row = rows.find(r => r.get('Item Name') === item);

            if (row) {
                const purchasedStatus = row.get(PURCHASE_HEADER);
                const isPurchased = purchasedStatus && purchasedStatus.toString().toUpperCase().includes('TRUE');

                if (isPurchased) {
                    return res.status(400).json({ error: 'Item already purchased' });
                }

                // Update Row
                row.assign({
                    'Purchased By': sender,
                    [PURCHASE_HEADER]: 'TRUE'
                });
                await row.save();
                return res.status(200).json({ success: true, message: 'Updated existing item' });
            } else {
                // Custom Gift ("Other")
                // Generate 6-char random alphanumeric ID
                const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();

                await sheet.addRow({
                    'ID': randomId,
                    'Item Name': item,
                    'Purchased By': sender,
                    [PURCHASE_HEADER]: 'TRUE',
                    'Notes include other relevant infos': 'Custom items added via website'
                });
                return res.status(200).json({ success: true, message: 'Added custom item' });
            }
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Registry API Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
