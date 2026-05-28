import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { fetchAllServiceCategories } from '../../firebase/repairServicesService';
import { iconMap } from './iconMap';

function RepairServicesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchAllServiceCategories();
        // Sort by order field
        const sortedData = data.sort((a, b) => (a.order || 0) - (b.order || 0));
        setCategories(sortedData);
      } catch (error) {
        console.error('Error loading service categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

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
          <div className="card-grid three">
            {categories.map((service, idx) => {
              const Icon = iconMap[service.icon] || iconMap['wrench'];
              return (
                <article key={service.id} className="glass-card reveal" style={{ animationDelay: `${idx * 0.08}s` }}>
                  <span className="icon-box">
                    <Icon size={24} />
                  </span>
                  <h3>{service.name}</h3>
                  <ul>
                    {service.services && service.services.map((line) => (
                      <li key={line}>
                        <CheckCircle2 size={16} />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="price">{service.price}</p>
                  <button className="btn btn-ghost block">Book Now</button>
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
