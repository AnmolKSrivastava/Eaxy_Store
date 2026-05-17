import { Star } from 'lucide-react';
import { testimonials } from '../../data';
import { parseBrandText } from '../../utils/parseBrandText';

function TestimonialsSection() {
  return (
    <section className="section section-tint">
      <div className="container">
        <header className="section-head reveal">
          <h2>Customer Stories</h2>
          <p>Trusted by 10,000+ customers across Pune</p>
        </header>
        <div className="card-grid three">
          {testimonials.map((testimonial, idx) => (
            <article key={testimonial.name} className="glass-card reveal" style={{ animationDelay: `${idx * 0.08}s` }}>
              <div className="stars">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} size={16} />
                ))}
              </div>
              <p className="quote">&quot;{parseBrandText(testimonial.review)}&quot;</p>
              <p className="author">{testimonial.name}</p>
              <p className="role">{testimonial.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
