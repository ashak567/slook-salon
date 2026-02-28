const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const db = require('../db');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
router.post('/create-order', async (req, res) => {
    try {
        const { amount, appointmentId } = req.body; // Amount should be in INR

        if (process.env.RAZORPAY_KEY_ID === 'test_key_id') {
            return res.json({
                id: 'order_mock_' + Date.now(),
                amount: amount * 100,
                currency: 'INR',
                receipt: `receipt_appt_${appointmentId}`
            });
        }

        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency: 'INR',
            receipt: `receipt_appt_${appointmentId}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order) return res.status(500).send('Some error occurred creating order');

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verify Payment Signature
router.post('/verify-payment', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

    if (process.env.RAZORPAY_KEY_ID === 'test_key_id' && razorpay_signature === 'mock_signature') {
        db.run(`UPDATE appointments SET paymentStatus = 'Paid', paymentId = ? WHERE id = ?`,
            [razorpay_payment_id, appointmentId],
            function (err) {
                if (err) return res.status(500).json({ status: 'failed', error: err.message });
                return res.json({ status: 'success', message: 'Mock Payment verified successfully' });
            }
        );
        return;
    }

    const payload = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(payload)
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        // Payment is authentic, update appointment
        db.run(`UPDATE appointments SET paymentStatus = 'Paid', paymentId = ? WHERE id = ?`,
            [razorpay_payment_id, appointmentId],
            function (err) {
                if (err) return res.status(500).json({ status: 'failed', error: err.message });
                res.json({ status: 'success', message: 'Payment verified successfully' });
            }
        );
    } else {
        res.status(400).json({ status: 'failed', message: 'Invalid payment signature' });
    }
});

module.exports = router;
