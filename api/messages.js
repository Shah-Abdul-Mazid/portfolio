import mongoose from "mongoose";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// 🔥 Fix SSL issue (self-signed certificate)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


// =======================
// 📦 MONGOOSE SCHEMA
// =======================
const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  query: String,
  createdAt: { type: Date, default: Date.now },
});

const Message =
  mongoose.models.Message ||
  mongoose.model(
    "Message",
    MessageSchema,
    process.env.atlas_COLLECTION_NAME || "messages"
  );


// =======================
// 🔗 DB CONNECTION (CACHED)
// =======================
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  if (!process.env.atlas_URL) {
    throw new Error("❌ MongoDB URL missing in ENV");
  }

  cachedDb = await mongoose.connect(process.env.atlas_URL, {
    dbName: process.env.atlas_DB_NAME || "portfolio_data",
  });

  console.log("✅ MongoDB Connected");
  return cachedDb;
}


// =======================
// ✉️ EMAIL FUNCTION
// =======================
async function sendAutoReply(email, name, req_phone, req_query) {
  try {
    // 🔍 ENV CHECK
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error("❌ Missing Gmail credentials");
      return { success: false };
    }

    // 🔍 INPUT CHECK
    if (!email || !name) {
      console.error("❌ Missing email or name");
      return { success: false };
    }

    console.log("✉️ Preparing auto-reply for:", name, `(${email})`);

    // 🔌 TRANSPORTER (FINAL FIXED)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      family: 4, // 👈 force IPv4
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // ✅ FIX self-signed error
      },
    });

    // 🔍 VERIFY SMTP
    console.log("🔄 Verifying SMTP...");
    await transporter.verify();
    console.log("✅ SMTP Ready");

    // ✉️ MAIL CONTENT
    const mailOptions = {
      from: `"Portfolio Support" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Thank you for your message!",
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
      `,
    };

    console.log("📤 Sending email...");

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.response);

    return { success: true };

  } catch (error) {
    console.error("❌ Email error:", error.message);
    return { success: false, error: error.message };
  }
}


// =======================
// 🚀 API HANDLER
// =======================
export default async function handler(req, res) {
  // 🌐 CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Content-Type"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    // =======================
    // 📩 POST (SAVE + EMAIL)
    // =======================
    if (req.method === "POST") {
      const { name, email, phone, query } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: "Name and email are required",
        });
      }

      console.log("📩 Incoming request:", { name, email });

      // 💾 Save to DB
      const newMessage = new Message({ name, email, phone, query });
      await newMessage.save();

      console.log("✅ Message saved to MongoDB");

      // ✉️ Send Email
      const emailResult = await sendAutoReply(
        email,
        name,
        phone,
        query
      );

      return res.status(201).json({
        success: true,
        message: "Message saved successfully",
        emailSent: emailResult.success,
      });
    }

    // =======================
    // 📥 GET
    // =======================
    if (req.method === "GET") {
      const messages = await Message.find().sort({ createdAt: -1 });
      return res.status(200).json(messages);
    }

    // =======================
    // 🗑 DELETE
    // =======================
    if (req.method === "DELETE") {
      const { id } = req.query;

      await Message.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: "Message deleted",
      });
    }

    return res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    console.error("❌ API Error:", error.message);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}