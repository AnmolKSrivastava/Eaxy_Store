# Review System Implementation Guide

## Overview

The review system allows customers to rate and review products and repair services. It includes:
- Star ratings (1-5 stars)
- Written reviews
- Verified purchase/booking badges
- Helpful vote system
- Automatic rating aggregation
- Rating distribution charts

## Phase 1: Realistic Ratings (✅ Complete)

### Changes Made:

1. **Testimonials Updated**
   - Added `rating` field to testimonials (mix of 4 and 5 stars)
   - Updated `TestimonialsSection.jsx` to display actual ratings
   - Location: `src/data/homeData.js`, `src/components/home/TestimonialsSection.jsx`

2. **Product Ratings Updated**
   - Removed hardcoded `4.5` fallback rating
   - Added support for `reviewCount` display
   - Only shows rating if product has been rated
   - Location: `src/pages/ProductsPage.jsx`, `src/pages/ProductDetailPage.jsx`

3. **CSS Updated**
   - Added styles for review count display
   - Location: `src/pages/ProductsPage.css`, `src/pages/ProductDetailPage.css`

## Phase 2: Review System (✅ Complete)

### Firebase Collections Created:

#### `product_reviews`
```javascript
{
  itemId: string,           // Product ID
  userId: string,           // User ID
  userName: string,         // Display name
  userEmail: string,        // User email
  rating: number,           // 1-5
  review: string,           // Review text
  verified: boolean,        // Verified purchase
  helpful: number,          // Helpful count
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `service_reviews`
```javascript
{
  itemId: string,           // Service ID
  userId: string,           // User ID
  userName: string,         // Display name
  userEmail: string,        // User email
  rating: number,           // 1-5
  review: string,           // Review text
  verified: boolean,        // Verified booking
  helpful: number,          // Helpful count
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Services Created:

**`src/firebase/reviewService.js`**
- `addReview(type, itemId, reviewData)` - Add new review
- `getProductReviews(productId)` - Get all product reviews
- `getServiceReviews(serviceId)` - Get all service reviews
- `getUserReviews(userId, type)` - Get user's reviews
- `updateAggregateRating(type, itemId)` - Update average rating
- `markReviewHelpful(type, reviewId)` - Mark review as helpful
- `updateReview(type, reviewId, updates)` - Update review
- `deleteReview(type, reviewId, itemId)` - Delete review
- `hasUserReviewed(type, itemId, userId)` - Check if user reviewed
- `getRatingStats(type, itemId)` - Get rating distribution
- `getRecentReviews(type, limitCount)` - Get recent reviews

### Components Created:

**`src/components/shared/ReviewSection.jsx`**
- Displays all reviews for a product or service
- Shows rating summary and distribution
- Allows logged-in users to submit reviews
- Prevents duplicate reviews per user
- Includes "Verified Purchase/Booking" badges
- "Mark as Helpful" functionality
- Styled with `ReviewSection.css`

## How to Use

### 1. Add ReviewSection to Product Detail Page

```javascript
import { ReviewSection } from '../../components/shared';

// In ProductDetailPage.jsx
<ReviewSection 
  type="product" 
  itemId={product.id} 
  itemName={product.name} 
/>
```

### 2. Add ReviewSection to Service Detail Page

```javascript
import { ReviewSection } from '../../components/shared';

// In RepairServiceDetailPage.jsx (if exists)
<ReviewSection 
  type="service" 
  itemId={service.id} 
  itemName={service.title} 
/>
```

### 3. Firebase Security Rules

Add these rules to Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Product reviews - read public, write authenticated
    match /product_reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null 
                    && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null 
                            && resource.data.userId == request.auth.uid;
    }
    
    // Service reviews - read public, write authenticated
    match /service_reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null 
                    && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null 
                            && resource.data.userId == request.auth.uid;
    }
  }
}
```

### 4. Deploy Security Rules

```bash
firebase deploy --only firestore:rules
```

## Features

✅ **Rating Display**
- Star rating (1-5 stars)
- Review count display
- Average rating calculation
- Rating distribution chart

✅ **Review Submission**
- Only logged-in users can review
- One review per user per item
- Star rating selector
- Text review (required)
- Real-time updates after submission

✅ **Review Management**
- View all reviews for an item
- Sort by date (newest first)
- Mark reviews as helpful
- Verified purchase/booking badge
- Edit own reviews (can be added)
- Delete own reviews (can be added)

✅ **Automatic Aggregation**
- Average rating calculated from all reviews
- Review count updated automatically
- Updates product/service document
- Real-time stats

## Admin Features (To Be Added)

Future enhancements for admin dashboard:
- View all reviews across all products/services
- Moderate reviews (approve/reject/delete)
- Respond to reviews
- Filter reviews by rating
- Export reviews for analysis
- Review analytics dashboard

## Testing

### Test Review Submission:
1. Login as a user
2. Navigate to a product detail page
3. Click "Write a Review"
4. Select rating (1-5 stars)
5. Write review text
6. Submit
7. Verify review appears immediately
8. Check that product rating updates

### Test Review Display:
1. Navigate to a product/service with reviews
2. Verify rating summary shows correct average
3. Check rating distribution bars
4. Verify review count is accurate
5. Test "Mark as Helpful" button

## Notes

- Reviews are tied to user accounts (must be logged in)
- Each user can only review an item once
- Reviews immediately update product/service ratings
- "Verified" badge can be set based on actual purchase/booking data
- All reviews are public and visible to everyone
- Rating aggregation happens automatically on review add/update/delete

## Next Steps

1. **Add ReviewSection to ProductDetailPage**
2. **Update Firebase Security Rules**
3. **Test review system thoroughly**
4. **Add review moderation in admin dashboard**
5. **Consider adding review photos/videos**
6. **Add review sorting options (most helpful, recent, high/low rating)**
7. **Implement review reporting for inappropriate content**
