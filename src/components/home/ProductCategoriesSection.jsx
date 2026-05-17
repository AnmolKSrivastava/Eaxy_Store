import { categories } from '../../data';
import { iconMap } from './iconMap';

function ProductCategoriesSection() {
  return (
    <section id="products" className="section">
      <div className="container">
        <header className="section-head reveal">
          <h2>Product Categories</h2>
          <p>Premium tech for every need</p>
        </header>
        <div className="card-grid four media-grid">
          {categories.map((category, idx) => {
            const Icon = iconMap[category.icon];
            return (
              <article key={category.title} className="media-card reveal" style={{ animationDelay: `${idx * 0.08}s` }}>
                <img src={category.image} alt={category.title} />
                <div className="media-overlay" />
                <div className="media-content">
                  <span className="icon-box small">
                    <Icon size={18} />
                  </span>
                  <span className="count-tag">{category.count} items</span>
                  <h3>{category.title}</h3>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ProductCategoriesSection;
