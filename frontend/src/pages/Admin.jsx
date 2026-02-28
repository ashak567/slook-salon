import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Volume2, VolumeX, LogOut, CheckCircle, Clock } from 'lucide-react';
import api from '../api';
import './Admin.css';

const Admin = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);

    // Admin Tabs & Data
    const [activeTab, setActiveTab] = useState('appointments');
    const [services, setServices] = useState([]);

    // Filters
    const [filterDate, setFilterDate] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterMethod, setFilterMethod] = useState('');

    const navigate = useNavigate();

    // Login form state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Handle Login
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', { username, password });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setToken(token);
            setUser(user);
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken('');
        setUser(null);
        navigate('/admin');
    };

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/appointments');
            setAppointments(res.data);
        } catch (err) {
            console.error('Failed to fetch appointments:', err);
        }
    };

    const fetchServices = async () => {
        try {
            const res = await api.get('/services');
            setServices(res.data);
        } catch (err) {
            console.error('Failed to fetch services:', err);
        }
    };

    useEffect(() => {
        if (token && user?.role === 'admin') {
            fetchAppointments();
            fetchServices();

            // Setup Socket.io
            const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const socket = io(socketUrl);

            socket.on('new_booking', (data) => {
                console.log('New Booking Alert:', data);

                // Refresh appointment list
                fetchAppointments();

                // Announce using Web Speech API if enabled
                if (audioEnabled) {
                    const utterance = new SpeechSynthesisUtterance(data.message);
                    utterance.rate = 0.9;
                    utterance.pitch = 1.1;
                    window.speechSynthesis.speak(utterance);
                }
            });

            return () => socket.disconnect();
        }
    }, [token, user, audioEnabled]);

    const toggleAudio = () => {
        if (!audioEnabled) {
            // Browsers require a deliberate action to enable Audio contexts
            const synth = window.speechSynthesis;
            const u = new SpeechSynthesisUtterance('Audio announcements enabled.');
            synth.speak(u);
        }
        setAudioEnabled(!audioEnabled);
    };

    const togglePaymentStatus = async (id, currentStatus) => {
        if (currentStatus === 'Paid') return; // Only allow marking as Paid for Pending
        try {
            await api.put(`/appointments/${id}`, { paymentStatus: 'Paid' });
            fetchAppointments();
        } catch (err) {
            console.error('Failed to update payment status:', err);
        }
    };

    const filteredAppointments = appointments.filter(appt => {
        if (filterDate && appt.date !== filterDate) return false;
        if (filterStatus && appt.paymentStatus !== filterStatus) return false;
        if (filterMethod && appt.paymentMethod !== filterMethod) return false;
        return true;
    });

    const todayDate = new Date().toISOString().split('T')[0];

    const deleteAppointment = async (id) => {
        if (!window.confirm('Are you sure you want to delete this appointment?')) return;
        try {
            await api.delete(`/appointments/${id}`);
            fetchAppointments();
        } catch (err) {
            console.error('Failed to delete appointment:', err);
        }
    };

    if (!token) {
        return (
            <div className="admin-login-page">
                <div className="login-box glass-panel">
                    <div className="admin-header">
                        <h2>Staff Portal</h2>
                        <p>Admin Login</p>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Login</button>
                    </form>
                    <a href="/" className="back-link">Return to Public Site</a>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-sidebar glass-panel">
                <div className="admin-brand">
                    <h2>SLOOKS</h2>
                    <span>Admin Portal</span>
                </div>

                <div className="admin-user-info">
                    <p>Logged in as: <strong>{user?.username}</strong></p>
                    <span className="role-badge">{user?.role}</span>
                </div>

                <nav className="admin-nav">
                    <button className={`nav-btn ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>Appointments</button>
                    <button className={`nav-btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>Services</button>
                </nav>

                <div className="admin-settings">
                    <button onClick={toggleAudio} className={`audio-toggle ${audioEnabled ? 'active' : ''}`}>
                        {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        {audioEnabled ? 'Audio On' : 'Audio Off'}
                    </button>
                </div>

                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={20} /> Logout
                </button>
            </div>

            <div className="admin-main">
                <div className="admin-topbar">
                    <h1>{activeTab === 'appointments' ? 'Appointments' : 'Services Directory'}</h1>
                    {activeTab === 'appointments' && (
                        <div className="dashboard-stats">
                            <div className="stat-card">
                                <span>Total Bookings Today</span>
                                <strong>{appointments.filter(a => a.date === todayDate).length}</strong>
                            </div>
                            <div className="stat-card">
                                <span>Paid Revenue Today</span>
                                <strong style={{ color: '#047857' }}>₹{appointments.filter(a => a.date === todayDate && a.paymentStatus === 'Paid').reduce((sum, a) => sum + (a.totalAmount || 0), 0)}</strong>
                            </div>
                            <div className="stat-card">
                                <span>Pending Payments Today</span>
                                <strong style={{ color: '#b45309' }}>₹{appointments.filter(a => a.date === todayDate && a.paymentStatus === 'Pending').reduce((sum, a) => sum + (a.totalAmount || 0), 0)}</strong>
                            </div>
                            <div className="stat-card">
                                <span>Total Revenue (All Time)</span>
                                <strong>₹{appointments.filter(a => a.paymentStatus === 'Paid').reduce((sum, a) => sum + (a.totalAmount || 0), 0)}</strong>
                            </div>
                        </div>
                    )}
                </div>

                {activeTab === 'appointments' ? (
                    <>
                        <div className="filters-container glass-panel" style={{ padding: '20px', marginBottom: '20px', display: 'flex', gap: '20px', borderRadius: '12px' }}>
                            <div className="form-group" style={{ flex: 1, margin: 0 }}>
                                <label>Filter by Date</label>
                                <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                            </div>
                            <div className="form-group" style={{ flex: 1, margin: 0 }}>
                                <label>Payment Status</label>
                                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                    <option value="">All Statuses</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ flex: 1, margin: 0 }}>
                                <label>Payment Method</label>
                                <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)}>
                                    <option value="">All Methods</option>
                                    <option value="Online">Online</option>
                                    <option value="PayAtSalon">Pay at Salon</option>
                                </select>
                            </div>
                            <button className="btn-primary" style={{ marginTop: 'auto', padding: '10px 20px', height: '42px' }} onClick={() => { setFilterDate(''); setFilterMethod(''); setFilterStatus(''); }}>Clear</button>
                        </div>

                        <div className="data-table-container glass-panel">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date & Time</th>
                                        <th>Client Details</th>
                                        <th>Service (Stylist)</th>
                                        <th>Amount & Method</th>
                                        <th>Payment Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAppointments.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="empty-state">No appointments found.</td>
                                        </tr>
                                    ) : (
                                        filteredAppointments.map(appt => (
                                            <tr key={appt.id}>
                                                <td>
                                                    <div className="cell-datetime">
                                                        <strong>{appt.date}</strong>
                                                        <span><Clock size={14} /> {appt.time}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="cell-client">
                                                        <strong>{appt.customerName}</strong>
                                                        <span>{appt.phone}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="cell-service">
                                                        <strong>{appt.serviceName}</strong>
                                                        <span>{appt.stylistName ? `With: ${appt.stylistName}` : 'Any Stylist'}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="cell-service">
                                                        <strong>₹{appt.totalAmount || 0}</strong>
                                                        <span>{appt.paymentMethod === 'Online' ? 'Online Setup' : 'At Salon'}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${appt.paymentStatus === 'Paid' ? 'paid' : 'pending'}`}>
                                                        {appt.paymentStatus === 'Paid' ? <><CheckCircle size={14} /> Paid</> : 'Pending'}
                                                    </span>
                                                </td>
                                                <td>
                                                    {appt.paymentStatus === 'Pending' && (
                                                        <button className="action-btn" style={{ color: '#047857', borderColor: '#34d399', marginRight: '5px' }} onClick={() => togglePaymentStatus(appt.id, appt.paymentStatus)}>Mark as Paid</button>
                                                    )}
                                                    <button className="action-btn delete" onClick={() => deleteAppointment(appt.id)}>Cancel</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="data-table-container glass-panel">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Service Name</th>
                                    <th>Category & Sub-Category</th>
                                    <th>Duration</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="empty-state">No services found.</td>
                                    </tr>
                                ) : (
                                    services.map(s => (
                                        <tr key={s.id}>
                                            <td>
                                                <strong>{s.serviceName}</strong>
                                            </td>
                                            <td>
                                                <div className="cell-client">
                                                    <strong>{s.category}</strong>
                                                    <span>{s.subCategory}</span>
                                                </div>
                                            </td>
                                            <td>{s.duration} mins</td>
                                            <td><strong>₹{s.priceMin}</strong></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
