import { CheckCircle2 } from 'lucide-react';
import { services } from '../../data';
import { iconMap } from './iconMap';

function RepairServicesSection() {
  return (
    <section id="services" className="section section-tint">
      <div className="container">
        <header className="section-head reveal">
          <h2>Repair Services</h2>
          <p>Expert repairs within 4 hours</p>
        </header>
        <div className="card-grid three">
          {services.map((service, idx) => {
            const Icon = iconMap[service.icon];
            return (
              <article key={service.title} className="glass-card reveal" style={{ animationDelay: `${idx * 0.08}s` }}>
                <span className="icon-box">
                  <Icon size={24} />
                </span>
                <h3>{service.title}</h3>
                <ul>
                  {service.services.map((line) => (
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
      </div>
    </section>
  );
}

export default RepairServicesSection;
