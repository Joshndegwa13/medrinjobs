import { useState, useCallback } from 'react';
import { db } from '../config/firebase';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export const useStorage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const uploadFile = useCallback(async (file, path, metadata = {}) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      // Convert file to base64 for small files (< 1MB)
      if (file.size <= 1024 * 1024) {
        const base64 = await convertToBase64(file);
        const fileId = uuidv4();
        const fileRef = doc(collection(db, 'files'));
        
        await setDoc(fileRef, {
          id: fileId,
          name: file.name,
          type: file.type,
          size: file.size,
          path,
          base64,
          metadata,
          createdAt: new Date().toISOString()
        });

        setProgress(100);
        return { id: fileId, url: base64 };
      } else {
        throw new Error('File size exceeds 1MB limit');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFile = useCallback(async (fileId) => {
    try {
      setLoading(true);
      setError(null);
      
      const fileRef = doc(db, 'files', fileId);
      await deleteDoc(fileRef);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return {
    uploadFile,
    deleteFile,
    loading,
    error,
    progress
  };
};