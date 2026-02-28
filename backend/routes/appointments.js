const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Get all appointments (Admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('serviceId').sort({ date: -1, time: -1 });

        // Map to flat object expected by UI
        const mapped = appointments.map(a => {
            const obj = a.toObject();
            obj.id = obj._id;
            if (obj.serviceId) {
                obj.serviceName = obj.serviceId.serviceName;
                obj.duration = obj.serviceId.duration;
            }
            return obj;
        });

        res.json(mapped);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new appointment (Public)
router.post('/', async (req, res) => {
    try {
        const { customerName, phone, email, serviceId, stylistName, date, time, totalAmount, paymentStatus, paymentMethod, paymentId } = req.body;

        if (!customerName || !phone || !serviceId || !date || !time) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existing = await Appointment.findOne({ date, time });
        if (existing) {
            return res.status(409).json({ error: 'Time slot is already booked. Please choose another time.' });
        }

        const newAppt = await Appointment.create({
            customerName, phone, email, serviceId, stylistName, date, time,
            totalAmount: totalAmount || 0,
            paymentStatus: paymentStatus || 'Pending',
            paymentMethod: paymentMethod || 'PayAtSalon',
            paymentId: paymentId || null
        });

        // Broadcast
        const service = await Service.findById(serviceId);
        const serviceName = service ? service.serviceName : 'a service';
        const msg = `New booking received. ${customerName} has booked ${serviceName} on ${date} at ${time} with ${stylistName || 'any stylist'}.`;

        if (req.io) {
            req.io.emit('new_booking', { message: msg, appointment: { id: newAppt._id, customerName, date, time, serviceName, stylistName } });
        }

        res.status(201).json({ message: 'Appointment booked successfully', id: newAppt._id });

    } catch (err) {
        // Handle Mongoose Duplicate Key Error (11000) gracefully just in case race condition
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Time slot is already booked. Please choose another time.' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Update appointment status or payment
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { paymentStatus, paymentId } = req.body;

        const updated = await Appointment.findByIdAndUpdate(
            req.params.id,
            {
                ...(paymentStatus && { paymentStatus }),
                ...(paymentId && { paymentId })
            },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: 'Appointment not found' });
        res.json({ message: 'Appointment updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete appointment
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const deleted = await Appointment.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Appointment not found' });
        res.json({ message: 'Appointment deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
