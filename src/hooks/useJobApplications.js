import { useState, useCallback } from 'react';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const useJobApplications = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitApplication = useCallback(async (jobId, jobData) => {
    if (!user) throw new Error('Must be logged in to apply');

    try {
      setLoading(true);
      setError(null);

      // Create application
      const applicationData = {
        jobId,
        userId: user.uid,
        userName: `${user.firstname} ${user.lastname}`,
        userEmail: user.email,
        jobTitle: jobData.title,
        companyName: jobData.companyName,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'applications'), applicationData);

      // Update job applicant count
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, {
        applicantCount: increment(1)
      });

      toast.success('Application submitted successfully!');
    } catch (err) {
      console.error('Application error:', err);
      setError(err.message);
      toast.error('Failed to submit application');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getEmployerApplications = useCallback(async () => {
    if (!user?.uid) return [];

    try {
      setLoading(true);
      setError(null);

      const jobsQuery = query(
        collection(db, 'jobs'),
        where('employerId', '==', user.uid)
      );
      const jobsSnap = await getDocs(jobsQuery);
      const jobIds = jobsSnap.docs.map(doc => doc.id);

      if (jobIds.length === 0) return [];

      const applicationsQuery = query(
        collection(db, 'applications'),
        where('jobId', 'in', jobIds)
      );
      const applicationsSnap = await getDocs(applicationsQuery);

      return applicationsSnap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        };
      });
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to fetch applications');
      toast.error('Failed to fetch applications');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getUserApplications = useCallback(async () => {
    if (!user?.uid) return [];

    try {
      setLoading(true);
      setError(null);

      const applicationsQuery = query(
        collection(db, 'applications'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(applicationsQuery);

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        };
      });
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to fetch applications');
      toast.error('Failed to fetch your applications');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

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
      console.error('Error updating application:', err);
      setError('Failed to update application');
      toast.error('Failed to update application status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    submitApplication,
    getUserApplications,
    getEmployerApplications,
    updateApplicationStatus,
    loading,
    error
  };
};