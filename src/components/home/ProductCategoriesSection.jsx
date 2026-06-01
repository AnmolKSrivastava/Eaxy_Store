import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllCategories, fetchAllProducts } from '../../firebase/productsService';
import { iconMap } from './iconMap';

// Smart icon mapping based on category name
const getIconForCategory = (categoryTitle, categoryIcon) => {
  // If a specific icon is set in Firebase, use it
  if (categoryIcon && iconMap[categoryIcon.toLowerCase()]) {
    return iconMap[categoryIcon.toLowerCase()];
  }

  // Otherwise, intelligently map based on category name
  const title = categoryTitle.toLowerCase();
  
  if (title.includes('phone') || title.includes('mobile') || title.includes('smartphone')) {
    return iconMap['smartphone'];
  }
  if (title.includes('laptop') || title.includes('notebook')) {
    return iconMap['laptop'];
  }
  if (title.includes('monitor') || title.includes('display') || title.includes('screen')) {
    return iconMap['monitor'];
  }
  if (title.includes('headphone') || title.includes('earphone') || title.includes('audio') || title.includes('speaker')) {
    return iconMap['headphones'];
  }
  if (title.includes('gaming') || title.includes('game')) {
    return iconMap['zap'];
  }
  if (title.includes('repair') || title.includes('service') || title.includes('fix')) {
    return iconMap['wrench'];
  }
  if (title.includes('warranty') || title.includes('protection') || title.includes('insurance')) {
    return iconMap['shield'];
  }
  if (title.includes('premium') || title.includes('featured') || title.includes('best')) {
    return iconMap['star'];
  }
  if (title.includes('new') || title.includes('arrival') || title.includes('latest')) {
    return iconMap['clock'];
  }
  if (title.includes('refurbish')) {
    return iconMap['check'];
  }
  
  // Default fallback
  return iconMap['package'];
};

function ProductCategoriesSection() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const [categoriesData, productsData] = await Promise.all([
          fetchAllCategories(),
          fetchAllProducts()
        ]);

        // Map Firebase categories with product counts
        const categoriesWithCounts = categoriesData.map(cat => ({
          ...cat,
          count: productsData.filter(p => p.category === cat.slug).length
        }));

        setCategories(categoriesWithCounts);
      } catch (err) {
        console.error('Error loading categories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <section id="products" className="section">
        <div className="container">
          <header className="section-head reveal">
            <h2>Product Categories</h2>
            <p>Premium tech for every need</p>
          </header>
          <div className="card-grid four">
            <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>
              Loading categories...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section id="products" className="section">
        <div className="container">
          <header className="section-head reveal">
            <h2>Product Categories</h2>
            <p>Premium tech for every need</p>
          </header>
          <div className="card-grid four">
            <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>
              No categories available yet.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="section">
      <div className="container">
        <header className="section-head reveal">
          <h2>Product Categories</h2>
          <p>Premium tech for every need</p>
        </header>
        <div className="card-grid four media-grid">
          {categories.map((category, idx) => {
            const Icon = getIconForCategory(category.title, category.icon);
            return (
              <article key={category.id} className="media-card reveal" style={{ animationDelay: `${idx * 0.08}s`, cursor: 'pointer' }} onClick={() => navigate(`/products?category=${category.slug}`)}>
                {category.image && <img src={category.image} alt={category.title} />}
                <div className="media-overlay" />
                <div className="media-content">
                  <span className="icon-box small">
                    <Icon size={18} />
                  </span>
                  <span className="count-tag">{category.count || 0} items</span>
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
