import { useState } from 'react';
import api from '../api';
import './MyBookings.css';
import { Clock, Calendar, XCircle, Search, LogOut } from 'lucide-react';

const MyBookings = () => {
    const [phone, setPhone] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLookup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/appointments/lookup', { phone });
            setAppointments(res.data);
            setIsLoggedIn(true);
        } catch (err) {
            setError('Failed to fetch appointments. Please check your phone number.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

        try {
            await api.post(`/appointments/client-cancel/${id}`, { phone });
            // Refresh list
            const res = await api.post('/appointments/lookup', { phone });
            setAppointments(res.data);
        } catch (err) {
            alert('Failed to cancel appointment: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setPhone('');
        setAppointments([]);
    };

    if (!isLoggedIn) {
        return (
            <div className="my-bookings-page page-container">
                <div className="lookup-box glass-panel">
                    <h2>Find My Bookings</h2>
                    <p>Enter the phone number you used during checkout to view or cancel your upcoming salon appointments.</p>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleLookup} className="lookup-form">
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                placeholder="Enter 10-digit mobile number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Searching...' : <><Search size={18} /> Find Bookings</>}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Sort: Upcoming future dates first, then past dates.
    const today = new Date().toISOString().split('T')[0];
    const upcoming = appointments.filter(a => a.date >= today);
    const past = appointments.filter(a => a.date < today);

    return (
        <div className="my-bookings-dashboard page-container">
            <div className="dashboard-header">
                <h2>My Appointments</h2>
                <button className="btn-secondary logout-btn" onClick={handleLogout}>
                    <LogOut size={16} /> Look up another
                </button>
            </div>

            {appointments.length === 0 ? (
                <div className="empty-state glass-panel">
                    <p>No appointments found for {phone}.</p>
                </div>
            ) : (
                <div className="appointments-list">
                    {upcoming.length > 0 && (
                        <div className="appointment-section">
                            <h3>Upcoming</h3>
                            <div className="booking-cards">
                                {upcoming.map(appt => (
                                    <div key={appt.id} className="booking-card glass-panel hover-3d">
                                        <div className="card-header">
                                            <h4>{appt.serviceName}</h4>
                                        </div>
                                        <div className="card-body">
                                            <p><Calendar size={16} /> <strong>{appt.date}</strong></p>
                                            <p><Clock size={16} /> <strong>{appt.time}</strong></p>
                                            <p>Stylist: {appt.stylistName || 'Any Stylist'}</p>
                                            <p>Amount: ₹{appt.totalAmount}</p>
                                        </div>
                                        <div className="card-footer">
                                            <button className="cancel-btn" onClick={() => handleCancel(appt.id)}>
                                                <XCircle size={16} /> Cancel Appointment
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {past.length > 0 && (
                        <div className="appointment-section">
                            <h3>Past History</h3>
                            <div className="booking-cards">
                                {past.map(appt => (
                                    <div key={appt.id} className="booking-card glass-panel past-card">
                                        <div className="card-header">
                                            <h4>{appt.serviceName}</h4>
                                        </div>
                                        <div className="card-body">
                                            <p><Calendar size={16} /> {appt.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
