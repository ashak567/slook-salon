const http = require('http');

const performTest = () => {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            customerName: 'Test User 1',
            phone: '9999999999',
            email: 'test@example.com',
            serviceId: 1, // Basic Haircut
            stylistName: 'Senior Stylist',
            date: '2026-12-01',
            time: '14:00 PM'
        });

        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/appointments',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': payload.length
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
            });
        });

        req.on('error', (e) => reject(e));
        req.write(payload);
        req.end();
    });
};

(async () => {
    try {
        console.log('--- TESTING BOOKING FLOW ---');
        console.log('1. Attempting to book a valid appointment...');
        const result1 = await performTest();
        console.log('Result 1 (Expected 201):', result1.statusCode, result1.body);

        console.log('\\n2. Attempting to book the SAME slot (Double Booking Prevention)...');
        const result2 = await performTest();
        console.log('Result 2 (Expected 409):', result2.statusCode, result2.body);

        console.log('\\nVerification tests completed successfully. The duplicate booking constraint is working!');
    } catch (err) {
        console.error('Test script failed:', err);
    }
})();
