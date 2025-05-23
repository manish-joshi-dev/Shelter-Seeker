import axios from 'axios';

const testLocalInsights = async () => {
  try {
    // Test the local insights endpoint
    const listingId = '673b8a1f2c3d4e5f6a7b8c9d'; // Example ID, will need to be replaced with actual ID
    const response = await axios.get(`http://localhost:50000/api/locality-insight/get/${listingId}`);
    
    console.log('Local Insights Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Check if localInsights is present
    if (response.data.localInsights) {
      console.log('\n✅ Local Insights feature is working!');
      console.log('Average Nearby Rating:', response.data.localInsights.avgNearbyRating);
      console.log('Number of Nearby Comments:', response.data.localInsights.nearbyComments.length);
    } else {
      console.log('\n❌ Local Insights feature is not working properly.');
    }
  } catch (error) {
    console.error('Error testing local insights:', error.response?.data || error.message);
  }
};

testLocalInsights();