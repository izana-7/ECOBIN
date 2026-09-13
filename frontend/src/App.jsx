import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ReportWastePage from './pages/ReportWastePage';
import AIScannerPage from './pages/AIScannerPage';
import BinLocatorPage from './pages/BinLocatorPage';
import CleanEarnPage from './pages/CleanEarnPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminReportsPage from './pages/AdminReportsPage';
import AdminMissionsPage from './pages/AdminMissionsPage';
import AdminBinsPage from './pages/AdminBinsPage';
import AdminUsersPage from './pages/AdminUsersPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-eco-400 font-bold">Loading EcoBin...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function ProtectedAdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-eco-400 font-bold">Loading EcoBin...</div>;
  }
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans pb-16 md:pb-0">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute><ReportWastePage /></ProtectedRoute>} />
          <Route path="/scan" element={<ProtectedRoute><AIScannerPage /></ProtectedRoute>} />
          <Route path="/bins" element={<ProtectedRoute><BinLocatorPage /></ProtectedRoute>} />
          <Route path="/clean-earn" element={<ProtectedRoute><CleanEarnPage /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboardPage /></ProtectedAdminRoute>} />
          <Route path="/admin/reports" element={<ProtectedAdminRoute><AdminReportsPage /></ProtectedAdminRoute>} />
          <Route path="/admin/missions" element={<ProtectedAdminRoute><AdminMissionsPage /></ProtectedAdminRoute>} />
          <Route path="/admin/bins" element={<ProtectedAdminRoute><AdminBinsPage /></ProtectedAdminRoute>} />
          <Route path="/admin/users" element={<ProtectedAdminRoute><AdminUsersPage /></ProtectedAdminRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <MobileNav />
      <Footer />
    </div>
  );
}
