import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import api from '../services/api';

export const useEmployerJobs = () => {
  const queryClient = useQueryClient();

  // Fetch employer's posted jobs
  const { data: jobs, isLoading, error } = useQuery(
    'employerJobs',
    () => api.get('/employer/jobs'),
    {
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to fetch jobs');
      }
    }
  );

  // Create new job mutation
  const createJobMutation = useMutation(
    (jobData) => api.post('/employer/jobs', jobData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employerJobs');
        toast.success('Job posted successfully');
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to post job');
      }
    }
  );

  // Update job mutation
  const updateJobMutation = useMutation(
    ({ jobId, data }) => api.put(`/employer/jobs/${jobId}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employerJobs');
        toast.success('Job updated successfully');
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to update job');
      }
    }
  );

  // Delete job mutation
  const deleteJobMutation = useMutation(
    (jobId) => api.delete(`/employer/jobs/${jobId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employerJobs');
        toast.success('Job deleted successfully');
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to delete job');
      }
    }
  );

  return {
    jobs: jobs?.data || [],
    isLoading,
    error,
    createJob: createJobMutation.mutate,
    updateJob: updateJobMutation.mutate,
    deleteJob: deleteJobMutation.mutate,
    isCreating: createJobMutation.isLoading,
    isUpdating: updateJobMutation.isLoading,
    isDeleting: deleteJobMutation.isLoading
  };
};