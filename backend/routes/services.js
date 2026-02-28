const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all services
router.get('/', (req, res) => {
    db.all('SELECT * FROM services', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create new service (Admin only protected later via middleware)
router.post('/', (req, res) => {
    const { serviceName, category, subCategory, description, priceMin, priceMax, duration } = req.body;

    if (!serviceName || !category || !priceMin || !duration) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = `INSERT INTO services (serviceName, category, subCategory, description, priceMin, priceMax, duration) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [serviceName, category, subCategory, description, priceMin, priceMax, duration];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Service created', id: this.lastID });
    });
});

// Update a service
router.put('/:id', (req, res) => {
    const { serviceName, category, subCategory, description, priceMin, priceMax, duration, activeStatus } = req.body;
    const sql = `UPDATE services SET 
    serviceName = coalesce(?, serviceName),
    category = coalesce(?, category),
    subCategory = coalesce(?, subCategory),
    description = coalesce(?, description),
    priceMin = coalesce(?, priceMin),
    priceMax = coalesce(?, priceMax),
    duration = coalesce(?, duration),
    activeStatus = coalesce(?, activeStatus)
    WHERE id = ?`;

    const params = [serviceName, category, subCategory, description, priceMin, priceMax, duration, activeStatus, req.params.id];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Service updated', changes: this.changes });
    });
});

// Delete a service
router.delete('/:id', (req, res) => {
    db.run('DELETE FROM services WHERE id = ?', req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Service deleted', changes: this.changes });
    });
});

module.exports = router;
