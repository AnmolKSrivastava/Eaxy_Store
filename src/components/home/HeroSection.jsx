import { ChevronRight, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { imageUrls } from '../../assets/images';

function HeroSection() {
  const navigate = useNavigate();

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
          <img src={imageUrls.hero} alt="Premium laptop" />
          <aside className="hero-chip">
            <Clock size={20} />
            <div>
              <span>Next delivery in</span>
              <strong>3h 42min</strong>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
