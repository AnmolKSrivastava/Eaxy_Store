import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck,
  MapPin,
  Calendar,
  IndianRupee,
  Wrench
} from 'lucide-react';
import { Footer, Navbar } from '../components/layout';
import { useAuth } from '../contexts/AuthContext';
import { getUserOrders, cancelOrder } from '../firebase/orderService';
import { getUserRepairBookings, cancelRepairBooking } from '../firebase/repairBookingService';
import './OrdersPage.css';

function OrdersPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [pageTab, setPageTab] = useState('orders'); // 'orders' | 'repairs'
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancellingBooking, setCancellingBooking] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    loadOrders();
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      console.log('📦 OrdersPage: Loading orders for user:', currentUser.uid);
      const userOrders = await getUserOrders(currentUser.uid);
      console.log('📦 OrdersPage: Received orders:', userOrders.length);
      console.log('📦 OrdersPage: Order IDs:', userOrders.map(o => o.orderId || o.id));
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const userBookings = await getUserRepairBookings(currentUser.uid);
      setBookings(userBookings);
    } catch (error) {
      console.error('Error loading repair bookings:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancellingOrder(orderId);
      await cancelOrder(orderId, 'Cancelled by customer', 'customer');
      await loadOrders();
      if (selectedOrder?.orderId === orderId) {
        setShowModal(false);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setCancellingOrder(null);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this repair request?')) return;
    try {
      setCancellingBooking(bookingId);
      await cancelRepairBooking(bookingId, 'Cancelled by customer');
      await loadBookings();
      if (selectedBooking?.bookingId === bookingId) setShowBookingModal(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setCancellingBooking(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    let date;
    if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { icon: Clock, color: '#ffc107', label: 'Pending' },
      processing: { icon: Package, color: '#3b82f6', label: 'Processing' },
      'out-for-delivery': { icon: Truck, color: '#8b5cf6', label: 'Out for Delivery' },
      delivered: { icon: CheckCircle2, color: '#10b981', label: 'Delivered' },
      cancelled: { icon: XCircle, color: '#ef4444', label: 'Cancelled' }
    };
    return statusMap[status] || statusMap.pending;
  };

  const getBookingStatusInfo = (status) => {
    const statusMap = {
      pending: { icon: Clock, color: '#ffc107', label: 'Pending' },
      confirmed: { icon: CheckCircle2, color: '#3b82f6', label: 'Confirmed' },
      'in-progress': { icon: Wrench, color: '#8b5cf6', label: 'In Progress' },
      completed: { icon: CheckCircle2, color: '#10b981', label: 'Completed' },
      cancelled: { icon: XCircle, color: '#ef4444', label: 'Cancelled' }
    };
    return statusMap[status] || statusMap.pending;
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'active') {
      return ['pending', 'processing', 'out-for-delivery'].includes(order.status);
    }
    if (filter === 'completed') return order.status === 'delivered';
    if (filter === 'cancelled') return order.status === 'cancelled';
    return true;
  });

  const filterOptions = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'active', label: 'Active', count: orders.filter(o => ['pending', 'processing', 'out-for-delivery'].includes(o.status)).length },
    { id: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'delivered').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  return (
    <div className="page">
      <Navbar />

      <section className="orders-page">
        <div className="container">
          <div className="page-header reveal">
            <h1>My Activity</h1>
            <p>{orders.length} {orders.length === 1 ? 'order' : 'orders'} · {bookings.length} repair {bookings.length === 1 ? 'request' : 'requests'}</p>
          </div>

          {/* Page Tab */}
          <div className="page-tab-switcher reveal">
            <button
              className={`page-tab-btn ${pageTab === 'orders' ? 'active' : ''}`}
              onClick={() => { setPageTab('orders'); setFilter('all'); }}
            >
              <Package size={16} />
              Product Orders
              {orders.length > 0 && <span className="count">{orders.length}</span>}
            </button>
            <button
              className={`page-tab-btn ${pageTab === 'repairs' ? 'active' : ''}`}
              onClick={() => { setPageTab('repairs'); setFilter('all'); }}
            >
              <Wrench size={16} />
              Repair Requests
              {bookings.length > 0 && <span className="count">{bookings.length}</span>}
            </button>
          </div>

          {/* Filter Tabs - Orders */}
          {pageTab === 'orders' && (
          <div className="order-filters reveal">
            {filterOptions.map(option => (
              <button
                key={option.id}
                className={`filter-btn ${filter === option.id ? 'active' : ''}`}
                onClick={() => setFilter(option.id)}
              >
                {option.label}
                <span className="count">{option.count}</span>
              </button>
            ))}
          </div>
          )}

          {/* Filter Tabs - Repairs */}
          {pageTab === 'repairs' && (
          <div className="order-filters reveal">
            {[
              { id: 'all', label: 'All', count: bookings.length },
              { id: 'active', label: 'Active', count: bookings.filter(b => ['pending','confirmed','in-progress'].includes(b.status)).length },
              { id: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
              { id: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
            ].map(option => (
              <button
                key={option.id}
                className={`filter-btn ${filter === option.id ? 'active' : ''}`}
                onClick={() => setFilter(option.id)}
              >
                {option.label}
                <span className="count">{option.count}</span>
              </button>
            ))}
          </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="orders-loading reveal">
              <p>Loading...</p>
            </div>
          )}

          {/* Orders List */}
          {!loading && pageTab === 'orders' && (filteredOrders.length > 0 ? (
            <div className="orders-list">
              {filteredOrders.map((order, idx) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <article 
                    key={order.orderId} 
                    className="order-card reveal"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="order-header">
                      <div className="order-id-section">
                        <h3>Order #{order.orderId}</h3>
                        <span className="order-date">
                          <Calendar size={14} />
                          {formatDate(order.orderDate)}
                        </span>
                      </div>
                      <span 
                        className="order-status"
                        style={{ 
                          background: `${statusInfo.color}20`,
                          color: statusInfo.color,
                          border: `1px solid ${statusInfo.color}40`
                        }}
                      >
                        <StatusIcon size={16} />
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="order-items-preview">
                      {order.items.slice(0, 3).map(item => (
                        <div key={item.productId} className="item-preview">
                          <img src={item.image} alt={item.name} />
                          <div className="item-info">
                            <p className="item-name">{item.name}</p>
                            <p className="item-qty">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="more-items">+{order.items.length - 3} more</p>
                      )}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">
                        <IndianRupee size={16} />
                        <strong>{formatPrice(order.totalAmount)}</strong>
                      </div>
                      <div className="order-actions">
                        <button
                          className="btn btn-ghost"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowModal(true);
                          }}
                        >
                          View Details
                        </button>
                        {order.status === 'pending' && (
                          <button
                            className="btn btn-ghost danger"
                            onClick={() => handleCancelOrder(order.orderId)}
                            disabled={cancellingOrder === order.orderId}
                          >
                            {cancellingOrder === order.orderId ? 'Cancelling...' : 'Cancel Order'}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : !loading && (
            <div className="no-orders reveal">
              <Package size={64} style={{ color: 'var(--muted)', opacity: 0.5 }} />
              <h2>No {filter !== 'all' ? filter : ''} orders found</h2>
              <p>Start shopping to see your orders here</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/products')}
              >
                Browse Products
              </button>
            </div>
          ))}

          {/* Repair Bookings List */}
          {!loading && pageTab === 'repairs' && (() => {
            const filteredBookings = bookings.filter(b => {
              if (filter === 'all') return true;
              if (filter === 'active') return ['pending', 'confirmed', 'in-progress'].includes(b.status);
              if (filter === 'completed') return b.status === 'completed';
              if (filter === 'cancelled') return b.status === 'cancelled';
              return true;
            });
            return filteredBookings.length > 0 ? (
              <div className="orders-list">
                {filteredBookings.map((booking, idx) => {
                  const statusInfo = getBookingStatusInfo(booking.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <article
                      key={booking.bookingId || booking.id}
                      className="order-card reveal"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div className="order-header">
                        <div className="order-id-section">
                          <h3>Booking #{booking.bookingId || booking.id}</h3>
                          <span className="order-date">
                            <Calendar size={14} />
                            {formatDate(booking.createdAt)}
                          </span>
                        </div>
                        <span
                          className="order-status"
                          style={{
                            background: `${statusInfo.color}20`,
                            color: statusInfo.color,
                            border: `1px solid ${statusInfo.color}40`
                          }}
                        >
                          <StatusIcon size={16} />
                          {statusInfo.label}
                        </span>
                      </div>

                      <div className="order-items-preview">
                        <div className="item-preview">
                          <div className="repair-icon-placeholder">
                            <Wrench size={24} style={{ color: 'var(--primary)' }} />
                          </div>
                          <div className="item-info">
                            <p className="item-name">{booking.serviceName}</p>
                            <p className="item-qty">{booking.deviceDetails || 'Device not specified'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="order-footer">
                        <div className="order-total">
                          <IndianRupee size={16} />
                          <strong>{formatPrice(booking.servicePrice || 0)}</strong>
                        </div>
                        <div className="order-actions">
                          <button
                            className="btn btn-ghost"
                            onClick={() => { setSelectedBooking(booking); setShowBookingModal(true); }}
                          >
                            View Details
                          </button>
                          {booking.status === 'pending' && (
                            <button
                              className="btn btn-ghost danger"
                              onClick={() => handleCancelBooking(booking.bookingId || booking.id)}
                              disabled={cancellingBooking === (booking.bookingId || booking.id)}
                            >
                              {cancellingBooking === (booking.bookingId || booking.id) ? 'Cancelling...' : 'Cancel'}
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="no-orders reveal">
                <Wrench size={64} style={{ color: 'var(--muted)', opacity: 0.5 }} />
                <h2>No repair requests found</h2>
                <p>Book a repair service to see it here</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/repair-services')}
                >
                  Book a Repair
                </button>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              {/* Order Info */}
              <div className="detail-section">
                <h3>Order Information</h3>
                <div className="detail-row">
                  <span>Order ID:</span>
                  <strong>{selectedOrder.orderId}</strong>
                </div>
                <div className="detail-row">
                  <span>Order Date:</span>
                  <strong>{formatDate(selectedOrder.orderDate)}</strong>
                </div>
                <div className="detail-row">
                  <span>Status:</span>
                  <span 
                    className="order-status"
                    style={{ 
                      background: `${getStatusInfo(selectedOrder.status).color}20`,
                      color: getStatusInfo(selectedOrder.status).color,
                      border: `1px solid ${getStatusInfo(selectedOrder.status).color}40`
                    }}
                  >
                    {getStatusInfo(selectedOrder.status).label}
                  </span>
                </div>
                <div className="detail-row">
                  <span>Expected Delivery:</span>
                  <strong>{formatDate(selectedOrder.orderDeadline)}</strong>
                </div>
              </div>

              {/* Items */}
              <div className="detail-section">
                <h3>Items Ordered</h3>
                {selectedOrder.items.map(item => (
                  <div key={item.productId} className="modal-item">
                    <img src={item.image} alt={item.name} />
                    <div className="modal-item-info">
                      <p className="item-name">{item.name}</p>
                      <p className="item-price">{formatPrice(item.price)} × {item.quantity}</p>
                    </div>
                    <strong className="item-subtotal">{formatPrice(item.subtotal)}</strong>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              <div className="detail-section">
                <h3>Delivery Address</h3>
                <div className="address-display">
                  <MapPin size={20} />
                  <div>
                    <p><strong>{selectedOrder.deliveryAddress.fullName || selectedOrder.customer.name}</strong></p>
                    <p>{selectedOrder.deliveryAddress.addressLine1}</p>
                    {selectedOrder.deliveryAddress.addressLine2 && (
                      <p>{selectedOrder.deliveryAddress.addressLine2}</p>
                    )}
                    <p>{selectedOrder.deliveryAddress.area}, {selectedOrder.deliveryAddress.city} - {selectedOrder.deliveryAddress.pincode}</p>
                    <p className="address-phone">Phone: {selectedOrder.deliveryAddress.phone || selectedOrder.customer.phone}</p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="detail-section">
                <h3>Price Details</h3>
                <div className="detail-row">
                  <span>Subtotal:</span>
                  <strong>{formatPrice(selectedOrder.subtotal)}</strong>
                </div>
                <div className="detail-row">
                  <span>Shipping:</span>
                  <strong>{selectedOrder.shippingCharges === 0 ? 'FREE' : formatPrice(selectedOrder.shippingCharges)}</strong>
                </div>
                <div className="detail-row">
                  <span>Tax (GST 18%):</span>
                  <strong>{formatPrice(selectedOrder.tax)}</strong>
                </div>
                <div className="detail-divider"></div>
                <div className="detail-row total">
                  <span>Total Amount:</span>
                  <strong>{formatPrice(selectedOrder.totalAmount)}</strong>
                </div>
              </div>

              {/* Status History */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div className="detail-section">
                  <h3>Order Timeline</h3>
                  <div className="timeline">
                    {selectedOrder.statusHistory.map((history, idx) => {
                      const StatusIcon = getStatusInfo(history.status).icon;
                      return (
                        <div key={idx} className="timeline-item">
                          <div className="timeline-icon">
                            <StatusIcon size={16} />
                          </div>
                          <div className="timeline-content">
                            <p className="timeline-status">{getStatusInfo(history.status).label}</p>
                            <p className="timeline-date">{formatDate(history.timestamp)}</p>
                            {history.notes && <p className="timeline-notes">{history.notes}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {selectedOrder.status === 'pending' && (
                <button
                  className="btn btn-ghost danger"
                  onClick={() => {
                    handleCancelOrder(selectedOrder.orderId);
                  }}
                  disabled={cancellingOrder === selectedOrder.orderId}
                >
                  {cancellingOrder === selectedOrder.orderId ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
              <button className="btn btn-primary" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Repair Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Repair Request Details</h2>
              <button className="modal-close" onClick={() => setShowBookingModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>Booking Information</h3>
                <div className="detail-row">
                  <span>Booking ID:</span>
                  <strong>{selectedBooking.bookingId || selectedBooking.id}</strong>
                </div>
                <div className="detail-row">
                  <span>Booked On:</span>
                  <strong>{formatDate(selectedBooking.createdAt)}</strong>
                </div>
                <div className="detail-row">
                  <span>Status:</span>
                  <span
                    className="order-status"
                    style={{
                      background: `${getBookingStatusInfo(selectedBooking.status).color}20`,
                      color: getBookingStatusInfo(selectedBooking.status).color,
                      border: `1px solid ${getBookingStatusInfo(selectedBooking.status).color}40`
                    }}
                  >
                    {getBookingStatusInfo(selectedBooking.status).label}
                  </span>
                </div>
                {selectedBooking.preferredDate && (
                  <div className="detail-row">
                    <span>Preferred Date:</span>
                    <strong>{new Date(selectedBooking.preferredDate).toLocaleDateString('en-IN')}</strong>
                  </div>
                )}
                {selectedBooking.preferredTime && (
                  <div className="detail-row">
                    <span>Preferred Time:</span>
                    <strong>{selectedBooking.preferredTime}</strong>
                  </div>
                )}
              </div>

              <div className="detail-section">
                <h3>Service Details</h3>
                <div className="detail-row">
                  <span>Service:</span>
                  <strong>{selectedBooking.serviceName}</strong>
                </div>
                <div className="detail-row">
                  <span>Device:</span>
                  <strong>{selectedBooking.deviceDetails || 'Not specified'}</strong>
                </div>
                {selectedBooking.issueDescription && (
                  <div className="detail-row">
                    <span>Issue:</span>
                    <strong>{selectedBooking.issueDescription}</strong>
                  </div>
                )}
                <div className="detail-row">
                  <span>Pickup Required:</span>
                  <strong>{selectedBooking.pickupRequired ? 'Yes' : 'No (Drop-in)'}</strong>
                </div>
              </div>

              <div className="detail-section">
                <h3>Price</h3>
                <div className="detail-row total">
                  <span>Service Price:</span>
                  <strong>{formatPrice(selectedBooking.servicePrice || 0)}</strong>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {selectedBooking.status === 'pending' && (
                <button
                  className="btn btn-ghost danger"
                  onClick={() => handleCancelBooking(selectedBooking.bookingId || selectedBooking.id)}
                  disabled={cancellingBooking === (selectedBooking.bookingId || selectedBooking.id)}
                >
                  {cancellingBooking === (selectedBooking.bookingId || selectedBooking.id) ? 'Cancelling...' : 'Cancel Request'}
                </button>
              )}
              <button className="btn btn-primary" onClick={() => setShowBookingModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default OrdersPage;
