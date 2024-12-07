import { 
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/firebase';

// File metadata helper
const storeFileMetadata = async (fileData) => {
  const fileRef = doc(collection(db, 'files'));
  await setDoc(fileRef, {
    ...fileData,
    createdAt: serverTimestamp()
  });
  return fileRef.id;
};

// Jobs
export const jobsService = {
  async createJob(jobData, employerId) {
    const jobRef = doc(collection(db, 'jobs'));
    const job = {
      ...jobData,
      id: jobRef.id,
      employerId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'active'
    };
    await setDoc(jobRef, job);
    return job;
  },

  async getJobs(filters = {}) {
    let jobsQuery = query(collection(db, 'jobs'), where('status', '==', 'active'));
    
    if (filters.category) {
      jobsQuery = query(jobsQuery, where('category', '==', filters.category));
    }
    if (filters.location) {
      jobsQuery = query(jobsQuery, where('location', '==', filters.location));
    }
    
    const snapshot = await getDocs(jobsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getEmployerJobs(employerId) {
    const jobsQuery = query(
      collection(db, 'jobs'),
      where('employerId', '==', employerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(jobsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

// Applications
export const applicationsService = {
  async apply(jobId, userId, applicationData) {
    const applicationRef = doc(collection(db, 'applications'));
    
    let cvMetadata = null;
    if (applicationData.cv) {
      const cvData = {
        name: applicationData.cv.name,
        type: applicationData.cv.type,
        size: applicationData.cv.size,
        userId,
        purpose: 'job_application'
      };
      cvMetadata = await storeFileMetadata(cvData);
    }

    const application = {
      id: applicationRef.id,
      jobId,
      userId,
      status: 'pending',
      cvId: cvMetadata,
      ...applicationData,
      createdAt: serverTimestamp()
    };

    await setDoc(applicationRef, application);
    return application;
  },

  async getJobSeekerApplications(userId) {
    const applicationsQuery = query(
      collection(db, 'applications'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(applicationsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getJobApplications(jobId) {
    const applicationsQuery = query(
      collection(db, 'applications'),
      where('jobId', '==', jobId)
    );
    const snapshot = await getDocs(applicationsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async updateStatus(applicationId, status) {
    const applicationRef = doc(db, 'applications', applicationId);
    await updateDoc(applicationRef, {
      status,
      updatedAt: serverTimestamp()
    });
  }
};

// Profiles
export const profilesService = {
  async createUserProfile(userId, profileData) {
    let profileImageMetadata = null;
    if (profileData.profileImage) {
      const imageData = {
        name: profileData.profileImage.name,
        type: profileData.profileImage.type,
        size: profileData.profileImage.size,
        userId,
        purpose: 'profile_image'
      };
      profileImageMetadata = await storeFileMetadata(imageData);
    }

    let cvMetadata = null;
    if (profileData.cv) {
      const cvData = {
        name: profileData.cv.name,
        type: profileData.cv.type,
        size: profileData.cv.size,
        userId,
        purpose: 'cv'
      };
      cvMetadata = await storeFileMetadata(cvData);
    }

    const profile = {
      ...profileData,
      userId,
      profileImageId: profileImageMetadata,
      cvId: cvMetadata,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, 'profiles', userId), profile);
    return profile;
  },

  async updateProfile(userId, profileData) {
    const profileRef = doc(db, 'profiles', userId);
    const currentProfile = await getDoc(profileRef);
    
    let updates = { ...profileData, updatedAt: serverTimestamp() };

    if (profileData.profileImage) {
      const imageData = {
        name: profileData.profileImage.name,
        type: profileData.profileImage.type,
        size: profileData.profileImage.size,
        userId,
        purpose: 'profile_image'
      };
      updates.profileImageId = await storeFileMetadata(imageData);
    }

    if (profileData.cv) {
      const cvData = {
        name: profileData.cv.name,
        type: profileData.cv.type,
        size: profileData.cv.size,
        userId,
        purpose: 'cv'
      };
      updates.cvId = await storeFileMetadata(cvData);
    }

    await updateDoc(profileRef, updates);
    return { id: profileRef.id, ...updates };
  },

  async getProfile(userId) {
    const profileRef = doc(db, 'profiles', userId);
    const profile = await getDoc(profileRef);
    return profile.exists() ? { id: profile.id, ...profile.data() } : null;
  }
};

// Company Profiles
export const companyProfilesService = {
  async createCompanyProfile(companyId, profileData) {
    let logoMetadata = null;
    if (profileData.companyLogo) {
      const logoData = {
        name: profileData.companyLogo.name,
        type: profileData.companyLogo.type,
        size: profileData.companyLogo.size,
        companyId,
        purpose: 'company_logo'
      };
      logoMetadata = await storeFileMetadata(logoData);
    }

    const profile = {
      ...profileData,
      companyId,
      logoId: logoMetadata,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, 'companies', companyId), profile);
    return profile;
  },

  async updateCompanyProfile(companyId, profileData) {
    const profileRef = doc(db, 'companies', companyId);
    let updates = { ...profileData, updatedAt: serverTimestamp() };

    if (profileData.companyLogo) {
      const logoData = {
        name: profileData.companyLogo.name,
        type: profileData.companyLogo.type,
        size: profileData.companyLogo.size,
        companyId,
        purpose: 'company_logo'
      };
      updates.logoId = await storeFileMetadata(logoData);
    }

    await updateDoc(profileRef, updates);
    return { id: profileRef.id, ...updates };
  },

  async getCompanyProfile(companyId) {
    const profileRef = doc(db, 'companies', companyId);
    const profile = await getDoc(profileRef);
    return profile.exists() ? { id: profile.id, ...profile.data() } : null;
  }
};

// Files
export const filesService = {
  async getFile(fileId) {
    const fileRef = doc(db, 'files', fileId);
    const file = await getDoc(fileRef);
    return file.exists() ? { id: file.id, ...file.data() } : null;
  },

  async getUserFiles(userId) {
    const filesQuery = query(
      collection(db, 'files'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(filesQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async deleteFile(fileId) {
    const fileRef = doc(db, 'files', fileId);
    await deleteDoc(fileRef);
  }
};