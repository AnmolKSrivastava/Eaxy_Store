import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { getFeaturedReviews } from '../../firebase/reviewService';
import { parseBrandText } from '../../utils/parseBrandText';

function TestimonialsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const featuredReviews = await getFeaturedReviews(6);
        setReviews(featuredReviews);
      } catch (error) {
        console.error('Error loading featured reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  // Format date helper
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
  };

  return (
    <section className="section section-tint">
      <div className="container">
        <header className="section-head reveal">
          <h2>Customer Stories</h2>
          <p>Trusted by 10,000+ customers across Pune</p>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
            Loading testimonials...
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
            <p>No customer reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="card-grid three">
            {reviews.map((review, idx) => (
              <article key={review.id} className="glass-card reveal" style={{ animationDelay: `${idx * 0.08}s` }}>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={16} 
                      fill={star <= review.rating ? 'var(--gold)' : 'none'}
                      stroke="var(--gold)"
                    />
                  ))}
                </div>
                <p className="quote">&quot;{parseBrandText(review.review)}&quot;</p>
                <p className="author">{review.userName}</p>
                <p className="role">{formatDate(review.createdAt)}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default TestimonialsSection;
