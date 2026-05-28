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
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';

// ============= PRODUCTS =============

/**
 * Fetch all products
 */
export const fetchAllProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch products by category
 */
export const fetchProductsByCategory = async (category) => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('category', '==', category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

/**
 * Fetch single product by ID
 */
export const fetchProductById = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      return { id: productSnap.id, ...productSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

/**
 * Add a new product
 */
export const addProduct = async (productData) => {
  try {
    const productRef = doc(collection(db, 'products'));
    await setDoc(productRef, {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return productRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Update product stock status
 */
export const updateProductStock = async (productId, inStock) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      inStock,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
};

// ============= CATEGORIES =============

/**
 * Fetch all categories
 */
export const fetchAllCategories = async () => {
  try {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Add a new category
 */
export const addCategory = async (categoryData) => {
  try {
    const categoryRef = doc(collection(db, 'categories'));
    await setDoc(categoryRef, {
      ...categoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return categoryRef.id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

/**
 * Update an existing category
 */
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, {
      ...categoryData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

/**
 * Delete a category
 */
export const deleteCategory = async (categoryId) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// ============= DEALS =============

/**
 * Fetch all deals
 */
export const fetchAllDeals = async () => {
  try {
    const dealsRef = collection(db, 'deals');
    const q = query(dealsRef, orderBy('priority', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching deals:', error);
    throw error;
  }
};

/**
 * Fetch active deals
 */
export const fetchActiveDeals = async () => {
  try {
    const dealsRef = collection(db, 'deals');
    const q = query(
      dealsRef,
      where('isActive', '==', true),
      orderBy('priority', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching active deals:', error);
    throw error;
  }
};

/**
 * Add a new deal
 */
export const addDeal = async (dealData) => {
  try {
    const dealRef = doc(collection(db, 'deals'));
    await setDoc(dealRef, {
      ...dealData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return dealRef.id;
  } catch (error) {
    console.error('Error adding deal:', error);
    throw error;
  }
};

/**
 * Update an existing deal
 */
export const updateDeal = async (dealId, dealData) => {
  try {
    const dealRef = doc(db, 'deals', dealId);
    await updateDoc(dealRef, {
      ...dealData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating deal:', error);
    throw error;
  }
};

/**
 * Delete a deal
 */
export const deleteDeal = async (dealId) => {
  try {
    const dealRef = doc(db, 'deals', dealId);
    await deleteDoc(dealRef);
  } catch (error) {
    console.error('Error deleting deal:', error);
    throw error;
  }
};

/**
 * Toggle deal active status
 */
export const toggleDealStatus = async (dealId, isActive) => {
  try {
    const dealRef = doc(db, 'deals', dealId);
    await updateDoc(dealRef, {
      isActive,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error toggling deal status:', error);
    throw error;
  }
};

// ============= BULK OPERATIONS =============

/**
 * Bulk import products (for initial setup or migration)
 */
export const bulkImportProducts = async (productsArray) => {
  try {
    const batch = writeBatch(db);
    productsArray.forEach((product) => {
      const productRef = doc(collection(db, 'products'));
      batch.set(productRef, {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
    return productsArray.length;
  } catch (error) {
    console.error('Error bulk importing products:', error);
    throw error;
  }
};
