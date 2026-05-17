import { ChevronRight } from 'lucide-react';
import { deals } from '../../data';

function HotDealsSection() {
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
            <article key={deal.name} className="media-card product reveal" style={{ animationDelay: `${idx * 0.08}s` }}>
              <img src={deal.image} alt={deal.name} />
              <div className="media-overlay" />
              <span className="deal-badge">{deal.badge}</span>
              <div className="product-content">
                <h3>{deal.name}</h3>
                <p className="price-row">
                  <strong>{deal.price}</strong>
                  <span>{deal.original}</span>
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
