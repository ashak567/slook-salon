const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await Staff.findOne({ username });
        if (!user) return res.status(401).json({ error: 'Invalid username or password' });

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid username or password' });

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

module.exports = router;
