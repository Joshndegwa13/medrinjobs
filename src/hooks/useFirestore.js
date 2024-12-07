import { useState, useCallback } from 'react';
import { db } from '../config/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp
} from 'firebase/firestore';

export const useFirestore = (collectionName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const add = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const ref = doc(collection(db, collectionName));
      const timestamp = serverTimestamp();
      await setDoc(ref, {
        ...data,
        id: ref.id,
        createdAt: timestamp,
        updatedAt: timestamp
      });
      return ref.id;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const get = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const list = useCallback(async (conditions = [], orderByField = 'createdAt', limitTo = 10, lastDoc = null) => {
    try {
      setLoading(true);
      setError(null);
      
      let q = collection(db, collectionName);
      
      if (conditions.length > 0) {
        conditions.forEach(condition => {
          q = query(q, where(condition.field, condition.operator, condition.value));
        });
      }

      q = query(q, orderBy(orderByField, 'desc'), limit(limitTo));
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const update = useCallback(async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  return {
    add,
    get,
    list,
    update,
    loading,
    error
  };
};