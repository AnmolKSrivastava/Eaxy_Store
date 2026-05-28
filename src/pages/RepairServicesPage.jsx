import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Star, Clock, Shield } from 'lucide-react';
import { Footer, Navbar } from '../components/layout';
import { fetchAllRepairServices, fetchAllServiceCategories } from '../firebase/repairServicesService';
import { iconMap } from '../components/home/iconMap';
import './RepairServicesPage.css';

// Static data for price ranges and sort options (moved outside component to prevent re-creation)
const servicePriceRanges = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under-1k', label: 'Under ₹1,000', min: 0, max: 1000 },
  { id: '1k-3k', label: '₹1,000 - ₹3,000', min: 1000, max: 3000 },
  { id: '3k-5k', label: '₹3,000 - ₹5,000', min: 3000, max: 5000 },
  { id: 'over-5k', label: 'Over ₹5,000', min: 5000, max: Infinity },
];

const serviceSortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'duration', label: 'Fastest First' },
];

function RepairServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Firebase data
  const [repairServices, setRepairServices] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load services and categories from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [servicesData, categoriesData] = await Promise.all([
          fetchAllRepairServices(),
          fetchAllServiceCategories()
        ]);

        setRepairServices(servicesData);

        // Build categories with counts
        const allCategory = {
          id: 'all',
          name: 'All Services',
          icon: 'wrench',
          count: servicesData.length
        };

        const categoriesWithCounts = categoriesData.map(cat => ({
          ...cat,
          count: servicesData.filter(s => s.category === cat.id).length
        }));

        setServiceCategories([allCategory, ...categoriesWithCounts]);
        setError('');
      } catch (err) {
        console.error('Error loading repair services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let services = repairServices;

    // Filter by category
    if (selectedCategory !== 'all') {
      services = services.filter(s => s.category === selectedCategory);
    }

    // Filter by price range
    const priceRange = servicePriceRanges.find(r => r.id === selectedPriceRange);
    if (priceRange) {
      services = services.filter(s => s.price >= priceRange.min && s.price <= priceRange.max);
    }

    // Filter by search query
    if (searchQuery) {
      services = services.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort services
    switch (sortBy) {
      case 'price-low':
        services = [...services].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        services = [...services].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        services = [...services].sort((a, b) => b.rating - a.rating);
        break;
      case 'duration':
        // Sort by duration (shortest first)
        services = [...services].sort((a, b) => {
          const getDurationMinutes = (duration) => {
            if (duration.includes('mins')) return parseInt(duration);
            if (duration.includes('hour')) return parseInt(duration) * 60;
            if (duration.includes('day')) return parseInt(duration) * 1440;
            return 0;
          };
          return getDurationMinutes(a.duration) - getDurationMinutes(b.duration);
        });
        break;
      default:
        // Keep original order for featured
        break;
    }

    return services;
  }, [selectedCategory, selectedPriceRange, sortBy, searchQuery, repairServices]);

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
      <section className="services-hero">
        <div className="container">
          <div className="services-hero-content reveal">
            <h1>Professional Repair Services</h1>
            <p>Fast, reliable repairs for laptops, mobiles, and computers with certified technicians and 100% warranty</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section services-section">
        <div className="container">
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
              {error}
            </div>
          )}

          {loading ? (
            <div className="loading-state" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--muted)' }}>
              <p>Loading repair services...</p>
            </div>
          ) : (
            <>
              {/* Search and Filters Bar */}
              <div className="services-toolbar reveal">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search repair services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="toolbar-actions">
              <button 
                className="btn btn-ghost filters-toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={18} />
                Filters
              </button>
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {serviceSortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Layout: Sidebar + Grid */}
          <div className="services-layout reveal">
            {/* Sidebar Filters */}
            <aside className={`services-filters ${showFilters ? 'show' : ''}`}>
              {/* Category Filters */}
              <div className="filter-group">
                <h3>Service Category</h3>
                <div className="filter-options">
                  {serviceCategories.map(cat => {
                    const Icon = iconMap[cat.icon];
                    return (
                      <button
                        key={cat.id}
                        className={`category-filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat.id)}
                      >
                        <Icon size={18} />
                        <span>{cat.name}</span>
                        <span className="count">({cat.count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Filters */}
              <div className="filter-group">
                <h3>Price Range</h3>
                <div className="filter-options">
                  {servicePriceRanges.map(range => (
                    <button
                      key={range.id}
                      className={`price-filter-btn ${selectedPriceRange === range.id ? 'active' : ''}`}
                      onClick={() => setSelectedPriceRange(range.id)}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Filters */}
              {(selectedCategory !== 'all' || selectedPriceRange !== 'all' || searchQuery) && (
                <button 
                  className="btn btn-ghost reset-btn"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedPriceRange('all');
                    setSearchQuery('');
                  }}
                >
                  Reset All Filters
                </button>
              )}
            </aside>

            {/* Services Grid */}
            <main className="services-main">
              <div className="services-count">
                <p>Showing {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'}</p>
              </div>

              {filteredServices.length > 0 ? (
                <div className="services-grid">
                  {filteredServices.map(service => (
                    <div key={service.id} className="service-card">
                      <div className="service-header">
                        <h3>{service.title}</h3>
                        <div className="service-rating">
                          <Star size={16} fill="var(--gold)" color="var(--gold)" />
                          <span>{service.rating}</span>
                        </div>
                      </div>
                      
                      <p className="service-description">{service.description}</p>
                      
                      <div className="service-features">
                        {service.features.map((feature, index) => (
                          <span key={index} className="feature-badge">
                            {feature}
                          </span>
                        ))}
                      </div>

                      <div className="service-meta">
                        <div className="meta-item">
                          <Clock size={16} />
                          <span>{service.duration}</span>
                        </div>
                        <div className="meta-item">
                          <Shield size={16} />
                          <span>{service.warranty}</span>
                        </div>
                      </div>

                      <div className="service-footer">
                        <div className="service-price">
                          <span className="price-label">Starting at</span>
                          <span className="price">{formatPrice(service.price)}</span>
                        </div>
                        <button className="btn btn-primary">
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Search size={48} />
                  <h3>No services found</h3>
                  <p>Try adjusting your filters or search query</p>
                </div>
              )}
            </main>
          </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box reveal">
            <h2>Need Help Choosing?</h2>
            <p>Talk to our experts and get personalized recommendations</p>
            <div className="cta-actions">
              <button className="btn btn-primary btn-lg">
                Call Us: 1800-123-4567
              </button>
              <button className="btn btn-secondary btn-lg">
                Chat with Expert
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default RepairServicesPage;
