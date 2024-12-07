import React from 'react';
import { motion } from 'framer-motion';

const FilterSection = ({
  selectedType,
  setSelectedType,
  selectedLevel,
  setSelectedLevel,
  employmentTypes,
  experienceLevels
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Type of Employment</h3>
        <div className="space-y-3">
          {employmentTypes.map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedType === type}
                onChange={() => setSelectedType(selectedType === type ? '' : type)}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience Level</h3>
        <div className="space-y-3">
          {experienceLevels.map((level) => (
            <label key={level} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLevel === level}
                onChange={() => setSelectedLevel(selectedLevel === level ? '' : level)}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-gray-700">{level}</span>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FilterSection;