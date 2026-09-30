import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="pt-32">
        <Loader text="Authenticating secure gateway..." />
      </div>
    );
  }

  if (!user) {
    // Redirect to login page but save the original location we wanted to visit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
