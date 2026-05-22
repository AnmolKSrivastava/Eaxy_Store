import React, { useState } from 'react';
import { Wrench, Plus, Edit, Trash2, Clock, DollarSign, Package, Laptop, Smartphone, Monitor } from 'lucide-react';
import './RepairCatalog.css';

function RepairCatalog() {
  const [services] = useState([
    // Laptop Repairs
    {
      id: 'SRV-001',
      name: 'Laptop Screen Replacement',
      category: 'laptop',
      price: 4999,
      priceRange: '₹3,999 - ₹12,999',
      duration: '2-3 hours',
      warranty: '6 months',
      description: 'Professional screen replacement for all laptop brands',
      popularity: 'high',
      availability: 'in-stock',
      partsRequired: ['LCD Screen', 'Screen Bezel', 'Adhesive'],
      complexity: 'medium'
    },
    {
      id: 'SRV-002',
      name: 'Laptop Battery Replacement',
      category: 'laptop',
      price: 2999,
      priceRange: '₹2,499 - ₹8,999',
      duration: '1-2 hours',
      warranty: '1 year',
      description: 'Original and compatible battery replacement',
      popularity: 'high',
      availability: 'in-stock',
      partsRequired: ['Battery Pack', 'Thermal Paste'],
      complexity: 'easy'
    },
    {
      id: 'SRV-003',
      name: 'Keyboard Replacement',
      category: 'laptop',
      price: 1999,
      priceRange: '₹1,499 - ₹4,999',
      duration: '1-2 hours',
      warranty: '6 months',
      description: 'Replace faulty or damaged keyboard',
      popularity: 'medium',
      availability: 'in-stock',
      partsRequired: ['Keyboard Assembly'],
      complexity: 'easy'
    },
    {
      id: 'SRV-004',
      name: 'Performance Optimization',
      category: 'laptop',
      price: 999,
      priceRange: '₹999 - ₹2,499',
      duration: '2-4 hours',
      warranty: '3 months',
      description: 'Speed up slow laptops, remove bloatware',
      popularity: 'high',
      availability: 'available',
      partsRequired: [],
      complexity: 'easy'
    },
    {
      id: 'SRV-005',
      name: 'Data Recovery',
      category: 'laptop',
      price: 3499,
      priceRange: '₹2,999 - ₹9,999',
      duration: '4-24 hours',
      warranty: 'N/A',
      description: 'Recover lost data from damaged drives',
      popularity: 'medium',
      availability: 'available',
      partsRequired: [],
      complexity: 'hard'
    },
    // Mobile Repairs
    {
      id: 'SRV-006',
      name: 'Mobile Screen Replacement',
      category: 'mobile',
      price: 2499,
      priceRange: '₹1,999 - ₹14,999',
      duration: '30-60 mins',
      warranty: '6 months',
      description: 'Screen replacement for all mobile brands',
      popularity: 'high',
      availability: 'in-stock',
      partsRequired: ['Display Assembly', 'Adhesive'],
      complexity: 'medium'
    },
    {
      id: 'SRV-007',
      name: 'Mobile Battery Replacement',
      category: 'mobile',
      price: 1499,
      priceRange: '₹999 - ₹4,999',
      duration: '30-45 mins',
      warranty: '1 year',
      description: 'Original and compatible battery replacement',
      popularity: 'high',
      availability: 'in-stock',
      partsRequired: ['Battery', 'Adhesive'],
      complexity: 'easy'
    },
    {
      id: 'SRV-008',
      name: 'Water Damage Repair',
      category: 'mobile',
      price: 2999,
      priceRange: '₹1,999 - ₹8,999',
      duration: '2-4 hours',
      warranty: '3 months',
      description: 'Clean and repair water damaged phones',
      popularity: 'medium',
      availability: 'available',
      partsRequired: ['Cleaning Solution', 'Ultrasonic Cleaner'],
      complexity: 'hard'
    },
    {
      id: 'SRV-009',
      name: 'Software Issues',
      category: 'mobile',
      price: 799,
      priceRange: '₹499 - ₹1,999',
      duration: '30-60 mins',
      warranty: '1 month',
      description: 'OS update, app issues, performance fix',
      popularity: 'high',
      availability: 'available',
      partsRequired: [],
      complexity: 'easy'
    },
    // Computer Repairs
    {
      id: 'SRV-010',
      name: 'Hardware Upgrade',
      category: 'computer',
      price: 1999,
      priceRange: '₹999 - ₹19,999',
      duration: '1-2 hours',
      warranty: '1 year',
      description: 'RAM, SSD, GPU upgrades',
      popularity: 'high',
      availability: 'in-stock',
      partsRequired: ['Varies by upgrade'],
      complexity: 'medium'
    },
    {
      id: 'SRV-011',
      name: 'Virus Removal',
      category: 'computer',
      price: 999,
      priceRange: '₹799 - ₹1,999',
      duration: '2-3 hours',
      warranty: '1 month',
      description: 'Complete virus and malware removal',
      popularity: 'medium',
      availability: 'available',
      partsRequired: [],
      complexity: 'easy'
    },
    {
      id: 'SRV-012',
      name: 'OS Installation',
      category: 'computer',
      price: 1499,
      priceRange: '₹999 - ₹2,999',
      duration: '2-4 hours',
      warranty: '3 months',
      description: 'Fresh Windows/Mac/Linux installation',
      popularity: 'high',
      availability: 'available',
      partsRequired: [],
      complexity: 'easy'
    },
    {
      id: 'SRV-013',
      name: 'Network Setup',
      category: 'computer',
      price: 1999,
      priceRange: '₹1,499 - ₹4,999',
      duration: '1-3 hours',
      warranty: '6 months',
      description: 'Home/office network configuration',
      popularity: 'medium',
      availability: 'available',
      partsRequired: ['Network Cables', 'Tools'],
      complexity: 'medium'
    },
  ]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'laptop': return Laptop;
      case 'mobile': return Smartphone;
      case 'computer': return Monitor;
      default: return Wrench;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'laptop': return '#3b82f6';
      case 'mobile': return '#10b981';
      case 'computer': return '#8b5cf6';
      default: return 'var(--primary)';
    }
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return 'var(--muted)';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const laptopServices = services.filter(s => s.category === 'laptop');
  const mobileServices = services.filter(s => s.category === 'mobile');
  const computerServices = services.filter(s => s.category === 'computer');

  return (
    <div className="repair-catalog">
      <div className="repair-catalog-header">
        <div>
          <h1>🔧 Repair Service Catalog</h1>
          <p className="repair-catalog-subtitle">Manage repair services, pricing, and availability</p>
        </div>
        <button className="btn-add-service">
          <Plus size={20} />
          Add New Service
        </button>
      </div>

      <div className="catalog-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
            <Laptop size={24} />
          </div>
          <div className="stat-details">
            <h3>{laptopServices.length}</h3>
            <p>Laptop Services</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
            <Smartphone size={24} />
          </div>
          <div className="stat-details">
            <h3>{mobileServices.length}</h3>
            <p>Mobile Services</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6' }}>
            <Monitor size={24} />
          </div>
          <div className="stat-details">
            <h3>{computerServices.length}</h3>
            <p>Computer Services</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(var(--primary-rgb), 0.2)', color: 'var(--primary)' }}>
            <Wrench size={24} />
          </div>
          <div className="stat-details">
            <h3>{services.length}</h3>
            <p>Total Services</p>
          </div>
        </div>
      </div>

      {/* Laptop Services */}
      <div className="service-category-section">
        <div className="category-header">
          <Laptop size={28} style={{ color: '#3b82f6' }} />
          <h2>Laptop Repairs</h2>
          <span className="service-count">{laptopServices.length} services</span>
        </div>
        <div className="services-grid">
          {laptopServices.map((service) => {
            const Icon = getCategoryIcon(service.category);
            return (
              <div key={service.id} className="service-card">
                <div className="service-card-header">
                  <div className="service-icon" style={{ background: `${getCategoryColor(service.category)}20`, color: getCategoryColor(service.category) }}>
                    <Icon size={24} />
                  </div>
                  <div className="service-actions">
                    <button className="action-btn edit" title="Edit Service">
                      <Edit size={16} />
                    </button>
                    <button className="action-btn delete" title="Delete Service">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="service-card-body">
                  <h3>{service.name}</h3>
                  <p className="service-description">{service.description}</p>
                  
                  <div className="service-meta">
                    <div className="meta-item">
                      <DollarSign size={16} />
                      <div>
                        <span className="meta-label">Starting from</span>
                        <span className="meta-value">{formatPrice(service.price)}</span>
                      </div>
                    </div>
                    <div className="meta-item">
                      <Clock size={16} />
                      <div>
                        <span className="meta-label">Duration</span>
                        <span className="meta-value">{service.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="service-badges">
                    <span className={`badge popularity ${service.popularity}`}>
                      {service.popularity === 'high' ? '🔥 Popular' : '⭐ Available'}
                    </span>
                    <span className={`badge availability ${service.availability}`}>
                      {service.availability === 'in-stock' ? '✓ In Stock' : '○ On Demand'}
                    </span>
                    <span className="badge complexity" style={{ background: `${getComplexityColor(service.complexity)}20`, color: getComplexityColor(service.complexity) }}>
                      {service.complexity}
                    </span>
                  </div>

                  <div className="service-footer">
                    <span className="warranty">
                      <Package size={14} />
                      {service.warranty} warranty
                    </span>
                    <span className="price-range">{service.priceRange}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Services */}
      <div className="service-category-section">
        <div className="category-header">
          <Smartphone size={28} style={{ color: '#10b981' }} />
          <h2>Mobile Repairs</h2>
          <span className="service-count">{mobileServices.length} services</span>
        </div>
        <div className="services-grid">
          {mobileServices.map((service) => {
            const Icon = getCategoryIcon(service.category);
            return (
              <div key={service.id} className="service-card">
                <div className="service-card-header">
                  <div className="service-icon" style={{ background: `${getCategoryColor(service.category)}20`, color: getCategoryColor(service.category) }}>
                    <Icon size={24} />
                  </div>
                  <div className="service-actions">
                    <button className="action-btn edit" title="Edit Service">
                      <Edit size={16} />
                    </button>
                    <button className="action-btn delete" title="Delete Service">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="service-card-body">
                  <h3>{service.name}</h3>
                  <p className="service-description">{service.description}</p>
                  
                  <div className="service-meta">
                    <div className="meta-item">
                      <DollarSign size={16} />
                      <div>
                        <span className="meta-label">Starting from</span>
                        <span className="meta-value">{formatPrice(service.price)}</span>
                      </div>
                    </div>
                    <div className="meta-item">
                      <Clock size={16} />
                      <div>
                        <span className="meta-label">Duration</span>
                        <span className="meta-value">{service.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="service-badges">
                    <span className={`badge popularity ${service.popularity}`}>
                      {service.popularity === 'high' ? '🔥 Popular' : '⭐ Available'}
                    </span>
                    <span className={`badge availability ${service.availability}`}>
                      {service.availability === 'in-stock' ? '✓ In Stock' : '○ On Demand'}
                    </span>
                    <span className="badge complexity" style={{ background: `${getComplexityColor(service.complexity)}20`, color: getComplexityColor(service.complexity) }}>
                      {service.complexity}
                    </span>
                  </div>

                  <div className="service-footer">
                    <span className="warranty">
                      <Package size={14} />
                      {service.warranty} warranty
                    </span>
                    <span className="price-range">{service.priceRange}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Computer Services */}
      <div className="service-category-section">
        <div className="category-header">
          <Monitor size={28} style={{ color: '#8b5cf6' }} />
          <h2>Computer Repairs</h2>
          <span className="service-count">{computerServices.length} services</span>
        </div>
        <div className="services-grid">
          {computerServices.map((service) => {
            const Icon = getCategoryIcon(service.category);
            return (
              <div key={service.id} className="service-card">
                <div className="service-card-header">
                  <div className="service-icon" style={{ background: `${getCategoryColor(service.category)}20`, color: getCategoryColor(service.category) }}>
                    <Icon size={24} />
                  </div>
                  <div className="service-actions">
                    <button className="action-btn edit" title="Edit Service">
                      <Edit size={16} />
                    </button>
                    <button className="action-btn delete" title="Delete Service">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="service-card-body">
                  <h3>{service.name}</h3>
                  <p className="service-description">{service.description}</p>
                  
                  <div className="service-meta">
                    <div className="meta-item">
                      <DollarSign size={16} />
                      <div>
                        <span className="meta-label">Starting from</span>
                        <span className="meta-value">{formatPrice(service.price)}</span>
                      </div>
                    </div>
                    <div className="meta-item">
                      <Clock size={16} />
                      <div>
                        <span className="meta-label">Duration</span>
                        <span className="meta-value">{service.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="service-badges">
                    <span className={`badge popularity ${service.popularity}`}>
                      {service.popularity === 'high' ? '🔥 Popular' : '⭐ Available'}
                    </span>
                    <span className={`badge availability ${service.availability}`}>
                      {service.availability === 'in-stock' ? '✓ In Stock' : '○ On Demand'}
                    </span>
                    <span className="badge complexity" style={{ background: `${getComplexityColor(service.complexity)}20`, color: getComplexityColor(service.complexity) }}>
                      {service.complexity}
                    </span>
                  </div>

                  <div className="service-footer">
                    <span className="warranty">
                      <Package size={14} />
                      {service.warranty} warranty
                    </span>
                    <span className="price-range">{service.priceRange}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RepairCatalog;
