import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from './api/model/user.model.js';

dotenv.config();

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@shelterseeker.com' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Create admin user
        const hashedPassword = bcryptjs.hashSync('admin123', 10);
        const adminUser = new User({
            username: 'admin',
            email: 'admin@shelterseeker.com',
            password: hashedPassword,
            role: 'admin',
            isBanned: false,
            trustPoints: 100,
            trustedSeller: true,
        });

        await adminUser.save();
        console.log('Admin user created successfully!');
        console.log('Email: admin@shelterseeker.com');
        console.log('Password: admin123');
        console.log('Role: admin');

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

createAdmin();

