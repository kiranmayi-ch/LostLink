import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullPage text="Verifying authentication session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role)) {
      return (
        <div className="container" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '2.5rem' }}>
            <h2 style={{ color: 'var(--status-danger)', marginBottom: '1rem' }}>Access Restricted</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              You do not have permission to access the administrative portal. This area is reserved for verified campus staff and system administrators.
            </p>
            <a href="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>
              Return to Homepage
            </a>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
