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
  limit,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { updateUserDoc } from './userService';

/**
 * Order Service - Manages product orders in Firebase
 * Orders stored at: orders/{orderId}
 */

/**
 * Generate unique order ID
 * @returns {string} Order ID in format ORD-YYYYMMDD-XXXXX
 */
const generateOrderId = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${dateStr}-${random}`;
};

/**
 * Create new order
 * @param {Object} orderData - Order details
 * @returns {Promise<string>} Created order ID
 */
export const createOrder = async (orderData) => {
  const {
    userId,
    items,
    customer,
    deliveryAddress,
    subtotal,
    shippingCharges,
    tax,
    totalAmount,
    paymentMethod = 'pending',
    notes = ''
  } = orderData;

  if (!userId) throw new Error('User ID is required');
  if (!items || items.length === 0) throw new Error('Order must have at least one item');
  if (!customer) throw new Error('Customer information is required');
  if (!deliveryAddress) throw new Error('Delivery address is required');

  const orderId = generateOrderId();
  const orderRef = doc(db, 'orders', orderId);
  const orderDate = new Date();
  const orderDeadline = new Date(orderDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours

  const order = {
    orderId,
    userId,
    status: 'pending',
    
    // Order Items
    items: items.map(item => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
      specs: item.specs || []
    })),
    
    // Customer Info
    customer: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      userId
    },
    
    // Delivery Info
    deliveryAddress: {
      addressLine1: deliveryAddress.addressLine1,
      addressLine2: deliveryAddress.addressLine2 || '',
      landmark: deliveryAddress.landmark || '',
      pincode: deliveryAddress.pincode,
      city: deliveryAddress.city || 'Pune',
      area: deliveryAddress.area,
      addressType: deliveryAddress.addressType || 'Home',
      phone: deliveryAddress.phone || customer.phone
    },
    
    // Pricing
    subtotal,
    shippingCharges,
    tax,
    discount: 0,
    totalAmount,
    
    // Payment (simplified - no integration yet)
    paymentStatus: 'pending',
    paymentMethod,
    paymentId: null,
    paidAt: null,
    
    // Timestamps
    createdAt: serverTimestamp(),
    orderDate: serverTimestamp(),
    orderDeadline: orderDeadline.toISOString(),
    confirmedAt: null,
    dispatchedAt: null,
    deliveredAt: null,
    cancelledAt: null,
    
    // Status History
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date().toISOString(),
        updatedBy: 'customer',
        notes: 'Order placed'
      }
    ],
    
    // Metadata
    source: 'web',
    createdBy: customer.email,
    notes,
    cancellationReason: null,
    
    // Compliance
    deliveredWithin4Hours: null,
    actualDeliveryTime: null
  };

  await setDoc(orderRef, order);

  // Update user stats
  try {
    await updateUserDoc(userId, {
      totalOrders: increment(1),
      lastOrderDate: serverTimestamp()
    });
  } catch (error) {
    console.error('Failed to update user stats:', error);
  }

  return orderId;
};

/**
 * Get order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order data
 */
export const getOrder = async (orderId) => {
  if (!orderId) throw new Error('Order ID is required');
  
  const orderRef = doc(db, 'orders', orderId);
  const orderSnap = await getDoc(orderRef);
  
  if (!orderSnap.exists()) {
    throw new Error('Order not found');
  }
  
  return { id: orderSnap.id, ...orderSnap.data() };
};

/**
 * Get all orders for a user
 * @param {string} userId - User ID
 * @param {number} limitCount - Max number of orders to return
 * @returns {Promise<Array>} Array of orders
 */
export const getUserOrders = async (userId, limitCount = 50) => {
  if (!userId) throw new Error('User ID is required');
  
  try {
    console.log('🔍 getUserOrders called with userId:', userId);
    const ordersRef = collection(db, 'orders');
    
    // Try with orderBy first
    try {
      const q = query(
        ordersRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`✅ Found ${orders.length} orders for user ${userId}`);
      
      if (orders.length === 0) {
        // Debug: check if orders exist at all
        const allOrdersQuery = query(ordersRef, limit(5));
        const allSnapshot = await getDocs(allOrdersQuery);
        console.log(`📊 Total orders in database (sample):`, allSnapshot.size);
        if (allSnapshot.size > 0) {
          const sampleOrder = allSnapshot.docs[0].data();
          console.log(`📋 Sample order userId field:`, sampleOrder.userId);
          console.log(`📋 Sample order customer.userId:`, sampleOrder.customer?.userId);
          console.log(`🔍 Comparing with searched userId:`, userId);
        }
      }
      
      return orders;
    } catch (indexError) {
      // If orderBy fails (no index), try without it
      console.warn('orderBy failed, trying without ordering:', indexError);
      const q = query(
        ordersRef,
        where('userId', '==', userId),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort manually by createdAt or orderDate
      orders.sort((a, b) => {
        const dateA = a.createdAt?.seconds || a.orderDate?.seconds || 0;
        const dateB = b.createdAt?.seconds || b.orderDate?.seconds || 0;
        return dateB - dateA;
      });
      
      console.log(`✅ Found ${orders.length} orders for user ${userId} (manual sort)`);
      
      if (orders.length === 0) {
        // Debug: check if orders exist at all
        const allOrdersQuery = query(ordersRef, limit(5));
        const allSnapshot = await getDocs(allOrdersQuery);
        console.log(`📊 Total orders in database (sample):`, allSnapshot.size);
        if (allSnapshot.size > 0) {
          const sampleOrder = allSnapshot.docs[0].data();
          console.log(`📋 Sample order userId field:`, sampleOrder.userId);
          console.log(`📋 Sample order customer.userId:`, sampleOrder.customer?.userId);
          console.log(`🔍 Comparing with searched userId:`, userId);
        }
      }
      
      return orders;
    }
  } catch (error) {
    console.error('❌ Error fetching user orders:', error);
    throw error;
  }
};

/**
 * Get all orders (admin)
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} Array of orders
 */
export const getAllOrders = async (filters = {}) => {
  try {
    const ordersRef = collection(db, 'orders');
    
    // Try with ordering
    try {
      let q;
      
      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        q = query(ordersRef, where('status', '==', filters.status), orderBy('createdAt', 'desc'));
      } 
      // Apply area filter
      else if (filters.area && filters.area !== 'all') {
        q = query(ordersRef, where('deliveryAddress.area', '==', filters.area), orderBy('createdAt', 'desc'));
      }
      // No filters
      else {
        q = query(ordersRef, orderBy('createdAt', 'desc'));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (indexError) {
      // If orderBy fails, get all and sort manually
      console.warn('getAllOrders orderBy failed, fetching without ordering:', indexError);
      
      let q = query(ordersRef);
      
      // Apply filters without orderBy
      if (filters.status && filters.status !== 'all') {
        q = query(ordersRef, where('status', '==', filters.status));
      } else if (filters.area && filters.area !== 'all') {
        q = query(ordersRef, where('deliveryAddress.area', '==', filters.area));
      }
      
      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort manually
      orders.sort((a, b) => {
        const dateA = a.createdAt?.seconds || a.orderDate?.seconds || 0;
        const dateB = b.createdAt?.seconds || b.orderDate?.seconds || 0;
        return dateB - dateA;
      });
      
      return orders;
    }
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {string} newStatus - New status
 * @param {string} updatedBy - Who updated (admin email or 'customer')
 * @param {string} notes - Optional notes
 * @returns {Promise<void>}
 */
export const updateOrderStatus = async (orderId, newStatus, updatedBy = 'admin', notes = '') => {
  if (!orderId) throw new Error('Order ID is required');
  if (!newStatus) throw new Error('Status is required');
  
  const validStatuses = ['pending', 'processing', 'out-for-delivery', 'delivered', 'cancelled'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }
  
  const orderRef = doc(db, 'orders', orderId);
  const orderSnap = await getDoc(orderRef);
  
  if (!orderSnap.exists()) {
    throw new Error('Order not found');
  }
  
  const currentOrder = orderSnap.data();
  const statusHistoryEntry = {
    status: newStatus,
    timestamp: new Date().toISOString(),
    updatedBy,
    notes: notes || `Status updated to ${newStatus}`
  };
  
  const updates = {
    status: newStatus,
    statusHistory: [...currentOrder.statusHistory, statusHistoryEntry]
  };
  
  // Update specific timestamp based on status
  switch (newStatus) {
    case 'processing':
      updates.confirmedAt = serverTimestamp();
      break;
    case 'out-for-delivery':
      updates.dispatchedAt = serverTimestamp();
      break;
    case 'delivered':
      updates.deliveredAt = serverTimestamp();
      // Calculate delivery time
      const orderDate = new Date(currentOrder.orderDate.seconds * 1000);
      const deliveredAt = new Date();
      const deliveryTimeMinutes = Math.floor((deliveredAt - orderDate) / 1000 / 60);
      updates.actualDeliveryTime = deliveryTimeMinutes;
      updates.deliveredWithin4Hours = deliveryTimeMinutes <= 240; // 4 hours = 240 minutes
      
      // Update user stats
      try {
        await updateUserDoc(currentOrder.userId, {
          totalSpent: increment(currentOrder.totalAmount)
        });
      } catch (error) {
        console.error('Failed to update user stats:', error);
      }
      break;
    case 'cancelled':
      updates.cancelledAt = serverTimestamp();
      // Release stock back (TODO: implement stock reservation)
      break;
    default:
      // No additional timestamp updates for other statuses
      break;
  }
  
  await updateDoc(orderRef, updates);
};

/**
 * Cancel order
 * @param {string} orderId - Order ID
 * @param {string} reason - Cancellation reason
 * @param {string} cancelledBy - Who cancelled
 * @returns {Promise<void>}
 */
export const cancelOrder = async (orderId, reason, cancelledBy = 'customer') => {
  if (!orderId) throw new Error('Order ID is required');
  if (!reason) throw new Error('Cancellation reason is required');
  
  const orderRef = doc(db, 'orders', orderId);
  const orderSnap = await getDoc(orderRef);
  
  if (!orderSnap.exists()) {
    throw new Error('Order not found');
  }
  
  const currentOrder = orderSnap.data();
  
  // Only allow cancellation if not dispatched
  if (currentOrder.status === 'out-for-delivery' || currentOrder.status === 'delivered') {
    throw new Error('Cannot cancel order that is already dispatched or delivered');
  }
  
  await updateDoc(orderRef, {
    status: 'cancelled',
    cancelledAt: serverTimestamp(),
    cancellationReason: reason,
    statusHistory: [
      ...currentOrder.statusHistory,
      {
        status: 'cancelled',
        timestamp: new Date().toISOString(),
        updatedBy: cancelledBy,
        notes: `Order cancelled: ${reason}`
      }
    ]
  });
};

/**
 * Update payment status
 * @param {string} orderId - Order ID
 * @param {string} paymentStatus - Payment status (pending/paid/failed/refunded)
 * @param {string} paymentId - Payment gateway transaction ID
 * @returns {Promise<void>}
 */
export const updatePaymentStatus = async (orderId, paymentStatus, paymentId = null) => {
  if (!orderId) throw new Error('Order ID is required');
  if (!paymentStatus) throw new Error('Payment status is required');
  
  const orderRef = doc(db, 'orders', orderId);
  const updates = {
    paymentStatus
  };
  
  if (paymentStatus === 'paid') {
    updates.paidAt = serverTimestamp();
  }
  
  if (paymentId) {
    updates.paymentId = paymentId;
  }
  
  await updateDoc(orderRef, updates);
};

/**
 * Add notes to order
 * @param {string} orderId - Order ID
 * @param {string} notes - Notes to add
 * @returns {Promise<void>}
 */
export const addOrderNotes = async (orderId, notes) => {
  if (!orderId) throw new Error('Order ID is required');
  
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, { notes });
};

/**
 * Delete order (admin only)
 * @param {string} orderId - Order ID
 * @returns {Promise<void>}
 */
export const deleteOrder = async (orderId) => {
  if (!orderId) throw new Error('Order ID is required');
  
  const orderRef = doc(db, 'orders', orderId);
  await deleteDoc(orderRef);
};

/**
 * Get orders by status
 * @param {string} status - Order status
 * @param {number} limitCount - Max number of orders
 * @returns {Promise<Array>} Array of orders
 */
export const getOrdersByStatus = async (status, limitCount = 50) => {
  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    where('status', '==', status),
    orderBy('orderDate', 'desc'),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Get orders by delivery area
 * @param {string} area - Delivery area
 * @param {number} limitCount - Max number of orders
 * @returns {Promise<Array>} Array of orders
 */
export const getOrdersByArea = async (area, limitCount = 50) => {
  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    where('deliveryAddress.area', '==', area),
    orderBy('orderDate', 'desc'),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Get today's orders
 * @returns {Promise<Array>} Array of today's orders
 */
export const getTodaysOrders = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    where('orderDate', '>=', today),
    orderBy('orderDate', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Get order statistics
 * @returns {Promise<Object>} Order statistics
 */
export const getOrderStats = async () => {
  const allOrders = await getAllOrders();
  
  const stats = {
    total: allOrders.filter(o => o.status !== 'cancelled').length,
    pending: allOrders.filter(o => o.status === 'pending').length,
    processing: allOrders.filter(o => o.status === 'processing').length,
    outForDelivery: allOrders.filter(o => o.status === 'out-for-delivery').length,
    delivered: allOrders.filter(o => o.status === 'delivered').length,
    cancelled: allOrders.filter(o => o.status === 'cancelled').length,
    totalRevenue: allOrders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.totalAmount, 0),
    averageOrderValue: 0,
    deliveredWithin4Hours: 0,
    complianceRate: 0
  };
  
  if (stats.delivered > 0) {
    stats.averageOrderValue = stats.totalRevenue / stats.delivered;
    const within4Hours = allOrders.filter(
      o => o.status === 'delivered' && o.deliveredWithin4Hours === true
    ).length;
    stats.deliveredWithin4Hours = within4Hours;
    stats.complianceRate = (within4Hours / stats.delivered) * 100;
  }
  
  return stats;
};
