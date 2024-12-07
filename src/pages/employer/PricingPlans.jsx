import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';

const EXCHANGE_RATE = 153.50; // USD to KES rate

const plans = [
  {
    name: 'Single Job Post',
    price: 15,
    interval: 'one-time',
    features: [
      'Post one job listing',
      'Active for 30 days',
      'Basic candidate management',
      'Email support'
    ],
    cta: 'Post a Job',
    popular: false
  },
  {
    name: 'Basic Plan',
    price: 100,
    interval: 'month',
    features: [
      'Post up to 10 jobs/month',
      'Advanced candidate tracking',
      'Priority support',
      'Analytics dashboard',
      'Company profile page'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro Plan',
    price: 150,
    interval: 'month',
    features: [
      'Unlimited job posts',
      'Featured job listings',
      'Advanced analytics',
      'Priority support',
      'Custom company page',
      'API access'
    ],
    cta: 'Go Pro',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 1000,
    interval: 'year',
    features: [
      'Unlimited job posts',
      'Dedicated account manager',
      'Custom branding',
      'API access',
      'Advanced integrations',
      'Bulk posting tools',
      '24/7 priority support'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

const PricingPlans = () => {
  const [currency, setCurrency] = useState('USD');

  const formatPrice = (price) => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(price);
    } else {
      return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES'
      }).format(price * EXCHANGE_RATE);
    }
  };

  const formatInterval = (interval) => {
    if (interval === 'one-time') return '';
    return `/${interval}`;
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Choose Your Plan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
          >
            Find the perfect plan for your hiring needs
          </motion.p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrency('USD')}
              className={`px-4 py-2 rounded-lg ${
                currency === 'USD'
                  ? 'bg-primary-600 dark:bg-primary-500 text-white'
                  : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
              }`}
            >
              USD
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrency('KES')}
              className={`px-4 py-2 rounded-lg ${
                currency === 'KES'
                  ? 'bg-primary-600 dark:bg-primary-500 text-white'
                  : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
              }`}
            >
              KES
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-primary-600 dark:ring-primary-400' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary-600 dark:bg-primary-500 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                  Popular
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(plan.price)}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {formatInterval(plan.interval)}
                  </span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-lg font-medium ${
                    plan.popular
                      ? 'bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-600'
                      : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40'
                  } transition-colors`}
                >
                  {plan.cta}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-gray-600 dark:text-gray-300"
        >
          <p>All plans include our standard features. Need a custom plan?</p>
          <button className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300">
            Contact our sales team
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPlans;