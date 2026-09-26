import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import RequireClient from './components/RequireClient.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';

import Landing from './pages/Landing.jsx';
import Booking from './pages/Booking.jsx';
import ClientLogin from './pages/ClientLogin.jsx';
import ClientDashboard from './pages/ClientDashboard.jsx';
import EmailVerificationPending from './pages/EmailVerificationPending.jsx';
import DashboardAppointments from './pages/dashboard/DashboardAppointments.jsx';
import DashboardProfile from './pages/dashboard/DashboardProfile.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminCalendar from './pages/admin/AdminCalendar.jsx';
import AdminClients from './pages/admin/AdminClients.jsx';
import AdminClientDetail from './pages/admin/AdminClientDetail.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';
import AdminAppointmentTypes from './pages/admin/AdminAppointmentTypes.jsx';
import AdminReviewQueue from './pages/admin/AdminReviewQueue.jsx';

function RequireAdmin({ children }) {
  const { admin } = useAuth();
  if (!admin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/book/*" element={<Booking />} />
      <Route path="/login" element={<ClientLogin />} />

      <Route
        path="/verify-email"
        element={
          <RequireClient>
            <EmailVerificationPending />
          </RequireClient>
        }
      />

      <Route
        path="/dashboard"
        element={
          <RequireClient>
            <DashboardLayout />
          </RequireClient>
        }
      >
        <Route index element={<ClientDashboard />} />
        <Route path="appointments" element={<DashboardAppointments />} />
        <Route path="profile" element={<DashboardProfile />} />
      </Route>

      {/* Legacy redirects for any bookmark still pointing at the old paths. */}
      <Route path="/my-appointments" element={<Navigate to="/dashboard/appointments" replace />} />
      <Route path="/my-profile" element={<Navigate to="/dashboard/profile" replace />} />

      {/* Obscured staff login — path token required */}
      <Route path="/staff-portal/:pathToken" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Navigate to="calendar" replace />} />
        <Route path="calendar" element={<AdminCalendar />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="clients/:id" element={<AdminClientDetail />} />
        <Route path="types" element={<AdminAppointmentTypes />} />
        <Route path="review" element={<AdminReviewQueue />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
