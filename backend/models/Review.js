const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewerName: { // Keeping exact naming from the SQLite columns for minimal frontend friction
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewText: {
        type: String
    },
    reviewDate: {
        type: Date,
        default: Date.now
    },
    profilePhotoUrl: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
