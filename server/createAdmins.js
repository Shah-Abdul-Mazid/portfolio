import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Fix Path to generic .env in root
dotenv.config({ path: path.resolve('..', '.env') });

const atlasURL = process.env.atlas_URL;
const adminCollection = process.env.atlas_ADMIN_COLLECTION || 'admin_db';

const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed
    role: { type: String, default: 'superadmin' },
    created_at: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', AdminSchema, adminCollection);

async function createInitialAdmins() {
    try {
        console.log(`Connecting to MongoDB Atlas...`);
        await mongoose.connect(atlasURL, { dbName: process.env.atlas_DB_NAME });
        console.log('✅ Connected to DB');

        const adminsToCreate = [
            {
                email: 'admin@portfolio.com',
                password: 'admin2026@'
            },
            {
                email: 'shahabdulmazid@portfolio.com',
                password: 'shahabdul2026@'
            }
        ];

        for (const adminData of adminsToCreate) {
            const existingAdmin = await Admin.findOne({ email: adminData.email });
            if (existingAdmin) {
                console.log(`⚠️ Admin ${adminData.email} already exists.`);
                continue;
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminData.password, salt);

            const newAdmin = new Admin({
                email: adminData.email,
                password: hashedPassword
            });

            await newAdmin.save();
            console.log(`✅ Successfully created admin: ${adminData.email}`);
        }

    } catch (error) {
        console.error('❌ Error creating admins:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from DB');
    }
}

createInitialAdmins();
