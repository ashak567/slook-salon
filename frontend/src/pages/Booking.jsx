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
    const [suggestions, setSuggestions] = useState(null);

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
        setSuggestions(null);
    };

    const executeBooking = async (dataToSubmit) => {
        setLoading(true);
        setError('');
        setSuccess('');
        setSuggestions(null);

        try {
            const selectedService = services.find(s => s.id === dataToSubmit.serviceId);
            const totalAmount = selectedService ? selectedService.priceMin : 0;

            // Force PayAtSalon implicitly
            const payload = { ...dataToSubmit, totalAmount, paymentStatus: 'Pending', paymentMethod: 'PayAtSalon' };

            await api.post('/appointments', payload);

            setSuccess('Appointment booked successfully! Payment will be collected at the salon.');
            setTimeout(() => navigate('/'), 3000);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
                if (err.response.status === 409 && err.response.data.conflict) {
                    setSuggestions(err.response.data.suggestions);
                }
            } else {
                setError('Failed to book appointment. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        executeBooking(formData);
    };

    const handleAlternativeBooking = (newDate, newTime) => {
        const updatedForm = { ...formData, date: newDate, time: newTime };
        setFormData(updatedForm); // Update UI visibly to user
        executeBooking(updatedForm); // Transparently auto-submit the new payload
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
                            {error && !suggestions && <div className="error-message">{error}</div>}

                            {suggestions && (
                                <div className="suggestions-box" style={{ background: '#fef3c7', border: '1px solid #f59e0b', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                                    <h4 style={{ color: '#92400e', marginBottom: '10px' }}>⚠ Stylist Unavailable</h4>
                                    <p style={{ color: '#b45309', marginBottom: '15px', fontSize: '0.95rem' }}>{error} Here are alternative slots:</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {suggestions.todayTime && (
                                            <button type="button" className="btn-secondary" style={{ borderColor: '#f59e0b', color: '#92400e' }} onClick={() => handleAlternativeBooking(formData.date, suggestions.todayTime)}>
                                                Book Today at {suggestions.todayTime}
                                            </button>
                                        )}
                                        {suggestions.tomorrowDate && (
                                            <button type="button" className="btn-secondary" style={{ borderColor: '#f59e0b', color: '#92400e' }} onClick={() => handleAlternativeBooking(suggestions.tomorrowDate, suggestions.tomorrowTime)}>
                                                Book Tomorrow at {suggestions.tomorrowTime}
                                            </button>
                                        )}
                                        <button type="button" style={{ background: 'none', border: 'none', color: '#d97706', textDecoration: 'underline', cursor: 'pointer', padding: '10px' }} onClick={() => { setSuggestions(null); setError(''); }}>
                                            No thanks, let me pick manually
                                        </button>
                                    </div>
                                </div>
                            )}

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

                            {/* Payment Options Removed. System defaults to Pay At Salon exclusively. */}

                            <button type="submit" className="btn-primary form-submit" disabled={loading} style={{ marginTop: '30px' }}>
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
