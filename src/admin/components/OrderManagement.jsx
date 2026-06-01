import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Clock, Eye, X, Check, Truck, Package, Wrench, AlertCircle } from 'lucide-react';
import { statusColors, paymentStatusColors } from '../data/mockOrders';
import { repairStatusColors, priorityColors } from '../data/mockRepairRequests';
import { getAllOrders, updateOrderStatus as updateOrderStatusFirebase } from '../../firebase/orderService';
import { getAllRepairBookings, updateRepairBookingStatus } from '../../firebase/repairBookingService';
import './OrderManagement.css';

function OrderManagement({ activeTab: initialActiveTab, setActiveTab: parentSetActiveTab }) {
  const [activeTab, setActiveTab] = useState(initialActiveTab || 'products'); // 'products' or 'repairs'
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [repairRequests, setRepairRequests] = useState([]);
  const [filteredRepairs, setFilteredRepairs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.landmark,
      address.area,
      address.city || 'Pune',
      address.pincode
    ].filter(Boolean);
    return parts.join(', ');
  };

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      console.log('OrderManagement: Loading orders from Firebase...');
      const firebaseOrders = await getAllOrders();
      console.log('OrderManagement: Fetched orders:', firebaseOrders.length, 'orders');
      // Transform Firebase orders to match admin panel format
      const transformedOrders = firebaseOrders.map(order => ({
        id: order.orderId || order.id,
        customer: {
          name: order.customer?.name || 'N/A',
          email: order.customer?.email || 'N/A',
          phone: order.customer?.phone || 'N/A',
          address: formatAddress(order.deliveryAddress)
        },
        items: order.items || [],
        total: order.totalAmount || 0,
        status: order.status || 'pending',
        paymentStatus: order.paymentStatus || 'pending',
        deliveryArea: order.deliveryAddress?.area || 'N/A',
        orderDate: order.orderDate?.seconds 
          ? new Date(order.orderDate.seconds * 1000) 
          : new Date(order.orderDate),
        deliveryDeadline: order.orderDeadline 
          ? new Date(order.orderDeadline)
          : null,
        estimatedDelivery: order.orderDeadline 
          ? new Date(order.orderDeadline)
          : null,
        deliveredAt: order.deliveredAt?.seconds 
          ? new Date(order.deliveredAt.seconds * 1000)
          : null,
        notes: order.notes || ''
      }));
      setOrders(transformedOrders);
      setFilteredOrders(transformedOrders);
      console.log('OrderManagement: Orders loaded successfully');
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRepairBookings = useCallback(async () => {
    try {
      setLoading(true);
      console.log('OrderManagement: Loading repair bookings from Firebase...');
      const firebaseBookings = await getAllRepairBookings();
      console.log('OrderManagement: Fetched repair bookings:', firebaseBookings.length, 'bookings');
      // Transform Firebase bookings to match admin panel format
      const transformedBookings = firebaseBookings.map(booking => ({
        id: booking.bookingId || booking.id,
        customer: {
          name: booking.customerName || 'N/A',
          email: booking.email || 'N/A',
          phone: booking.phone || 'N/A',
          address: booking.address || 'N/A'
        },
        device: booking.deviceDetails || 'N/A',
        issue: booking.serviceName || 'N/A',
        description: booking.issueDescription || 'No description provided',
        serviceName: booking.serviceName || 'N/A',
        servicePrice: booking.servicePrice || 0,
        estimatedCost: booking.servicePrice || 0,
        status: booking.status || 'pending',
        priority: booking.priority || 'medium',
        requestDate: booking.createdAt?.seconds
          ? new Date(booking.createdAt.seconds * 1000)
          : new Date(booking.createdAt || Date.now()),
        receivedAt: booking.createdAt?.seconds 
          ? new Date(booking.createdAt.seconds * 1000) 
          : new Date(booking.createdAt || Date.now()),
        estimatedCompletion: booking.preferredDate 
          ? new Date(booking.preferredDate)
          : null,
        completedAt: booking.completedAt?.seconds 
          ? new Date(booking.completedAt.seconds * 1000)
          : null,
        pickupRequired: booking.pickupRequired || false,
        serviceHistory: booking.serviceHistory || []
      }));
      setRepairRequests(transformedBookings);
      setFilteredRepairs(transformedBookings);
      console.log('OrderManagement: Repair bookings loaded successfully');
    } catch (error) {
      console.error('Error loading repair bookings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load real orders and repair bookings from Firebase
  useEffect(() => {
    loadOrders();
    loadRepairBookings();
  }, [loadOrders, loadRepairBookings]);

  // Update current time every minute for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Sync with parent tab selection
  useEffect(() => {
    if (initialActiveTab) {
      setActiveTab(initialActiveTab);
    }
  }, [initialActiveTab]);

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (areaFilter !== 'all') {
      filtered = filtered.filter(order => order.deliveryArea === areaFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, areaFilter, orders]);

  // Filter repair requests
  useEffect(() => {
    let filtered = repairRequests;

    if (searchTerm) {
      filtered = filtered.filter(repair =>
        repair.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repair.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repair.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repair.issue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(repair => repair.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(repair => repair.priority === priorityFilter);
    }

    setFilteredRepairs(filtered);
  }, [searchTerm, statusFilter, priorityFilter, repairRequests]);

  const updateRepairStatus = async (repairId, newStatus) => {
    try {
      await updateRepairBookingStatus(repairId, newStatus, `Status updated to ${newStatus}`);
      // Reload repair bookings to get updated data
      await loadRepairBookings();
      if (selectedRepair && selectedRepair.id === repairId) {
        const updated = repairRequests.find(r => r.id === repairId);
        if (updated) {
          setSelectedRepair({ ...updated, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating repair status:', error);
      alert('Failed to update repair status');
    }
  };

  const getTimeRemaining = (deadline) => {
    const diff = new Date(deadline) - currentTime;
    if (diff <= 0) return { hours: 0, minutes: 0, isOverdue: true };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const isUrgent = diff < 60 * 60 * 1000; // Less than 1 hour
    
    return { hours, minutes, isOverdue: false, isUrgent };
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatusFirebase(orderId, newStatus, 'admin', `Status updated to ${newStatus}`);
      // Reload orders to get updated data
      await loadOrders();
      // Update selected order if it's open
      if (selectedOrder && selectedOrder.id === orderId) {
        const updated = orders.find(o => o.id === orderId);
        if (updated) {
          setSelectedOrder({ ...updated, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const deliveryAreas = [
    'Pimpri-Chinchwad',
    'Kothrud & Warje',
    'Hadapsar & Magarpatta',
    'Shivajinagar & Camp',
    'Aundh & Baner',
    'Wakad & Hinjewadi'
  ];

  const getStatusActions = (currentStatus) => {
    switch (currentStatus) {
      case 'pending':
        return [{ status: 'processing', label: 'Start Processing', icon: Package }];
      case 'processing':
        return [{ status: 'out-for-delivery', label: 'Out for Delivery', icon: Truck }];
      case 'out-for-delivery':
        return [{ status: 'delivered', label: 'Mark Delivered', icon: Check }];
      default:
        return [];
    }
  };

  const getRepairStatusActions = (currentStatus) => {
    switch (currentStatus) {
      case 'received':
        return [{ status: 'diagnosed', label: 'Diagnose', icon: AlertCircle }];
      case 'diagnosed':
        return [{ status: 'repairing', label: 'Start Repair', icon: Wrench }];
      case 'repairing':
        return [{ status: 'completed', label: 'Mark Completed', icon: Check }];
      default:
        return [];
    }
  };

  return (
    <div className="order-management">
      <div className="order-header">
        <div>
          <h1>Order Management</h1>
          <p className="order-subtitle">Manage product orders and repair service requests</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="order-tabs">
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('products');
            if (parentSetActiveTab) parentSetActiveTab('products');
          }}
        >
          <Package size={18} />
          Product Orders ({orders.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'repairs' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('repairs');
            if (parentSetActiveTab) parentSetActiveTab('repairs');
          }}
        >
          <Wrench size={18} />
          Repair Requests ({repairRequests.length})
        </button>
      </div>

      {/* Filters */}
      <div className="order-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder={activeTab === 'products' ? 'Search orders...' : 'Search repair requests...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {activeTab === 'products' ? (
            <>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="out-for-delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </>
          ) : (
            <>
              <option value="received">Received</option>
              <option value="diagnosed">Diagnosed</option>
              <option value="repairing">Repairing</option>
              <option value="completed">Completed</option>
            </>
          )}
        </select>

        {activeTab === 'products' ? (
          <select
            className="filter-select"
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
          >
            <option value="all">All Areas</option>
            {deliveryAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        ) : (
          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        )}
      </div>

      {/* Product Orders Table */}
      {activeTab === 'products' && (
      <div className="orders-table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
            <Package size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
            <Package size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p>No orders found</p>
          </div>
        ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Area</th>
              <th>4-Hour Countdown</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => {
              const timeRemaining = getTimeRemaining(order.deliveryDeadline);
              return (
                <tr key={order.id} className={order.status === 'delivered' ? 'delivered-row' : ''}>
                  <td>
                    <span className="order-id">{order.id}</span>
                  </td>
                  <td>
                    <div className="customer-cell">
                      <strong>{order.customer.name}</strong>
                      <span className="customer-email">{order.customer.email}</span>
                    </div>
                  </td>
                  <td>{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                  <td className="amount">₹{order.total.toLocaleString()}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ background: `${statusColors[order.status].bg}20`, color: statusColors[order.status].bg }}
                    >
                      {statusColors[order.status].text}
                    </span>
                  </td>
                  <td>
                    <span
                      className="payment-badge"
                      style={{ background: `${paymentStatusColors[order.paymentStatus].bg}20`, color: paymentStatusColors[order.paymentStatus].bg }}
                    >
                      {paymentStatusColors[order.paymentStatus].text}
                    </span>
                  </td>
                  <td>
                    <div className="area-cell">
                      <MapPin size={14} />
                      {order.deliveryArea}
                    </div>
                  </td>
                  <td>
                    {order.status !== 'delivered' ? (
                      <div className={`countdown ${timeRemaining.isOverdue ? 'overdue' : timeRemaining.isUrgent ? 'urgent' : ''}`}>
                        <Clock size={14} />
                        {timeRemaining.isOverdue ? (
                          <span>Overdue</span>
                        ) : (
                          <span>{timeRemaining.hours}h {timeRemaining.minutes}m</span>
                        )}
                      </div>
                    ) : (
                      <span className="delivered-text">Delivered</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view"
                        onClick={() => setSelectedOrder(order)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {getStatusActions(order.status).map((action, idx) => {
                        const ActionIcon = action.icon;
                        return (
                          <button
                            key={idx}
                            className="action-btn update"
                            onClick={() => updateOrderStatus(order.id, action.status)}
                            title={action.label}
                          >
                            <ActionIcon size={16} />
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </div>
      )}

      {/* Repair Requests Table */}
      {activeTab === 'repairs' && (
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Customer</th>
              <th>Device</th>
              <th>Issue</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Est. Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRepairs.map(repair => {
              return (
                <tr key={repair.id} className={repair.status === 'completed' ? 'delivered-row' : ''}>
                  <td>
                    <span className="order-id">{repair.id}</span>
                  </td>
                  <td>
                    <div className="customer-cell">
                      <strong>{repair.customer.name}</strong>
                      <span className="customer-email">{repair.customer.phone}</span>
                    </div>
                  </td>
                  <td>{repair.device}</td>
                  <td>{repair.issue}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ background: `${(priorityColors[repair.priority] || priorityColors.default).bg}20`, color: (priorityColors[repair.priority] || priorityColors.default).bg }}
                    >
                      {(priorityColors[repair.priority] || priorityColors.default).text}
                    </span>
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ background: `${(repairStatusColors[repair.status] || repairStatusColors.pending).bg}20`, color: (repairStatusColors[repair.status] || repairStatusColors.pending).bg }}
                    >
                      {(repairStatusColors[repair.status] || repairStatusColors.pending).text}
                    </span>
                  </td>
                  <td className="amount">₹{(repair.estimatedCost || repair.servicePrice || 0).toLocaleString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view"
                        onClick={() => setSelectedRepair(repair)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {getRepairStatusActions(repair.status).map((action, idx) => {
                        const ActionIcon = action.icon;
                        return (
                          <button
                            key={idx}
                            className="action-btn update"
                            onClick={() => updateRepairStatus(repair.id, action.status)}
                            title={action.label}
                          >
                            <ActionIcon size={16} />
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="order-info-grid">
                <div className="info-section">
                  <h3>Order Information</h3>
                  <div className="info-row">
                    <span className="info-label">Order ID:</span>
                    <span className="info-value">{selectedOrder.id}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Status:</span>
                    <span
                      className="status-badge"
                      style={{ background: `${statusColors[selectedOrder.status].bg}20`, color: statusColors[selectedOrder.status].bg }}
                    >
                      {statusColors[selectedOrder.status].text}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Order Date:</span>
                    <span className="info-value">{selectedOrder.orderDate.toLocaleString()}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Delivery Deadline:</span>
                    <span className="info-value">{selectedOrder.deliveryDeadline.toLocaleString()}</span>
                  </div>
                </div>

                <div className="info-section">
                  <h3>Customer Information</h3>
                  <div className="info-row">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{selectedOrder.customer.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{selectedOrder.customer.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">{selectedOrder.customer.phone}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Address:</span>
                    <span className="info-value">{selectedOrder.customer.address}</span>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>Order Items</h3>
                <div className="order-items">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <div className="item-info">
                        <strong>{item.name}</strong>
                        <span className="item-qty">Qty: {item.quantity}</span>
                      </div>
                      <span className="item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="order-total">
                    <strong>Total Amount:</strong>
                    <strong className="total-amount">₹{selectedOrder.total.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="info-section">
                  <h3>Notes</h3>
                  <p className="order-notes">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {getStatusActions(selectedOrder.status).map((action, idx) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={idx}
                    className="modal-btn primary"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, action.status);
                      setSelectedOrder(null);
                    }}
                  >
                    <ActionIcon size={18} />
                    {action.label}
                  </button>
                );
              })}
              <button className="modal-btn secondary" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Repair Details Modal */}
      {selectedRepair && (
        <div className="modal-overlay" onClick={() => setSelectedRepair(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Repair Request Details</h2>
              <button className="modal-close" onClick={() => setSelectedRepair(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="order-info-grid">
                <div className="info-section">
                  <h3>Request Information</h3>
                  <div className="info-row">
                    <span className="info-label">Request ID:</span>
                    <span className="info-value">{selectedRepair.id}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Status:</span>
                    <span
                      className="status-badge"
                      style={{ background: `${(repairStatusColors[selectedRepair.status] || repairStatusColors.pending).bg}20`, color: (repairStatusColors[selectedRepair.status] || repairStatusColors.pending).bg }}
                    >
                      {(repairStatusColors[selectedRepair.status] || repairStatusColors.pending).text}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Priority:</span>
                    <span
                      className="status-badge"
                      style={{ background: `${(priorityColors[selectedRepair.priority] || priorityColors.default).bg}20`, color: (priorityColors[selectedRepair.priority] || priorityColors.default).bg }}
                    >
                      {(priorityColors[selectedRepair.priority] || priorityColors.default).text}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Request Date:</span>
                    <span className="info-value">{selectedRepair.requestDate?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Est. Completion:</span>
                    <span className="info-value">{selectedRepair.estimatedCompletion?.toLocaleString() || 'Not scheduled'}</span>
                  </div>
                </div>

                <div className="info-section">
                  <h3>Customer Information</h3>
                  <div className="info-row">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{selectedRepair.customer.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{selectedRepair.customer.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">{selectedRepair.customer.phone}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Address:</span>
                    <span className="info-value">{selectedRepair.customer.address}</span>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>Device & Issue</h3>
                <div className="info-row">
                  <span className="info-label">Device:</span>
                  <span className="info-value">{selectedRepair.device}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Issue:</span>
                  <span className="info-value">{selectedRepair.issue}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Description:</span>
                  <span className="info-value">{selectedRepair.description}</span>
                </div>
              </div>

              <div className="info-section">
                <h3>Cost & Warranty</h3>
                <div className="info-row">
                  <span className="info-label">Estimated Cost:</span>
                  <span className="info-value">₹{(selectedRepair.estimatedCost || selectedRepair.servicePrice || 0).toLocaleString()}</span>
                </div>
                {selectedRepair.actualCost && (
                  <div className="info-row">
                    <span className="info-label">Actual Cost:</span>
                    <span className="info-value">₹{selectedRepair.actualCost.toLocaleString()}</span>
                  </div>
                )}
                <div className="info-row">
                  <span className="info-label">Warranty:</span>
                  <span className="info-value">{selectedRepair.warranty}</span>
                </div>
              </div>

              {selectedRepair.serviceHistory && selectedRepair.serviceHistory.length > 0 && (
                <div className="info-section">
                  <h3>Service History</h3>
                  <div className="service-history">
                    {selectedRepair.serviceHistory.map((entry, idx) => (
                      <div key={idx} className="history-entry">
                        <div className="history-time">{entry.date.toLocaleString()}</div>
                        <div className="history-action">{entry.action}</div>
                        <div className="history-by">by {entry.by}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRepair.notes && (
                <div className="info-section">
                  <h3>Notes</h3>
                  <p className="order-notes">{selectedRepair.notes}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {getRepairStatusActions(selectedRepair.status).map((action, idx) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={idx}
                    className="modal-btn primary"
                    onClick={() => {
                      updateRepairStatus(selectedRepair.id, action.status);
                      setSelectedRepair(null);
                    }}
                  >
                    <ActionIcon size={18} />
                    {action.label}
                  </button>
                );
              })}
              <button className="modal-btn secondary" onClick={() => setSelectedRepair(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;
