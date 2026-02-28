import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function getDoc() {
    // 1. Load Environment Variables
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!email || !privateKey || !sheetId) {
        throw new Error('Missing required Google Sheets Environment Variables (EMAIL, KEY, or SHEET_ID)');
    }

    // 2. Initialize Auth
    const auth = new JWT({
        email: email,
        key: privateKey.replace(/\\n/g, '\n'), // Important: Handle escaped newlines from Env Vars
        scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
        ],
    });

    // 3. Load Document
    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();
    return doc;
}

export async function getRsvpDoc() {
    // 1. Load Environment Variables
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_RSVP_SHEET_ID;

    if (!email || !privateKey || !sheetId) {
        throw new Error('Missing required Google Sheets Environment Variables (EMAIL, KEY, or GOOGLE_RSVP_SHEET_ID)');
    }

    // 2. Initialize Auth
    const auth = new JWT({
        email: email,
        key: privateKey.replace(/\\n/g, '\n'), // Important: Handle escaped newlines from Env Vars
        scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
        ],
    });

    // 3. Load Document
    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();
    return doc;
}

export async function syncRsvpToSheet(data) {
    try {
        const doc = await getRsvpDoc();
        // Target the specific sheet ID "1439114200" or title "response"
        const sheet = doc.sheetsById[1439114200] || doc.sheetsByTitle['response'] || doc.sheetsByIndex[0];

        await sheet.loadHeaderRow();

        const rows = await sheet.getRows();
        const existingRow = rows.find(r => r.get('Name') === data.name);

        const now = new Date().toISOString();

        if (existingRow) {
            // Update existing row
            existingRow.assign({
                'Attendance': data.attendance !== undefined ? data.attendance : existingRow.get('Attendance'),
                'Total Guests': data.guests !== undefined ? data.guests : existingRow.get('Total Guests'),
                'Adults': data.adults !== undefined ? data.adults : existingRow.get('Adults'),
                'Children': data.children !== undefined ? data.children : existingRow.get('Children'),
                'Wishes': data.wishes !== undefined ? data.wishes : existingRow.get('Wishes'),
                'Gift Item': data.gift_item_name !== undefined ? data.gift_item_name : existingRow.get('Gift Item'),
                'Updated At': now
            });
            await existingRow.save();
            console.log('Synced RSVP update to Sheets for:', data.name);
        } else {
            // Append new row
            await sheet.addRow({
                'Name': data.name,
                'Attendance': data.attendance || '',
                'Total Guests': data.guests || 0,
                'Adults': data.adults || 0,
                'Children': data.children || 0,
                'Wishes': data.wishes || '',
                'Gift Item': data.gift_item_name || '',
                'Submitted At': now,
                'Updated At': now
            });
            console.log('Synced new RSVP to Sheets for:', data.name);
        }
    } catch (e) {
        // Log but do not block request
        console.error('Failed to sync RSVP to Google Sheets:', e);
    }
}
