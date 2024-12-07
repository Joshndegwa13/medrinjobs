import { useState, useCallback } from 'react';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const useJobManagement = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createJob = useCallback(async (jobData) => {
    try {
      setLoading(true);
      setError(null);

      const sanitizedData = {
        ...jobData,
        employerId: user.uid,
        companyName: user.company_name || '',
        status: 'active',
        applicantCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const jobRef = await addDoc(collection(db, 'jobs'), sanitizedData);
      toast.success('Job posted successfully!');
      return jobRef.id;
    } catch (err) {
      console.error('Error creating job:', err);
      setError('Failed to post job');
      toast.error('Failed to post job');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getEmployerJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.uid) {
        throw new Error('No authenticated user found');
      }

      const jobsQuery = query(
        collection(db, 'jobs'),
        where('employerId', '==', user.uid)
      );

      const snapshot = await getDocs(jobsQuery);
      
      // Get applications count for each job
      const jobsWithApplications = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const jobData = doc.data();
          const applicationsQuery = query(
            collection(db, 'applications'),
            where('jobId', '==', doc.id)
          );
          const applicationsSnapshot = await getDocs(applicationsQuery);
          
          return {
            id: doc.id,
            ...jobData,
            applicantCount: applicationsSnapshot.size,
            createdAt: jobData.createdAt?.toDate(),
            updatedAt: jobData.updatedAt?.toDate()
          };
        })
      );

      // Filter active jobs and sort by creation date
      return jobsWithApplications
        .filter(job => job.status === 'active')
        .sort((a, b) => b.createdAt - a.createdAt);
    } catch (err) {
      console.error('Error fetching employer jobs:', err);
      setError('Failed to fetch jobs');
      toast.error('Failed to fetch jobs');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    createJob,
    getEmployerJobs,
    loading,
    error
  };
};