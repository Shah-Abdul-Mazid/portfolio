import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'portfolio', // Assumed name
  password: 'admin',
  port: 5432,
});

// Create table if not exists (Simplified for local setup)
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                query TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS analytics (
                id TEXT PRIMARY KEY,
                count INTEGER DEFAULT 0
            );
            INSERT INTO analytics (id, count) VALUES ('total_views', 0) ON CONFLICT (id) DO NOTHING;
        `);
        console.log('Database initialized successfully.');
    } catch (err) {
        console.error('Database initialization failed:', err.message);
    }
};

initDB();

// API Endpoints
app.post('/api/messages', async (req, res) => {
    const { name, email, phone, query } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO messages (name, email, phone, query) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, phone, query]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error saving message:', err.message);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

app.get('/api/messages', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching messages:', err.message);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

app.post('/api/analytics/track', async (req, res) => {
    try {
        await pool.query('UPDATE analytics SET count = count + 1 WHERE id = $1', ['total_views']);
        const result = await pool.query('SELECT count FROM analytics WHERE id = $1', ['total_views']);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error tracking visit:', err.message);
        res.status(500).json({ error: 'Failed to track visit' });
    }
});

app.get('/api/analytics', async (req, res) => {
    try {
        const result = await pool.query('SELECT count FROM analytics WHERE id = $1', ['total_views']);
        res.json(result.rows[0] || { count: 0 });
    } catch (err) {
        console.error('Error fetching analytics:', err.message);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

app.delete('/api/messages/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM messages WHERE id = $1', [req.params.id]);
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting message:', err.message);
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
