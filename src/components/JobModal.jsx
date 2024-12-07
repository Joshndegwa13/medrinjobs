import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useJobApplications } from '../hooks/useJobApplications';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const JobModal = ({ isOpen, onClose, job }) => {
  const { user } = useAuth();
  const { submitApplication, loading } = useJobApplications();
  const [showSuccess, setShowSuccess] = useState(false);

  if (!job) return null;

  const handleApply = async () => {
    if (!user) {
      toast.error('Please login to apply for jobs');
      return;
    }

    try {
      await submitApplication(job.id, job);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Application error:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4">
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white dark:bg-dark-800 rounded-2xl shadow-2xl p-6 mx-auto my-8"
              >
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </button>

                <AnimatePresence mode="wait">
                  {showSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center justify-center py-12"
                    >
                      <CheckCircleIcon className="h-16 w-16 text-green-500" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Successful!</h3>
                      <p className="text-gray-600 dark:text-gray-300">Thank you for applying to {job.title}</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h2>
                        <p className="text-xl text-primary-600 dark:text-primary-400">{job.companyName}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Location</p>
                          <p className="font-medium text-gray-900 dark:text-white">{job.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Employment Type</p>
                          <p className="font-medium text-gray-900 dark:text-white">{job.employmentType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Experience Level</p>
                          <p className="font-medium text-gray-900 dark:text-white">{job.experienceLevel}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Salary Range</p>
                          <p className="font-medium text-gray-900 dark:text-white">{job.salary}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Job Description</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{job.description}</p>
                      </div>

                      {job.responsibilities && job.responsibilities.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Key Responsibilities</h3>
                          <ul className="list-disc list-inside space-y-2">
                            {job.responsibilities.map((item, index) => (
                              <li key={index} className="text-gray-700 dark:text-gray-300">{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {job.qualifications && job.qualifications.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Qualifications</h3>
                          <ul className="list-disc list-inside space-y-2">
                            {job.qualifications.map((item, index) => (
                              <li key={index} className="text-gray-700 dark:text-gray-300">{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex justify-end gap-4 pt-4">
                        <motion.button
                          onClick={onClose}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                        >
                          Cancel
                        </motion.button>
                        {user?.userType === 'job_seeker' && (
                          <motion.button
                            onClick={handleApply}
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-2.5 rounded-lg bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors disabled:opacity-50"
                          >
                            {loading ? 'Applying...' : 'Apply Now'}
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default JobModal;