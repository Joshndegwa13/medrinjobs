import { useState, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';

export const useJobSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchJobs = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Basic query with ordering
      let jobsQuery = query(
        collection(db, 'jobs'),
        where('status', '==', 'active')
      );

      const snapshot = await getDocs(jobsQuery);
      
      // Transform and filter in memory
      let jobs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date()
        };
      });

      // Sort by creation date
      jobs = jobs.sort((a, b) => b.createdAt - a.createdAt);

      // Apply filters in memory
      if (filters.category) {
        jobs = jobs.filter(job => job.category === filters.category);
      }
      if (filters.location) {
        jobs = jobs.filter(job => job.location === filters.location);
      }
      if (filters.employmentType) {
        jobs = jobs.filter(job => job.employmentType === filters.employmentType);
      }
      if (filters.experienceLevel) {
        jobs = jobs.filter(job => job.experienceLevel === filters.experienceLevel);
      }

      return jobs;
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to fetch jobs. Please try again.');
      toast.error('Failed to fetch jobs');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    searchJobs,
    loading,
    error
  };
};