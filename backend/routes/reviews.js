const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Helper to map Mongoose _id to id
const mapReviewId = (r) => {
    const obj = r.toObject();
    obj.id = obj._id;
    return obj;
};

// Get all reviews (Public)
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ reviewDate: -1 });
        res.json(reviews.map(mapReviewId));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a review (Public)
router.post('/', async (req, res) => {
    try {
        const { reviewerName, rating, reviewText, reviewDate, profilePhotoUrl } = req.body;

        if (!reviewerName || !rating) {
            return res.status(400).json({ error: 'Reviewer name and rating are required' });
        }

        const newReview = await Review.create({
            reviewerName,
            rating,
            reviewText,
            reviewDate: reviewDate || new Date().toISOString(),
            profilePhotoUrl
        });

        res.status(201).json({ message: 'Review added', id: newReview._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a review (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const deleted = await Review.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Review not found' });
        res.json({ message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
