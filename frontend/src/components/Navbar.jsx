import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scissors } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const closeMenu = () => setMobileMenuOpen(false);

    return (
        <header className={`navbar ${isScrolled ? 'scrolled glass-panel' : ''}`}>
            <div className="nav-container">
                <Link to="/" className="brand" onClick={closeMenu}>
                    <Scissors className="brand-icon" />
                    <div className="brand-text">
                        <h1>SLOOKS</h1>
                        <span>UNISEX SALON</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="desktop-nav">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                    <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}>Services</Link>
                    <a href="/#reviews" className="nav-link">Reviews</a>
                </nav>

                <div className="desktop-actions">
                    <Link to="/book" className="btn-primary">Book Appointment</Link>
                </div>

                {/* Mobile Toggle */}
                <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''} glass-panel`}>
                <nav>
                    <Link to="/" className="mobile-link" onClick={closeMenu}>Home</Link>
                    <Link to="/services" className="mobile-link" onClick={closeMenu}>Services</Link>
                    <a href="/#reviews" className="mobile-link" onClick={closeMenu}>Reviews</a>
                    <Link to="/book" className="btn-primary custom-btn-mobile" onClick={closeMenu}>Book Appointment</Link>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
