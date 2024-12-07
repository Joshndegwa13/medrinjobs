import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({
              ...firebaseUser,
              ...userDoc.data()
            });
          } else {
            setUser(firebaseUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const registerEmployer = async (email, password) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        email,
        userType: 'employer',
        profileComplete: false,
        createdAt: serverTimestamp()
      });

      toast.success('Registration successful! Please complete your profile.');
      navigate('/employer/complete-profile');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const registerJobSeeker = async (email, password) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        email,
        userType: 'job_seeker',
        profileComplete: false,
        createdAt: serverTimestamp()
      });

      toast.success('Registration successful! Please complete your profile.');
      navigate('/jobseeker/complete-profile');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Redirect based on profile completion and user type
        if (!userData.profileComplete) {
          navigate(userData.userType === 'employer' 
            ? '/employer/complete-profile' 
            : '/jobseeker/complete-profile'
          );
        } else {
          navigate(userData.userType === 'employer' ? '/employer' : '/find-jobs');
        }
      }

      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error.message);
    }
  };

  const completeEmployerProfile = async (profileData) => {
    if (!user) throw new Error('No user logged in');

    try {
      const userRef = doc(db, 'users', user.uid);
      const companyRef = doc(db, 'companies', user.uid);

      // Sanitize data before saving
      const { logoData, ...companyData } = profileData;
      const sanitizedData = {
        ...companyData,
        logoUrl: logoData?.url || null,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Update user document to mark profile as complete
      await setDoc(userRef, {
        profileComplete: true,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Create company profile
      await setDoc(companyRef, sanitizedData);

      // Update local user state
      setUser(prev => ({
        ...prev,
        profileComplete: true,
        ...sanitizedData
      }));

      toast.success('Profile completed successfully!');
      navigate('/employer');
    } catch (error) {
      console.error('Profile completion error:', error);
      toast.error('Failed to complete profile');
      throw error;
    }
  };

  const completeJobSeekerProfile = async (profileData) => {
    if (!user) throw new Error('No user logged in');

    try {
      const userRef = doc(db, 'users', user.uid);
      const profileRef = doc(db, 'profiles', user.uid);

      // Sanitize data before saving
      const { profileImageData, cvData, ...userData } = profileData;
      const sanitizedData = {
        ...userData,
        profileImageUrl: profileImageData?.url || null,
        cvUrl: cvData?.url || null,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Update user document to mark profile as complete
      await setDoc(userRef, {
        profileComplete: true,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Create job seeker profile
      await setDoc(profileRef, sanitizedData);

      // Update local user state
      setUser(prev => ({
        ...prev,
        profileComplete: true,
        ...sanitizedData
      }));

      toast.success('Profile completed successfully!');
      navigate('/find-jobs');
    } catch (error) {
      console.error('Profile completion error:', error);
      toast.error('Failed to complete profile');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    registerEmployer,
    registerJobSeeker,
    login,
    logout,
    completeEmployerProfile,
    completeJobSeekerProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};