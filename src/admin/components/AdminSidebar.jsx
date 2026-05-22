import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Wrench, 
  Users, 
  MapPin, 
  FileText, 
  BarChart3, 
  Settings 
} from 'lucide-react';

function AdminSidebar({ activeSection, setActiveSection, setOrderTab, setProductView, setServiceView, orderTab = 'products', productView = 'inventory', serviceView = 'catalog' }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, submenu: ['Product Orders', 'Repair Requests'] },
    { id: 'products', label: 'Products', icon: Package, submenu: ['Inventory', 'Categories', 'Deals'] },
    { id: 'services', label: 'Services', icon: Wrench, submenu: ['Repair Catalog', 'Technicians'] },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'logistics', label: 'Coverage & Logistics', icon: MapPin },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getSubmenuActiveIndex = (itemId) => {
    if (itemId === 'orders') {
      return orderTab === 'products' ? 0 : 1;
    } else if (itemId === 'products') {
      const viewMap = ['inventory', 'categories', 'deals'];
      return viewMap.indexOf(productView);
    } else if (itemId === 'services') {
      const viewMap = ['catalog', 'technicians'];
      return viewMap.indexOf(serviceView);
    }
    return -1;
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id}>
              <button
                className={`admin-menu-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
              {item.submenu && activeSection === item.id && (
                <div className="admin-submenu">
                  {item.submenu.map((sub, idx) => (
                    <button 
                      key={idx} 
                      className={`admin-submenu-item ${getSubmenuActiveIndex(item.id) === idx ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.id === 'orders') {
                          setOrderTab(idx === 0 ? 'products' : 'repairs');
                        } else if (item.id === 'products') {
                          // Map submenu items to product views
                          const viewMap = ['inventory', 'categories', 'deals'];
                          setProductView(viewMap[idx]);
                        } else if (item.id === 'services') {
                          // Map submenu items to service views
                          const viewMap = ['catalog', 'technicians'];
                          setServiceView(viewMap[idx]);
                        }
                      }}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminSidebar;
