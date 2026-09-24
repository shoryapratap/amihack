import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';
import ProfilePage from './pages/ProfilePage';

// NGO pages
import NgoDashboard from './pages/ngo/NgoDashboard';
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

// Route Guard Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify/:id" element={<VerifyCertificatePage />} />

          {/* Shared Authenticated Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* NGO Routes */}
          <Route
            path="/ngo/dashboard"
            element={
              <ProtectedRoute allowedRoles={['NGO', 'ADMIN']}>
                <NgoDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo/donations/:id"
            element={
              <ProtectedRoute allowedRoles={['NGO', 'ADMIN']}>
                <NgoDonationDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo/profile"
            element={
              <ProtectedRoute allowedRoles={['NGO', 'ADMIN']}>
                <NgoProfile />
              </ProtectedRoute>
            }
          />

          {/* Driver Routes */}
          <Route
            path="/driver/dashboard"
            element={
              <ProtectedRoute allowedRoles={['DRIVER', 'ADMIN']}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/pickups/:id"
            element={
              <ProtectedRoute allowedRoles={['DRIVER', 'ADMIN']}>
                <DriverPickupDetail />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/donations"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDonations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/recipients"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminRecipients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/drivers"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDrivers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/certificates"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminCertificates />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

