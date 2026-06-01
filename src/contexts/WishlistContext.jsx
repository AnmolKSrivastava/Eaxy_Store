import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  getWishlist,
  addToWishlist as addToWishlistService,
  removeFromWishlist as removeFromWishlistService,
  clearWishlist as clearWishlistService,
  mergeWishlist as mergeWishlistService
} from '../firebase/wishlistService';

const WishlistContext = createContext();

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}

const WISHLIST_STORAGE_KEY = 'eaxy_guest_wishlist';

export function WishlistProvider({ children }) {
  const { currentUser } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemCount, setItemCount] = useState(0);

  // Load wishlist on mount and when user changes
  useEffect(() => {
    loadWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Update item count whenever wishlistItems changes
  useEffect(() => {
    setItemCount(wishlistItems.length);
  }, [wishlistItems]);

  // Load wishlist from Firebase or localStorage
  const loadWishlist = async () => {
    setLoading(true);
    try {
      if (currentUser) {
        // Load from Firebase
        const wishlist = await getWishlist(currentUser.uid);
        setWishlistItems(wishlist.items || []);
        
        // Merge guest wishlist if exists
        const guestWishlist = getGuestWishlist();
        if (guestWishlist.length > 0) {
          await mergeWishlistService(currentUser.uid, guestWishlist);
          clearGuestWishlist();
          // Reload after merge
          const updatedWishlist = await getWishlist(currentUser.uid);
          setWishlistItems(updatedWishlist.items || []);
        }
      } else {
        // Load from localStorage
        const guestWishlist = getGuestWishlist();
        setWishlistItems(guestWishlist.map(productId => ({
          productId,
          addedAt: new Date().toISOString()
        })));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get guest wishlist from localStorage (array of product IDs)
  const getGuestWishlist = () => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading guest wishlist:', error);
      return [];
    }
  };

  // Save guest wishlist to localStorage
  const saveGuestWishlist = (productIds) => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(productIds));
    } catch (error) {
      console.error('Error saving guest wishlist:', error);
    }
  };

  // Clear guest wishlist from localStorage
  const clearGuestWishlist = () => {
    try {
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing guest wishlist:', error);
    }
  };

  // Add item to wishlist
  const addToWishlist = async (productId) => {
    try {
      if (currentUser) {
        // Add to Firebase
        await addToWishlistService(currentUser.uid, productId);
        const updatedWishlist = await getWishlist(currentUser.uid);
        setWishlistItems(updatedWishlist.items || []);
      } else {
        // Add to localStorage
        const productIds = wishlistItems.map(item => item.productId);
        if (!productIds.includes(productId)) {
          const newItem = {
            productId,
            addedAt: new Date().toISOString()
          };
          setWishlistItems([...wishlistItems, newItem]);
          saveGuestWishlist([...productIds, productId]);
        }
      }
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      if (currentUser) {
        // Remove from Firebase
        await removeFromWishlistService(currentUser.uid, productId);
        const updatedWishlist = await getWishlist(currentUser.uid);
        setWishlistItems(updatedWishlist.items || []);
      } else {
        // Remove from localStorage
        const updatedItems = wishlistItems.filter(item => item.productId !== productId);
        setWishlistItems(updatedItems);
        const productIds = updatedItems.map(item => item.productId);
        saveGuestWishlist(productIds);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  };

  // Toggle item in wishlist (add if not exists, remove if exists)
  const toggleWishlist = async (productId) => {
    try {
      const inWishlist = isInWishlist(productId);
      
      if (inWishlist) {
        await removeFromWishlist(productId);
        return false; // Removed
      } else {
        await addToWishlist(productId);
        return true; // Added
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      throw error;
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    try {
      if (currentUser) {
        // Clear Firebase wishlist
        await clearWishlistService(currentUser.uid);
        setWishlistItems([]);
      } else {
        // Clear localStorage wishlist
        setWishlistItems([]);
        clearGuestWishlist();
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw error;
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  // Get wishlist product IDs only
  const getWishlistProductIds = () => {
    return wishlistItems.map(item => item.productId);
  };

  const value = {
    wishlistItems,
    loading,
    itemCount,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistProductIds,
    refreshWishlist: loadWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}
