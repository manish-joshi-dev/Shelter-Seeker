import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import Listing from './api/model/listing.model.js';

dotenv.config();

const testLocalInsightsFeature = async () => {
  try {
    console.log('🌱 Seeding database with test data...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO);
    
    // Clear existing listings
    await Listing.deleteMany({});
    
    // Create test listings with locations and reviews
    const testListings = [
      {
        name: 'Test Apartment 1',
        description: 'A test apartment in downtown',
        address: '123 Test St, Downtown, USA',
        regularPrice: 1500,
        discountPrice: 1400,
        bedRooms: 2,
        furnished: true,
        parking: true,
        type: 'rent',
        offer: true,
        imageUrls: ['https://via.placeholder.com/150'],
        washrooms: 2,
        userRef: 'testuser1',
        location: {
          type: 'Point',
          coordinates: [-73.9857, 40.7484], // Near Times Square, NYC
        },
        reviews: [
          {
            comment: 'Great location, very convenient!',
            rating: 5,
          },
          {
            comment: 'Nice apartment but a bit noisy.',
            rating: 4,
          },
        ],
      },
      {
        name: 'Test Apartment 2',
        description: 'Another test apartment nearby',
        address: '456 Nearby Ave, Downtown, USA',
        regularPrice: 1600,
        discountPrice: 1500,
        bedRooms: 3,
        furnished: false,
        parking: true,
        type: 'rent',
        offer: false,
        imageUrls: ['https://via.placeholder.com/150'],
        washrooms: 2,
        userRef: 'testuser2',
        location: {
          type: 'Point',
          coordinates: [-73.9867, 40.7494], // About 100m away
        },
        reviews: [
          {
            comment: 'Spacious and well-maintained.',
            rating: 4,
          },
          {
            comment: 'Good value for money.',
            rating: 4,
          },
        ],
      },
      {
        name: 'Test Apartment 3',
        description: 'A third test apartment',
        address: '789 Close St, Downtown, USA',
        regularPrice: 1700,
        discountPrice: 1600,
        bedRooms: 1,
        furnished: true,
        parking: false,
        type: 'rent',
        offer: true,
        imageUrls: ['https://via.placeholder.com/150'],
        washrooms: 1,
        userRef: 'testuser3',
        location: {
          type: 'Point',
          coordinates: [-73.9847, 40.7474], // About 200m away
        },
        reviews: [
          {
            comment: 'Cozy and modern.',
            rating: 5,
          },
          {
            comment: 'Perfect for singles or couples.',
            rating: 5,
          },
        ],
      },
    ];
    
    // Insert test listings
    const insertedListings = await Listing.insertMany(testListings);
    console.log(`✅ Inserted ${insertedListings.length} test listings`);
    
    // Get the first listing ID for testing
    const testListingId = insertedListings[0]._id;
    console.log(`🧪 Testing local insights for listing: ${testListingId}`);
    
    // Test the local insights endpoint
    console.log('📡 Calling local insights API...');
    const response = await axios.get(`http://localhost:50000/api/locality-insight/get/${testListingId}`);
    
    console.log('\n📊 Local Insights Results:');
    console.log('Full Response:', JSON.stringify(response.data, null, 2));
    
    // Validate the response
    if (response.data.localInsights) {
      console.log('\n✅ SUCCESS: Local Insights feature is working!');
      console.log(`📍 Average Nearby Rating: ${response.data.localInsights.avgNearbyRating}`);
      console.log(`💬 Number of Nearby Comments: ${response.data.localInsights.nearbyComments.length}`);
      
      // Show the aggregated comments
      console.log('\n📝 Aggregated Nearby Comments:');
      response.data.localInsights.nearbyComments.forEach((comment, index) => {
        console.log(`${index + 1}. "${comment}"`);
      });
      
      // Verify the calculation
      const expectedAvgRating = (4 + 4 + 5 + 5) / 4; // Ratings from nearby properties
      const actualAvgRating = response.data.localInsights.avgNearbyRating;
      
      if (Math.abs(actualAvgRating - expectedAvgRating) < 0.1) {
        console.log('\n✅ Rating calculation is correct!');
      } else {
        console.log(`\n⚠️  Rating calculation might be off. Expected: ${expectedAvgRating}, Got: ${actualAvgRating}`);
      }
    } else {
      console.log('\n❌ FAIL: Local Insights feature is not working properly.');
      console.log('Response does not contain localInsights object.');
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      console.log('\n💡 Make sure the server is running on port 50000 and the listing ID exists.');
    }
  } finally {
    // Clean up
    await mongoose.connection.close();
    console.log('\n🧹 Database connection closed.');
  }
};

// Run the test
testLocalInsightsFeature().catch(console.error);