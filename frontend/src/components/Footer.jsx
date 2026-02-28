import { MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const location = useLocation();

    // Hide Footer on admin routes
    if (['/admin', '/staff-login', '/dashboard'].some(path => location.pathname.startsWith(path))) {
        return null;
    }

    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-brand">
                    <h2>SLOOKS</h2>
                    <p className="kannada-text">ಸ್ಲಾಕ್ಸ್ ಯುನಿಸೆಕ್ಸ್ ಸಲೋನ್</p>
                    <p className="footer-desc">
                        Experience premium grooming, styling, and relaxing treatments in the heart of Ballari.
                        Where luxury meets aesthetics.
                    </p>
                    <div className="social-links">
                        <a href="#" aria-label="Instagram"><Instagram /></a>
                        <a href="#" aria-label="Facebook"><Facebook /></a>
                    </div>
                </div>

                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/services">Services</a></li>
                        <li><a href="/book">Book Appointment</a></li>
                        <li><a href="/#reviews">Reviews</a></li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h3>Contact Us</h3>
                    <ul>
                        <li>
                            <MapPin size={18} />
                            <span>Beside Hot Breads, New Seven Hills Super Bazaar, First Floor, Infantry Road, Ballari, Karnataka 583104</span>
                        </li>
                        <li>
                            <Phone size={18} />
                            <span>074113 99972</span>
                        </li>
                        <li>
                            <Clock size={18} />
                            <span>Open daily, closes 9 PM</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Slooks Unisex Salon. All Rights Reserved.</p>
                <p><a href="/admin" className="admin-link">Staff Portal</a></p>
            </div>
        </footer>
    );
};

export default Footer;
