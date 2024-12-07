export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',

  // Profile endpoints
  PROFILE: '/profile',
  COMPANY_PROFILE: '/employer/profile',

  // Job seeker endpoints
  JOB_SEEKER_APPLICATIONS: '/applications/job-seeker',
  APPLY_JOB: '/jobs/:jobId/apply',

  // Employer endpoints
  EMPLOYER_JOBS: '/employer/jobs',
  EMPLOYER_APPLICATIONS: '/applications/employer',
  UPDATE_APPLICATION_STATUS: '/applications/:applicationId/status',
  BULK_UPDATE_STATUS: '/applications/bulk-status',

  // Jobs endpoints
  JOBS: '/jobs',
  JOB_DETAILS: '/jobs/:jobId'
};

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  SHORTLISTED: 'shortlisted'
};

export const FILE_UPLOAD_LIMITS = {
  PROFILE_IMAGE: 1024 * 1024, // 1MB
  CV: 1024 * 1024, // 1MB
  COMPANY_LOGO: 1024 * 1024 // 1MB
};

export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif'],
  DOCUMENTS: ['application/pdf']
};