import React, { useState } from 'react';
import { UserPlus, Plus, Edit, Trash2, Star, Calendar, CheckCircle, Clock, Phone, Mail, MapPin } from 'lucide-react';
import './TechniciansManagement.css';

function TechniciansManagement() {
  const [technicians] = useState([
    {
      id: 'TECH-001',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@eaxystore.com',
      phone: '+91 98765 43210',
      specialization: ['Laptop Repairs', 'Data Recovery'],
      experience: '8 years',
      rating: 4.9,
      totalJobs: 1247,
      activeJobs: 3,
      status: 'available',
      availability: 'Mon-Sat, 9 AM - 6 PM',
      location: 'Kothrud, Pune',
      avatar: '👨‍🔧',
      certifications: ['Apple Certified', 'Dell Certified'],
      skills: ['Screen Replacement', 'Battery Replacement', 'Hardware Diagnostics']
    },
    {
      id: 'TECH-002',
      name: 'Priya Patel',
      email: 'priya.patel@eaxystore.com',
      phone: '+91 97654 32109',
      specialization: ['Mobile Repairs', 'Software Issues'],
      experience: '5 years',
      rating: 4.8,
      totalJobs: 892,
      activeJobs: 2,
      status: 'busy',
      availability: 'Mon-Fri, 10 AM - 7 PM',
      location: 'Hinjewadi, Pune',
      avatar: '👩‍🔧',
      certifications: ['Samsung Certified', 'Apple Certified'],
      skills: ['Screen Repair', 'Battery Replacement', 'Water Damage']
    },
    {
      id: 'TECH-003',
      name: 'Amit Singh',
      email: 'amit.singh@eaxystore.com',
      phone: '+91 99887 76543',
      specialization: ['Computer Repairs', 'Network Setup'],
      experience: '6 years',
      rating: 4.7,
      totalJobs: 1056,
      activeJobs: 1,
      status: 'available',
      availability: 'Mon-Sat, 8 AM - 5 PM',
      location: 'Baner, Pune',
      avatar: '👨‍💻',
      certifications: ['CompTIA A+', 'Network+'],
      skills: ['Hardware Upgrade', 'OS Installation', 'Network Configuration']
    },
    {
      id: 'TECH-004',
      name: 'Sneha Desai',
      email: 'sneha.desai@eaxystore.com',
      phone: '+91 98123 45678',
      specialization: ['Laptop Repairs', 'Performance Optimization'],
      experience: '4 years',
      rating: 4.6,
      totalJobs: 634,
      activeJobs: 2,
      status: 'available',
      availability: 'Tue-Sun, 9 AM - 6 PM',
      location: 'Hadapsar, Pune',
      avatar: '👩‍💼',
      certifications: ['HP Certified', 'Lenovo Certified'],
      skills: ['Keyboard Replacement', 'Performance Tuning', 'Software Troubleshooting']
    },
    {
      id: 'TECH-005',
      name: 'Vikram Joshi',
      email: 'vikram.joshi@eaxystore.com',
      phone: '+91 97777 88899',
      specialization: ['Mobile Repairs', 'Laptop Repairs'],
      experience: '7 years',
      rating: 4.9,
      totalJobs: 1423,
      activeJobs: 0,
      status: 'available',
      availability: 'Mon-Sat, 9 AM - 7 PM',
      location: 'Wakad, Pune',
      avatar: '👨‍🔬',
      certifications: ['Apple Certified', 'Samsung Certified', 'OnePlus Certified'],
      skills: ['Screen Replacement', 'Battery Replacement', 'Data Recovery']
    },
    {
      id: 'TECH-006',
      name: 'Meera Shah',
      email: 'meera.shah@eaxystore.com',
      phone: '+91 96543 21098',
      specialization: ['Computer Repairs', 'Virus Removal'],
      experience: '3 years',
      rating: 4.5,
      totalJobs: 387,
      activeJobs: 1,
      status: 'available',
      availability: 'Mon-Fri, 10 AM - 6 PM',
      location: 'Viman Nagar, Pune',
      avatar: '👩‍🔧',
      certifications: ['Microsoft Certified'],
      skills: ['Virus Removal', 'OS Installation', 'Data Backup']
    },
  ]);

  const formatRating = (rating) => {
    return rating.toFixed(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'busy': return '#f59e0b';
      case 'offline': return '#6b7280';
      default: return 'var(--muted)';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available': return '🟢 Available';
      case 'busy': return '🟡 Busy';
      case 'offline': return '⚫ Offline';
      default: return status;
    }
  };

  const availableTechs = technicians.filter(t => t.status === 'available');
  const busyTechs = technicians.filter(t => t.status === 'busy');
  const averageRating = (technicians.reduce((sum, t) => sum + t.rating, 0) / technicians.length).toFixed(1);
  const totalJobs = technicians.reduce((sum, t) => sum + t.totalJobs, 0);
  const activeJobs = technicians.reduce((sum, t) => sum + t.activeJobs, 0);

  return (
    <div className="technicians-management">
      <div className="technicians-header">
        <div>
          <h1>👷 Technicians Management</h1>
          <p className="technicians-subtitle">Manage technician availability, assignments, and performance</p>
        </div>
        <button className="btn-add-technician">
          <Plus size={20} />
          Add Technician
        </button>
      </div>

      <div className="technicians-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-details">
            <h3>{availableTechs.length}</h3>
            <p>Available Now</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div className="stat-details">
            <h3>{busyTechs.length}</h3>
            <p>Currently Busy</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
            <Star size={24} />
          </div>
          <div className="stat-details">
            <h3>{averageRating} ⭐</h3>
            <p>Average Rating</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(var(--primary-rgb), 0.2)', color: 'var(--primary)' }}>
            <UserPlus size={24} />
          </div>
          <div className="stat-details">
            <h3>{technicians.length}</h3>
            <p>Total Technicians</p>
          </div>
        </div>
      </div>

      <div className="technicians-grid">
        {technicians.map((tech) => (
          <div key={tech.id} className={`technician-card ${tech.status}`}>
            <div className="technician-card-header">
              <div className="tech-avatar-section">
                <div className="tech-avatar">{tech.avatar}</div>
                <div className="tech-status-badge" style={{ background: getStatusColor(tech.status) }}>
                  {getStatusLabel(tech.status)}
                </div>
              </div>
              <div className="tech-actions">
                <button className="action-btn edit" title="Edit Technician">
                  <Edit size={16} />
                </button>
                <button className="action-btn delete" title="Delete Technician">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="technician-card-body">
              <h3>{tech.name}</h3>
              <p className="tech-id">{tech.id}</p>

              <div className="tech-rating">
                <Star size={18} fill="#fbbf24" stroke="#fbbf24" />
                <span className="rating-value">{formatRating(tech.rating)}</span>
                <span className="rating-jobs">({tech.totalJobs} jobs)</span>
              </div>

              <div className="tech-info">
                <div className="info-item">
                  <Mail size={14} />
                  <span>{tech.email}</span>
                </div>
                <div className="info-item">
                  <Phone size={14} />
                  <span>{tech.phone}</span>
                </div>
                <div className="info-item">
                  <MapPin size={14} />
                  <span>{tech.location}</span>
                </div>
                <div className="info-item">
                  <Calendar size={14} />
                  <span>{tech.availability}</span>
                </div>
              </div>

              <div className="tech-specialization">
                <h4>Specialization</h4>
                <div className="specialization-tags">
                  {tech.specialization.map((spec, idx) => (
                    <span key={idx} className="tag">{spec}</span>
                  ))}
                </div>
              </div>

              <div className="tech-skills">
                <h4>Skills</h4>
                <div className="skills-list">
                  {tech.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="skill-badge">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="tech-certifications">
                <h4>Certifications</h4>
                <div className="certifications-list">
                  {tech.certifications.map((cert, idx) => (
                    <span key={idx} className="cert-badge">✓ {cert}</span>
                  ))}
                </div>
              </div>

              <div className="tech-stats">
                <div className="stat-item">
                  <span className="stat-label">Experience</span>
                  <span className="stat-value">{tech.experience}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Active Jobs</span>
                  <span className="stat-value" style={{ color: tech.activeJobs > 0 ? '#f59e0b' : '#10b981' }}>
                    {tech.activeJobs}
                  </span>
                </div>
              </div>

              <button className="btn-assign">
                <UserPlus size={16} />
                Assign to Job
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="technicians-summary">
        <h3>Performance Summary</h3>
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-icon">📊</div>
            <div className="summary-content">
              <h4>{totalJobs.toLocaleString()}</h4>
              <p>Total Jobs Completed</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">🔧</div>
            <div className="summary-content">
              <h4>{activeJobs}</h4>
              <p>Jobs In Progress</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">⭐</div>
            <div className="summary-content">
              <h4>{averageRating}/5.0</h4>
              <p>Team Average Rating</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">🎯</div>
            <div className="summary-content">
              <h4>{((totalJobs / technicians.length).toFixed(0))}</h4>
              <p>Avg Jobs per Technician</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechniciansManagement;
