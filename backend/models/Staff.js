const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: { // Will store hashed bcrypt passwords
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'admin'
    }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
