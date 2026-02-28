const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Men', 'Women', 'Unisex'] // As specified in the Booking UI
    },
    subCategory: {
        type: String
    },
    description: {
        type: String
    },
    priceMin: { // Keeping the Min/Max structure from the SQLite db for flexiblity
        type: Number,
        required: true
    },
    priceMax: {
        type: Number
    },
    duration: {
        type: Number,
        required: true
    },
    activeStatus: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
