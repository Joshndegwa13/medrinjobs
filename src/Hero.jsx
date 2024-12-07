import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, 50]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const popularSearches = [
    'Software Engineer', 'Marketing Manager', 'Data Analyst',
    'Product Manager', 'Sales Representative'
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen pt-20 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-primary-50 to-white">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 60% 40%, rgba(14, 165, 233, 0.15) 0%, transparent 60%)',
              'radial-gradient(circle at 40% 60%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0"
        />
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-primary-100/40 to-primary-200/40 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-20 right-10 w-[30rem] h-[30rem] bg-gradient-to-tr from-primary-200/40 to-primary-100/40 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="space-y-6"
            >
              <h1 className="text-7xl font-bold text-gray-900 leading-tight">
                Find the perfect
                <br />
                <motion.span 
                  className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent inline-block"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  job for you
                </motion.span>
              </h1>
              <p className="text-2xl text-gray-600 max-w-lg">
                Search your career opportunity through thousands of jobs
              </p>
            </motion.div>

            <motion.form 
              onSubmit={handleSearch}
              className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Job Title or Keyword"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-200/50 transition-all outline-none bg-white/90 text-lg"
                  />
                </div>
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-primary-600 text-white px-10 py-4 rounded-xl hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/25 text-lg font-medium"
                >
                  Search Jobs
                </motion.button>
              </div>
            </motion.form>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="space-y-4"
            >
              <p className="text-gray-700 font-medium text-lg">Popular Searches:</p>
              <div className="flex flex-wrap gap-3">
                {popularSearches.map((search, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/find-jobs"
                      className="block bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full text-gray-600 hover:text-primary-600 transition-all border border-gray-100 hover:border-primary-200 shadow-sm hover:shadow-lg hover:bg-white"
                    >
                      {search}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Images */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="relative hidden lg:block"
          >
            <motion.div
              initial={{ opacity: 0, x: 20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute right-10 top-20 z-20"
            >
              <div className="bg-white/90 rounded-2xl shadow-2xl p-6 backdrop-blur-xl border border-white">
                <div className="flex flex-col gap-2">
                  <p className="text-3xl font-bold text-gray-900">319</p>
                  <p className="text-gray-600">Legal Jobs Available</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="absolute left-10 bottom-20 z-20"
            >
              <div className="bg-white/90 rounded-2xl shadow-2xl p-6 backdrop-blur-xl border border-white">
                <div className="flex flex-col gap-2">
                  <p className="text-3xl font-bold text-gray-900">450+</p>
                  <p className="text-gray-600">Construction Jobs</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="relative z-10 mt-10"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"
                  alt="Professional woman"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;