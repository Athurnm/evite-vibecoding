import { getDoc } from './api/_lib/google.js';

async function debug() {
    try {
        const doc = await getDoc();
        const sheet = doc.sheetsByIndex[0];
        await sheet.loadHeaderRow();
        console.log("Headers found:", sheet.headerValues);

        const rows = await sheet.getRows();
        if (rows.length > 0) {
            console.log("First row data keys:", Object.keys(rows[0])); // Might not show all direct keys if using internal storage
            console.log("First row raw data:", rows[0]._rawData);
            // Try fetching specific columns to see what works
            console.log("Item Name:", rows[0].get('Item Name'));
            // Check for the problematic column
            const purchaseHeader = sheet.headerValues.find(h => h.includes('Purchased'));
            console.log(`Found purchase header: '${purchaseHeader}'`);
            console.log("Value:", rows[0].get(purchaseHeader));
        }
    } catch (e) {
        console.error(e);
    }
}

debug();
