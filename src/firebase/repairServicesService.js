import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

// ============ Repair Services CRUD ============

/**
 * Fetch all repair services
 */
export const fetchAllRepairServices = async () => {
  try {
    const servicesRef = collection(db, 'repair_services');
    const q = query(servicesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching repair services:', error);
    throw error;
  }
};

/**
 * Fetch repair service by ID
 */
export const fetchRepairServiceById = async (serviceId) => {
  try {
    const serviceRef = doc(db, 'repair_services', serviceId);
    const serviceDoc = await getDoc(serviceRef);
    
    if (serviceDoc.exists()) {
      return {
        id: serviceDoc.id,
        ...serviceDoc.data()
      };
    } else {
      throw new Error('Service not found');
    }
  } catch (error) {
    console.error('Error fetching repair service:', error);
    throw error;
  }
};

/**
 * Fetch repair services by category
 */
export const fetchRepairServicesByCategory = async (category) => {
  try {
    const servicesRef = collection(db, 'repair_services');
    const q = query(servicesRef, where('category', '==', category));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching services by category:', error);
    throw error;
  }
};

/**
 * Add a new repair service
 * If serviceData.id is provided, it will be used as the document ID.
 * Otherwise, a random ID will be generated.
 */
export const addRepairService = async (serviceData) => {
  try {
    // Use custom ID if provided, otherwise generate random ID
    const serviceRef = serviceData.id 
      ? doc(db, 'repair_services', serviceData.id)
      : doc(collection(db, 'repair_services'));
    
    // Remove id from data as it's used as document key
    const { id, ...dataWithoutId } = serviceData;
    
    await setDoc(serviceRef, {
      ...dataWithoutId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return serviceRef.id;
  } catch (error) {
    console.error('Error adding repair service:', error);
    throw error;
  }
};

/**
 * Update an existing repair service
 * Uses setDoc with merge to create if doesn't exist (upsert)
 */
export const updateRepairService = async (serviceId, serviceData) => {
  try {
    const serviceRef = doc(db, 'repair_services', serviceId);
    
    // Remove id from data as it's used as document key
    const { id, ...dataWithoutId } = serviceData;
    
    // Use setDoc with merge instead of updateDoc for upsert behavior
    await setDoc(serviceRef, {
      ...dataWithoutId,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return serviceId;
  } catch (error) {
    console.error('Error updating repair service:', error);
    throw error;
  }
};

/**
 * Delete a repair service
 */
export const deleteRepairService = async (serviceId) => {
  try {
    const serviceRef = doc(db, 'repair_services', serviceId);
    await deleteDoc(serviceRef);
  } catch (error) {
    console.error('Error deleting repair service:', error);
    throw error;
  }
};

// ============ Service Categories CRUD ============

/**
 * Fetch all service categories
 */
export const fetchAllServiceCategories = async () => {
  try {
    const categoriesRef = collection(db, 'service_categories');
    const q = query(categoriesRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching service categories:', error);
    throw error;
  }
};

/**
 * Add a new service category
 * MUST provide categoryData.id as it will be used as the document ID.
 * This ensures consistent IDs for updating later (e.g., "mobile", "laptop", "computer").
 */
export const addServiceCategory = async (categoryData) => {
  try {
    if (!categoryData.id) {
      throw new Error('Category ID is required');
    }
    
    // Use the provided ID as the document ID
    const categoryRef = doc(db, 'service_categories', categoryData.id);
    
    // Remove id from data as it's used as document key
    const { id, ...dataWithoutId } = categoryData;
    
    await setDoc(categoryRef, {
      ...dataWithoutId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return categoryRef.id;
  } catch (error) {
    console.error('Error adding service category:', error);
    throw error;
  }
};

/**
 * Update a service category
 * Uses setDoc with merge to create if doesn't exist (upsert behavior).
 * This prevents "No document to update" errors.
 */
export const updateServiceCategory = async (categoryId, categoryData) => {
  try {
    const categoryRef = doc(db, 'service_categories', categoryId);
    
    // Remove id from data as it's used as document key
    const { id, ...dataWithoutId } = categoryData;
    
    // Use setDoc with merge instead of updateDoc for upsert behavior
    await setDoc(categoryRef, {
      ...dataWithoutId,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return categoryId;
  } catch (error) {
    console.error('Error updating service category:', error);
    throw error;
  }
};

/**
 * Delete a service category
 */
export const deleteServiceCategory = async (categoryId) => {
  try {
    const categoryRef = doc(db, 'service_categories', categoryId);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error('Error deleting service category:', error);
    throw error;
  }
};
