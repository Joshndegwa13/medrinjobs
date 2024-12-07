import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const jobs = {
  getAll: (filters) => api.get('/jobs', { params: filters }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (jobData) => api.post('/jobs', jobData),
  update: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  delete: (id) => api.delete(`/jobs/${id}`),
  apply: (jobId, application) => api.post(`/jobs/${jobId}/apply`, application),
};

export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
};

export const profile = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  updateCompany: (data) => api.put('/employer/profile', data),
};

export const applications = {
  getJobSeekerApplications: () => api.get('/applications/job-seeker'),
  getEmployerApplications: () => api.get('/applications/employer'),
  updateStatus: (applicationId, status) => 
    api.put(`/applications/${applicationId}/status`, { status }),
  bulkUpdateStatus: (applicationIds, status) => 
    api.put('/applications/bulk-status', { applicationIds, status }),
};

export default api;