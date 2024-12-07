import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, 50]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/find-jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/find-jobs');
    }
  };

  const popularSearches = [
    'Software Engineer', 'Marketing Manager', 'Data Analyst',
    'Product Manager', 'Sales Representative'
  ];

  const handlePopularSearch = (term) => {
    navigate(`/find-jobs?search=${encodeURIComponent(term)}`);
  };

  return (
    <div ref={containerRef} className="relative min-h-[calc(100vh-4rem)] pt-16 sm:pt-20 pb-8 sm:pb-16 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-primary-50/50 to-white">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 50% 50%, rgba(2, 132, 199, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 60% 40%, rgba(2, 132, 199, 0.2) 0%, transparent 60%)',
              'radial-gradient(circle at 40% 60%, rgba(2, 132, 199, 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-8rem)]">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6 sm:space-y-10 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="space-y-4 sm:space-y-6"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-gray-900">Find the perfect</span>
                <br />
                <span className="text-primary-600">job for you</span>
              </h1>
              <p className="text-lg sm:text-2xl text-gray-600 max-w-lg mx-auto lg:mx-0">
                Search your career opportunity through thousands of jobs
              </p>
            </motion.div>

            <motion.form 
              onSubmit={handleSearch}
              className="bg-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Job Title or Keyword"
                    className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-200/50 transition-all outline-none bg-white text-base sm:text-lg text-gray-900"
                  />
                </div>
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-primary-600 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/25 text-base sm:text-lg font-medium whitespace-nowrap"
                >
                  Search Jobs
                </motion.button>
              </div>
            </motion.form>

            <div className="space-y-4">
              <p className="text-gray-700 font-medium">Popular Searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handlePopularSearch(search)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white px-4 py-2 rounded-full text-primary-600 hover:bg-primary-50 hover:text-primary-700 transition-colors border border-primary-100 shadow-sm hover:shadow-md"
                  >
                    {search}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative z-20 rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]"
              >
                <img
                  src="https://diversitycomm.net/wp-content/uploads/2022/11/business-group.jpg.webp"
                  alt="Diverse group of professionals"
                  className="w-full h-full object-cover object-center rounded-2xl"
                />
              </motion.div>

              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -top-10 -right-10 z-30"
              >
                <div className="bg-white p-4 rounded-xl shadow-lg border border-primary-100">
                  <p className="text-2xl font-bold text-primary-600">500+</p>
                  <p className="text-sm text-gray-600">Companies Hiring</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute -bottom-10 left-10 z-30"
              >
                <div className="bg-white p-4 rounded-xl shadow-lg border border-primary-100">
                  <p className="text-2xl font-bold text-primary-600">1000+</p>
                  <p className="text-sm text-gray-600">Active Jobs</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;