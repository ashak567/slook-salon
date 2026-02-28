const axios = require('axios');

async function test() {
    try {
        const res = await axios.get('http://localhost:5000/api/reviews');
        console.log(`Backend returned ${res.data.length} reviews.`);
        if (res.data.length > 0) {
            console.log(res.data[0]);
        }
    } catch (err) {
        console.error("Error connecting to backend API:", err.message);
    }
}
test();
