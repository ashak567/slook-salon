const mongoose = require('mongoose');
require('dotenv').config();

const dropIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas');

        const db = mongoose.connection.db;
        const collection = db.collection('appointments');

        // List indexes
        const indexes = await collection.indexes();
        console.log('Current Indexes:', indexes.map(i => i.name));

        const indexName = 'date_1_time_1';
        const hasIndex = indexes.find(i => i.name === indexName);

        if (hasIndex) {
            console.log(`Dropping index ${indexName}...`);
            await collection.dropIndex(indexName);
            console.log('Index dropped successfully.');
        } else {
            console.log(`Index ${indexName} not found.`);
        }

        mongoose.disconnect();
    } catch (err) {
        console.error('Error dropping index:', err);
        mongoose.disconnect();
    }
};

dropIndex();
