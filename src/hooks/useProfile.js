import { useState, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const useProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.uid) return null;

    try {
      setLoading(true);
      setError(null);

      const profileRef = doc(db, user.userType === 'employer' ? 'companies' : 'profiles', user.uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        return { id: profileSnap.id, ...profileSnap.data() };
      }
      return null;
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createProfile = useCallback(async (profileData) => {
    if (!user?.uid) throw new Error('No authenticated user');

    try {
      setLoading(true);
      setError(null);

      const collection = user.userType === 'employer' ? 'companies' : 'profiles';
      const profileRef = doc(db, collection, user.uid);

      // Store base64 images directly in Firestore
      const profile = {
        ...profileData,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(profileRef, profile);
      toast.success('Profile created successfully');
      return { id: profileRef.id, ...profile };
    } catch (err) {
      console.error('Error creating profile:', err);
      setError('Failed to create profile');
      toast.error('Failed to create profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProfile = useCallback(async (profileData) => {
    if (!user?.uid) throw new Error('No authenticated user');

    try {
      setLoading(true);
      setError(null);

      const collection = user.userType === 'employer' ? 'companies' : 'profiles';
      const profileRef = doc(db, collection, user.uid);

      const updates = {
        ...profileData,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(profileRef, updates);
      toast.success('Profile updated successfully');
      return { id: profileRef.id, ...updates };
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      toast.error('Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    fetchProfile,
    createProfile,
    updateProfile,
    loading,
    error
  };
};