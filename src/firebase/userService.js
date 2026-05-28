import { doc, getDoc, getDocs, setDoc, collection, query, orderBy, serverTimestamp } from 'firebase/firestore';
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

/**
 * Fetch all users from Firestore.
 * Returns an array of user objects with their UID as a property.
 */
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const users = [];
    snapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
