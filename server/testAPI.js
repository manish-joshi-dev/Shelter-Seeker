import fetch from 'node-fetch';

const testAPI = async () => {
    try {
        console.log('🧪 Testing API endpoints...');
        
        // Test if backend is running
        console.log('🔍 Testing backend connection...');
        const healthResponse = await fetch('http://localhost:8000/api/auth/test');
        console.log('Backend health check status:', healthResponse.status);
        
        // Test admin analytics endpoint (this will fail without auth, but we can see the response)
        console.log('🔍 Testing admin analytics endpoint...');
        const analyticsResponse = await fetch('http://localhost:8000/api/admin/analytics', {
            credentials: 'include'
        });
        console.log('Analytics endpoint status:', analyticsResponse.status);
        
        if (!analyticsResponse.ok) {
            const errorText = await analyticsResponse.text();
            console.log('Analytics error response:', errorText);
        } else {
            const data = await analyticsResponse.json();
            console.log('Analytics data:', data);
        }
        
        // Test admin users endpoint
        console.log('🔍 Testing admin users endpoint...');
        const usersResponse = await fetch('http://localhost:8000/api/admin/users', {
            credentials: 'include'
        });
        console.log('Users endpoint status:', usersResponse.status);
        
        if (!usersResponse.ok) {
            const errorText = await usersResponse.text();
            console.log('Users error response:', errorText);
        } else {
            const data = await usersResponse.json();
            console.log('Users data:', data);
        }
        
    } catch (error) {
        console.error('❌ Error testing API:', error.message);
        console.log('💡 Make sure the backend server is running on port 8000');
    }
};

testAPI();

