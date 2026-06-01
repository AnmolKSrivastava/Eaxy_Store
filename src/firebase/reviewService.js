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
} from 'firebase/firestore';
import { db } from './config';

/**
 * Review Service - Manages product and service reviews in Firebase
 * Collections: product_reviews, service_reviews
 */

/**
 * Add a review for a product or service
 * @param {string} type - 'product' or 'service'
 * @param {string} itemId - Product ID or Service ID
 * @param {Object} reviewData - Review details
 * @returns {Promise<string>} Review ID
 */
export const addReview = async (type, itemId, reviewData) => {
  try {
    const collectionName = type === 'product' ? 'product_reviews' : 'service_reviews';
    const reviewRef = doc(collection(db, collectionName));
    
    const review = {
      itemId,
      userId: reviewData.userId,
      userName: reviewData.userName,
      userEmail: reviewData.userEmail,
      rating: reviewData.rating, // 1-5
      review: reviewData.review,
      verified: reviewData.verified || false, // Verified purchase/booking
      helpful: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    await setDoc(reviewRef, review);
    
    // Update aggregate rating for the item
    await updateAggregateRating(type, itemId);
    
    return reviewRef.id;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

/**
 * Get all reviews for a product
 * @param {string} productId - Product ID
 * @returns {Promise<Array>} Reviews
 */
export const getProductReviews = async (productId) => {
  try {
    const reviewsRef = collection(db, 'product_reviews');
    const q = query(
      reviewsRef,
      where('itemId', '==', productId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    throw error;
  }
};

/**
 * Get all reviews for a service
 * @param {string} serviceId - Service ID
 * @returns {Promise<Array>} Reviews
 */
export const getServiceReviews = async (serviceId) => {
  try {
    const reviewsRef = collection(db, 'service_reviews');
    const q = query(
      reviewsRef,
      where('itemId', '==', serviceId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching service reviews:', error);
    throw error;
  }
};

/**
 * Get reviews by user
 * @param {string} userId - User ID
 * @param {string} type - 'product' or 'service' or 'all'
 * @returns {Promise<Array>} Reviews
 */
export const getUserReviews = async (userId, type = 'all') => {
  try {
    const reviews = [];
    
    if (type === 'product' || type === 'all') {
      try {
        const productReviewsRef = collection(db, 'product_reviews');
        const q = query(productReviewsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        reviews.push(...snapshot.docs.map(doc => ({ id: doc.id, type: 'product', ...doc.data() })));
      } catch (indexError) {
        // Fallback without orderBy if index doesn't exist
        console.warn('product_reviews orderBy failed, fetching without order:', indexError);
        const productReviewsRef = collection(db, 'product_reviews');
        const q = query(productReviewsRef, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        reviews.push(...snapshot.docs.map(doc => ({ id: doc.id, type: 'product', ...doc.data() })));
      }
    }
    
    if (type === 'service' || type === 'all') {
      try {
        const serviceReviewsRef = collection(db, 'service_reviews');
        const q = query(serviceReviewsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        reviews.push(...snapshot.docs.map(doc => ({ id: doc.id, type: 'service', ...doc.data() })));
      } catch (indexError) {
        // Fallback without orderBy if index doesn't exist
        console.warn('service_reviews orderBy failed, fetching without order:', indexError);
        const serviceReviewsRef = collection(db, 'service_reviews');
        const q = query(serviceReviewsRef, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        reviews.push(...snapshot.docs.map(doc => ({ id: doc.id, type: 'service', ...doc.data() })));
      }
    }
    
    // Sort manually by createdAt
    reviews.sort((a, b) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA;
    });
    
    return reviews;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
};

/**
 * Update aggregate rating for a product or service
 * @param {string} type - 'product' or 'service'
 * @param {string} itemId - Product ID or Service ID
 */
export const updateAggregateRating = async (type, itemId) => {
  try {
    const collectionName = type === 'product' ? 'product_reviews' : 'service_reviews';
    const reviewsRef = collection(db, collectionName);
    const q = query(reviewsRef, where('itemId', '==', itemId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return;
    }
    
    const reviews = snapshot.docs.map(doc => doc.data());
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);
    const reviewCount = reviews.length;
    
    // Update the product or service document with new rating
    const itemCollectionName = type === 'product' ? 'products' : 'repair_services';
    const itemRef = doc(db, itemCollectionName, itemId);
    await updateDoc(itemRef, {
      rating: parseFloat(averageRating),
      reviewCount: reviewCount,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating aggregate rating:', error);
    throw error;
  }
};

/**
 * Mark review as helpful
 * @param {string} type - 'product' or 'service'
 * @param {string} reviewId - Review ID
 */
export const markReviewHelpful = async (type, reviewId) => {
  try {
    const collectionName = type === 'product' ? 'product_reviews' : 'service_reviews';
    const reviewRef = doc(db, collectionName, reviewId);
    const reviewSnap = await getDoc(reviewRef);
    
    if (reviewSnap.exists()) {
      const currentHelpful = reviewSnap.data().helpful || 0;
      await updateDoc(reviewRef, {
        helpful: currentHelpful + 1,
      });
    }
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    throw error;
  }
};

/**
 * Update a review
 * @param {string} type - 'product' or 'service'
 * @param {string} reviewId - Review ID
 * @param {Object} updates - Fields to update
 */
export const updateReview = async (type, reviewId, updates) => {
  try {
    const collectionName = type === 'product' ? 'product_reviews' : 'service_reviews';
    const reviewRef = doc(db, collectionName, reviewId);
    
    await updateDoc(reviewRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    
    // If rating was updated, recalculate aggregate
    if (updates.rating) {
      const reviewSnap = await getDoc(reviewRef);
      if (reviewSnap.exists()) {
        await updateAggregateRating(type, reviewSnap.data().itemId);
      }
    }
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

/**
 * Delete a review
 * @param {string} type - 'product' or 'service'
 * @param {string} reviewId - Review ID
 * @param {string} itemId - Product or Service ID (to update aggregate)
 */
export const deleteReview = async (type, reviewId, itemId) => {
  try {
    const collectionName = type === 'product' ? 'product_reviews' : 'service_reviews';
    const reviewRef = doc(db, collectionName, reviewId);
    
    await deleteDoc(reviewRef);
    
    // Update aggregate rating after deletion
    await updateAggregateRating(type, itemId);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

/**
 * Check if user has already reviewed an item
 * @param {string} type - 'product' or 'service'
 * @param {string} itemId - Product or Service ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if user has reviewed
 */
export const hasUserReviewed = async (type, itemId, userId) => {
  try {
    const collectionName = type === 'product' ? 'product_reviews' : 'service_reviews';
    const reviewsRef = collection(db, collectionName);
    const q = query(
      reviewsRef,
      where('itemId', '==', itemId),
      where('userId', '==', userId),
      limit(1)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking if user reviewed:', error);
    return false;
  }
};

/**
 * Get rating statistics for an item
 * @param {string} type - 'product' or 'service'
 * @param {string} itemId - Product or Service ID
 * @returns {Promise<Object>} Rating statistics
 */
export const getRatingStats = async (type, itemId) => {
  try {
    const collectionName = type === 'product' ? 'product_reviews' : 'service_reviews';
    const reviewsRef = collection(db, collectionName);
    const q = query(reviewsRef, where('itemId', '==', itemId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return {
        average: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }
    
    const reviews = snapshot.docs.map(doc => doc.data());
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = (totalRating / reviews.length).toFixed(1);
    
    return {
      average: parseFloat(average),
      total: reviews.length,
      distribution,
    };
  } catch (error) {
    console.error('Error getting rating stats:', error);
    throw error;
  }
};

/**
 * Get recent reviews across all items
 * @param {string} type - 'product' or 'service' or 'all'
 * @param {number} limitCount - Number of reviews to fetch
 * @returns {Promise<Array>} Recent reviews
 */
export const getRecentReviews = async (type = 'all', limitCount = 10) => {
  try {
    const reviews = [];
    
    if (type === 'product' || type === 'all') {
      const productReviewsRef = collection(db, 'product_reviews');
      const q = query(productReviewsRef, orderBy('createdAt', 'desc'), limit(limitCount));
      const snapshot = await getDocs(q);
      reviews.push(...snapshot.docs.map(doc => ({ id: doc.id, type: 'product', ...doc.data() })));
    }
    
    if (type === 'service' || type === 'all') {
      const serviceReviewsRef = collection(db, 'service_reviews');
      const q = query(serviceReviewsRef, orderBy('createdAt', 'desc'), limit(limitCount));
      const snapshot = await getDocs(q);
      reviews.push(...snapshot.docs.map(doc => ({ id: doc.id, type: 'service', ...doc.data() })));
    }
    
    return reviews.sort((a, b) => b.createdAt - a.createdAt).slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching recent reviews:', error);
    throw error;
  }
};
