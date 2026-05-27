import { db } from './config';
import {
  collection, addDoc, getDocs,
  query, orderBy, limit, serverTimestamp
} from 'firebase/firestore';

/**
 * Log an admin action to Firestore activity_logs collection.
 * Never throws — logging failures are silent.
 */
export async function logActivity(action, details = '', adminEmail = '') {
  try {
    await addDoc(collection(db, 'activity_logs'), {
      action,
      details,
      adminEmail,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Activity log write failed:', err);
  }
}

/**
 * Fetch latest activity logs.
 * @param {number} limitCount - max number of logs to return
 */
export async function fetchActivityLogs(limitCount = 100) {
  const q = query(
    collection(db, 'activity_logs'),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({
    id: d.id,
    ...d.data(),
    timestamp: d.data().timestamp?.toDate?.() || null,
  }));
}
