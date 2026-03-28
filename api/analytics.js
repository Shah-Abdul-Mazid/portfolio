import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Analytics Schema
const AnalyticsSchema = new mongoose.Schema({
    pageViews: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
});

const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema, 'analytics');

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
            // Track visitor
            let stats = await Analytics.findOne();
            if (!stats) {
                stats = new Analytics({ pageViews: 1 });
            } else {
                stats.pageViews += 1;
                stats.lastUpdated = new Date();
            }
            await stats.save();
            return res.status(200).json({ success: true, count: stats.pageViews });
        }

        if (req.method === 'GET') {
            const stats = await Analytics.findOne();
            return res.status(200).json({ count: stats ? stats.pageViews : 0 });
        }

        res.status(405).json({ message: 'Method not allowed' });
    } catch (error) {
        console.error('Analytics API Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
