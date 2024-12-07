import React, { createContext, useContext } from 'react';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const JobContext = createContext(null);

export const JobProvider = ({ children }) => {
  const { user } = useAuth();

  const createJob = async (jobData) => {
    try {
      const jobRef = await addDoc(collection(db, 'jobs'), {
        ...jobData,
        employerId: user.uid,
        companyName: user.company_name,
        status: 'active',
        createdAt: serverTimestamp()
      });
      toast.success('Job posted successfully!');
      return jobRef.id;
    } catch (error) {
      toast.error('Failed to post job');
      throw error;
    }
  };

  const getJobs = async (filters = {}) => {
    try {
      let jobsQuery = query(collection(db, 'jobs'), where('status', '==', 'active'));

      if (filters.category) {
        jobsQuery = query(jobsQuery, where('category', '==', filters.category));
      }
      if (filters.location) {
        jobsQuery = query(jobsQuery, where('location', '==', filters.location));
      }

      const snapshot = await getDocs(jobsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      toast.error('Failed to fetch jobs');
      throw error;
    }
  };

  const applyForJob = async (jobId, applicationData) => {
    try {
      const applicationRef = await addDoc(collection(db, 'applications'), {
        jobId,
        userId: user.uid,
        ...applicationData,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      toast.success('Application submitted successfully!');
      return applicationRef.id;
    } catch (error) {
      toast.error('Failed to submit application');
      throw error;
    }
  };

  const getEmployerJobs = async () => {
    try {
      const jobsQuery = query(collection(db, 'jobs'), where('employerId', '==', user.uid));
      const snapshot = await getDocs(jobsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      toast.error('Failed to fetch employer jobs');
      throw error;
    }
  };

  const getJobApplications = async (jobId) => {
    try {
      const applicationsQuery = query(collection(db, 'applications'), where('jobId', '==', jobId));
      const snapshot = await getDocs(applicationsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      toast.error('Failed to fetch applications');
      throw error;
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const applicationRef = doc(db, 'applications', applicationId);
      await updateDoc(applicationRef, {
        status,
        updatedAt: serverTimestamp()
      });
      toast.success(`Application ${status} successfully`);
    } catch (error) {
      toast.error('Failed to update application status');
      throw error;
    }
  };

  const value = {
    createJob,
    getJobs,
    applyForJob,
    getEmployerJobs,
    getJobApplications,
    updateApplicationStatus
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};