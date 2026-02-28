const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Helper to map Mongoose _id to id for frontend compatibility
const mapServiceId = (s) => {
    const obj = s.toObject();
    obj.id = obj._id;
    return obj;
};

// Get all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services.map(mapServiceId));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new service (Admin only protected later via middleware)
router.post('/', async (req, res) => {
    try {
        const newService = await Service.create(req.body);
        res.status(201).json({ message: 'Service created', id: newService._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a service
router.put('/:id', async (req, res) => {
    try {
        const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: 'Service not found' });
        res.json({ message: 'Service updated', service: mapServiceId(updated) });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a service
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Service.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Service not found' });
        res.json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
