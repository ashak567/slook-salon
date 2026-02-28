const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Get all appointments (Admin only)
router.get('/', authMiddleware, adminMiddleware, (req, res) => {
    const sql = `
    SELECT a.*, s.serviceName, s.priceMin, s.duration 
    FROM appointments a
    JOIN services s ON a.serviceId = s.id
    ORDER BY a.date DESC, a.time DESC
  `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create new appointment (Public)
router.post('/', (req, res) => {
    const { customerName, phone, email, serviceId, stylistName, date, time, totalAmount, paymentStatus, paymentMethod, paymentId } = req.body;

    if (!customerName || !phone || !serviceId || !date || !time) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Double booking check happens at DB level via UNIQUE index, but we can do a preemptive check
    db.get('SELECT id FROM appointments WHERE date = ? AND time = ?', [date, time], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err.message });
        if (row) {
            return res.status(409).json({ error: 'Time slot is already booked. Please choose another time.' });
        }

        const sql = `INSERT INTO appointments (customerName, phone, email, serviceId, stylistName, date, time, totalAmount, paymentStatus, paymentMethod, paymentId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [customerName, phone, email, serviceId, stylistName, date, time, totalAmount || 0, paymentStatus || 'Pending', paymentMethod || 'PayAtSalon', paymentId || null];

        db.run(sql, params, function (err) {
            if (err) return res.status(500).json({ error: 'Error creating appointment', details: err.message });

            const newApptId = this.lastID;

            // Real-time Staff Announcement trigger
            db.get('SELECT serviceName FROM services WHERE id = ?', [serviceId], (serviceErr, serviceRow) => {
                const serviceName = serviceRow ? serviceRow.serviceName : 'a service';
                const msg = `New booking received. ${customerName} has booked ${serviceName} on ${date} at ${time} with ${stylistName || 'any stylist'}.`;

                if (req.io) {
                    req.io.emit('new_booking', { message: msg, appointment: { id: newApptId, customerName, date, time, serviceName, stylistName } });
                }
                res.status(201).json({ message: 'Appointment booked successfully', id: newApptId });
            });
        });
    });
});

// Update appointment status or payment
router.put('/:id', authMiddleware, adminMiddleware, (req, res) => {
    const { paymentStatus, paymentId } = req.body;

    const sql = `UPDATE appointments SET paymentStatus = coalesce(?, paymentStatus), paymentId = coalesce(?, paymentId) WHERE id = ? `;
    const params = [paymentStatus, paymentId, req.params.id];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Appointment updated', changes: this.changes });
    });
});

// Delete appointment
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
    db.run('DELETE FROM appointments WHERE id = ?', req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Appointment deleted', changes: this.changes });
    });
});

module.exports = router;
