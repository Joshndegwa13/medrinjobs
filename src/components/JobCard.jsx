import React from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, ClockIcon, BriefcaseIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const JobCard = ({ job, onClick }) => {
  const formatDate = (date) => {
    if (!date) return 'Recently';
    try {
      if (date instanceof Date) {
        return date.toLocaleDateString();
      }
      return new Date(date).toLocaleDateString();
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Recently';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
          <p className="text-primary-600 font-medium mb-4">{job.companyName}</p>
          
          <div className="flex flex-wrap gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <BriefcaseIcon className="h-5 w-5" />
              <span>{job.employmentType}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5" />
              <span>Posted: {formatDate(job.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-primary-600">
              <UserGroupIcon className="h-5 w-5" />
              <span>{job.applicantCount || 0} {job.applicantCount === 1 ? 'Applicant' : 'Applicants'}</span>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onClick(job);
          }}
          className="p-2 rounded-full text-primary-600 hover:bg-primary-50"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default JobCard;