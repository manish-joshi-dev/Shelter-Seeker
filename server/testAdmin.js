import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './api/model/user.model.js';
import Listing from './api/model/listing.model.js';

dotenv.config();

const testAdminData = async () => {
    try {
        // Set default MongoDB connection if not provided
        const mongoUrl = process.env.MONGO || 'mongodb://localhost:27017/shelterseeker';
        console.log('Connecting to MongoDB...');
        console.log('MongoDB URL:', mongoUrl);
        
        // Connect to MongoDB
        await mongoose.connect(mongoUrl);
        console.log('✅ Connected to MongoDB successfully');

        // Count users
        const userCount = await User.countDocuments();
        console.log(`📊 Total users in database: ${userCount}`);

        // Count listings
        const listingCount = await Listing.countDocuments();
        console.log(`📊 Total listings in database: ${listingCount}`);

        // Get admin users
        const adminUsers = await User.find({ role: 'admin' }).select('username email role');
        console.log(`👑 Admin users:`, adminUsers);

        // Get some sample users
        const sampleUsers = await User.find().select('username email role').limit(5);
        console.log(`👥 Sample users:`, sampleUsers);

        // Get some sample listings
        const sampleListings = await Listing.find().select('name status').limit(5);
        console.log(`🏠 Sample listings:`, sampleListings);

    } catch (error) {
        console.error('❌ Error testing admin data:', error);
    } finally {
        try {
            await mongoose.disconnect();
            console.log('🔌 Disconnected from MongoDB');
        } catch (disconnectError) {
            console.error('Error disconnecting from MongoDB:', disconnectError);
        }
    }
};

testAdminData();

