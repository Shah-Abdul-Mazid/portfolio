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
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Portfolio Support" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Thank you for your message!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-top: 5px solid #007bff;">
                <h2 style="color: #333;">Hello ${name},</h2>
                <p>I hope this email finds you well!</p>
                <p>This is an automated confirmation to let you know that I've successfully received your message through my portfolio's contact form.</p>
                <p>I truly appreciate you reaching out and will get back to you as soon as possible.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 14px; color: #777;">Best regards,<br><strong>Shah Abdul Mazid</strong></p>
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

    // Admin Notification
    const adminMailOptions = {
        from: `"Portfolio Notification" <${process.env.GMAIL_USER}>`,
        to: 'shahabdulmazid.ezan@yahoo.com',
        subject: `New Inquiry from ${name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-top: 5px solid #ffc107;">
                <h2 style="color: #333;">New Message Received</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${req_phone || 'N/A'}</p>
                <p><strong>Message:</strong></p>
                <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #ffc107; margin-top: 10px;">
                    ${req_query}
                </div>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #999;">This inquiry was sent from your portfolio contact form.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(adminMailOptions);
        console.log(`🚀 Admin Notification sent to Yahoo!`);
    } catch (error) {
        console.error('❌ Error sending admin notification:', error);
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
