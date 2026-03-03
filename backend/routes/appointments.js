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

        // --- NEW ALGORITHM: Stylist Double-Booking Prevention & Suggestions ---
        // If a specific stylist is requested, check if THEY are booked.
        // If "Any Stylist" (empty string or not provided), we bypass strict unique checks.
        if (stylistName && stylistName !== 'Any Stylist') {
            const existingStylist = await Appointment.findOne({ date, time, stylistName });

            if (existingStylist) {
                // Collision detected! Calculate alternative suggestions.
                const timeSlots = [];
                for (let i = 10; i <= 20; i++) {
                    timeSlots.push(`${i > 12 ? i - 12 : i}:00 ${i >= 12 ? 'PM' : 'AM'}`);
                    if (i !== 20) timeSlots.push(`${i > 12 ? i - 12 : i}:30 ${i >= 12 ? 'PM' : 'AM'}`);
                }

                const todayAppointments = await Appointment.find({ date, stylistName });
                const bookedTimesToday = todayAppointments.map(a => a.time);

                const startIndex = timeSlots.indexOf(time);
                let nextAvailableToday = null;
                if (startIndex !== -1) {
                    for (let i = startIndex + 1; i < timeSlots.length; i++) {
                        if (!bookedTimesToday.includes(timeSlots[i])) {
                            nextAvailableToday = timeSlots[i];
                            break;
                        }
                    }
                }

                const dateObj = new Date(date);
                dateObj.setDate(dateObj.getDate() + 1);
                const tomorrowStr = dateObj.toISOString().split('T')[0];
                const tomorrowConflict = await Appointment.findOne({ date: tomorrowStr, time, stylistName });
                const availableTomorrow = !tomorrowConflict ? tomorrowStr : null;

                return res.status(409).json({
                    error: `${stylistName} is already booked at ${time}.`,
                    conflict: true,
                    suggestions: {
                        todayTime: nextAvailableToday,
                        tomorrowDate: availableTomorrow,
                        tomorrowTime: time
                    }
                });
            }
        }
        // --- END ALGORITHM ---

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

// Delete appointment (Admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const deleted = await Appointment.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Appointment not found' });
        res.json({ message: 'Appointment deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Client tracking lookup
router.post('/lookup', async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ error: 'Phone number is required' });

        const appointments = await Appointment.find({ phone }).populate('serviceId').sort({ date: -1, time: -1 });

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

// Client tracking public cancel
router.post('/client-cancel/:id', async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ error: 'Phone number is required to cancel' });

        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

        if (appointment.phone !== phone) {
            return res.status(403).json({ error: 'Phone number does not match booking records' });
        }

        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Appointment successfully cancelled' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
