import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppShell from './components/AppShell';

// Public pages
import LandingPage from './pages/LandingPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';
import ProfilePage from './pages/ProfilePage';

// NGO pages
import NgoDashboard from './pages/ngo/NgoDashboard';
import NearbyRestaurantsPage from './pages/ngo/NearbyRestaurantsPage';
import NgoDonationDetail from './pages/ngo/NgoDonationDetail';
import NgoProfile from './pages/ngo/NgoProfile';

// Driver pages
import DriverDashboard from './pages/driver/DriverDashboard';
import DriverPickupDetail from './pages/driver/DriverPickupDetail';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDonations from './pages/admin/AdminDonations';
import AdminRecipients from './pages/admin/AdminRecipients';
import AdminDrivers from './pages/admin/AdminDrivers';
import AdminCertificates from './pages/admin/AdminCertificates';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppShell>
          <Routes>
            {/* Overview / Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* Direct Redirect for any login/signup links */}
            <Route path="/login" element={<Navigate to="/ngo/dashboard" replace />} />
            <Route path="/signup" element={<Navigate to="/ngo/dashboard" replace />} />

            {/* Public Certificate Verification */}
            <Route path="/verify/:id" element={<VerifyCertificatePage />} />

            {/* Profile */}
            <Route path="/profile" element={<ProfilePage />} />

            {/* NGO Routes */}
            <Route path="/ngo/dashboard" element={<NgoDashboard />} />
            <Route path="/ngo/restaurants" element={<NearbyRestaurantsPage />} />
            <Route path="/ngo/donations/:id" element={<NgoDonationDetail />} />
            <Route path="/ngo/profile" element={<NgoProfile />} />

            {/* Driver Routes */}
            <Route path="/driver/dashboard" element={<DriverDashboard />} />
            <Route path="/driver/pickups/:id" element={<DriverPickupDetail />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/donations" element={<AdminDonations />} />
            <Route path="/admin/recipients" element={<AdminRecipients />} />
            <Route path="/admin/drivers" element={<AdminDrivers />} />
            <Route path="/admin/certificates" element={<AdminCertificates />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </Router>
    </AuthProvider>
  );
}
