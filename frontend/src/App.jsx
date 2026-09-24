import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import AppShell from './components/AppShell';

// Public & Auth pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';
import ProfilePage from './pages/ProfilePage';
import AccountSettingsPage from './pages/AccountSettingsPage';

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

// Initial Entry Gate: Presents Login/Signup as the very first screen
function InitialEntryGate() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === 'DRIVER') return <Navigate to="/driver/dashboard" replace />;
  return <Navigate to="/ngo/dashboard" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <Router>
          <AppShell>
            <Routes>
              {/* Very First Screen: Login / Signup Gate */}
              <Route path="/" element={<InitialEntryGate />} />
              <Route path="/overview" element={<LandingPage />} />
              <Route path="/landing" element={<LandingPage />} />

              {/* Role-Based Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

            {/* Public Certificate Verification */}
            <Route path="/verify/:id" element={<VerifyCertificatePage />} />

            {/* User Profile & Account Settings */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<AccountSettingsPage />} />

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
    </SearchProvider>
  </AuthProvider>
  );
}
