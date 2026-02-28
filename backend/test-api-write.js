const axios = require('axios');

async function test() {
    try {
        console.log("Sending POST to /api/reviews...");
        const postRes = await axios.post('http://localhost:5000/api/reviews', {
            reviewerName: "Test Sync User",
            rating: 5,
            reviewText: "Testing DB sync from active connection",
            profilePhotoUrl: "https://ui-avatars.com/api/?name=Test+Sync+User"
        });
        console.log("POST response:", postRes.data);

        console.log("Sending GET to /api/reviews...");
        const getRes = await axios.get('http://localhost:5000/api/reviews');
        console.log(`Backend returned ${getRes.data.length} reviews.`);

    } catch (err) {
        console.error("Error:", err.message);
        if (err.response) console.error(err.response.data);
    }
}
test();
