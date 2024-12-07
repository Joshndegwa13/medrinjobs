import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const testimonials = [
  {
    name: 'Joshua N.',
    text: 'The seamless user experience at Medrin Jobs made my job search incredibly efficient. I found my dream position within weeks!',
    role: 'Software Engineer',
    rating: 5
  },
  {
    name: 'Walter I.',
    text: 'As a fresh graduate, Medrin Jobs helped me land my first job. The platform is intuitive and the job matches were spot-on!',
    role: 'Marketing Associate',
    rating: 5
  },
  {
    name: 'Craig W.',
    text: 'The filtering functionality helped me find exactly what I was looking for. Medrin Jobs streamlined my entire job search process.',
    role: 'Product Manager',
    rating: 5
  },
  {
    name: 'Joy M.',
    text: 'The affordable price options made premium job searching accessible. I found great value in the services provided!',
    role: 'Financial Analyst',
    rating: 5
  },
  {
    name: 'Winnie O.',
    text: 'Medrin Jobs excels at connecting job seekers with employers. The platform helped me find my perfect career match!',
    role: 'HR Manager',
    rating: 5
  }
];

const TestimonialCard = ({ testimonial, isActive }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.9 }}
    transition={{ duration: 0.5 }}
    className={`bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-xl transform transition-all duration-500 ${
      isActive ? 'scale-100 z-10' : 'scale-95 opacity-50'
    }`}
  >
    <div className="flex gap-1 mb-6">
      {[...Array(testimonial.rating)].map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="text-yellow-400 text-2xl"
        >
          ⭐
        </motion.span>
      ))}
    </div>
    <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed italic">
      "{testimonial.text}"
    </p>
    <div className="flex items-center">
      <div>
        <p className="text-xl font-semibold text-gray-900 dark:text-white">
          {testimonial.name}
        </p>
        <p className="text-primary-600 dark:text-primary-400">
          {testimonial.role}
        </p>
      </div>
    </div>
  </motion.div>
);

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-primary-50 dark:from-dark-800 to-white dark:to-dark-900 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Why Customers Love Us
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 dark:text-gray-300"
          >
            What our customers say about us
          </motion.p>
        </div>

        <div className="relative">
          <div className="flex justify-center items-center gap-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevious}
              className="p-2 rounded-full bg-white dark:bg-dark-800 shadow-lg hover:shadow-xl transition-all"
            >
              <ChevronLeftIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </motion.button>

            <div className="relative w-full max-w-3xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                >
                  <TestimonialCard
                    testimonial={testimonials[currentIndex]}
                    isActive={true}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="p-2 rounded-full bg-white dark:bg-dark-800 shadow-lg hover:shadow-xl transition-all"
            >
              <ChevronRightIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </motion.button>
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-primary-600 dark:bg-primary-400 w-6' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Testimonials;