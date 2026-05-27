import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

/**
 * Check if a user document exists in Firestore.
 */
export const userExists = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists();
};

/**
 * Fetch a user's profile from Firestore. Returns null if not found.
 */
export const getUserDoc = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

/**
 * Create a new user document in Firestore.
 * @param {string} uid   - Firebase Auth UID
 * @param {object} data  - { name, email, phone, address, photoURL, provider }
 */
export const createUserDoc = async (uid, data) => {
  await setDoc(doc(db, 'users', uid), {
    uid,
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    photoURL: data.photoURL || '',
    provider: data.provider || 'unknown',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/**
 * Update (merge) an existing user document in Firestore.
 */
export const updateUserDoc = async (uid, data) => {
  await setDoc(
    doc(db, 'users', uid),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
};
