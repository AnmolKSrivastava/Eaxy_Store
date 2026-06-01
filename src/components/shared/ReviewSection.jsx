import { useState, useEffect, useCallback } from 'react';
import { Star, ThumbsUp, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  getProductReviews,
  getServiceReviews,
  addReview,
  markReviewHelpful,
  getRatingStats,
  hasUserReviewed,
} from '../../firebase/reviewService';
import './ReviewSection.css';

/**
 * ReviewSection Component
 * Displays reviews and allows users to add reviews for products or services
 * @param {string} type - 'product' or 'service'
 * @param {string} itemId - Product ID or Service ID
 * @param {string} itemName - Product or Service name (for context)
 */
function ReviewSection({ type, itemId, itemName }) {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    rating: 5,
    review: '',
  });
  const [error, setError] = useState('');

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError('');
      const [reviewsData, statsData] = await Promise.all([
        type === 'product' ? getProductReviews(itemId) : getServiceReviews(itemId),
        getRatingStats(type, itemId),
      ]);
      setReviews(reviewsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading reviews:', err);
      setLoadError(err.message || 'Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [type, itemId]);

  const checkIfUserReviewed = useCallback(async () => {
    if (!currentUser) return;
    try {
      const reviewed = await hasUserReviewed(type, itemId, currentUser.uid);
      setHasReviewed(reviewed);
    } catch (err) {
      console.error('Error checking review status:', err);
    }
  }, [type, itemId, currentUser]);

  useEffect(() => {
    loadReviews();
    checkIfUserReviewed();
  }, [loadReviews, checkIfUserReviewed]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('Please login to submit a review');
      return;
    }
    
    if (hasReviewed) {
      setError('You have already reviewed this item');
      return;
    }
    
    if (!formData.review.trim()) {
      setError('Please write a review');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      await addReview(type, itemId, {
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userEmail: currentUser.email || '',
        rating: formData.rating,
        review: formData.review.trim(),
        verified: false, // Can be set based on purchase/booking verification
      });
      
      // Reset form and reload reviews
      setFormData({ rating: 5, review: '' });
      setShowForm(false);
      setHasReviewed(true);
      await loadReviews();
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    try {
      await markReviewHelpful(type, reviewId);
      await loadReviews();
    } catch (err) {
      console.error('Error marking review as helpful:', err);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const renderStars = (rating, size = 16) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={size}
        fill={star <= rating ? 'var(--gold)' : 'none'}
        stroke="var(--gold)"
      />
    ));
  };

  if (loading) {
    return (
      <div className="review-section">
        <div className="review-section-header">
          <h2>Customer Reviews</h2>
        </div>
        <p style={{ color: 'var(--muted)', padding: '2rem 0' }}>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="review-section">
      <div className="review-section-header">
        <h2>Customer Reviews</h2>
        {!hasReviewed && currentUser && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Load Error Display */}
      {loadError && (
        <div className="review-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={16} />
          {loadError}
        </div>
      )}

      {/* Rating Summary */}
      {stats && stats.total > 0 && (
        <div className="rating-summary">
          <div className="rating-overview">
            <div className="rating-number">{stats.average}</div>
            <div className="rating-stars-large">
              {renderStars(Math.round(stats.average), 20)}
            </div>
            <div className="rating-text">Based on {stats.total} reviews</div>
          </div>
          
          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.distribution[rating] || 0;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={rating} className="rating-bar-row">
                  <span className="rating-label">{rating} star</span>
                  <div className="rating-bar">
                    <div
                      className="rating-bar-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="rating-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review Form */}
      {showForm && !hasReviewed && currentUser && (
        <form className="review-form" onSubmit={handleSubmitReview}>
          <h3>Write Your Review</h3>
          
          <div className="form-group">
            <label>Your Rating</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  className="rating-star-input"
                  fill={star <= formData.rating ? 'var(--gold)' : 'none'}
                  stroke="var(--gold)"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label>Your Review</label>
            <textarea
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              placeholder={`Share your experience with ${itemName}...`}
              rows={5}
              required
            />
          </div>
          
          {error && (
            <div className="review-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setShowForm(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}

      {hasReviewed && currentUser && (
        <div className="review-notice">
          <ShieldCheck size={20} />
          <span>Thank you for your review!</span>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review {itemName}!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div>
                  <div className="review-author">
                    {review.userName}
                    {review.verified && (
                      <span className="verified-badge">
                        <ShieldCheck size={14} />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="review-stars">{renderStars(review.rating)}</div>
                </div>
                <div className="review-date">{formatDate(review.createdAt)}</div>
              </div>
              
              <p className="review-text">{review.review}</p>
              
              <div className="review-footer">
                <button
                  className="review-helpful-btn"
                  onClick={() => handleMarkHelpful(review.id)}
                >
                  <ThumbsUp size={14} />
                  Helpful ({review.helpful || 0})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewSection;
