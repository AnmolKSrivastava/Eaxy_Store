import React, { useState } from 'react';
import { Users, Search, Eye, ShoppingBag, Heart, Star, CheckCircle, TrendingUp } from 'lucide-react';
import CustomerDetailModal from './CustomerDetailModal';
import './CustomerManagement.css';

function CustomerManagement() {
  const [customers] = useState([
    {
      id: 'CUST-001',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@email.com',
      phone: '+91 98765 43210',
      location: 'Kothrud, Pune',
      totalOrders: 12,
      totalSpent: 245680,
      averageRating: 4.8,
      wishlistItems: 5,
      cartItems: 2,
      status: 'active',
      joinDate: '2025-08-15',
      lastOrder: '2026-05-20',
      reviews: 8,
      testimonials: 1,
      contactSubmissions: 2,
      purchaseHistory: [
        { date: '2026-05-20', product: 'MacBook Air M2', amount: 84999, status: 'delivered' },
        { date: '2026-04-12', product: 'iPhone 15 Pro', amount: 124999, status: 'delivered' },
        { date: '2026-03-08', product: 'AirPods Pro 2', amount: 21999, status: 'delivered' }
      ]
    },
    {
      id: 'CUST-002',
      name: 'Priya Deshmukh',
      email: 'priya.d@email.com',
      phone: '+91 97654 32100',
      location: 'Hinjewadi, Pune',
      totalOrders: 8,
      totalSpent: 156780,
      averageRating: 4.9,
      wishlistItems: 12,
      cartItems: 0,
      status: 'active',
      joinDate: '2025-11-22',
      lastOrder: '2026-05-18',
      reviews: 5,
      testimonials: 2,
      contactSubmissions: 1,
      purchaseHistory: [
        { date: '2026-05-18', product: 'Dell XPS 15', amount: 124999, status: 'delivered' },
        { date: '2026-02-14', product: 'Sony WH-1000XM5', amount: 26999, status: 'delivered' }
      ]
    },
    {
      id: 'CUST-003',
      name: 'Amit Patil',
      email: 'amit.patil@email.com',
      phone: '+91 99887 76543',
      location: 'Baner, Pune',
      totalOrders: 15,
      totalSpent: 389450,
      averageRating: 4.7,
      wishlistItems: 8,
      cartItems: 3,
      status: 'active',
      joinDate: '2025-06-10',
      lastOrder: '2026-05-22',
      reviews: 12,
      testimonials: 3,
      contactSubmissions: 4,
      purchaseHistory: [
        { date: '2026-05-22', product: 'Samsung Galaxy S24', amount: 89999, status: 'processing' },
        { date: '2026-04-28', product: 'Logitech MX Master 3S', amount: 8999, status: 'delivered' },
        { date: '2026-03-15', product: 'ASUS ROG Strix G15', amount: 139999, status: 'delivered' }
      ]
    },
    {
      id: 'CUST-004',
      name: 'Sneha Kulkarni',
      email: 'sneha.k@email.com',
      phone: '+91 98123 45678',
      location: 'Hadapsar, Pune',
      totalOrders: 5,
      totalSpent: 98750,
      averageRating: 5.0,
      wishlistItems: 15,
      cartItems: 1,
      status: 'active',
      joinDate: '2026-01-05',
      lastOrder: '2026-05-15',
      reviews: 5,
      testimonials: 1,
      contactSubmissions: 0,
      purchaseHistory: [
        { date: '2026-05-15', product: 'OnePlus 12', amount: 64999, status: 'delivered' },
        { date: '2026-03-20', product: 'Keychron K8 Pro', amount: 11999, status: 'delivered' }
      ]
    },
    {
      id: 'CUST-005',
      name: 'Vikram Joshi',
      email: 'vikram.j@email.com',
      phone: '+91 96543 21098',
      location: 'Wakad, Pune',
      totalOrders: 3,
      totalSpent: 45780,
      averageRating: 4.3,
      wishlistItems: 6,
      cartItems: 0,
      status: 'inactive',
      joinDate: '2025-09-18',
      lastOrder: '2026-02-10',
      reviews: 2,
      testimonials: 0,
      contactSubmissions: 1,
      purchaseHistory: [
        { date: '2026-02-10', product: 'Samsung T7 SSD', amount: 8499, status: 'delivered' },
        { date: '2025-12-05', product: 'Anker PowerCore', amount: 3999, status: 'delivered' }
      ]
    },
    {
      id: 'CUST-006',
      name: 'Neha Rathod',
      email: 'neha.rathod@email.com',
      phone: '+91 97777 88899',
      location: 'Viman Nagar, Pune',
      totalOrders: 20,
      totalSpent: 567890,
      averageRating: 4.9,
      wishlistItems: 20,
      cartItems: 5,
      status: 'vip',
      joinDate: '2025-03-12',
      lastOrder: '2026-05-21',
      reviews: 18,
      testimonials: 4,
      contactSubmissions: 6,
      purchaseHistory: [
        { date: '2026-05-21', product: 'MacBook Pro 2021 Refurbished', amount: 89999, status: 'out-for-delivery' },
        { date: '2026-05-10', product: 'Google Pixel 8 Pro', amount: 94999, status: 'delivered' }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
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

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active' || c.status === 'vip').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0);

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
            <h3>{formatPrice(totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37' }}>
            <ShoppingBag size={24} />
          </div>
          <div className="stat-details">
            <h3>{formatPrice(averageOrderValue)}</h3>
            <p>Avg Order Value</p>
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
                      {customer.name.charAt(0).toUpperCase()}
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
                  <span className="amount">{formatPrice(customer.totalSpent)}</span>
                </td>
                <td>
                  <div className="rating">
                    <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                    <span>{customer.averageRating.toFixed(1)}</span>
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
        {filteredCustomers.length === 0 && (
          <div className="empty-state">
            <Users size={48} />
            <p>No customers found</p>
          </div>
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
