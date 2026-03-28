import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Mongoose Schema
const MessageSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    query: String,
    createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema, process.env.atlas_COLLECTION_NAME || 'messages');

// Connection Helper (Cached)
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) return cachedDb;
    
    const opts = {
        dbName: process.env.atlas_DB_NAME || 'portfolio_data'
    };
    
    cachedDb = await mongoose.connect(process.env.atlas_URL, opts);
    return cachedDb;
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        await connectToDatabase();

        if (req.method === 'POST') {
            const { name, email, phone, query } = req.body;
            const newMessage = new Message({ name, email, phone, query });
            await newMessage.save();
            return res.status(201).json({ success: true, message: 'Message sent successfully!' });
        }

        if (req.method === 'GET') {
            const messages = await Message.find().sort({ createdAt: -1 });
            return res.status(200).json(messages);
        }

        if (req.method === 'DELETE') {
            const { id } = req.query;
            await Message.findByIdAndDelete(id);
            return res.status(200).json({ success: true, message: 'Message deleted!' });
        }

        res.status(405).json({ message: 'Method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
