import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Star, ShoppingCart } from 'lucide-react';
import { Footer, Navbar } from '../components/layout';
import { allProducts, productCategories, sortOptions, priceRanges } from '../data/productsData';
import { iconMap } from '../components/home/iconMap';
import './ProductsPage.css';

function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = allProducts;

    // Filter by category
    if (selectedCategory !== 'all') {
      products = products.filter(p => p.category === selectedCategory);
    }

    // Filter by price range
    const priceRange = priceRanges.find(r => r.id === selectedPriceRange);
    if (priceRange) {
      products = products.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    }

    // Filter by search query
    if (searchQuery) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.specs.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        products.sort((a, b) => b.id - a.id);
        break;
      default:
        // Keep original order for featured
        break;
    }

    return products;
  }, [selectedCategory, selectedPriceRange, sortBy, searchQuery]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="page">
      <Navbar />
      
      {/* Hero Header */}
      <section className="products-hero">
        <div className="container">
          <div className="products-hero-content reveal">
            <h1>Premium Tech Products</h1>
            <p>Discover our curated collection of laptops, smartphones, accessories, and refurbished devices</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section products-section">
        <div className="container">
          {/* Search and Filters Bar */}
          <div className="products-toolbar reveal">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="toolbar-actions">
              <button 
                className="btn btn-ghost filters-toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="products-layout">
            {/* Sidebar Filters */}
            <aside className={`products-sidebar ${showFilters ? 'show' : ''}`}>
              {/* Categories */}
              <div className="filter-group reveal">
                <h3>Categories</h3>
                <div className="category-filters">
                  {productCategories.map((category) => {
                    const Icon = iconMap[category.icon];
                    return (
                      <button
                        key={category.id}
                        className={`category-filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <Icon size={18} />
                        <span>{category.name}</span>
                        <span className="count">{category.count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="filter-group reveal">
                <h3>Price Range</h3>
                <div className="price-filters">
                  {priceRanges.map((range) => (
                    <label key={range.id} className="price-filter-label">
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.id}
                        checked={selectedPriceRange === range.id}
                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory !== 'all' || selectedPriceRange !== 'all' || searchQuery) && (
                <button
                  className="btn btn-ghost block"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedPriceRange('all');
                    setSearchQuery('');
                  }}
                >
                  Clear All Filters
                </button>
              )}
            </aside>

            {/* Products Grid */}
            <main className="products-main">
              <div className="products-results-info reveal">
                <p>
                  Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="products-grid">
                  {filteredProducts.map((product, idx) => (
                    <article 
                      key={product.id} 
                      className="product-card reveal"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      {product.badge && (
                        <span className="product-badge">{product.badge}</span>
                      )}
                      {!product.inStock && (
                        <span className="out-of-stock-badge">Out of Stock</span>
                      )}
                      <div className="product-image">
                        <img src={product.image} alt={product.name} />
                      </div>
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <div className="product-rating">
                          <Star size={14} fill="var(--gold)" stroke="var(--gold)" />
                          <span>{product.rating}</span>
                        </div>
                        <ul className="product-specs">
                          {product.specs.slice(0, 3).map((spec, i) => (
                            <li key={i}>{spec}</li>
                          ))}
                        </ul>
                        <div className="product-footer">
                          <div className="product-pricing">
                            <strong className="price">{formatPrice(product.price)}</strong>
                            {product.originalPrice && (
                              <span className="original-price">{formatPrice(product.originalPrice)}</span>
                            )}
                          </div>
                          <button 
                            className="btn btn-primary"
                            disabled={!product.inStock}
                          >
                            <ShoppingCart size={16} />
                            {product.inStock ? 'Add to Cart' : 'Unavailable'}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="no-results reveal">
                  <p>No products found matching your criteria.</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedPriceRange('all');
                      setSearchQuery('');
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ProductsPage;
