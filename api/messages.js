import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
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

// Nodemailer Transporter Helper
async function sendAutoReply(email, name, req_phone, req_query) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        console.log('Skipping auto-reply: Gmail credentials not configured.');
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
            
            // Trigger emails in background
            sendAutoReply(email, name, phone, query).catch(console.error);
            
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
