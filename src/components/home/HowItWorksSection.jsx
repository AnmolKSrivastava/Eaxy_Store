import { howItWorks } from '../../data';
import { iconMap } from './iconMap';

function HowItWorksSection() {
  return (
    <section className="section">
      <div className="container">
        <header className="section-head reveal">
          <h2>How It Works</h2>
          <p>Simple process, instant results</p>
        </header>
        <div className="card-grid four">
          {howItWorks.map((item, idx) => {
            const Icon = iconMap[item.icon];
            return (
              <article key={item.title} className="glass-card reveal" style={{ animationDelay: `${idx * 0.08}s` }}>
                <span className="step-watermark">{item.step}</span>
                <span className="icon-box">
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

export default HowItWorksSection;
