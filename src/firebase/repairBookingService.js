import { db } from './config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

/**
 * Repair Booking Service - Manages repair service bookings
 */

/**
 * Generate unique booking ID
 */
const generateBookingId = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `RB-${dateStr}-${random}`;
};

/**
 * Create new repair booking
 */
export const createRepairBooking = async (bookingData) => {
  const {
    userId,
    serviceId,
    serviceName,
    servicePrice,
    customerName,
    email,
    phone,
    address,
    deviceDetails,
    issueDescription,
    preferredDate,
    preferredTime,
    pickupRequired = false
  } = bookingData;

  if (!customerName || !email || !phone) {
    throw new Error('Customer details are required');
  }
  if (!serviceId || !serviceName) {
    throw new Error('Service details are required');
  }

  const bookingId = generateBookingId();
  const bookingRef = doc(db, 'repair_bookings', bookingId);

  const booking = {
    bookingId,
    userId: userId || null,
    
    // Service Info
    serviceId,
    serviceName,
    servicePrice,
    
    // Customer Info
    customerName,
    email,
    phone,
    address: address || '',
    
    // Device & Issue
    deviceDetails: deviceDetails || '',
    issueDescription: issueDescription || '',
    
    // Scheduling
    preferredDate: preferredDate || null,
    preferredTime: preferredTime || null,
    pickupRequired,
    
    // Status
    status: 'pending', // pending, confirmed, in-progress, completed, cancelled
    
    // Timestamps
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    confirmedAt: null,
    completedAt: null,
    cancelledAt: null,
    
    // Notes
    customerNotes: '',
    adminNotes: ''
  };

  await setDoc(bookingRef, booking);
  return bookingId;
};

/**
 * Get booking by ID
 */
export const getRepairBooking = async (bookingId) => {
  const bookingRef = doc(db, 'repair_bookings', bookingId);
  const bookingSnap = await getDoc(bookingRef);
  
  if (!bookingSnap.exists()) {
    throw new Error('Booking not found');
  }
  
  return { id: bookingSnap.id, ...bookingSnap.data() };
};

/**
 * Get all bookings for a user
 */
export const getUserRepairBookings = async (userId) => {
  const bookingsRef = collection(db, 'repair_bookings');
  const q = query(
    bookingsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Get all bookings (admin)
 */
export const getAllRepairBookings = async (filters = {}) => {
  const bookingsRef = collection(db, 'repair_bookings');
  let q = query(bookingsRef, orderBy('createdAt', 'desc'));
  
  if (filters.status && filters.status !== 'all') {
    q = query(bookingsRef, where('status', '==', filters.status), orderBy('createdAt', 'desc'));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Update booking status
 */
export const updateRepairBookingStatus = async (bookingId, newStatus, notes = '') => {
  const bookingRef = doc(db, 'repair_bookings', bookingId);
  const updateData = {
    status: newStatus,
    updatedAt: serverTimestamp()
  };

  if (newStatus === 'confirmed') {
    updateData.confirmedAt = serverTimestamp();
  } else if (newStatus === 'completed') {
    updateData.completedAt = serverTimestamp();
  } else if (newStatus === 'cancelled') {
    updateData.cancelledAt = serverTimestamp();
  }

  if (notes) {
    updateData.adminNotes = notes;
  }

  await updateDoc(bookingRef, updateData);
};

/**
 * Cancel booking
 */
export const cancelRepairBooking = async (bookingId, reason = '') => {
  await updateRepairBookingStatus(bookingId, 'cancelled', reason);
};
