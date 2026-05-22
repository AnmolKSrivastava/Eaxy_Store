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
import './AdminDashboard.css';

function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [orderTab, setOrderTab] = useState('products');
  const [productView, setProductView] = useState('inventory');
  const [serviceView, setServiceView] = useState('catalog');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'orders':
        return <OrderManagement activeTab={orderTab} setActiveTab={setOrderTab} />;
      case 'products':
        switch (productView) {
          case 'inventory':
            return <ProductManagement />;
          case 'categories':
            return <CategoriesManagement />;
          case 'deals':
            return <DealsManagement />;
          default:
            return <ProductManagement />;
        }
      case 'services':
        switch (serviceView) {
          case 'catalog':
            return <RepairCatalog />;
          case 'technicians':
            return <TechniciansManagement />;
          default:
            return <RepairCatalog />;
        }
      case 'customers':
        return <CustomerManagement />;
      case 'logistics':
        return <CoverageManagement />;
      case 'content':
        return <ContentManagement />;
      case 'reports':
        return (
          <div>
            <h1>Reports & Analytics</h1>
            <p>Sales reports and performance metrics.</p>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h1>Settings</h1>
            <p>System configuration and preferences.</p>
          </div>
        );
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
