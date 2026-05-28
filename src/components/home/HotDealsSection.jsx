import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { fetchActiveDeals } from '../../firebase/productsService';

function HotDealsSection() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeals = async () => {
      try {
        setLoading(true);
        const dealsData = await fetchActiveDeals();
        // Limit to 3 deals for homepage
        setDeals(dealsData.slice(0, 3));
      } catch (err) {
        console.error('Error loading deals:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDeals();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <header className="section-head row reveal">
            <div>
              <h2>Hot Deals</h2>
              <p>Limited time offers on premium tech</p>
            </div>
          </header>
          <div className="card-grid three">
            <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>
              Loading deals...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (deals.length === 0) {
    return null; // Don't show section if no deals
  }

  return (
    <section className="section">
      <div className="container">
        <header className="section-head row reveal">
          <div>
            <h2>Hot Deals</h2>
            <p>Limited time offers on premium tech</p>
          </div>
          <button className="btn btn-link">
            View All <ChevronRight size={16} />
          </button>
        </header>
        <div className="card-grid three media-grid">
          {deals.map((deal, idx) => (
            <article key={deal.id} className="media-card product reveal" style={{ animationDelay: `${idx * 0.08}s` }}>
              {deal.image && <img src={deal.image} alt={deal.productName} />}
              <div className="media-overlay" />
              {deal.badge && <span className="deal-badge">{deal.badge}</span>}
              <div className="product-content">
                <h3>{deal.productName}</h3>
                <p className="price-row">
                  <strong>{formatPrice(deal.price)}</strong>
                  {deal.originalPrice && <span>{formatPrice(deal.originalPrice)}</span>}
                </p>
                <button className="btn btn-primary block">Add to Cart</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HotDealsSection;
