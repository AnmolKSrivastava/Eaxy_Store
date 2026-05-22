import React from 'react';
import { Search, Bell, User, LogOut } from 'lucide-react';
import BrandName from '../../components/shared/BrandName';

function AdminTopBar() {
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
        <button className="admin-icon-btn" title="Profile">
          <User size={20} />
        </button>
        <button className="admin-icon-btn logout-btn" title="Logout" onClick={() => window.location.href = '/'}>
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}

export default AdminTopBar;
