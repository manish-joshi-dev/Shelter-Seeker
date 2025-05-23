import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './api/model/user.model.js';

dotenv.config();

const promoteToAdmin = async (email) => {
    try {
        // Set default MongoDB connection if not provided
        const mongoUrl = process.env.MONGO || 'mongodb://localhost:27017/shelterseeker';
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URL:', mongoUrl);
        
        // Connect to MongoDB
        await mongoose.connect(mongoUrl);
        console.log('✅ Connected to MongoDB successfully');

        // Find user by email
        console.log(`🔍 Looking for user with email: ${email}`);
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log('❌ User not found with email:', email);
            console.log('💡 Make sure the user has registered first before promoting to admin');
            console.log('💡 You can check existing users with: db.users.find({})');
            return;
        }

        console.log(`✅ Found user: ${user.username} (${user.email})`);
        console.log(`📊 Current role: ${user.role}`);
        console.log(`📊 Current trust points: ${user.trustPoints}`);

        // Check if user is already admin
        if (user.role === 'admin') {
            console.log('ℹ️ User is already an admin');
            console.log('📊 Admin details:');
            console.log('- Role: admin');
            console.log('- Trust Points:', user.trustPoints);
            console.log('- Trusted Seller:', user.trustedSeller);
            return;
        }

        // Update user role to admin
        console.log('🔄 Updating user to admin...');
        user.role = 'admin';
        user.trustPoints = 100; // Give full trust points
        user.trustedSeller = true; // Mark as trusted seller
        await user.save();

        console.log(`🎉 User ${email} has been promoted to admin successfully!`);
        console.log('📊 Updated user details:');
        console.log('- Role: admin');
        console.log('- Trust Points: 100');
        console.log('- Trusted Seller: true');
        console.log('- Username:', user.username);

    } catch (error) {
        console.error('❌ Error promoting user to admin:', error);
        console.error('Error details:', error.message);
    } finally {
        try {
            await mongoose.disconnect();
            console.log('🔌 Disconnected from MongoDB');
        } catch (disconnectError) {
            console.error('Error disconnecting from MongoDB:', disconnectError);
        }
    }
};

// Get email from command line argument
const email = process.argv[2];
if (!email) {
    console.log('Usage: node promoteToAdmin.js <email>');
    console.log('Example: node promoteToAdmin.js user@example.com');
    process.exit(1);
}

promoteToAdmin(email);
