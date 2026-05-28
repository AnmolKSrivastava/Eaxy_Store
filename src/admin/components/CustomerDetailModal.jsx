import React from 'react';
import { Mail, Star, ShoppingBag, Heart, TrendingUp, MessageSquare, CheckCircle } from 'lucide-react';

function CustomerDetailModal({ customer, onClose }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#6b7280';
      case 'vip': return '#d4af37';
      default: return 'var(--muted)';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return '🟢 Active';
      case 'inactive': return '⚫ Inactive';
      case 'vip': return '⭐ VIP';
      default: return status;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content customer-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Customer Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="customer-detail-header">
            <div className="customer-avatar-large">
              {customer.photoURL ? (
                <img 
                  src={customer.photoURL} 
                  alt={customer.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
              ) : (
                customer.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="customer-detail-info">
              <h3>{customer.name}</h3>
              <p className="customer-detail-id">{customer.id}</p>
              <span className="status-badge" style={{ background: `${getStatusColor(customer.status)}20`, color: getStatusColor(customer.status) }}>
                {getStatusLabel(customer.status)}
              </span>
            </div>
          </div>

          <div className="detail-grid">
            <div className="detail-section">
              <h4>📧 Contact Information</h4>
              <div className="detail-item">
                <Mail size={16} />
                <span>{customer.email}</span>
              </div>
              <div className="detail-item">
                <span>📱</span>
                <span>{customer.phone}</span>
              </div>
              <div className="detail-item">
                <span>📍</span>
                <span>{customer.location}</span>
              </div>
              {customer.provider && (
                <div className="detail-item">
                  <span>🔐</span>
                  <span>Sign-in: {customer.provider === 'google.com' ? 'Google' : customer.provider}</span>
                </div>
              )}
            </div>

            <div className="detail-section">
              <h4>📊 Statistics</h4>
              <div className="stats-grid">
                <div className="stat-box">
                  <ShoppingBag size={20} />
                  <div>
                    <strong>{customer.totalOrders}</strong>
                    <span>Total Orders</span>
                  </div>
                </div>
                <div className="stat-box">
                  <TrendingUp size={20} />
                  <div>
                    <strong>{formatPrice(customer.totalSpent)}</strong>
                    <span>Total Spent</span>
                  </div>
                </div>
                <div className="stat-box">
                  <Star size={20} />
                  <div>
                    <strong>{customer.averageRating.toFixed(1)} ⭐</strong>
                    <span>Avg Rating</span>
                  </div>
                </div>
                <div className="stat-box">
                  <Heart size={20} />
                  <div>
                    <strong>{customer.wishlistItems}</strong>
                    <span>Wishlist Items</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4>🛍️ Purchase History</h4>
            <div className="purchase-history">
              {customer.purchaseHistory && customer.purchaseHistory.length > 0 ? (
                customer.purchaseHistory.map((purchase, idx) => (
                  <div key={idx} className="purchase-item">
                    <div className="purchase-date">{formatDate(purchase.date)}</div>
                    <div className="purchase-product">{purchase.product}</div>
                    <div className="purchase-amount">{formatPrice(purchase.amount)}</div>
                    <span className={`purchase-status ${purchase.status}`}>
                      {purchase.status}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '2rem', 
                  color: 'var(--muted)',
                  fontSize: '0.9rem'
                }}>
                  No purchase history available yet
                </div>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h4>💬 Engagement</h4>
            <div className="engagement-grid">
              <div className="engagement-item">
                <MessageSquare size={20} />
                <strong>{customer.reviews}</strong>
                <span>Reviews</span>
              </div>
              <div className="engagement-item">
                <CheckCircle size={20} />
                <strong>{customer.testimonials}</strong>
                <span>Testimonials</span>
              </div>
              <div className="engagement-item">
                <Mail size={20} />
                <strong>{customer.contactSubmissions}</strong>
                <span>Contact Forms</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4>📅 Activity Timeline</h4>
            <div className="timeline">
              {customer.lastLogin && customer.lastLogin !== 'N/A' && (
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <strong>Last Login</strong>
                    <span>{formatDate(customer.lastLogin)}</span>
                  </div>
                </div>
              )}
              {customer.lastOrder && customer.lastOrder !== 'N/A' && (
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <strong>Last Order</strong>
                    <span>{formatDate(customer.lastOrder)}</span>
                  </div>
                </div>
              )}
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <strong>Joined</strong>
                  <span>{customer.joinDate !== 'N/A' ? formatDate(customer.joinDate) : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetailModal;
