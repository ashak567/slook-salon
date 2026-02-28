import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Star, Award, Heart } from 'lucide-react';
import Reviews from '../components/Reviews';
import './Home.css';

const Home = () => {
    // Parallax effect for hero section
    useEffect(() => {
        const handleScroll = () => {
            const hero = document.getElementById('hero-bg');
            if (hero) {
                let scrollPosition = window.pageYOffset;
                hero.style.transform = `translateY(${scrollPosition * 0.4}px)`;
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    return (
        <div className="home-page">
            {/* HERO SECTION */}
            <section className="hero">
                <div id="hero-bg" className="hero-bg"></div>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="hero-text-wrapper"
                    >
                        <motion.span variants={fadeInUp} className="hero-subtitle">Premium Experience in Ballari</motion.span>
                        <motion.h1 variants={fadeInUp} className="hero-title">
                            Discover Your <br /><span className="text-gold">Perfect Look</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="hero-desc">
                            Experience luxury grooming, expert styling, and rejuvenating treatments.
                            Where every detail is crafted for your confidence.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="hero-actions">
                            <Link to="/book" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>
                                <Sparkles size={20} />
                                Book Your Experience
                            </Link>
                            <Link to="/services" className="btn-secondary" style={{ padding: '15px 36px', fontSize: '1.1rem', borderColor: 'var(--color-cream)', color: 'var(--color-cream)' }}>
                                Explore Services
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* WHY CHOOSE US SECTION */}
            <section className="why-us">
                <div className="section-container">
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                        className="section-title"
                    >
                        Why Choose Us
                    </motion.h2>

                    <motion.div
                        className="features-grid"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp} className="feature-card hover-3d glass-panel">
                            <div className="feature-icon"><Star /></div>
                            <h3>Expert Stylists</h3>
                            <p>Highly trained professionals dedicated to bringing your vision to life with precision.</p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="feature-card hover-3d glass-panel">
                            <div className="feature-icon"><Award /></div>
                            <h3>Premium Products</h3>
                            <p>We use only top-tier, international salon products to ensure the best results and care.</p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="feature-card hover-3d glass-panel">
                            <div className="feature-icon"><Heart /></div>
                            <h3>Luxury Ambience</h3>
                            <p>Relax in our carefully designed, soothing environment meant to be your personal retreat.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* STYLIST / ABOUT SECTION with blur-to-clear effect */}
            <section className="about-section">
                <div className="about-container">
                    <div className="about-image-wrapper">
                        {/* Using a placeholder for styling, would be replaced with real salon image */}
                        <div className="about-image blur-reveal"></div>
                    </div>
                    <motion.div
                        className="about-text"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2>The Slooks Philosophy</h2>
                        <p className="kannada-text">ಸ್ಲಾಕ್ಸ್ ಯುನಿಸೆಕ್ಸ್ ಸಲೋನ್</p>
                        <p>
                            Located in the heart of Ballari, we believe that beauty and grooming are
                            forms of self-expression and self-care.
                        </p>
                        <p>
                            Our unisex salon is designed to serve everyone with equality, offering a comprehensive
                            range of services from cutting-edge hair styling to advanced skin treatments.
                            We blend modern techniques with a warm, welcoming environment to ensure every
                            visit leaves you feeling refreshed and confident.
                        </p>
                        <Link to="/book" className="btn-primary" style={{ marginTop: '20px' }}>Book Now</Link>
                    </motion.div>
                </div>
            </section>

            {/* REVIEWS SECTION */}
            <Reviews />

            {/* QUICK CTA */}
            <section className="cta-section">
                <div className="cta-content glass-panel">
                    <h2>Ready for your transformation?</h2>
                    <p>Book your appointment today and secure your spot with our expert stylists.</p>
                    <Link to="/book" className="btn-primary" style={{ marginTop: '30px' }}>Book Appointment Now</Link>
                </div>
            </section>

        </div>
    );
};

export default Home;
