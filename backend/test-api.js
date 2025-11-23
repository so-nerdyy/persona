const fetch = require('node-fetch');

async function testAPI() {
    console.log('=== Testing API Endpoints ===\n');
    
    const sessionId = 'test-session-' + Date.now();
    
    // Test GET (should return empty array)
    console.log('1. Testing GET /api/notes/' + sessionId);
    try {
        const getRes = await fetch(`http://localhost:3000/api/notes/${sessionId}`);
        console.log('   Status:', getRes.status);
        const getData = await getRes.json();
        console.log('   Response:', getData);
    } catch (err) {
        console.log('   Error:', err.message);
    }
    
    // Test POST
    console.log('\n2. Testing POST /api/notes');
    try {
        const postRes = await fetch('http://localhost:3000/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: sessionId,
                title: 'Test Note',
                message: 'This is a test message'
            })
        });
        console.log('   Status:', postRes.status);
        const postData = await postRes.json();
        console.log('   Response:', postData);
    } catch (err) {
        console.log('   Error:', err.message);
    }
    
    console.log('\nDone!');
}

testAPI();

