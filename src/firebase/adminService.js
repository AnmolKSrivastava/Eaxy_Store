import { db } from './config';
import {
  doc, getDoc, getDocs, collection,
  setDoc, deleteDoc, updateDoc
} from 'firebase/firestore';

export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  VIEWER: 'viewer',
};

// Permissions per role
export const PERMISSIONS = {
  superadmin: [
    'dashboard', 'analytics', 'orders', 'products', 'inventory',
    'coupons', 'users', 'activity_logs', 'contact_enquiries',
    'settings', 'admin_management', 'password_change',
  ],
  admin: [
    'dashboard', 'analytics', 'orders', 'products', 'inventory',
    'users', 'contact_enquiries', 'password_change',
  ],
  viewer: ['dashboard', 'analytics'],
};

/** Returns array of admin email strings */
export async function fetchAdminEmails() {
  const snapshot = await getDocs(collection(db, 'admin'));
  return snapshot.docs.map(d => d.id);
}

/** Check if an email exists in admin collection */
export async function isAdmin(email) {
  if (!email) return false;
  const snap = await getDoc(doc(db, 'admin', email));
  return snap.exists();
}

/** Get admin doc data (role, addedBy, addedAt) */
export async function getAdminData(email) {
  const snap = await getDoc(doc(db, 'admin', email));
  if (!snap.exists()) return null;
  return snap.data();
}

/** Fetch all admins with their data */
export async function fetchAllAdmins() {
  const snapshot = await getDocs(collection(db, 'admin'));
  return snapshot.docs.map(d => ({ email: d.id, ...d.data() }));
}

/** Add new admin. Throws if already exists. */
export async function addAdmin(email, role = 'admin', addedBy = '') {
  const ref = doc(db, 'admin', email);
  const existing = await getDoc(ref);
  if (existing.exists()) throw new Error('An admin with this email already exists.');
  await setDoc(ref, {
    role,
    addedBy,
    addedAt: new Date().toISOString(),
    active: true,
  });
}

/** Remove admin. Blocks super admin removal and self-removal. */
export async function removeAdmin(email, requestingAdminEmail) {
  const target = await getAdminData(email);
  if (!target) throw new Error('Admin not found.');
  if (target.role === ROLES.SUPERADMIN) throw new Error('Cannot remove a super admin.');
  if (email === requestingAdminEmail) throw new Error('You cannot remove yourself.');
  await deleteDoc(doc(db, 'admin', email));
}

/** Update an admin's role. Blocks modifying super admins. */
export async function updateAdminRole(email, newRole) {
  const target = await getAdminData(email);
  if (!target) throw new Error('Admin not found.');
  if (target.role === ROLES.SUPERADMIN) throw new Error('Cannot modify a super admin\'s role.');
  await updateDoc(doc(db, 'admin', email), { role: newRole });
}

/** Check if a role has a given permission */
export function hasPermission(role, permission) {
  return (PERMISSIONS[role] || []).includes(permission);
}
