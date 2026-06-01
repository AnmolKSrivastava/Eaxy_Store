import React, { useState, useEffect } from 'react';
import { Users, Search, Eye, ShoppingBag, Heart, Star, CheckCircle, TrendingUp } from 'lucide-react';
import CustomerDetailModal from './CustomerDetailModal';
import { getAllUsers } from '../../firebase/userService';
import './CustomerManagement.css';

function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fetch users from Firebase
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const users = await getAllUsers();
        
        // Transform Firebase user data to match component format
        // Stats will be fetched when viewing individual customer details
        const transformedUsers = users.map(user => ({
          id: user.uid || user.id,
          name: user.name || 'N/A',
          email: user.email || 'N/A',
          phone: user.phone || 'N/A',
          location: user.address || 'N/A',
          photoURL: user.photoURL || null,
          provider: user.provider || 'email',
          joinDate: user.createdAt ? new Date(user.createdAt.seconds * 1000).toISOString().split('T')[0] : 'N/A',
          lastLogin: user.updatedAt ? new Date(user.updatedAt.seconds * 1000).toISOString().split('T')[0] : 'N/A',
          // Placeholder values - real data loaded in modal
          totalOrders: '-',
          totalSpent: 0,
          averageRating: 0,
          wishlistItems: '-',
          cartItems: 0,
          status: 'active',
          reviews: 0,
          testimonials: 0,
          contactSubmissions: 0,
          purchaseHistory: []
        }));
        
        setCustomers(transformedUsers);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to load customer data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });


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

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active' || c.status === 'vip').length;
  const registeredToday = customers.filter(c => {
    if (c.joinDate === 'N/A') return false;
    const joinDate = new Date(c.joinDate);
    const today = new Date();
    return joinDate.toDateString() === today.toDateString();
  }).length;
  const registeredThisMonth = customers.filter(c => {
    if (c.joinDate === 'N/A') return false;
    const joinDate = new Date(c.joinDate);
    const today = new Date();
    return joinDate.getMonth() === today.getMonth() && 
           joinDate.getFullYear() === today.getFullYear();
  }).length;

  // Show loading state
  if (loading) {
    return (
      <div className="customer-management">
        <div className="loading-state">
          <p>Loading customer data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="customer-management">
        <div className="customer-header">
          <div>
            <h1>👥 Customer Management</h1>
            <p className="customer-subtitle">Manage customer database, analytics, and engagement</p>
          </div>
        </div>
        <div className="error-message" style={{
          padding: '2rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          color: '#ef4444',
          textAlign: 'center'
        }}>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-management">
      <div className="customer-header">
        <div>
          <h1>👥 Customer Management</h1>
          <p className="customer-subtitle">Manage customer database, analytics, and engagement</p>
        </div>
      </div>

      <div className="customer-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(var(--primary-rgb), 0.2)', color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
          <div className="stat-details">
            <h3>{totalCustomers}</h3>
            <p>Total Customers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-details">
            <h3>{activeCustomers}</h3>
            <p>Active Customers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-details">
            <h3>{registeredThisMonth}</h3>
            <p>New This Month</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37' }}>
            <ShoppingBag size={24} />
          </div>
          <div className="stat-details">
            <h3>{registeredToday}</h3>
            <p>Registered Today</p>
          </div>
        </div>
      </div>

      <div className="customer-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="vip">VIP</option>
        </select>
      </div>

      <div className="customers-table-container">
        {filteredCustomers.length === 0 ? (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: 'var(--muted)',
            background: 'var(--card)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Users size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              {searchTerm || statusFilter !== 'all' 
                ? 'No customers found matching your filters' 
                : 'No customers registered yet'}
            </p>
            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Customers will appear here once they register on your platform'}
            </p>
          </div>
        ) : (
          <table className="customers-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Rating</th>
              <th>Wishlist</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <div className="customer-info">
                    <div className="customer-avatar">
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
                    <div>
                      <div className="customer-name">{customer.name}</div>
                      <div className="customer-id">{customer.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <div>{customer.email}</div>
                    <div className="phone">{customer.phone}</div>
                  </div>
                </td>
                <td>{customer.location}</td>
                <td>
                  <span className="orders-badge">{customer.totalOrders}</span>
                </td>
                <td>
                  <span className="amount" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                    View Details
                  </span>
                </td>
                <td>
                  <div className="rating" style={{ color: 'var(--muted)' }}>
                    <Star size={14} />
                    <span>-</span>
                  </div>
                </td>
                <td>
                  <div className="wishlist-count">
                    <Heart size={14} />
                    <span>{customer.wishlistItems}</span>
                  </div>
                </td>
                <td>
                  <span className="status-badge" style={{ background: `${getStatusColor(customer.status)}20`, color: getStatusColor(customer.status) }}>
                    {getStatusLabel(customer.status)}
                  </span>
                </td>
                <td>
                  <button
                    className="action-btn view"
                    onClick={() => handleViewCustomer(customer)}
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {showDetailModal && selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
}

export default CustomerManagement;
