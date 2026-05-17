import { whyChoose } from '../../data';
import { iconMap } from './iconMap';
import BrandName from '../shared/BrandName';

function WhyChooseSection() {
  return (
    <section className="section">
      <div className="container">
        <header className="section-head reveal">
          <h2>Why Choose <BrandName /></h2>
          <p>Trust built on speed and quality</p>
        </header>
        <div className="card-grid four">
          {whyChoose.map((item, idx) => {
            const Icon = iconMap[item.icon];
            return (
              <article key={item.title} className="glass-card center reveal" style={{ animationDelay: `${idx * 0.08}s` }}>
                <span className="icon-box gold">
                  <Icon size={24} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseSection;
