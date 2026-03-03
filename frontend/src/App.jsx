import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Admin from './pages/Admin';
import ReviewsPage from './pages/ReviewsPage';
import MyBookings from './pages/MyBookings';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <Router>
      <div className="page-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/book" element={<Booking />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/staff-login" element={<Admin />} />
            <Route path="/dashboard" element={<Admin />} />
            {/* Kept for backward compatibility */}
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
        <SpeedInsights />
        <Analytics />
      </div>
    </Router>
  );
}

export default App;
