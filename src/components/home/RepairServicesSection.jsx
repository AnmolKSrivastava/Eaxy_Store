import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { fetchAllServiceCategories } from '../../firebase/repairServicesService';
import { iconMap } from './iconMap';

function RepairServicesSection() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchAllServiceCategories();
        // Sort by order field and take top 4
        const topCategories = data
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .slice(0, 4);
        setCategories(topCategories);
      } catch (error) {
        console.error('Error loading service categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleBookNow = (categoryId) => {
    navigate(`/repair-services?category=${categoryId}`);
  };

  if (loading) {
    return (
      <section id="services" className="section section-tint">
        <div className="container">
          <header className="section-head reveal">
            <h2>Repair Services</h2>
            <p>Expert repairs within 4 hours</p>
          </header>
          <div className="loading-state" style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
            Loading services...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="section section-tint">
      <div className="container">
        <header className="section-head reveal">
          <h2>Repair Services</h2>
          <p>Expert repairs within 4 hours</p>
        </header>
        {categories.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
            <p>No service categories available yet.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Add categories via Admin Dashboard → Services → Service Categories</p>
          </div>
        ) : (
          <div className="card-grid four">
            {categories.map((category, idx) => {
              const Icon = iconMap[category.icon] || iconMap['wrench'];
              return (
                <article key={category.id} className="glass-card reveal" style={{ animationDelay: `${idx * 0.08}s` }}>
                  <span className="icon-box">
                    <Icon size={24} />
                  </span>
                  <h3>{category.name}</h3>
                  <ul>
                    {category.services && category.services.map((line) => (
                      <li key={line}>
                        <CheckCircle2 size={16} />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="price">{category.price}</p>
                  <button className="btn btn-primary block" onClick={() => handleBookNow(category.id)}>View Services</button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default RepairServicesSection;
