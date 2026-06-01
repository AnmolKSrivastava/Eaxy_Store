import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc,
  query,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

/**
 * Fetch all coverage areas
 */
export const fetchAllCoverageAreas = async () => {
  try {
    const areasRef = collection(db, 'coverage_areas');
    const q = query(areasRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching coverage areas:', error);
    throw error;
  }
};

/**
 * Add or update a coverage area
 * @param {Object} areaData - { id, name, order }
 */
export const saveCoverageArea = async (areaData) => {
  try {
    if (!areaData.id) {
      throw new Error('Area ID is required');
    }
    
    const areaRef = doc(db, 'coverage_areas', areaData.id);
    const { id, ...dataWithoutId } = areaData;
    
    await setDoc(areaRef, {
      ...dataWithoutId,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return areaRef.id;
  } catch (error) {
    console.error('Error saving coverage area:', error);
    throw error;
  }
};

/**
 * Delete a coverage area
 */
export const deleteCoverageArea = async (areaId) => {
  try {
    const areaRef = doc(db, 'coverage_areas', areaId);
    await deleteDoc(areaRef);
  } catch (error) {
    console.error('Error deleting coverage area:', error);
    throw error;
  }
};
