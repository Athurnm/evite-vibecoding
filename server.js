import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createObjectCsvStringifier } from 'csv-writer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(join(__dirname, 'dist'))); // Serve built assets in production

// Database Setup
const db = new sqlite3.Database('./rsvp.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS rsvp (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            guests INTEGER,
            attendance TEXT,
            wishes TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// API Routes

// 1. Submit RSVP
app.post('/api/rsvp', (req, res) => {
    const { name, guests, attendance, wishes } = req.body;
    const sql = `INSERT INTO rsvp (name, guests, attendance, wishes) VALUES (?, ?, ?, ?)`;

    db.run(sql, [name, guests, attendance, wishes], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'RSVP submitted successfully', id: this.lastID });
    });
});

// 2. Get Wishes (Limit 20, Latest First)
app.get('/api/wishes', (req, res) => {
    const sql = `SELECT name, wishes FROM rsvp WHERE wishes IS NOT NULL AND wishes != '' ORDER BY timestamp DESC LIMIT 20`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// 3. Download RSVP Data (CSV)
app.get('/api/rsvp/download', (req, res) => {
    const sql = `SELECT * FROM rsvp`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const csvStringifier = createObjectCsvStringifier({
            header: [
                { id: 'id', title: 'ID' },
                { id: 'name', title: 'Name' },
                { id: 'guests', title: 'Guests' },
                { id: 'attendance', title: 'Attendance' },
                { id: 'wishes', title: 'Wishes' },
                { id: 'timestamp', title: 'Timestamp' }
            ]
        });

        const header = csvStringifier.getHeaderString();
        const records = csvStringifier.stringifyRecords(rows);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=\"rsvp_data.csv\"');
        res.send(header + records);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
