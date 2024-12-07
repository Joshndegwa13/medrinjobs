import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BuildingOfficeIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

const navVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

const dropdownVariants = {
  hidden: { 
    opacity: 0, 
    y: 10,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: { 
    opacity: 0, 
    y: 10,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

const EmployerNavbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="fixed w-full z-50 bg-white dark:bg-dark-800 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                Medrin Jobs
              </span>
            </Link>
          </motion.div>

          <div className="flex items-center space-x-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/employer/pricing"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium px-4 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-dark-700 transition-colors"
              >
                Pricing Plans
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/employer/candidates"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium px-4 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-dark-700 transition-colors"
              >
                Manage Applications
              </Link>
            </motion.div>

            <ThemeToggle />

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDropdown(!showDropdown)}
                className="inline-flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors bg-white dark:bg-dark-800 px-4 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-dark-700"
              >
                <div className="flex items-center space-x-2">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {user?.companyLogo ? (
                      <img 
                        src={user.companyLogo} 
                        alt="Company Logo" 
                        className="h-8 w-8 rounded-full object-cover border-2 border-primary-100 dark:border-primary-800"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <BuildingOfficeIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                    )}
                  </motion.div>
                  <span className="font-medium">{user?.company_name || 'Company'}</span>
                  <motion.div
                    animate={{ rotate: showDropdown ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDownIcon className="h-4 w-4" />
                  </motion.div>
                </div>
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-xl shadow-lg py-1 ring-1 ring-black ring-opacity-5"
                  >
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link
                        to="/employer/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-dark-700"
                        onClick={() => setShowDropdown(false)}
                      >
                        Company Profile
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        Logout
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default EmployerNavbar;