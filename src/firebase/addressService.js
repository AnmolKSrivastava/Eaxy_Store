import { db } from './config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

/**
 * Address Service - Manages user delivery addresses
 * Addresses stored at: user_addresses/{addressId}
 */

/**
 * Generate unique address ID
 * @param {string} userId - User ID
 * @returns {string} Address ID
 */
const generateAddressId = (userId) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 6);
  return `${userId}_${timestamp}_${random}`;
};

/**
 * Get all addresses for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of addresses
 */
export const getUserAddresses = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  
  const addressesRef = collection(db, 'user_addresses');
  const q = query(
    addressesRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Get address by ID
 * @param {string} addressId - Address ID
 * @returns {Promise<Object>} Address data
 */
export const getAddress = async (addressId) => {
  if (!addressId) throw new Error('Address ID is required');
  
  const addressRef = doc(db, 'user_addresses', addressId);
  const addressSnap = await getDoc(addressRef);
  
  if (!addressSnap.exists()) {
    throw new Error('Address not found');
  }
  
  return { id: addressSnap.id, ...addressSnap.data() };
};

/**
 * Add new address
 * @param {string} userId - User ID
 * @param {Object} addressData - Address details
 * @returns {Promise<string>} Created address ID
 */
export const addAddress = async (userId, addressData) => {
  if (!userId) throw new Error('User ID is required');
  
  const {
    fullName,
    phone,
    addressLine1,
    addressLine2 = '',
    landmark = '',
    pincode,
    city = 'Pune',
    area,
    addressType = 'Home',
    isDefault = false
  } = addressData;
  
  if (!fullName) throw new Error('Full name is required');
  if (!phone) throw new Error('Phone number is required');
  if (!addressLine1) throw new Error('Address line 1 is required');
  if (!pincode) throw new Error('Pincode is required');
  if (!area) throw new Error('Delivery area is required');
  
  // If this is set as default, unset other default addresses
  if (isDefault) {
    await unsetDefaultAddresses(userId);
  }
  
  const addressId = generateAddressId(userId);
  const addressRef = doc(db, 'user_addresses', addressId);
  
  const address = {
    addressId,
    userId,
    fullName,
    phone,
    addressLine1,
    addressLine2,
    landmark,
    pincode,
    city,
    area,
    addressType,
    isDefault,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  await setDoc(addressRef, address);
  return addressId;
};

/**
 * Update existing address
 * @param {string} addressId - Address ID
 * @param {Object} addressData - Updated address data
 * @returns {Promise<void>}
 */
export const updateAddress = async (addressId, addressData) => {
  if (!addressId) throw new Error('Address ID is required');
  
  const addressRef = doc(db, 'user_addresses', addressId);
  const addressSnap = await getDoc(addressRef);
  
  if (!addressSnap.exists()) {
    throw new Error('Address not found');
  }
  
  const currentAddress = addressSnap.data();
  
  // If updating to default, unset other default addresses
  if (addressData.isDefault && !currentAddress.isDefault) {
    await unsetDefaultAddresses(currentAddress.userId);
  }
  
  const updates = {
    ...addressData,
    updatedAt: serverTimestamp()
  };
  
  await updateDoc(addressRef, updates);
};

/**
 * Delete address
 * @param {string} addressId - Address ID
 * @returns {Promise<void>}
 */
export const deleteAddress = async (addressId) => {
  if (!addressId) throw new Error('Address ID is required');
  
  const addressRef = doc(db, 'user_addresses', addressId);
  await deleteDoc(addressRef);
};

/**
 * Set address as default
 * @param {string} addressId - Address ID to set as default
 * @returns {Promise<void>}
 */
export const setDefaultAddress = async (addressId) => {
  if (!addressId) throw new Error('Address ID is required');
  
  const addressRef = doc(db, 'user_addresses', addressId);
  const addressSnap = await getDoc(addressRef);
  
  if (!addressSnap.exists()) {
    throw new Error('Address not found');
  }
  
  const currentAddress = addressSnap.data();
  
  // Unset other default addresses
  await unsetDefaultAddresses(currentAddress.userId);
  
  // Set this as default
  await updateDoc(addressRef, {
    isDefault: true,
    updatedAt: serverTimestamp()
  });
};

/**
 * Unset all default addresses for a user (helper function)
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
const unsetDefaultAddresses = async (userId) => {
  const addresses = await getUserAddresses(userId);
  const defaultAddresses = addresses.filter(addr => addr.isDefault);
  
  const updatePromises = defaultAddresses.map(addr => {
    const addressRef = doc(db, 'user_addresses', addr.id);
    return updateDoc(addressRef, {
      isDefault: false,
      updatedAt: serverTimestamp()
    });
  });
  
  await Promise.all(updatePromises);
};

/**
 * Get default address for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Default address or null
 */
export const getDefaultAddress = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  
  const addresses = await getUserAddresses(userId);
  const defaultAddress = addresses.find(addr => addr.isDefault);
  
  return defaultAddress || null;
};

/**
 * Get addresses by area
 * @param {string} userId - User ID
 * @param {string} area - Delivery area
 * @returns {Promise<Array>} Array of addresses in that area
 */
export const getAddressesByArea = async (userId, area) => {
  if (!userId) throw new Error('User ID is required');
  if (!area) throw new Error('Area is required');
  
  const addressesRef = collection(db, 'user_addresses');
  const q = query(
    addressesRef,
    where('userId', '==', userId),
    where('area', '==', area),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Validate Pune delivery areas
 * @param {string} area - Area to validate
 * @returns {boolean} True if valid area
 */
export const isValidPuneArea = (area) => {
  const validAreas = [
    'Pimpri-Chinchwad',
    'Kothrud & Warje',
    'Hadapsar & Magarpatta',
    'Shivajinagar & Camp',
    'Aundh & Baner',
    'Wakad & Hinjewadi'
  ];
  
  return validAreas.includes(area);
};

/**
 * Get all valid Pune delivery areas
 * @returns {Array} Array of delivery area names
 */
export const getValidAreas = () => {
  return [
    'Pimpri-Chinchwad',
    'Kothrud & Warje',
    'Hadapsar & Magarpatta',
    'Shivajinagar & Camp',
    'Aundh & Baner',
    'Wakad & Hinjewadi'
  ];
};

/**
 * Validate pincode for Pune
 * @param {string} pincode - Pincode to validate
 * @returns {boolean} True if valid Pune pincode
 */
export const isValidPunePincode = (pincode) => {
  // Pune pincodes range from 411001 to 412412
  const pin = parseInt(pincode);
  return pin >= 411001 && pin <= 412412;
};
