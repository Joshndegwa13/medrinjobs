import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Business Development', icon: '💼', color: 'bg-blue-50 dark:bg-blue-900/20' },
  { name: 'Building and Construction', icon: '🏗️', color: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { name: 'Customer Service', icon: '🎯', color: 'bg-green-50 dark:bg-green-900/20' },
  { name: 'Banking and Finance', icon: '💰', color: 'bg-purple-50 dark:bg-purple-900/20' },
  { name: 'Healthcare', icon: '⚕️', color: 'bg-red-50 dark:bg-red-900/20' },
  { name: 'Human Resource', icon: '👥', color: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { name: 'Marketing and Communication', icon: '📢', color: 'bg-pink-50 dark:bg-pink-900/20' },
  { name: 'Government', icon: '🏛️', color: 'bg-gray-50 dark:bg-gray-900/20' },
  { name: 'Project Management', icon: '📊', color: 'bg-teal-50 dark:bg-teal-900/20' },
  { name: 'IT and Software Development', icon: '💻', color: 'bg-cyan-50 dark:bg-cyan-900/20' },
  { name: 'Agriculture', icon: '🌾', color: 'bg-lime-50 dark:bg-lime-900/20' },
  { name: 'Hospitality and Leisure', icon: '🏨', color: 'bg-orange-50 dark:bg-orange-900/20' },
  { name: 'Legal', icon: '⚖️', color: 'bg-violet-50 dark:bg-violet-900/20' },
  { name: 'Teaching', icon: '📚', color: 'bg-rose-50 dark:bg-rose-900/20' },
];

const CategoryCard = ({ category, index }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to="/find-jobs"
        className={`group block p-6 ${category.color} rounded-2xl hover:scale-105 transform transition-all duration-300 hover:shadow-2xl border border-white/50 dark:border-gray-700/50 backdrop-blur-sm`}
      >
        <div className="relative overflow-hidden">
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.2, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-5xl mb-4 transform transition-transform duration-300"
          >
            {category.icon}
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {category.name}
          </h3>
          <motion.p
            initial={{ x: -10, opacity: 0 }}
            whileHover={{ x: 0, opacity: 1 }}
            className="text-primary-600 dark:text-primary-400 flex items-center gap-2"
          >
            View Jobs
            <motion.span
              initial={{ x: -5 }}
              whileHover={{ x: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              →
            </motion.span>
          </motion.p>
        </div>
      </Link>
    </motion.div>
  );
};

const Categories = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white dark:from-dark-900 to-primary-50/30 dark:to-primary-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Search by Category
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Search your career opportunity with our categories
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <CategoryCard key={index} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;