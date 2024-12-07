import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useJobSearch } from '../hooks/useJobSearch';
import { locations, categories, employmentTypes, experienceLevels } from '../data/jobsData';
import JobCard from '../components/JobCard';
import FilterSection from '../components/FilterSection';
import JobModal from '../components/JobModal';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const FindJobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchJobs, loading, error } = useJobSearch();
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [selectedCategory, selectedLocation, selectedType, selectedLevel]);

  const fetchJobs = async () => {
    try {
      const filters = {
        category: selectedCategory,
        location: selectedLocation,
        employmentType: selectedType,
        experienceLevel: selectedLevel
      };
      const fetchedJobs = await searchJobs(filters);
      setJobs(fetchedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { search: searchQuery } : {});
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const filteredJobs = jobs.filter(job => {
    if (!searchQuery) return true;
    
    const searchTerms = searchQuery.toLowerCase().split(' ');
    return searchTerms.every(term => 
      job.title?.toLowerCase().includes(term) ||
      job.companyName?.toLowerCase().includes(term) ||
      job.description?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-dark-900">
      {/* Search Section */}
      <div className="bg-primary-600 dark:bg-primary-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Job Title or Keyword"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-white/20 focus:border-white focus:ring-4 focus:ring-white/20 transition-all outline-none bg-white/10 text-white placeholder-white/60 dark:bg-dark-800/50 dark:border-dark-700"
                />
                <MagnifyingGlassIcon 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/60"
                />
              </div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="py-4 px-4 rounded-xl border-2 border-white/20 bg-white/10 text-white dark:bg-dark-800/50 dark:border-dark-700 outline-none focus:border-white"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location} className="text-gray-900 dark:text-white bg-white dark:bg-dark-800">
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <FilterSection
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
              employmentTypes={employmentTypes}
              experienceLevels={experienceLevels}
            />
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? 'Loading...' : `${filteredJobs.length} Jobs Found`}
              </h2>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="py-2 px-4 rounded-lg border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white outline-none focus:border-primary-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-400 mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-400 mt-4">Loading jobs...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div layout className="space-y-6">
                  {filteredJobs.map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onClick={() => handleJobClick(job)}
                    />
                  ))}
                  {filteredJobs.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <p className="text-xl text-gray-600 dark:text-gray-400">No jobs found matching your criteria</p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      <JobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={selectedJob}
      />
    </div>
  );
};

export default FindJobs;