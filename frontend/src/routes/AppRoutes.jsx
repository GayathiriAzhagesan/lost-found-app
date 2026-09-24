import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Pages
import LandingPage from '../pages/Landing/LandingPage';
import LoginPage from '../pages/Auth/Login/LoginPage';
import RegisterPage from '../pages/Auth/Register/RegisterPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import LostItemsPage from '../pages/LostItems/LostItemsPage';
import FoundItemsPage from '../pages/FoundItems/FoundItemsPage';
import ItemDetailsPage from '../pages/ItemDetails/ItemDetailsPage';
import ReportItemPage from '../pages/ReportItem/ReportItemPage';
import MyItemsPage from '../pages/MyItems/MyItemsPage';
import MyClaimsPage from '../pages/MyClaims/MyClaimsPage';
import NotificationsPage from '../pages/Notifications/NotificationsPage';
import ProfilePage from '../pages/Profile/ProfilePage';

// Admin Pages
import AdminDashboardPage from '../pages/Admin/Dashboard/AdminDashboardPage';
import AdminUsersPage from '../pages/Admin/Users/AdminUsersPage';
import AdminItemsPage from '../pages/Admin/Items/AdminItemsPage';
import AdminClaimsPage from '../pages/Admin/Claims/AdminClaimsPage';

// Protected Route Guard
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Checking authentication status..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Admin Route Guard
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Verifying permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/lost-items" element={<LostItemsPage />} />
      <Route path="/found-items" element={<FoundItemsPage />} />
      <Route path="/items/:id" element={<ItemDetailsPage />} />

      {/* User Protected Routes */}
      <Route
        path="/report"
        element={
          <ProtectedRoute>
            <ReportItemPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-items"
        element={
          <ProtectedRoute>
            <MyItemsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-claims"
        element={
          <ProtectedRoute>
            <MyClaimsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsersPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/items"
        element={
          <AdminRoute>
            <AdminItemsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/claims"
        element={
          <AdminRoute>
            <AdminClaimsPage />
          </AdminRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
