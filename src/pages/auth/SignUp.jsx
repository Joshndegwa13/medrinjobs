import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BriefcaseIcon, UserIcon } from '@heroicons/react/24/outline';

const SignUp = () => {
  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join Medrin Jobs
          </h1>
          <p className="text-xl text-gray-600">
            Choose how you want to get started
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/signup/job-seeker"
              className="block h-full p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-primary-500"
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                  <UserIcon className="h-10 w-10 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  I'm a Job Seeker
                </h2>
                <p className="text-gray-600 mb-6">
                  Create an account to find and apply for jobs
                </p>
                <motion.span
                  className="text-primary-600 font-medium"
                  whileHover={{ x: 5 }}
                >
                  Get Started →
                </motion.span>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/signup/employer"
              className="block h-full p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-primary-500"
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                  <BriefcaseIcon className="h-10 w-10 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  I'm an Employer
                </h2>
                <p className="text-gray-600 mb-6">
                  Create an account to post jobs and find talent
                </p>
                <motion.span
                  className="text-primary-600 font-medium"
                  whileHover={{ x: 5 }}
                >
                  Get Started →
                </motion.span>
              </div>
            </Link>
          </motion.div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;