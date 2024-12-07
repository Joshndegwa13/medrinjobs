import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { toast } from 'react-hot-toast';
import { UserCircleIcon, PhotoIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user } = useAuth();
  const { fetchProfile, updateProfile, loading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    title: '',
    location: '',
    phone: '',
    dateOfBirth: '',
    skills: '',
    experience: '',
    education: '',
    linkedin: '',
    portfolio: '',
    bio: '',
    profileImage: null,
    profileImageUrl: null,
    cv: null,
    cvUrl: null
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchProfile();
        if (profileData) {
          setProfile(profileData);
          setFormData({
            firstname: profileData.firstname || '',
            lastname: profileData.lastname || '',
            title: profileData.title || '',
            location: profileData.location || '',
            phone: profileData.phone || '',
            dateOfBirth: profileData.dateOfBirth || '',
            skills: profileData.skills || '',
            experience: profileData.experience || '',
            education: profileData.education || '',
            linkedin: profileData.linkedin || '',
            portfolio: profileData.portfolio || '',
            bio: profileData.bio || '',
            profileImageUrl: profileData.avatar || null,
            cvUrl: profileData.cvFile || null
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
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
        avatar: formData.profileImageUrl,
        cvFile: formData.cvUrl
      };
      
      delete updateData.profileImage;
      delete updateData.profileImageUrl;
      delete updateData.cv;
      delete updateData.cvUrl;

      await updateProfile(updateData);
      setIsEditing(false);
      setProfile(prev => ({ ...prev, ...updateData }));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (!profile && !loading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Profile not found</p>
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
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
              {formData.profileImageUrl ? (
                <img
                  src={formData.profileImageUrl}
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="h-32 w-32 text-gray-400" />
              )}
            </div>

            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Profile Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label className="relative cursor-pointer rounded-md bg-white dark:bg-dark-800 font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          name="profileImage"
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
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Skills
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="e.g., JavaScript, React, Node.js"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Experience
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Education
              </label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-700"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Portfolio Website
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Professional Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-700"
              />
            </div>

            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CV/Resume
                </label>
                <input
                  type="file"
                  name="cv"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}

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

export default Profile;