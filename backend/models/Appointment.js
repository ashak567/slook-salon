const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    stylistName: {
        type: String
    },
    category: {
        type: String
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    paymentStatus: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Paid']
    },
    paymentMethod: {
        type: String,
        default: 'PayAtSalon',
        enum: ['PayAtSalon', 'Online']
    },
    paymentId: {
        type: String
    }
}, { timestamps: true });

// Create a compound unique index to prevent double bookings purely at the database level
appointmentSchema.index({ date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
