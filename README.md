# Slooks Unisex Salon 💇‍♀️💇‍♂️

A premium, modern, and beautiful full-stack salon management application built for **Slooks Unisex Salon**. It features an elegant customer-facing website for showcasing services and booking appointments, alongside a secured Admin Dashboard for managing the daily operations, revenue, and staff schedules.

## 🌟 Key Features

### Beautiful Customer Portal
*   **Immersive UI/UX:** Responsive, glass-morphism aesthetic designed with modern CSS conventions and smooth 3D hover animations.
*   **Service Exploration:** Dynamic filtering of services by category (Men, Women, Unisex) with detailed pricing and durations.
*   **Smart Booking Engine:** An advanced checkout system that automatically pre-fills selected services.
*   **Intelligent Double-Booking Prevention:** If a specific stylist is already booked for a requested time, the backend dynamically calculates and suggests immediate alternative time-slots (Next available today, or same time tomorrow) via an interactive UI.
*   **Payment Integration:** Seamlessly supports both "Pay at Salon" and "Pay Online" via Razorpay gateway integration.

### Secure Admin Dashboard
*   **Real-time Synchronization:** Powered by Socket.io to instantly push new incoming bookings to the admin screen, complete with optional Web Audio API voice announcements.
*   **Revenue Tracking:** At-a-glance metrics for total bookings, paid revenue, and pending payments for the current day.
*   **Appointment Management:** Comprehensive data tables to filter bookings by Date, Payment Status, and Method. Admins can update payment statuses or cancel appointments directly from the dashboard.
*   **Service Directory:** Internal view of all configured salon services and base metrics.

## 🛠️ Technology Stack

*   **Frontend:** React (Vite), React Router DOM, Framer Motion, Axios, Socket.io-client, Lucide React Icons.
*   **Backend:** Node.js, Express.js, Mongoose, Socket.io.
*   **Database:** MongoDB Atlas.
*   **Authentication:** JWT (JSON Web Tokens) and bcryptjs.
*   **Payments:** Razorpay.
*   **Deployment:** Vercel (Frontend edge network), Render (Backend API).

## 🚀 Local Development

### Prerequisites
*   Node.js (v18+ recommended)
*   A MongoDB UI or connection string (e.g., MongoDB Compass or Atlas)
*   A Razorpay Test API Key

### Backend Setup
1. Open a terminal and navigate to the `backend` folder.
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the `backend` root with the following keys:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```
4. *Optional:* Run `node seed.js` to populate the database with default Services and an Admin user (`owner` / `admin123`).
5. Run `npm run dev` to start the Express server (typically runs on `http://localhost:5000`).

### Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder.
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the `frontend` root. The application defaults to `http://localhost:5000` for local development. If your backend runs differently, set:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Run `npm run dev` to start the Vite development server.
5. Open your browser to the local URL provided by Vite (e.g., `http://localhost:5173`).

---

*Designed and engineered specifically for Slooks Unisex Salon.*