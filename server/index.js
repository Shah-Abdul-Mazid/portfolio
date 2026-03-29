import express from 'express';
import nodemailer from 'nodemailer';
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

// Nodemailer Transporter Helper
async function sendAutoReply(email, name, req_phone, req_query) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        console.log('Skipping auto-reply: Gmail credentials not configured in .env.');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        family: 4, // Force IPv4
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: `"Portfolio Support" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Thank you for your message!',
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 20px auto; padding: 40px; border: 1px solid #eee; border-top: 4px solid #007bff; color: #333; line-height: 1.6; background-color: #fff;">
                <h2 style="font-weight: 700; font-size: 24px; margin-top: 0; color: #333;">Hello ${name},</h2>
                <p style="margin-bottom: 24px; font-size: 16px;">I hope this email finds you well!</p>
                <p style="margin-bottom: 24px; font-size: 16px;">This is an automated confirmation to let you know that I've successfully received your message through my portfolio's contact form.</p>
                <p style="margin-bottom: 24px; font-size: 16px;">I truly appreciate you reaching out and will get back to you as soon as possible.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 32px 0;">
                <p style="margin: 0; color: #666; font-size: 16px;">Best regards,</p>
                <p style="margin: 4px 0 0 0; font-weight: 700; color: #333; font-size: 18px;">Shah Abdul Mazid</p>
            </div>
        `
    };

    console.log(`✉️ Preparing auto-reply for: ${name} (${email})`);

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Auto-reply sent successfully to ${email}`);
    } catch (error) {
        console.error('❌ Error sending auto-reply:', error);
    }
}

// API Endpoints
// Post message
app.post('/api/messages', async (req, res) => {
    console.log('📩 Incoming message request:', req.body);
    try {
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();
        console.log('✅ Message saved to MongoDB:', savedMessage._id);
        
        // Trigger emails in background
        sendAutoReply(req.body.email, req.body.name, req.body.phone, req.body.query).catch(console.error);
        
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

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`🚀 Backend server running at http://localhost:${port}`);
    });
}

export default app;
