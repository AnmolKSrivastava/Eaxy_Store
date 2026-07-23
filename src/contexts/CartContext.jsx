import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  getCart,
  addToCart as addToCartService,
  updateCartItemQuantity as updateQuantityService,
  removeFromCart as removeFromCartService,
  clearCart as clearCartService,
  mergeCart as mergeCartService
} from '../firebase/cartService';

const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

const CART_STORAGE_KEY = 'eaxy_guest_cart';

export function CartProvider({ children }) {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemCount, setItemCount] = useState(0);

  // Load cart on mount and when user changes
  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Update item count whenever cartItems changes
  useEffect(() => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setItemCount(count);
  }, [cartItems]);

  // Load cart from Firebase or localStorage
  const loadCart = async () => {
    setLoading(true);
    try {
      if (currentUser) {
        // Load from Firebase
        const cart = await getCart(currentUser.uid);
        setCartItems(cart.items || []);
        
        // Merge guest cart if exists
        const guestCart = getGuestCart();
        if (guestCart.length > 0) {
          await mergeCartService(currentUser.uid, guestCart);
          clearGuestCart();
          // Reload after merge
          const updatedCart = await getCart(currentUser.uid);
          setCartItems(updatedCart.items || []);
        }
      } else {
        // Load from localStorage
        const guestCart = getGuestCart();
        setCartItems(guestCart);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get guest cart from localStorage
  const getGuestCart = () => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading guest cart:', error);
      return [];
    }
  };

  // Save guest cart to localStorage
  const saveGuestCart = (items) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  };

  // Clear guest cart from localStorage
  const clearGuestCart = () => {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing guest cart:', error);
    }
  };

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      const item = {
        productId: product.id,
        name: product.name,
        image: product.images && product.images.length > 0 ? product.images[0] : product.image,
        price: product.price,
        quantity,
        inStock: product.inStock !== undefined ? product.inStock : true,
        specs: product.specs || []
      };

      if (currentUser) {
        // Add to Firebase
        await addToCartService(currentUser.uid, item);
        const updatedCart = await getCart(currentUser.uid);
        setCartItems(updatedCart.items || []);
      } else {
        // Add to localStorage
        const existingIndex = cartItems.findIndex(i => i.productId === product.id);
        let updatedItems;
        
        if (existingIndex >= 0) {
          updatedItems = [...cartItems];
          updatedItems[existingIndex].quantity += quantity;
        } else {
          updatedItems = [...cartItems, { ...item, addedAt: new Date().toISOString() }];
        }
        
        setCartItems(updatedItems);
        saveGuestCart(updatedItems);
      }
      
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity < 1) {
        await removeItem(productId);
        return;
      }

      if (currentUser) {
        // Update in Firebase
        await updateQuantityService(currentUser.uid, productId, quantity);
        const updatedCart = await getCart(currentUser.uid);
        setCartItems(updatedCart.items || []);
      } else {
        // Update in localStorage
        const updatedItems = cartItems.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        );
        setCartItems(updatedItems);
        saveGuestCart(updatedItems);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  };

  // Remove item from cart
  const removeItem = async (productId) => {
    try {
      if (currentUser) {
        // Remove from Firebase
        await removeFromCartService(currentUser.uid, productId);
        const updatedCart = await getCart(currentUser.uid);
        setCartItems(updatedCart.items || []);
      } else {
        // Remove from localStorage
        const updatedItems = cartItems.filter(item => item.productId !== productId);
        setCartItems(updatedItems);
        saveGuestCart(updatedItems);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      if (currentUser) {
        // Clear Firebase cart
        await clearCartService(currentUser.uid);
        setCartItems([]);
      } else {
        // Clear localStorage cart
        setCartItems([]);
        clearGuestCart();
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return cartItems.some(item => item.productId === productId);
  };

  // Get item quantity
  const getItemQuantity = (productId) => {
    const item = cartItems.find(i => i.productId === productId);
    return item ? item.quantity : 0;
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCharges = subtotal > 50000 ? 0 : 500;
    const tax = subtotal * 0.18; // 18% GST
    const totalAmount = subtotal + shippingCharges + tax;
    
    return {
      subtotal,
      shippingCharges,
      tax,
      totalAmount
    };
  };

  const value = {
    cartItems,
    loading,
    itemCount,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    isInCart,
    getItemQuantity,
    calculateTotals,
    refreshCart: loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
