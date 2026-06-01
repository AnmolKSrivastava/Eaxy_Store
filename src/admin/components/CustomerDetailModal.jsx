import React, { useState, useEffect } from 'react';
import { Mail, Star, ShoppingBag, Heart, TrendingUp, MessageSquare, CheckCircle } from 'lucide-react';
import { getUserOrders } from '../../firebase/orderService';
import { getWishlist } from '../../firebase/wishlistService';
import { getUserReviews } from '../../firebase/reviewService';

function CustomerDetailModal({ customer, onClose }) {
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState({
    orders: [],
    wishlistItems: [],
    reviews: [],
    stats: {
      totalOrders: 0,
      totalSpent: 0,
      averageRating: 0,
      wishlistCount: 0,
      reviewCount: 0
    }
  });

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        
        console.log('Fetching data for customer:', customer.id);
        
        // Fetch all customer data in parallel
        const [orders, wishlistData, reviews] = await Promise.all([
          getUserOrders(customer.id).catch(err => {
            console.error('Error fetching orders:', err);
            return [];
          }),
          getWishlist(customer.id).catch(err => {
            console.error('Error fetching wishlist:', err);
            return { items: [] };
          }),
          getUserReviews(customer.id, 'all').catch(err => {
            console.error('Error fetching reviews:', err);
            return [];
          })
        ]);

        // Extract wishlist items array from wishlist object
        const wishlist = wishlistData?.items || [];

        console.log('Fetched orders:', orders.length);
        console.log('Fetched wishlist items:', wishlist.length);
        console.log('Fetched reviews:', reviews.length);

        // Calculate statistics
        const deliveredOrders = orders.filter(o => o.status === 'delivered');
        const totalOrders = orders.length; // Count all orders, not just delivered
        const totalSpent = deliveredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const wishlistCount = wishlist.length;
        const reviewCount = reviews.length;
        const averageRating = reviewCount > 0 
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount 
          : 0;

        console.log('Calculated stats:', { totalOrders, totalSpent, wishlistCount, reviewCount, averageRating });

        setCustomerData({
          orders,
          wishlistItems: wishlist,
          reviews,
          stats: {
            totalOrders,
            totalSpent,
            averageRating,
            wishlistCount,
            reviewCount
          }
        });
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [customer.id]);
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
          {loading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px',
              color: 'var(--muted)'
            }}>
              <p>Loading customer data...</p>
            </div>
          ) : (
            <>
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
                    <strong>{customerData.stats.totalOrders}</strong>
                    <span>Total Orders</span>
                  </div>
                </div>
                <div className="stat-box">
                  <TrendingUp size={20} />
                  <div>
                    <strong>{formatPrice(customerData.stats.totalSpent)}</strong>
                    <span>Total Spent</span>
                  </div>
                </div>
                <div className="stat-box">
                  <Star size={20} />
                  <div>
                    <strong>{customerData.stats.averageRating.toFixed(1)} ⭐</strong>
                    <span>Avg Rating</span>
                  </div>
                </div>
                <div className="stat-box">
                  <Heart size={20} />
                  <div>
                    <strong>{customerData.stats.wishlistCount}</strong>
                    <span>Wishlist Items</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4>🛍️ Purchase History</h4>
            <div className="purchase-history">
              {customerData.orders && customerData.orders.length > 0 ? (
                customerData.orders
                  .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
                  .slice(0, 10)
                  .map((order) => (
                    <div key={order.id} className="purchase-item">
                      <div className="purchase-date">
                        {order.createdAt 
                          ? formatDate(new Date(order.createdAt.seconds * 1000).toISOString().split('T')[0])
                          : 'N/A'}
                      </div>
                      <div className="purchase-product">
                        Order #{order.id.substring(0, 8)} 
                        {order.items && order.items.length > 0 && 
                          ` - ${order.items.length} item${order.items.length > 1 ? 's' : ''}`}
                      </div>
                      <div className="purchase-amount">{formatPrice(order.totalAmount || 0)}</div>
                      <span className={`purchase-status ${order.status}`}>
                        {order.status}
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
                <strong>{customerData.stats.reviewCount}</strong>
                <span>Reviews</span>
              </div>
              <div className="engagement-item">
                <CheckCircle size={20} />
                <strong>{customer.testimonials || 0}</strong>
                <span>Testimonials</span>
              </div>
              <div className="engagement-item">
                <Mail size={20} />
                <strong>{customer.contactSubmissions || 0}</strong>
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
              {customerData.orders.length > 0 && customerData.orders[0].createdAt && (
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <strong>Last Order</strong>
                    <span>
                      {formatDate(new Date(customerData.orders[0].createdAt.seconds * 1000).toISOString().split('T')[0])}
                    </span>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerDetailModal;
