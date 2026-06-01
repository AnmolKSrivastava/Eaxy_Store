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
 * Cart Service - Manages user shopping cart in Firebase
 * Cart stored at: carts/{userId}
 */

/**
 * Get user's cart
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Cart object with items array
 */
export const getCart = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  
  const cartRef = doc(db, 'carts', userId);
  const cartSnap = await getDoc(cartRef);
  
  if (cartSnap.exists()) {
    return { id: cartSnap.id, ...cartSnap.data() };
  }
  
  // Return empty cart if doesn't exist
  return {
    userId,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

/**
 * Add item to cart or update quantity if already exists
 * @param {string} userId - User ID
 * @param {Object} item - Product item to add
 * @returns {Promise<void>}
 */
export const addToCart = async (userId, item) => {
  if (!userId) throw new Error('User ID is required');
  if (!item.productId) throw new Error('Product ID is required');
  
  const cartRef = doc(db, 'carts', userId);
  const cartSnap = await getDoc(cartRef);
  
  const cartItem = {
    productId: item.productId,
    name: item.name,
    image: item.image,
    price: item.price,
    quantity: item.quantity || 1,
    addedAt: new Date().toISOString(),
    inStock: item.inStock !== undefined ? item.inStock : true,
    specs: item.specs || []
  };
  
  if (cartSnap.exists()) {
    const currentCart = cartSnap.data();
    const existingItemIndex = currentCart.items.findIndex(
      i => i.productId === item.productId
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedItems = [...currentCart.items];
      updatedItems[existingItemIndex].quantity += (item.quantity || 1);
      updatedItems[existingItemIndex].price = item.price; // Update price in case it changed
      updatedItems[existingItemIndex].inStock = item.inStock !== undefined ? item.inStock : true;
      
      await updateDoc(cartRef, {
        items: updatedItems,
        updatedAt: serverTimestamp()
      });
    } else {
      // Add new item
      await updateDoc(cartRef, {
        items: arrayUnion(cartItem),
        updatedAt: serverTimestamp()
      });
    }
  } else {
    // Create new cart
    await setDoc(cartRef, {
      userId,
      items: [cartItem],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
};

/**
 * Update item quantity in cart
 * @param {string} userId - User ID
 * @param {string} productId - Product ID
 * @param {number} quantity - New quantity
 * @returns {Promise<void>}
 */
export const updateCartItemQuantity = async (userId, productId, quantity) => {
  if (!userId) throw new Error('User ID is required');
  if (!productId) throw new Error('Product ID is required');
  if (quantity < 1) throw new Error('Quantity must be at least 1');
  
  const cartRef = doc(db, 'carts', userId);
  const cartSnap = await getDoc(cartRef);
  
  if (cartSnap.exists()) {
    const currentCart = cartSnap.data();
    const updatedItems = currentCart.items.map(item => 
      item.productId === productId 
        ? { ...item, quantity }
        : item
    );
    
    await updateDoc(cartRef, {
      items: updatedItems,
      updatedAt: serverTimestamp()
    });
  }
};

/**
 * Remove item from cart
 * @param {string} userId - User ID
 * @param {string} productId - Product ID to remove
 * @returns {Promise<void>}
 */
export const removeFromCart = async (userId, productId) => {
  if (!userId) throw new Error('User ID is required');
  if (!productId) throw new Error('Product ID is required');
  
  const cartRef = doc(db, 'carts', userId);
  const cartSnap = await getDoc(cartRef);
  
  if (cartSnap.exists()) {
    const currentCart = cartSnap.data();
    const updatedItems = currentCart.items.filter(
      item => item.productId !== productId
    );
    
    await updateDoc(cartRef, {
      items: updatedItems,
      updatedAt: serverTimestamp()
    });
  }
};

/**
 * Clear entire cart
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const clearCart = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  
  const cartRef = doc(db, 'carts', userId);
  await updateDoc(cartRef, {
    items: [],
    updatedAt: serverTimestamp()
  });
};

/**
 * Merge guest cart with user cart on login
 * @param {string} userId - User ID
 * @param {Array} guestCartItems - Items from localStorage
 * @returns {Promise<void>}
 */
export const mergeCart = async (userId, guestCartItems) => {
  if (!userId) throw new Error('User ID is required');
  if (!guestCartItems || guestCartItems.length === 0) return;
  
  const cartRef = doc(db, 'carts', userId);
  const cartSnap = await getDoc(cartRef);
  
  if (cartSnap.exists()) {
    const currentCart = cartSnap.data();
    const mergedItems = [...currentCart.items];
    
    // Merge guest items
    guestCartItems.forEach(guestItem => {
      const existingIndex = mergedItems.findIndex(
        item => item.productId === guestItem.productId
      );
      
      if (existingIndex >= 0) {
        // Increase quantity
        mergedItems[existingIndex].quantity += guestItem.quantity;
      } else {
        // Add new item
        mergedItems.push(guestItem);
      }
    });
    
    await updateDoc(cartRef, {
      items: mergedItems,
      updatedAt: serverTimestamp()
    });
  } else {
    // Create new cart with guest items
    await setDoc(cartRef, {
      userId,
      items: guestCartItems,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
};

/**
 * Delete entire cart document
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const deleteCart = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  
  const cartRef = doc(db, 'carts', userId);
  await deleteDoc(cartRef);
};

/**
 * Get cart item count
 * @param {string} userId - User ID
 * @returns {Promise<number>} Total item count
 */
export const getCartItemCount = async (userId) => {
  if (!userId) return 0;
  
  const cart = await getCart(userId);
  return cart.items.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Validate cart items (check stock availability)
 * @param {string} userId - User ID
 * @param {Array} productsData - Array of current product data from Firestore
 * @returns {Promise<Object>} Validation result with valid items and issues
 */
export const validateCart = async (userId, productsData) => {
  const cart = await getCart(userId);
  const validItems = [];
  const issues = [];
  
  cart.items.forEach(cartItem => {
    const product = productsData.find(p => p.id === cartItem.productId);
    
    if (!product) {
      issues.push({
        productId: cartItem.productId,
        name: cartItem.name,
        issue: 'Product no longer available'
      });
    } else if (!product.inStock) {
      issues.push({
        productId: cartItem.productId,
        name: cartItem.name,
        issue: 'Out of stock'
      });
    } else if (product.price !== cartItem.price) {
      // Price changed - update cart item
      validItems.push({
        ...cartItem,
        price: product.price,
        oldPrice: cartItem.price
      });
      issues.push({
        productId: cartItem.productId,
        name: cartItem.name,
        issue: 'Price changed',
        oldPrice: cartItem.price,
        newPrice: product.price
      });
    } else {
      validItems.push(cartItem);
    }
  });
  
  return {
    valid: issues.length === 0,
    validItems,
    issues
  };
};
