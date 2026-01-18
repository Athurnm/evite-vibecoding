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
