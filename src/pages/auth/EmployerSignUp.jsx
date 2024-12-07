import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import axios from 'axios';

const schema = z.object({
  company_name: z.string().min(2, 'Company name is too short'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  location: z.string().min(2, 'Location is required'),
  description: z.string().min(10, 'Description is too short'),
  vision: z.string().min(10, 'Vision statement is too short'),
  mission: z.string().min(10, 'Mission statement is too short')
});

const EmployerSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: '',
    email: '',
    password: '',
    location: '',
    description: '',
    vision: '',
    mission: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const validatedData = schema.parse(formData);
      const response = await axios.post('/api/register/employer', validatedData);
      toast.success('Registration successful! Please verify your email.');
      setShowOTPInput(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach(err => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else {
        toast.error(error.response?.data?.error || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post('/api/verify-otp', {
        email: formData.email,
        otp,
        user_type: 'employer'
      });
      toast.success('Email verified successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (showOTPInput) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Verify Your Email</h2>
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Employer Account</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.company_name ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-primary-500`}
                  required
                />
                {errors.company_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.company_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-primary-500`}
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-primary-500`}
                  required
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-primary-500`}
                  required
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-primary-500`}
                  required
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Vision
                </label>
                <textarea
                  name="vision"
                  value={formData.vision}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.vision ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-primary-500`}
                  required
                />
                {errors.vision && (
                  <p className="mt-1 text-sm text-red-500">{errors.vision}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Mission
                </label>
                <textarea
                  name="mission"
                  value={formData.mission}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.mission ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-primary-500`}
                  required
                />
                {errors.mission && (
                  <p className="mt-1 text-sm text-red-500">{errors.mission}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary-600 text-white px-8 py-2.5 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EmployerSignUp;