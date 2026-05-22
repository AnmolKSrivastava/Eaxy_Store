import React, { useState } from 'react';
import { Zap, Plus, Edit, Trash2, TrendingUp, Clock, Star, Package } from 'lucide-react';
import './DealsManagement.css';

function DealsManagement() {
  const [deals] = useState([
    {
      id: 1,
      productName: 'MacBook Air M2',
      originalPrice: 84999,
      discountPrice: 79999,
      discountPercent: 6,
      badge: 'Hot Deal',
      category: 'Laptops',
      startDate: '2026-05-15',
      endDate: '2026-05-31',
      status: 'active',
      clicks: 1284,
      conversions: 156,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'
    },
    {
      id: 2,
      productName: 'iPhone 15 Pro',
      originalPrice: 124999,
      discountPrice: 119999,
      discountPercent: 4,
      badge: 'Hot Deal',
      category: 'Smartphones',
      startDate: '2026-05-20',
      endDate: '2026-06-05',
      status: 'active',
      clicks: 2156,
      conversions: 298,
      image: 'https://images.unsplash.com/photo-1592286927505-c80e1edc15eb?w=400'
    },
    {
      id: 3,
      productName: 'Sony WH-1000XM5',
      originalPrice: 26999,
      discountPrice: 23999,
      discountPercent: 11,
      badge: 'Hot Deal',
      category: 'Accessories',
      startDate: '2026-05-18',
      endDate: '2026-05-28',
      status: 'active',
      clicks: 892,
      conversions: 167,
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400'
    },
    {
      id: 4,
      productName: 'Dell XPS 13 Refurbished',
      originalPrice: 79999,
      discountPrice: 64999,
      discountPercent: 19,
      badge: 'Best Value',
      category: 'Refurbished',
      startDate: '2026-05-10',
      endDate: '2026-05-25',
      status: 'ending-soon',
      clicks: 645,
      conversions: 89,
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400'
    },
  ]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getTotalRevenue = () => {
    return deals.reduce((sum, deal) => sum + (deal.discountPrice * deal.conversions), 0);
  };

  const getTotalConversions = () => {
    return deals.reduce((sum, deal) => sum + deal.conversions, 0);
  };

  const getConversionRate = () => {
    const totalClicks = deals.reduce((sum, deal) => sum + deal.clicks, 0);
    const totalConversions = getTotalConversions();
    return totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : 0;
  };

  return (
    <div className="deals-management">
      <div className="deals-header">
        <div>
          <h1>🔥 Hot Deals Management</h1>
          <p className="deals-subtitle">Manage promotional deals and special offers</p>
        </div>
        <button className="btn-add-deal">
          <Plus size={20} />
          Create New Deal
        </button>
      </div>

      <div className="deals-stats">
        <div className="stat-card">
          <div className="stat-icon active">
            <Zap size={24} />
          </div>
          <div className="stat-details">
            <h3>{deals.filter(d => d.status === 'active').length}</h3>
            <p>Active Deals</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon revenue">
            <TrendingUp size={24} />
          </div>
          <div className="stat-details">
            <h3>{formatPrice(getTotalRevenue())}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon conversions">
            <Star size={24} />
          </div>
          <div className="stat-details">
            <h3>{getTotalConversions()}</h3>
            <p>Total Sales</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon rate">
            <Package size={24} />
          </div>
          <div className="stat-details">
            <h3>{getConversionRate()}%</h3>
            <p>Conversion Rate</p>
          </div>
        </div>
      </div>

      <div className="deals-grid">
        {deals.map((deal) => {
          const daysLeft = getDaysRemaining(deal.endDate);
          const conversionRate = ((deal.conversions / deal.clicks) * 100).toFixed(1);
          
          return (
            <div key={deal.id} className={`deal-card ${deal.status}`}>
              <div className="deal-card-image">
                <img src={deal.image} alt={deal.productName} />
                <div className="deal-badge">{deal.badge}</div>
                <div className={`deal-status-badge ${deal.status}`}>
                  {deal.status === 'active' ? '🟢 Active' : '⏰ Ending Soon'}
                </div>
              </div>
              
              <div className="deal-card-content">
                <div className="deal-card-header">
                  <h3>{deal.productName}</h3>
                  <div className="deal-actions">
                    <button className="action-btn edit" title="Edit Deal">
                      <Edit size={16} />
                    </button>
                    <button className="action-btn delete" title="Delete Deal">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="deal-category">{deal.category}</div>

                <div className="deal-pricing">
                  <div className="current-price">{formatPrice(deal.discountPrice)}</div>
                  <div className="original-price">{formatPrice(deal.originalPrice)}</div>
                  <div className="discount-badge">-{deal.discountPercent}%</div>
                </div>

                <div className="deal-savings">
                  You save: {formatPrice(deal.originalPrice - deal.discountPrice)}
                </div>

                <div className="deal-timeline">
                  <Clock size={16} />
                  <span className={daysLeft <= 3 ? 'urgent' : ''}>
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                  </span>
                </div>

                <div className="deal-performance">
                  <div className="performance-item">
                    <span className="label">Clicks</span>
                    <span className="value">{deal.clicks}</span>
                  </div>
                  <div className="performance-item">
                    <span className="label">Sales</span>
                    <span className="value">{deal.conversions}</span>
                  </div>
                  <div className="performance-item">
                    <span className="label">CVR</span>
                    <span className="value">{conversionRate}%</span>
                  </div>
                </div>

                <div className="deal-revenue">
                  Revenue: {formatPrice(deal.discountPrice * deal.conversions)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="deals-actions-panel">
        <h3>Deal Management Actions</h3>
        <div className="action-buttons">
          <button className="action-panel-btn">
            <Zap size={18} />
            Create Flash Sale
          </button>
          <button className="action-panel-btn">
            <TrendingUp size={18} />
            View Analytics
          </button>
          <button className="action-panel-btn">
            <Clock size={18} />
            Schedule Deals
          </button>
          <button className="action-panel-btn">
            <Star size={18} />
            Export Performance
          </button>
        </div>
      </div>
    </div>
  );
}

export default DealsManagement;
