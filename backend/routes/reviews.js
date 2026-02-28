const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Get all reviews (Public)
router.get('/', (req, res) => {
    db.all('SELECT * FROM reviews ORDER BY reviewDate DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Add a review (Public)
router.post('/', (req, res) => {
    const { reviewerName, rating, reviewText, reviewDate, profilePhotoUrl } = req.body;

    if (!reviewerName || !rating) {
        return res.status(400).json({ error: 'Reviewer name and rating are required' });
    }

    const sql = `INSERT INTO reviews (reviewerName, rating, reviewText, reviewDate, profilePhotoUrl) VALUES (?, ?, ?, ?, ?)`;
    const params = [reviewerName, rating, reviewText, reviewDate || new Date().toISOString(), profilePhotoUrl];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Review added', id: this.lastID });
    });
});

// Delete a review (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
    db.run('DELETE FROM reviews WHERE id = ?', req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Review deleted', changes: this.changes });
    });
});

module.exports = router;
