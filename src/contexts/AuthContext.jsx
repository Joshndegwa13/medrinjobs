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
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            // Merge Firebase user + Firestore profile
            setUser({ ...firebaseUser, ...userDoc.data() });
          } else {
            // Fallback if no profile exists
            setUser({
              ...firebaseUser,
              userType: null,
              profileComplete: false
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser({
            ...firebaseUser,
            userType: null,
            profileComplete: false
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- Auth functions (you already have these implemented) ---
  const registerEmployer = async (email, password) => { /* same */ };
  const registerJobSeeker = async (email, password) => { /* same */ };
  const login = async (email, password) => { /* same */ };
  const logout = async () => { /* same */ };
  const completeEmployerProfile = async (profileData) => { /* same */ };
  const completeJobSeekerProfile = async (profileData) => { /* same */ };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900">
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
