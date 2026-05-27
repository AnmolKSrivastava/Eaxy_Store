import React, { useState } from 'react';
import AdminTopBar from './components/AdminTopBar';
import AdminSidebar from './components/AdminSidebar';
import DashboardOverview from './components/DashboardOverview';
import OrderManagement from './components/OrderManagement';
import ProductManagement from './components/ProductManagement';
import CategoriesManagement from './components/CategoriesManagement';
import DealsManagement from './components/DealsManagement';
import RepairCatalog from './components/RepairCatalog';
import TechniciansManagement from './components/TechniciansManagement';
import CustomerManagement from './components/CustomerManagement';
import CoverageManagement from './components/CoverageManagement';
import ContentManagement from './components/ContentManagement';
import AdminManagement from './components/AdminManagement';
import AdminPasswordChange from './components/AdminPasswordChange';
import ActivityLogs from './components/ActivityLogs';
import { useAdmin } from '../contexts/AdminContext';
import './AdminDashboard.css';
import './components/AdminManagement.css';

function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [orderTab, setOrderTab] = useState('products');
  const [productView, setProductView] = useState('inventory');
  const [serviceView, setServiceView] = useState('catalog');
  const [settingsView, setSettingsView] = useState('password');
  const { hasPermission } = useAdmin();

  const Denied = () => (
    <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
      <p>You don't have permission to view this section.</p>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return hasPermission('dashboard') ? <DashboardOverview /> : <Denied />;
      case 'orders':
        return hasPermission('orders')
          ? <OrderManagement activeTab={orderTab} setActiveTab={setOrderTab} />
          : <Denied />;
      case 'products':
        if (!hasPermission('products')) return <Denied />;
        switch (productView) {
          case 'inventory':   return <ProductManagement />;
          case 'categories':  return <CategoriesManagement />;
          case 'deals':       return <DealsManagement />;
          default:            return <ProductManagement />;
        }
      case 'services':
        if (!hasPermission('products')) return <Denied />;
        switch (serviceView) {
          case 'catalog':     return <RepairCatalog />;
          case 'technicians': return <TechniciansManagement />;
          default:            return <RepairCatalog />;
        }
      case 'customers':
        return hasPermission('users') ? <CustomerManagement /> : <Denied />;
      case 'logistics':
        return hasPermission('products') ? <CoverageManagement /> : <Denied />;
      case 'content':
        return hasPermission('products') ? <ContentManagement /> : <Denied />;
      case 'activity_logs':
        return hasPermission('activity_logs') ? <ActivityLogs /> : <Denied />;
      case 'settings':
        if (!hasPermission('settings')) return <Denied />;
        return (
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '1.5rem' }}>Settings</h2>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {hasPermission('password_change') && (
                <button
                  onClick={() => setSettingsView('password')}
                  style={{
                    padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                    background: settingsView === 'password' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    color: 'var(--foreground)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600
                  }}
                >
                  Change Password
                </button>
              )}
              {hasPermission('admin_management') && (
                <button
                  onClick={() => setSettingsView('admins')}
                  style={{
                    padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                    background: settingsView === 'admins' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    color: 'var(--foreground)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600
                  }}
                >
                  Admin Management
                </button>
              )}
            </div>
            {settingsView === 'password' && hasPermission('password_change') && <AdminPasswordChange />}
            {settingsView === 'admins' && hasPermission('admin_management') && <AdminManagement />}
          </div>
        );
      case 'reports':
        return hasPermission('analytics') ? (
          <div style={{ padding: '2rem' }}>
            <h1>Reports &amp; Analytics</h1>
            <p style={{ color: '#9ca3af' }}>Sales reports and performance metrics.</p>
          </div>
        ) : <Denied />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        setOrderTab={setOrderTab}
        orderTab={orderTab}
        setProductView={setProductView}
        productView={productView}
        setServiceView={setServiceView}
        serviceView={serviceView}
      />
      <div className="admin-main">
        <AdminTopBar />
        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
