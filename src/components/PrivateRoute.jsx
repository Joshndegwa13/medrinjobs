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

  // Not logged in
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Restrict access based on user type if specified
  if (userType && user.userType !== userType) {
    // If logged in as job seeker trying to access employer routes
    if (user.userType === 'job_seeker' && userType === 'employer') {
      return <Navigate to="/login" state={{ employerRequired: true }} replace />;
    }
    // If logged in as employer trying to access job seeker routes
    if (user.userType === 'employer' && userType === 'job_seeker') {
      return <Navigate to="/login" state={{ jobSeekerRequired: true }} replace />;
    }
    return <Navigate to={user.userType === 'employer' ? '/employer' : '/find-jobs'} replace />;
  }

  // Redirect to profile completion if needed
  if (!user.profileComplete && 
      !location.pathname.includes('complete-profile')) {
    return <Navigate 
      to={`/${user.userType === 'employer' ? 'employer' : 'jobseeker'}/complete-profile`} 
      replace 
    />;
  }

  return children;
};

export default PrivateRoute;