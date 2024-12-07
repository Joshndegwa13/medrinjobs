import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import {
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { useJobApplications } from '../../hooks/useJobApplications';

const CandidateCard = ({ application, onAccept, onReject }) => {
  // Format the applicant's name properly
  const applicantName = application.firstname && application.lastname 
    ? `${application.firstname} ${application.lastname}`
    : application.userName || 'Anonymous Applicant';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-dark-700 hover:shadow-xl transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {applicantName}
            </h3>
            <p className="text-primary-600 dark:text-primary-400">{application.jobTitle}</p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <EnvelopeIcon className="h-4 w-4" />
                <span>{application.userEmail}</span>
              </div>
              {application.phone && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <PhoneIcon className="h-4 w-4" />
                  <span>{application.phone}</span>
                </div>
              )}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Applied: {application.createdAt?.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        
        {application.status === 'pending' && (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAccept(application.id)}
              className="p-2 rounded-full text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <CheckCircleIcon className="h-6 w-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onReject(application.id)}
              className="p-2 rounded-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <XCircleIcon className="h-6 w-6" />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const CandidateManagement = () => {
  const { getEmployerApplications, updateApplicationStatus, loading } = useJobApplications();
  const [applications, setApplications] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const fetchedApplications = await getEmployerApplications();
      setApplications(fetchedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    }
  };

  const handleAccept = async (id) => {
    try {
      await updateApplicationStatus(id, 'accepted');
      setApplications(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status: 'accepted' } : app
        )
      );
      toast.success('Application accepted');
    } catch (error) {
      console.error('Error accepting application:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await updateApplicationStatus(id, 'rejected');
      setApplications(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status: 'rejected' } : app
        )
      );
      toast.success('Application rejected');
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  const pendingApplications = applications.filter(a => a.status === 'pending');
  const acceptedApplications = applications.filter(a => a.status === 'accepted');
  const rejectedApplications = applications.filter(a => a.status === 'rejected');

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Manage Applications</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-400 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading applications...</p>
          </div>
        ) : (
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex space-x-1 rounded-xl bg-primary-100 dark:bg-primary-900/20 p-1 mb-8">
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${
                    selected
                      ? 'bg-white dark:bg-dark-800 text-primary-700 dark:text-primary-400 shadow'
                      : 'text-primary-600 dark:text-primary-400 hover:bg-white/[0.12] hover:text-primary-700'
                  }`
                }
              >
                Pending ({pendingApplications.length})
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${
                    selected
                      ? 'bg-white dark:bg-dark-800 text-primary-700 dark:text-primary-400 shadow'
                      : 'text-primary-600 dark:text-primary-400 hover:bg-white/[0.12] hover:text-primary-700'
                  }`
                }
              >
                Accepted ({acceptedApplications.length})
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${
                    selected
                      ? 'bg-white dark:bg-dark-800 text-primary-700 dark:text-primary-400 shadow'
                      : 'text-primary-600 dark:text-primary-400 hover:bg-white/[0.12] hover:text-primary-700'
                  }`
                }
              >
                Rejected ({rejectedApplications.length})
              </Tab>
            </Tab.List>

            <Tab.Panels>
              <Tab.Panel>
                <AnimatePresence mode="popLayout">
                  <div className="space-y-4">
                    {pendingApplications.map(application => (
                      <CandidateCard
                        key={application.id}
                        application={application}
                        onAccept={handleAccept}
                        onReject={handleReject}
                      />
                    ))}
                    {pendingApplications.length === 0 && (
                      <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                        No pending applications
                      </p>
                    )}
                  </div>
                </AnimatePresence>
              </Tab.Panel>

              <Tab.Panel>
                <AnimatePresence mode="popLayout">
                  <div className="space-y-4">
                    {acceptedApplications.map(application => (
                      <CandidateCard
                        key={application.id}
                        application={application}
                      />
                    ))}
                    {acceptedApplications.length === 0 && (
                      <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                        No accepted applications
                      </p>
                    )}
                  </div>
                </AnimatePresence>
              </Tab.Panel>

              <Tab.Panel>
                <AnimatePresence mode="popLayout">
                  <div className="space-y-4">
                    {rejectedApplications.map(application => (
                      <CandidateCard
                        key={application.id}
                        application={application}
                      />
                    ))}
                    {rejectedApplications.length === 0 && (
                      <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                        No rejected applications
                      </p>
                    )}
                  </div>
                </AnimatePresence>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        )}
      </div>
    </div>
  );
};

export default CandidateManagement;