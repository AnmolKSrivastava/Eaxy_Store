import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, LogOut, Mail, Shield } from 'lucide-react';
import BrandName from '../../components/shared/BrandName';
import { useAdmin } from '../../contexts/AdminContext';
import { useAuth } from '../../contexts/AuthContext';

function AdminTopBar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { adminSession, adminRole } = useAdmin();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        setLoggingOut(true);
        await logout();
        navigate('/admin/login');
      } catch (error) {
        console.error('Logout error:', error);
        alert('Failed to logout. Please try again.');
      } finally {
        setLoggingOut(false);
      }
    }
  };

  const getDisplayName = () => {
    if (adminSession?.displayName) return adminSession.displayName;
    if (adminSession?.email) return adminSession.email.split('@')[0];
    return 'Admin';
  };

  const getRoleBadge = () => {
    const colors = { superadmin: '#d4af37', admin: '#6ee7b7', viewer: '#9ca3af' };
    const labels = { superadmin: 'Super Admin', admin: 'Admin', viewer: 'Viewer' };
    return { color: colors[adminRole] || '#9ca3af', label: labels[adminRole] || adminRole };
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="admin-topbar">
      <div className="admin-topbar-brand">
        <BrandName /> <span className="admin-badge">Admin</span>
      </div>
      
      <div className="admin-search">
        <Search size={18} />
        <input type="text" placeholder="Search orders, products, customers..." />
      </div>

      <div className="admin-topbar-actions">
        <button className="admin-icon-btn" title="Notifications">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        
        <div className="user-menu-wrapper">
          <button
            className="admin-icon-btn user-btn"
            title={getDisplayName()}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            {adminSession?.photoURL ? (
              <img src={adminSession.photoURL} alt="Profile" className="user-avatar" />
            ) : (
              <User size={20} />
            )}
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-info">
                <div className="user-avatar-large">
                  {adminSession?.photoURL ? (
                    <img src={adminSession.photoURL} alt="Profile" />
                  ) : (
                    <Shield size={28} color={roleBadge.color} />
                  )}
                </div>
                <div className="user-details">
                  <p className="user-name">{getDisplayName()}</p>
                  <p className="user-identifier">
                    <Mail size={14} />
                    <span>{adminSession?.email || '—'}</span>
                  </p>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: roleBadge.color }}>
                    {roleBadge.label}
                  </span>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={handleLogout} disabled={loggingOut}>
                <LogOut size={16} />
                <span>{loggingOut ? 'Logging out…' : 'Logout'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminTopBar;
