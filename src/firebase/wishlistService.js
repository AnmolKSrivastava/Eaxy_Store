import { db } from './config';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';

/**
 * Wishlist Service - Manages user wishlist in Firebase
 * Wishlist stored at: wishlists/{userId}
 */

/**
 * Get user's wishlist
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Wishlist object with items array
 */
export const getWishlist = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  
  const wishlistRef = doc(db, 'wishlists', userId);
  const wishlistSnap = await getDoc(wishlistRef);
  
  if (wishlistSnap.exists()) {
    return { id: wishlistSnap.id, ...wishlistSnap.data() };
  }
  
  // Return empty wishlist if doesn't exist
  return {
    userId,
    items: [],
    updatedAt: new Date()
  };
};

/**
 * Add item to wishlist
 * @param {string} userId - User ID
 * @param {string} productId - Product ID to add
 * @returns {Promise<void>}
 */
export const addToWishlist = async (userId, productId) => {
  if (!userId) throw new Error('User ID is required');
  if (!productId) throw new Error('Product ID is required');
  
  const wishlistRef = doc(db, 'wishlists', userId);
  const wishlistSnap = await getDoc(wishlistRef);
  
  const wishlistItem = {
    productId,
    addedAt: new Date().toISOString()
  };
  
  if (wishlistSnap.exists()) {
    const currentWishlist = wishlistSnap.data();
    const exists = currentWishlist.items.some(
      item => item.productId === productId
    );
    
    if (!exists) {
      await updateDoc(wishlistRef, {
        items: arrayUnion(wishlistItem),
        updatedAt: serverTimestamp()
      });
    }
  } else {
    // Create new wishlist
    await setDoc(wishlistRef, {
      userId,
      items: [wishlistItem],
      updatedAt: serverTimestamp()
    });
  }
};

/**
 * Remove item from wishlist
 * @param {string} userId - User ID
 * @param {string} productId - Product ID to remove
 * @returns {Promise<void>}
 */
export const removeFromWishlist = async (userId, productId) => {
  if (!userId) throw new Error('User ID is required');
  if (!productId) throw new Error('Product ID is required');
  
  const wishlistRef = doc(db, 'wishlists', userId);
  const wishlistSnap = await getDoc(wishlistRef);
  
  if (wishlistSnap.exists()) {
    const currentWishlist = wishlistSnap.data();
    const updatedItems = currentWishlist.items.filter(
      item => item.productId !== productId
    );
    
    await updateDoc(wishlistRef, {
      items: updatedItems,
      updatedAt: serverTimestamp()
    });
  }
};

/**
 * Check if product is in wishlist
 * @param {string} userId - User ID
 * @param {string} productId - Product ID to check
 * @returns {Promise<boolean>} True if in wishlist
 */
export const isInWishlist = async (userId, productId) => {
  if (!userId || !productId) return false;
  
  const wishlist = await getWishlist(userId);
  return wishlist.items.some(item => item.productId === productId);
};

/**
 * Toggle item in wishlist (add if not exists, remove if exists)
 * @param {string} userId - User ID
 * @param {string} productId - Product ID to toggle
 * @returns {Promise<boolean>} True if added, false if removed
 */
export const toggleWishlist = async (userId, productId) => {
  const inWishlist = await isInWishlist(userId, productId);
  
  if (inWishlist) {
    await removeFromWishlist(userId, productId);
    return false;
  } else {
    await addToWishlist(userId, productId);
    return true;
  }
};

/**
 * Clear entire wishlist
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const clearWishlist = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  
  const wishlistRef = doc(db, 'wishlists', userId);
  await updateDoc(wishlistRef, {
    items: [],
    updatedAt: serverTimestamp()
  });
};

/**
 * Get wishlist item count
 * @param {string} userId - User ID
 * @returns {Promise<number>} Total item count
 */
export const getWishlistItemCount = async (userId) => {
  if (!userId) return 0;
  
  const wishlist = await getWishlist(userId);
  return wishlist.items.length;
};

/**
 * Merge guest wishlist with user wishlist on login
 * @param {string} userId - User ID
 * @param {Array} guestWishlistItems - Product IDs from localStorage
 * @returns {Promise<void>}
 */
export const mergeWishlist = async (userId, guestWishlistItems) => {
  if (!userId) throw new Error('User ID is required');
  if (!guestWishlistItems || guestWishlistItems.length === 0) return;
  
  const wishlistRef = doc(db, 'wishlists', userId);
  const wishlistSnap = await getDoc(wishlistRef);
  
  const guestItems = guestWishlistItems.map(productId => ({
    productId,
    addedAt: new Date().toISOString()
  }));
  
  if (wishlistSnap.exists()) {
    const currentWishlist = wishlistSnap.data();
    const existingProductIds = new Set(
      currentWishlist.items.map(item => item.productId)
    );
    
    // Add only new items
    const newItems = guestItems.filter(
      item => !existingProductIds.has(item.productId)
    );
    
    if (newItems.length > 0) {
      await updateDoc(wishlistRef, {
        items: [...currentWishlist.items, ...newItems],
        updatedAt: serverTimestamp()
      });
    }
  } else {
    // Create new wishlist with guest items
    await setDoc(wishlistRef, {
      userId,
      items: guestItems,
      updatedAt: serverTimestamp()
    });
  }
};

/**
 * Move item from wishlist to cart
 * @param {string} userId - User ID
 * @param {string} productId - Product ID to move
 * @param {Function} addToCartFn - Function to add item to cart
 * @param {Object} productData - Product data to add to cart
 * @returns {Promise<void>}
 */
export const moveToCart = async (userId, productId, addToCartFn, productData) => {
  if (!userId) throw new Error('User ID is required');
  if (!productId) throw new Error('Product ID is required');
  
  // Add to cart first
  await addToCartFn(userId, productData);
  
  // Then remove from wishlist
  await removeFromWishlist(userId, productId);
};

/**
 * Get wishlist with full product details
 * @param {string} userId - User ID
 * @param {Array} productsData - Array of all products from Firestore
 * @returns {Promise<Array>} Array of wishlist items with full product details
 */
export const getWishlistWithDetails = async (userId, productsData) => {
  const wishlist = await getWishlist(userId);
  
  const wishlistWithDetails = wishlist.items
    .map(item => {
      const product = productsData.find(p => p.id === item.productId);
      if (product) {
        return {
          ...product,
          addedAt: item.addedAt
        };
      }
      return null;
    })
    .filter(item => item !== null); // Remove items where product not found
  
  return wishlistWithDetails;
};

/**
 * Delete entire wishlist document
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const deleteWishlist = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  
  const wishlistRef = doc(db, 'wishlists', userId);
  await deleteDoc(wishlistRef);
};
