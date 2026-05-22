import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Eye, X, Check, Truck, Package, Wrench, UserPlus, AlertCircle } from 'lucide-react';
import { mockOrders, statusColors, paymentStatusColors } from '../data/mockOrders';
import { mockRepairRequests, repairStatusColors, priorityColors, availableTechnicians } from '../data/mockRepairRequests';
import './OrderManagement.css';

function OrderManagement({ activeTab: initialActiveTab, setActiveTab: parentSetActiveTab }) {
  const [activeTab, setActiveTab] = useState(initialActiveTab || 'products'); // 'products' or 'repairs'
  const [orders, setOrders] = useState(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);
  const [repairRequests, setRepairRequests] = useState(mockRepairRequests);
  const [filteredRepairs, setFilteredRepairs] = useState(mockRepairRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [showAssignTech, setShowAssignTech] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  const updateRepairStatus = (repairId, newStatus) => {
    setRepairRequests(prevRepairs =>
      prevRepairs.map(repair =>
        repair.id === repairId
          ? { 
              ...repair, 
              status: newStatus,
              ...(newStatus === 'completed' && { completedAt: new Date() }),
              serviceHistory: [
                ...repair.serviceHistory,
                { date: new Date(), action: `Status updated to ${repairStatusColors[newStatus].text}`, by: 'Admin' }
              ]
            }
          : repair
      )
    );
    if (selectedRepair && selectedRepair.id === repairId) {
      const updated = repairRequests.find(r => r.id === repairId);
      setSelectedRepair({ ...updated, status: newStatus });
    }
  };

  const assignTechnician = (repairId, technicianName) => {
    setRepairRequests(prevRepairs =>
      prevRepairs.map(repair =>
        repair.id === repairId
          ? { 
              ...repair, 
              technician: technicianName,
              status: repair.status === 'received' ? 'diagnosed' : repair.status,
              serviceHistory: [
                ...repair.serviceHistory,
                { date: new Date(), action: `Assigned to ${technicianName}`, by: 'Admin' }
              ]
            }
          : repair
      )
    );
    setShowAssignTech(null);
  };

  const getTimeRemaining = (deadline) => {
    const diff = new Date(deadline) - currentTime;
    if (diff <= 0) return { hours: 0, minutes: 0, isOverdue: true };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const isUrgent = diff < 60 * 60 * 1000; // Less than 1 hour
    
    return { hours, minutes, isOverdue: false, isUrgent };
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus, ...(newStatus === 'delivered' && { deliveredAt: new Date() }) }
          : order
      )
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
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
              <th>Technician</th>
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
                      style={{ background: `${priorityColors[repair.priority].bg}20`, color: priorityColors[repair.priority].bg }}
                    >
                      {priorityColors[repair.priority].text}
                    </span>
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ background: `${repairStatusColors[repair.status].bg}20`, color: repairStatusColors[repair.status].bg }}
                    >
                      {repairStatusColors[repair.status].text}
                    </span>
                  </td>
                  <td>
                    {repair.technician ? (
                      <span className="tech-name">{repair.technician}</span>
                    ) : (
                      <span className="no-tech">Unassigned</span>
                    )}
                  </td>
                  <td className="amount">₹{repair.estimatedCost.toLocaleString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view"
                        onClick={() => setSelectedRepair(repair)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {!repair.technician && (
                        <button
                          className="action-btn assign"
                          onClick={() => setShowAssignTech(repair.id)}
                          title="Assign Technician"
                        >
                          <UserPlus size={16} />
                        </button>
                      )}
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

      {/* Assign Technician Dropdown */}
      {showAssignTech && (
        <div className="modal-overlay" onClick={() => setShowAssignTech(null)}>
          <div className="tech-assign-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Assign Technician</h3>
            <div className="tech-list">
              {availableTechnicians.map(tech => (
                <button
                  key={tech.id}
                  className={`tech-item ${!tech.available ? 'unavailable' : ''}`}
                  onClick={() => tech.available && assignTechnician(showAssignTech, tech.name)}
                  disabled={!tech.available}
                >
                  <div>
                    <strong>{tech.name}</strong>
                    <span className="tech-specialty">{tech.specialty}</span>
                  </div>
                  {tech.available ? (
                    <span className="tech-status available">Available</span>
                  ) : (
                    <span className="tech-status busy">Busy</span>
                  )}
                </button>
              ))}
            </div>
            <button className="modal-btn secondary" onClick={() => setShowAssignTech(null)}>
              Cancel
            </button>
          </div>
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
                      style={{ background: `${repairStatusColors[selectedRepair.status].bg}20`, color: repairStatusColors[selectedRepair.status].bg }}
                    >
                      {repairStatusColors[selectedRepair.status].text}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Priority:</span>
                    <span
                      className="status-badge"
                      style={{ background: `${priorityColors[selectedRepair.priority].bg}20`, color: priorityColors[selectedRepair.priority].bg }}
                    >
                      {priorityColors[selectedRepair.priority].text}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Request Date:</span>
                    <span className="info-value">{selectedRepair.requestDate.toLocaleString()}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Est. Completion:</span>
                    <span className="info-value">{selectedRepair.estimatedCompletion.toLocaleString()}</span>
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
                <div className="info-row">
                  <span className="info-label">Technician:</span>
                  <span className="info-value">{selectedRepair.technician || 'Unassigned'}</span>
                </div>
              </div>

              <div className="info-section">
                <h3>Cost & Warranty</h3>
                <div className="info-row">
                  <span className="info-label">Estimated Cost:</span>
                  <span className="info-value">₹{selectedRepair.estimatedCost.toLocaleString()}</span>
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
              {!selectedRepair.technician && (
                <button
                  className="modal-btn primary"
                  onClick={() => {
                    setShowAssignTech(selectedRepair.id);
                    setSelectedRepair(null);
                  }}
                >
                  <UserPlus size={18} />
                  Assign Technician
                </button>
              )}
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
