import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas Connection
const atlasURL = process.env.atlas_URL;

mongoose.connect(atlasURL, { dbName: process.env.atlas_DB_NAME })
    .then(() => console.log(`✅ Connected to MongoDB Database: ${process.env.atlas_DB_NAME}`))
    .catch(err => console.error('❌ MongoDB Connection Error:', err.message));

// Error handling for the process
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

// Schemas & Models
const MessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    query: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema, process.env.atlas_COLLECTION_NAME);

const AnalyticsSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    count: { type: Number, default: 0 }
});

const Analytics = mongoose.model('Analytics', AnalyticsSchema);

// API Endpoints
// Post message
app.post('/api/messages', async (req, res) => {
    console.log('📩 Incoming message request:', req.body);
    try {
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();
        console.log('✅ Message saved to MongoDB:', savedMessage._id);
        res.status(201).json(savedMessage);
    } catch (err) {
        console.error('Error saving message:', err.message);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// Get all messages
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ created_at: -1 });
        res.json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err.message);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Track page view
app.post('/api/analytics/track', async (req, res) => {
    try {
        const result = await Analytics.findOneAndUpdate(
            { id: 'total_views' },
            { $inc: { count: 1 } },
            { upsert: true, new: true }
        );
        res.json(result);
    } catch (err) {
        console.error('Error tracking visit:', err.message);
        res.status(500).json({ error: 'Failed to track visit' });
    }
});

// Get total views
app.get('/api/analytics', async (req, res) => {
    try {
        const result = await Analytics.findOne({ id: 'total_views' });
        res.json(result || { count: 0 });
    } catch (err) {
        console.error('Error fetching analytics:', err.message);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// Delete a message
app.delete('/api/messages/:id', async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting message:', err.message);
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

app.listen(port, () => {
    console.log(`🚀 Backend server running at http://localhost:${port}`);
});
