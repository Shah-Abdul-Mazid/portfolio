import express from 'express';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const Message = mongoose.model('Message', MessageSchema, process.env.atlas_COLLECTION_NAME2 || 'messages');

const AnalyticsSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    count: { type: Number, default: 0 }
});

const Analytics = mongoose.model('Analytics', AnalyticsSchema);

const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'superadmin' },
    created_at: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', AdminSchema, process.env.atlas_COLLECTION_NAME1 || 'admin_db');

// Portfolio CMS Content Schema
const PortfolioContentSchema = new mongoose.Schema({
    key: { type: String, default: 'main', unique: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    updated_at: { type: Date, default: Date.now }
});
const PortfolioContent = mongoose.model('PortfolioContent', PortfolioContentSchema, process.env.atlas_COLLECTION_NAME3 || 'portfolio_content');

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// EmailJS API Helper
async function sendAutoReply(email, name, req_phone, req_query) {
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;

    if (!publicKey || !serviceId || !templateId) {
        console.log('Skipping auto-reply: EmailJS credentials not fully configured in env.');
        return;
    }

    console.log(`✉️ Sending EmailJS auto-reply to: ${name} (${email})`);

    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service_id: serviceId,
                template_id: templateId,
                user_id: publicKey,
                accessToken: privateKey,
                template_params: {
                    to_name: name,
                    to_email: email
                }
            })
        });

        if (response.ok) {
            console.log(`✅ Auto-reply sent successfully via EmailJS to ${email}`);
        } else {
            const errText = await response.text();
            console.error('❌ EmailJS Error:', errText);
        }
    } catch (error) {
        console.error('❌ Error hitting EmailJS API:', error);
    }
}

// API Endpoints

// ── PORTFOLIO CMS DATA ────────────────────────────────────────────
// GET public portfolio data (used by frontend to load latest content)
app.get('/api/portfolio', async (req, res) => {
    try {
        const doc = await PortfolioContent.findOne({ key: 'main' });
        if (!doc) return res.json(null); // null = use default data
        res.json(doc.data);
    } catch (err) {
        console.error('Error fetching portfolio data:', err.message);
        res.status(500).json({ error: 'Failed to fetch portfolio data' });
    }
});

// POST save portfolio data (admin only)
app.post('/api/portfolio', authMiddleware, async (req, res) => {
    try {
        const doc = await PortfolioContent.findOneAndUpdate(
            { key: 'main' },
            { data: req.body, updated_at: new Date() },
            { upsert: true, new: true }
        );
        console.log('✅ Portfolio data saved to MongoDB');
        res.json({ success: true, updated_at: doc.updated_at });
    } catch (err) {
        console.error('Error saving portfolio data:', err.message);
        res.status(500).json({ error: 'Failed to save portfolio data' });
    }
});

// Post message
app.post('/api/messages', async (req, res) => {
    console.log('📩 Incoming message request:', req.body);
    try {
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();
        console.log('✅ Message saved to MongoDB:', savedMessage._id);
        
        // Trigger emails in background (non-blocking) so the UI doesn't hang
        sendAutoReply(req.body.email, req.body.name, req.body.phone, req.body.query)
            .then(() => console.log('Background email process finished.'))
            .catch(console.error);
        
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

// ── ADMIN AUTHENTICATION ────────────────────────────────────────────
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);
        
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
        );

        res.json({ success: true, token, admin: { email: admin.email, role: admin.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/admin/register', authMiddleware, async (req, res) => {
    try {
        const { email, password } = req.body;

        const existing = await Admin.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Admin with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({ email, password: hashedPassword });
        await newAdmin.save();

        res.json({ success: true, message: 'Admin created successfully' });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/api/admin/list', authMiddleware, async (req, res) => {
    try {
        const admins = await Admin.find({}, '-password').sort({ created_at: -1 });
        res.json({ success: true, data: admins });
    } catch (error) {
        console.error('List admins error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
    });
}

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Unified server running at http://0.0.0.0:${port}`);
});

export default app;
