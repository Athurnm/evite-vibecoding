import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    try {
        const result = await sql`
      CREATE TABLE IF NOT EXISTS rsvp (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        guests INTEGER,
        attendance VARCHAR(50),
        wishes TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
        return response.status(200).json({ result });
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}
