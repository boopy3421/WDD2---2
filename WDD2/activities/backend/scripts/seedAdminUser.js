import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const adminDefaults = {
    username: process.env.ADMIN_USERNAME || 'admin',
    email: process.env.ADMIN_EMAIL || 'admin@shopflow.com',
    password: process.env.ADMIN_PASSWORD || 'Admin12345',
    role: 'Admin',
};

const seedAdminUser = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is missing in .env');
    }

    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email: adminDefaults.email });

    if (existing) {
        existing.username = adminDefaults.username;
        existing.password = adminDefaults.password;
        existing.role = 'Admin';
        await existing.save();
        console.log(`Admin account updated: ${existing.email}`);
    } else {
        const created = await User.create(adminDefaults);
        console.log(`Admin account created: ${created.email}`);
    }

    await mongoose.connection.close();
};

seedAdminUser()
    .then(() => {
        console.log('Admin seeding complete.');
        process.exit(0);
    })
    .catch(async (error) => {
        console.error(`Admin seeding failed: ${error.message}`);
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
        process.exit(1);
    });
