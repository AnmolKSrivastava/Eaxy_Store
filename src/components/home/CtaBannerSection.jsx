import { Phone, Zap } from 'lucide-react';

function CtaBannerSection() {
  return (
    <section className="section">
      <div className="container">
        <article className="cta-banner reveal">
          <p className="pill light">
            <Zap size={14} />
            <span>Urgent Service Available</span>
          </p>
          <h2>Need Urgent Repair or Delivery?</h2>
          <p>
            Our expert technicians are ready to help. Get your device repaired or delivered within 4 hours, anywhere
            in Pune.
          </p>
          <div className="cta-row">
            <a href="tel:+919609955655" className="btn btn-light btn-lg">
              <Phone size={18} />
              Call Now: +91 96099 55655
            </a>
            <button className="btn btn-soft btn-lg">Schedule Pickup</button>
          </div>
        </article>
      </div>
    </section>
  );
}

export default CtaBannerSection;
