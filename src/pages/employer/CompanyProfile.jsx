import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { toast } from 'react-hot-toast';
import { BuildingOfficeIcon, PhotoIcon } from '@heroicons/react/24/outline';

const CompanyProfile = () => {
  const { user } = useAuth();
  const { fetchProfile, updateProfile, loading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    company_size: '',
    founded_year: '',
    website: '',
    location: '',
    description: '',
    mission: '',
    vision: '',
    companyLogo: null,
    companyLogoUrl: null
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchProfile();
        if (profileData) {
          setProfile(profileData);
          setFormData({
            company_name: profileData.company_name || '',
            industry: profileData.industry || '',
            company_size: profileData.company_size || '',
            founded_year: profileData.founded_year || '',
            website: profileData.website || '',
            location: profileData.location || '',
            description: profileData.description || '',
            mission: profileData.mission || '',
            vision: profileData.vision || '',
            companyLogoUrl: profileData.logo || null
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load company profile');
      }
    };

    loadProfile();
  }, [fetchProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      if (files[0].size > 1024 * 1024) {
        toast.error('File size must be less than 1MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          [`${name}Url`]: reader.result
        }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        ...formData,
        logo: formData.companyLogoUrl
      };
      
      delete updateData.companyLogo;
      delete updateData.companyLogoUrl;

      await updateProfile(updateData);
      setIsEditing(false);
      setProfile(prev => ({ ...prev, ...updateData }));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update company profile');
    }
  };

  if (!profile && !loading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Company profile not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-dark-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Profile</h1>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEditing(!isEditing)}
              className="text-primary-600 dark:text-primary-400 font-medium"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-8">
              {formData.companyLogoUrl ? (
                <img
                  src={formData.companyLogoUrl}
                  alt="Company Logo"
                  className="h-32 w-32 rounded-lg object-cover"
                />
              ) : (
                <BuildingOfficeIcon className="h-32 w-32 text-gray-400" />
              )}
            </div>

            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Logo
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label className="relative cursor-pointer rounded-md bg-white dark:bg-dark-800 font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          name="companyLogo"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 1MB</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Size
                </label>
                <select
                  name="company_size"
                  value={formData.company_size}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-700"
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501+">501+ employees</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Founded Year
                </label>
                <input
                  type="number"
                  name="founded_year"
                  value={formData.founded_year}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mission Statement
              </label>
              <textarea
                name="mission"
                value={formData.mission}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vision Statement
              </label>
              <textarea
                name="vision"
                value={formData.vision}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-700"
              />
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-primary-600 dark:bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyProfile;