import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import './Booking.css';

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const initialServiceId = searchParams.get('serviceId') || '';

    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        email: '',
        serviceId: initialServiceId,
        stylistName: '',
        date: '',
        time: '',
        category: '',
        paymentMethod: 'PayAtSalon'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get('/services');
                setServices(res.data);

                // Pre-fill category if a service was passed via URL to fix hidden dropdown bug
                if (initialServiceId) {
                    const matchedService = res.data.find(s => String(s.id) === String(initialServiceId));
                    if (matchedService && matchedService.category) {
                        setFormData(prev => ({
                            ...prev,
                            category: matchedService.category
                        }));
                    }
                }
            } catch (err) {
                console.error('Failed to fetch services:', err);
            }
        };
        fetchServices();
    }, [initialServiceId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const selectedService = services.find(s => s.id === formData.serviceId);
            const totalAmount = selectedService ? selectedService.priceMin : 0;
            const payload = { ...formData, totalAmount, paymentStatus: 'Pending' };

            // Step 1: Create the appointment first
            const res = await api.post('/appointments', payload);
            const appointmentId = res.data.id;

            if (formData.paymentMethod === 'PayAtSalon') {
                setSuccess('Appointment booked successfully! We will see you soon.');
                setTimeout(() => navigate('/'), 3000);
            } else {
                // Step 2: Pay Now Flow - Create Razorpay Order
                const orderRes = await api.post('/payments/create-order', { amount: totalAmount, appointmentId });

                if (orderRes.data && orderRes.data.id && orderRes.data.id.startsWith('order_mock_')) {
                    // INTERCEPT TESTING MODE
                    await api.post('/payments/verify-payment', {
                        razorpay_order_id: orderRes.data.id,
                        razorpay_payment_id: 'pay_mock_' + Date.now(),
                        razorpay_signature: 'mock_signature',
                        appointmentId
                    });
                    setSuccess('Payment successful & Appointment confirmed (Test Mode)!');
                    setTimeout(() => navigate('/'), 3000);
                    return;
                }

                const options = {
                    key: "rzp_test_dummykey", // In production, fetch this dynamically or use env
                    amount: orderRes.data.amount,
                    currency: "INR",
                    name: "Slooks Unisex Salon",
                    description: `Booking for ${selectedService.serviceName}`,
                    order_id: orderRes.data.id,
                    handler: async function (response) {
                        try {
                            // Step 3: Verify Payment Signature Server-Side
                            await api.post('/payments/verify-payment', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                appointmentId
                            });
                            setSuccess('Payment successful & Appointment confirmed!');
                            setTimeout(() => navigate('/'), 3000);
                        } catch (err) {
                            setError('Payment verification failed. Please contact salon.');
                        }
                    },
                    prefill: {
                        name: formData.customerName,
                        email: formData.email,
                        contact: formData.phone
                    },
                    theme: { color: "#D4AF37" }
                };

                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    setError('Payment failed: ' + response.error.description);
                });
                rzp.open();
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Failed to book appointment. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    // Generate time slots from 10 AM to 8 PM
    const timeSlots = [];
    for (let i = 10; i <= 20; i++) {
        timeSlots.push(`${i > 12 ? i - 12 : i}:00 ${i >= 12 ? 'PM' : 'AM'}`);
        if (i !== 20) timeSlots.push(`${i > 12 ? i - 12 : i}:30 ${i >= 12 ? 'PM' : 'AM'}`);
    }

    return (
        <div className="booking-page">
            <div className="booking-container">

                <div className="booking-info">
                    <h2>Book Your <br />Appointment</h2>
                    <p>Schedule your session at Slooks Unisex Salon. Please note that an appointment requires a strict arrival time.</p>
                    <div className="contact-details">
                        <p><strong>Location:</strong> Beside Hot Breads, New Seven Hills Super Bazaar, First Floor, Ballari</p>
                        <p><strong>Phone:</strong> 074113 99972</p>
                    </div>
                </div>

                <div className="booking-form-wrapper glass-panel">
                    {success ? (
                        <div className="success-message">
                            <h3>Success!</h3>
                            <p>{success}</p>
                            <p>Redirecting to home...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="booking-form">
                            {error && <div className="error-message">{error}</div>}

                            <div className="form-group">
                                <label>Full Name *</label>
                                <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Service Category *</label>
                                <select
                                    name="category"
                                    value={formData.category || ''}
                                    onChange={(e) => {
                                        setFormData({ ...formData, category: e.target.value, serviceId: '' });
                                    }}
                                    required
                                >
                                    <option value="">-- Select Category --</option>
                                    <option value="Men">Male Services</option>
                                    <option value="Women">Female Services</option>
                                    <option value="Unisex">Unisex Services</option>
                                </select>
                            </div>

                            {formData.category && (
                                <div className="form-group">
                                    <label>Select Service *</label>
                                    <select name="serviceId" value={formData.serviceId} onChange={handleChange} required>
                                        <option value="">-- Choose a Service --</option>
                                        {services
                                            .filter(s => s.category === formData.category)
                                            .map(s => (
                                                <option key={s.id} value={s.id}>{s.serviceName} - ₹{s.priceMin}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Preferred Stylist (Optional)</label>
                                <select name="stylistName" value={formData.stylistName} onChange={handleChange}>
                                    <option value="">Any Stylist</option>
                                    <option value="Senior Stylist">Senior Stylist</option>
                                    <option value="Master Stylist">Master Stylist</option>
                                    <option value="Color Specialist">Color Specialist</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date *</label>
                                    <input type="date" name="date" min={today} value={formData.date} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Time *</label>
                                    <select name="time" value={formData.time} onChange={handleChange} required>
                                        <option value="">-- Select Time --</option>
                                        {timeSlots.map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group payment-options" style={{ marginTop: '20px', marginBottom: '20px' }}>
                                <label style={{ color: 'var(--color-charcoal)', fontWeight: 'bold' }}>Payment Method *</label>
                                <div className="radio-group" style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--color-charcoal)' }}>
                                        <input type="radio" name="paymentMethod" value="Online" checked={formData.paymentMethod === 'Online'} onChange={handleChange} />
                                        Pay Now (Online)
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--color-charcoal)' }}>
                                        <input type="radio" name="paymentMethod" value="PayAtSalon" checked={formData.paymentMethod === 'PayAtSalon'} onChange={handleChange} />
                                        Pay at Salon
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary form-submit" disabled={loading}>
                                {loading ? 'Booking...' : 'Confirm Appointment'}
                            </button>
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Booking;
