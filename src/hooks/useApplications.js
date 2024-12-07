import { useState, useCallback } from 'react';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const useApplications = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const applyForJob = useCallback(async (jobId, applicationData) => {
    try {
      setLoading(true);
      setError(null);

      // Check if user has already applied
      const existingQuery = query(
        collection(db, 'applications'),
        where('jobId', '==', jobId),
        where('userId', '==', user.uid)
      );
      const existingSnap = await getDocs(existingQuery);

      if (!existingSnap.empty) {
        throw new Error('You have already applied for this job');
      }

      const applicationRef = await addDoc(collection(db, 'applications'), {
        jobId,
        userId: user.uid,
        ...applicationData,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      toast.success('Application submitted successfully!');
      return applicationRef.id;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to submit application');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getJobSeekerApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const applicationsQuery = query(
        collection(db, 'applications'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(applicationsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch applications');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getJobApplications = useCallback(async (jobId) => {
    try {
      setLoading(true);
      setError(null);

      const applicationsQuery = query(
        collection(db, 'applications'),
        where('jobId', '==', jobId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(applicationsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch applications');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateApplicationStatus = useCallback(async (applicationId, status) => {
    try {
      setLoading(true);
      setError(null);

      const applicationRef = doc(db, 'applications', applicationId);
      await updateDoc(applicationRef, {
        status,
        updatedAt: serverTimestamp()
      });

      toast.success(`Application ${status} successfully`);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to update application status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    applyForJob,
    getJobSeekerApplications,
    getJobApplications,
    updateApplicationStatus,
    loading,
    error
  };
};