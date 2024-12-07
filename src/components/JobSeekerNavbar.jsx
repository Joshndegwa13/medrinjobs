import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircleIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useJobApplications } from '../hooks/useJobApplications';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const JobSeekerNavbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const { getUserApplications } = useJobApplications();
  const [applications, setApplications] = useState([]);
  
  useEffect(() => {
    if (showApplicationsModal) {
      fetchApplications();
    }
  }, [showApplicationsModal]);

  const fetchApplications = async () => {
    try {
      const apps = await getUserApplications();
      setApplications(apps);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 bg-white dark:bg-dark-800 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            Medrin Jobs
          </Link>

          <div className="flex items-center space-x-4">
            <Link 
              to="/find-jobs" 
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              Find Jobs
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowApplicationsModal(true)}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              View Applications
            </motion.button>

            <ThemeToggle />

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-200"
              >
                <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <UserCircleIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <span>{user?.firstname || 'User'}</span>
                <ChevronDownIcon className="h-4 w-4" />
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-xl shadow-lg py-1"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-dark-700"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showApplicationsModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplicationsModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4">
              <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative w-full max-w-2xl bg-white dark:bg-dark-800 rounded-xl shadow-2xl p-6 mx-auto my-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Jobs Applied
                  </h2>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {applications.map((application) => (
                      <motion.div
                        key={application.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                      >
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {application.jobTitle}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">{application.companyName}</p>
                        <p className="text-sm text-primary-600 dark:text-primary-400 mt-2">
                          Status: {application.status}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Applied: {application.createdAt?.toLocaleDateString()}
                        </p>
                      </motion.div>
                    ))}
                    {applications.length === 0 && (
                      <p className="text-center text-gray-600 dark:text-gray-400 py-4">
                        No applications yet
                      </p>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowApplicationsModal(false)}
                    className="mt-6 w-full bg-primary-600 dark:bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                  >
                    Close
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default JobSeekerNavbar;