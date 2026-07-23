import { useEffect, useState } from 'react';
import { ChevronRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchActiveDeals } from '../../firebase/productsService';

function HeroSection() {
  const navigate = useNavigate();
  const [featuredDeal, setFeaturedDeal] = useState(null);

  useEffect(() => {
    const loadDealOfTheDay = async () => {
      try {
        const activeDeals = await fetchActiveDeals();
        setFeaturedDeal(activeDeals[0] || null);
      } catch (error) {
        console.error('Failed to load deal of the day:', error);
      }
    };

    loadDealOfTheDay();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const mrp = featuredDeal?.originalPrice || featuredDeal?.price || 0;
  const dealPrice = featuredDeal?.price || 0;
  const dealDiscount = mrp > 0
    ? Math.max(0, Math.round(((mrp - dealPrice) / mrp) * 100))
    : 0;

  return (
    <section id="top" className="hero section">
      <div className="hero-ambient hero-ambient-a" />
      <div className="hero-ambient hero-ambient-b" />
      <div className="container hero-grid">
        <div className="reveal">
          <p className="pill">
            <Zap size={14} />
            <span>4-Hour Promise Across Pune</span>
          </p>
          <h1>
            Premium Tech.
            <br />
            <span className="gradient-text">Lightning Fast.</span>
          </h1>
          <p className="lede">
            New and refurbished electronics delivered or repaired within 4 hours across Pune district.
          </p>
          <div className="cta-row">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>
              Shop Products <ChevronRight size={18} />
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/repair-services')}>Book Repair</button>
          </div>
          <div className="metrics">
            <div>
              <strong>4hrs</strong>
              <span>Delivery Time</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Support</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Warranty</span>
            </div>
          </div>
        </div>
        <div className="hero-media reveal delay-1">
          <article
            className="hero-deal-card"
            onClick={() => featuredDeal?.productId && navigate(`/products/${featuredDeal.productId}`)}
            role={featuredDeal?.productId ? 'button' : undefined}
            tabIndex={featuredDeal?.productId ? 0 : -1}
            onKeyDown={(event) => {
              if (!featuredDeal?.productId) return;
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                navigate(`/products/${featuredDeal.productId}`);
              }
            }}
          >
            <span className="hero-deal-badge">Deal of the Day</span>

            {featuredDeal?.image ? (
              <img src={featuredDeal.image} alt={featuredDeal.productName || 'Deal of the day'} />
            ) : (
              <div className="hero-deal-placeholder">Add a deal from Admin Dashboard</div>
            )}

            <div className="hero-deal-badge-stack">
              <span className="hero-deal-info-badge hero-deal-name-badge">
                {featuredDeal?.productName || 'No active deal yet'}
              </span>
              <span className="hero-deal-info-badge hero-deal-price-badge">
                Discounted Price: {formatPrice(dealPrice)}
              </span>
              <span className="hero-deal-info-badge hero-deal-mrp-badge">
                M.R.P: <span>{formatPrice(mrp)}</span>
              </span>
              <span className="hero-deal-info-badge hero-deal-discount-badge">
                {dealDiscount}% Discount
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
