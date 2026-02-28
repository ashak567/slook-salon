import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api';
import './Services.css';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeGender, setActiveGender] = useState('Women'); // 'Women', 'Men', 'Unisex'
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get('/services');
                setServices(res.data);
            } catch (err) {
                console.error('Failed to fetch services:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    // Filter logic
    const filteredServices = services.filter(s => {
        if (s.category !== activeGender) return false;
        if (activeCategory !== 'All' && s.subCategory !== activeCategory) return false;
        return true;
    });

    // Extract unique subcategories for the active gender
    const currentSubCats = ['All', ...new Set(services.filter(s => s.category === activeGender).map(s => s.subCategory))];

    return (
        <div className="services-page">
            <div className="services-header">
                <h1>Our <span className="text-gold">Services</span></h1>
                <p>Premium grooming & styling by experts.</p>
            </div>

            <div className="services-container">

                {/* Gender Toggle */}
                <div className="gender-toggle glass-panel">
                    {['Women', 'Men', 'Unisex'].map(gender => (
                        <button
                            key={gender}
                            className={`toggle-btn ${activeGender === gender ? 'active' : ''}`}
                            onClick={() => { setActiveGender(gender); setActiveCategory('All'); }}
                        >
                            {gender}
                        </button>
                    ))}
                </div>

                {/* Subcategory Filter */}
                <div className="subcategory-filter">
                    {currentSubCats.map(sub => (
                        <button
                            key={sub}
                            className={`sub-btn ${activeCategory === sub ? 'active' : ''}`}
                            onClick={() => setActiveCategory(sub)}
                        >
                            {sub}
                        </button>
                    ))}
                </div>

                {/* Service Grid */}
                {loading ? (
                    <div className="loading">Loading our catalog...</div>
                ) : (
                    <motion.div layout className="service-grid">
                        {filteredServices.length === 0 ? (
                            <div className="no-services">No services found for this category.</div>
                        ) : (
                            filteredServices.map((service, index) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    key={service.id}
                                    className="service-item glass-panel hover-3d"
                                >
                                    <div className="service-info">
                                        <h3>{service.serviceName}</h3>
                                        <p className="service-desc">{service.description}</p>
                                        <span className="service-duration">{service.duration} min</span>
                                    </div>
                                    <div className="service-action">
                                        <div className="service-price">
                                            ₹{service.priceMin}{service.priceMax && service.priceMin !== service.priceMax ? ` - ₹${service.priceMax}` : ''}
                                            {service.priceMin === 2500 && service.subCategory === 'Premium Add-ons' ? '+' : ''}
                                        </div>
                                        <Link to={`/book?serviceId=${service.id}`} className="btn-secondary book-btn">Book Now</Link>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                )}

            </div>
        </div>
    );
};

export default Services;
