import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD5aIhXUqxzFUOIk58GdMnoKtkuaXmmoEU",
  authDomain: "medrin-jobs-88edf.firebaseapp.com",
  projectId: "medrin-jobs-88edf",
  storageBucket: "medrin-jobs-88edf.firebasestorage.app",
  messagingSenderId: "312255869402",
  appId: "1:312255869402:web:23f5abfdd22437030e90e3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

if (!auth || !db) {
  console.error('Firebase services initialization failed');
}

export { auth, db };
export default app;