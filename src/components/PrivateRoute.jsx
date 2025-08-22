import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, userType, redirectTo = '/login' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Restrict access based on user type
  if (userType && user.userType !== userType) {
    return <Navigate to={user.userType === 'employer' ? '/employer' : '/find-jobs'} replace />;
  }

  // Redirect to profile completion only if needed
  const profilePath = user.userType === 'employer'
    ? '/employer/complete-profile'
    : '/jobseeker/complete-profile';

  if (!user.profileComplete && location.pathname !== profilePath) {
    return <Navigate to={profilePath} replace />;
  }

  return children;
};

export default PrivateRoute;
