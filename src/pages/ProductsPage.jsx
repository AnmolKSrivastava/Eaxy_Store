import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, ShoppingCart, Heart } from 'lucide-react';
import { Footer, Navbar } from '../components/layout';
import { sortOptions, priceRanges } from '../data/productsData';
import { fetchAllProducts, fetchAllCategories } from '../firebase/productsService';
import { iconMap } from '../components/home/iconMap';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import './ProductsPage.css';

function ProductsPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [addingToCart, setAddingToCart] = useState(null);
  const [togglingWishlist, setTogglingWishlist] = useState(null);

  // Fetch products and categories from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        const [productsData, categoriesData] = await Promise.all([
          fetchAllProducts(),
          fetchAllCategories()
        ]);
        setProducts(productsData);
        
        // Transform categories to match UI format
        const transformedCategories = [
          { id: 'all', name: 'All Products', icon: 'package', count: productsData.length },
          ...categoriesData.map(cat => ({
            id: cat.slug,
            name: cat.title,
            icon: (cat.icon || 'package').toLowerCase(),
            count: productsData.filter(p => p.category === cat.slug).length
          }))
        ];
        setCategories(transformedCategories);
      } catch (err) {
        setError('Failed to load products: ' + err.message);
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filteredList = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filteredList = filteredList.filter(p => p.category === selectedCategory);
    }

    // Filter by price range
    const priceRange = priceRanges.find(r => r.id === selectedPriceRange);
    if (priceRange) {
      filteredList = filteredList.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    }

    // Filter by search query
    if (searchQuery) {
      filteredList = filteredList.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const specsMatch = Array.isArray(p.specs) && p.specs.some(spec => 
          spec.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return nameMatch || specsMatch;
      });
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filteredList.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredList.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredList.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filteredList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        // Keep original order for featured
        break;
    }

    return filteredList;
  }, [products, selectedCategory, selectedPriceRange, sortBy, searchQuery]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    if (!product.inStock) return;
    
    try {
      setAddingToCart(product.id);
      await addToCart(product, 1);
      // Could add a toast notification here
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(null);
    }
  };

  const handleToggleWishlist = async (e, productId) => {
    e.stopPropagation();
    
    try {
      setTogglingWishlist(productId);
      await toggleWishlist(productId);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    } finally {
      setTogglingWishlist(null);
    }
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

      {/* Loading State */}
      {loading && (
        <section className="section">
          <div className="container">
            <div className="products-loading reveal">
              <p>Loading products...</p>
            </div>
          </div>
        </section>
      )}

      {/* Error State */}
      {error && (
        <section className="section">
          <div className="container">
            <div className="products-error reveal">
              <p className="error-message">{error}</p>
              <button className="btn btn-primary" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      {!loading && !error && (
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
                  {categories.map((category) => {
                    const Icon = iconMap[category.icon] || iconMap['package'];
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
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      {product.badge && (
                        <span className="product-badge">{product.badge}</span>
                      )}
                      {!product.inStock && (
                        <span className="out-of-stock-badge">Out of Stock</span>
                      )}
                      <button
                        className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                        onClick={(e) => handleToggleWishlist(e, product.id)}
                        disabled={togglingWishlist === product.id}
                        aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <Heart 
                          size={20} 
                          fill={isInWishlist(product.id) ? 'var(--gold)' : 'none'}
                          stroke="var(--gold)"
                        />
                      </button>
                      <div className="product-image">
                        <img src={product.image} alt={product.name} />
                      </div>
                      <div className="product-info">
                        <div className="product-title-row">
                          <h3>{product.name}</h3>
                          {product.category && product.category.toLowerCase().includes('refurbish') && (
                            <span className="refurbished-badge">Refurbished</span>
                          )}
                        </div>
                        {product.rating && (
                          <div className="product-rating">
                            <Star size={14} fill="var(--gold)" stroke="var(--gold)" />
                            <span>{product.rating}</span>
                            {product.reviewCount && (
                              <span className="review-count">({product.reviewCount})</span>
                            )}
                          </div>
                        )}
                        <ul className="product-specs">
                          {Array.isArray(product.specs) && product.specs.slice(0, 3).map((spec, i) => (
                            <li key={i}>{spec}</li>
                          ))}
                        </ul>
                        <div className="product-pricing">
                          <strong className="price">{formatPrice(product.price)}</strong>
                          {product.originalPrice && (
                            <span className="original-price">{formatPrice(product.originalPrice)}</span>
                          )}
                        </div>
                        <button 
                          className="btn btn-primary"
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={!product.inStock || addingToCart === product.id}
                        >
                          <ShoppingCart size={16} />
                          {addingToCart === product.id 
                            ? 'Adding...' 
                            : product.inStock 
                              ? 'Add to Cart' 
                              : 'Unavailable'}
                        </button>
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
      )}

      <Footer />
    </div>
  );
}

export default ProductsPage;
