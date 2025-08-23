import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, userType, redirectTo = '/login' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If no user logged in → go to login
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user exists but we don’t yet know their type → wait
  if (userType && !user.userType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Restrict based on type
  if (userType && user.userType !== userType) {
    return <Navigate to={user.userType === 'employer' ? '/employer' : '/find-jobs'} replace />;
  }

  // Redirect to profile completion if incomplete
  const profilePath = user.userType === 'employer'
    ? '/employer/complete-profile'
    : '/jobseeker/complete-profile';

  if (user.userType && !user.profileComplete && location.pathname !== profilePath) {
    return <Navigate to={profilePath} replace />;
  }

  return children;
};

export default PrivateRoute;
