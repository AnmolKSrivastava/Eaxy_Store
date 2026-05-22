import React, { useState } from 'react';
import { Edit, Eye, EyeOff, CheckCircle, XCircle, Clock, User, Star, MessageSquare } from 'lucide-react';
import './ContentManagement.css';

function ContentManagement() {
  const [activeTab, setActiveTab] = useState('sections');

  const [homepageSections, setHomepageSections] = useState([
    { id: 1, name: 'Hero Section', status: 'active', lastUpdated: '2026-05-20', type: 'hero' },
    { id: 2, name: 'How It Works', status: 'active', lastUpdated: '2026-05-15', type: 'process' },
    { id: 3, name: 'Product Categories', status: 'active', lastUpdated: '2026-05-18', type: 'categories' },
    { id: 4, name: 'Repair Services', status: 'active', lastUpdated: '2026-05-17', type: 'services' },
    { id: 5, name: 'Why Choose Us', status: 'active', lastUpdated: '2026-05-16', type: 'features' },
    { id: 6, name: 'Hot Deals', status: 'active', lastUpdated: '2026-05-22', type: 'deals' },
    { id: 7, name: 'Coverage Areas', status: 'active', lastUpdated: '2026-05-19', type: 'coverage' },
    { id: 8, name: 'Testimonials', status: 'active', lastUpdated: '2026-05-21', type: 'testimonials' },
    { id: 9, name: 'CTA Banner', status: 'active', lastUpdated: '2026-05-14', type: 'cta' },
  ]);

  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      author: 'Rahul Sharma',
      location: 'Kothrud, Pune',
      rating: 5,
      content: 'Amazing service! Got my MacBook delivered in just 3 hours. The quality is top-notch and the delivery was super fast.',
      date: '2026-05-22',
      status: 'pending',
      product: 'MacBook Air M2',
    },
    {
      id: 2,
      author: 'Priya Deshmukh',
      location: 'Hinjewadi, Pune',
      rating: 5,
      content: 'Best electronics store in Pune! Their repair service fixed my laptop screen within hours. Highly recommended!',
      date: '2026-05-21',
      status: 'pending',
      product: 'Laptop Screen Repair',
    },
    {
      id: 3,
      author: 'Amit Patil',
      location: 'Baner, Pune',
      rating: 4,
      content: 'Great experience with the 4-hour delivery promise. Products are genuine and prices are competitive.',
      date: '2026-05-20',
      status: 'approved',
      product: 'iPhone 15 Pro',
    },
    {
      id: 4,
      author: 'Sneha Kulkarni',
      location: 'Hadapsar, Pune',
      rating: 5,
      content: 'Purchased a refurbished laptop and it works like new! Customer service is excellent and very responsive.',
      date: '2026-05-19',
      status: 'approved',
      product: 'MacBook Pro Refurbished',
    },
    {
      id: 5,
      author: 'Vikram Joshi',
      location: 'Wakad, Pune',
      rating: 3,
      content: 'Decent service but delivery took slightly longer than promised. Product quality is good though.',
      date: '2026-05-23',
      status: 'pending',
      product: 'Samsung Galaxy S24',
    },
  ]);

  const toggleSectionStatus = (sectionId) => {
    setHomepageSections((sections) =>
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, status: section.status === 'active' ? 'inactive' : 'active' }
          : section
      )
    );
  };

  const handleTestimonialAction = (testimonialId, action) => {
    setTestimonials((items) =>
      items.map((item) =>
        item.id === testimonialId ? { ...item, status: action } : item
      )
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const activeSections = homepageSections.filter((s) => s.status === 'active').length;
  const pendingTestimonials = testimonials.filter((t) => t.status === 'pending').length;
  const approvedTestimonials = testimonials.filter((t) => t.status === 'approved').length;

  return (
    <div className="content-management">
      <div className="content-header">
        <div>
          <h1>📝 Content Management</h1>
          <p className="content-subtitle">Manage homepage sections and testimonials</p>
        </div>
      </div>

      <div className="content-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(var(--primary-rgb), 0.2)', color: 'var(--primary)' }}>
            <Edit size={24} />
          </div>
          <div className="stat-details">
            <h3>{activeSections}/9</h3>
            <p>Active Sections</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div className="stat-details">
            <h3>{pendingTestimonials}</h3>
            <p>Pending Reviews</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-details">
            <h3>{approvedTestimonials}</h3>
            <p>Approved Reviews</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
            <MessageSquare size={24} />
          </div>
          <div className="stat-details">
            <h3>{testimonials.length}</h3>
            <p>Total Reviews</p>
          </div>
        </div>
      </div>

      <div className="content-tabs">
        <button
          className={`tab-btn ${activeTab === 'sections' ? 'active' : ''}`}
          onClick={() => setActiveTab('sections')}
        >
          🏠 Homepage Sections
        </button>
        <button
          className={`tab-btn ${activeTab === 'testimonials' ? 'active' : ''}`}
          onClick={() => setActiveTab('testimonials')}
        >
          💬 Testimonials
          {pendingTestimonials > 0 && (
            <span className="badge">{pendingTestimonials}</span>
          )}
        </button>
      </div>

      <div className="content-body">
        {activeTab === 'sections' && (
          <div className="sections-panel">
            <div className="panel-header">
              <h3>Homepage Sections</h3>
              <p>Manage visibility and content of homepage sections</p>
            </div>
            <div className="sections-grid">
              {homepageSections.map((section) => (
                <div key={section.id} className={`section-card ${section.status}`}>
                  <div className="section-header">
                    <div className="section-info">
                      <h4>{section.name}</h4>
                      <p className="section-type">{section.type}</p>
                    </div>
                    <button
                      className={`status-toggle ${section.status}`}
                      onClick={() => toggleSectionStatus(section.id)}
                      title={section.status === 'active' ? 'Hide Section' : 'Show Section'}
                    >
                      {section.status === 'active' ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                    </button>
                  </div>
                  <div className="section-meta">
                    <span className="last-updated">
                      Last updated: {formatDate(section.lastUpdated)}
                    </span>
                  </div>
                  <div className="section-actions">
                    <button className="action-btn edit">
                      <Edit size={16} />
                      Edit Content
                    </button>
                    <span className={`status-badge ${section.status}`}>
                      {section.status === 'active' ? '🟢 Active' : '⚫ Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="testimonials-panel">
            <div className="panel-header">
              <h3>Testimonials Moderation</h3>
              <p>Review and approve customer testimonials</p>
            </div>
            <div className="testimonials-list">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className={`testimonial-card ${testimonial.status}`}>
                  <div className="testimonial-header">
                    <div className="author-info">
                      <div className="author-avatar">
                        <User size={20} />
                      </div>
                      <div>
                        <h4>{testimonial.author}</h4>
                        <p className="location">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < testimonial.rating ? '#fbbf24' : 'none'}
                          stroke={i < testimonial.rating ? '#fbbf24' : '#6b7280'}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="testimonial-content">
                    <p>{testimonial.content}</p>
                  </div>
                  <div className="testimonial-meta">
                    <span className="product-tag">{testimonial.product}</span>
                    <span className="date">{formatDate(testimonial.date)}</span>
                  </div>
                  <div className="testimonial-actions">
                    {testimonial.status === 'pending' && (
                      <>
                        <button
                          className="action-btn approve"
                          onClick={() => handleTestimonialAction(testimonial.id, 'approved')}
                        >
                          <CheckCircle size={16} />
                          Approve
                        </button>
                        <button
                          className="action-btn reject"
                          onClick={() => handleTestimonialAction(testimonial.id, 'rejected')}
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </>
                    )}
                    {testimonial.status === 'approved' && (
                      <span className="status-badge approved">✅ Approved</span>
                    )}
                    {testimonial.status === 'rejected' && (
                      <span className="status-badge rejected">❌ Rejected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentManagement;
