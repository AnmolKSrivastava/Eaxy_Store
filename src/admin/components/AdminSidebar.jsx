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
import { useAdmin } from '../../contexts/AdminContext';

function AdminSidebar({ activeSection, setActiveSection, setOrderTab, setProductView, setServiceView, setLogisticsView, orderTab = 'products', productView = 'inventory', serviceView = 'catalog', logisticsView = 'map' }) {
  const { hasPermission, isOrderManager } = useAdmin();
  
  // Define menu items with permission requirements
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard' },
    { 
      id: 'orders', 
      label: 'Orders', 
      icon: ShoppingCart, 
      submenu: ['Product Orders', 'Repair Requests'],
      permission: ['orders', 'product_orders', 'repair_requests'], // Show if has any of these
      customSubmenu: true // Handle submenu visibility based on specific permissions
    },
    { id: 'products', label: 'Products', icon: Package, submenu: ['Inventory', 'Categories', 'Deals'], permission: ['products', 'inventory'] },
    { id: 'services', label: 'Services', icon: Wrench, submenu: ['Repair Services', 'Service Categories'], permission: 'services' },
    { id: 'customers', label: 'Customers', icon: Users, permission: 'users' },
    { id: 'content', label: 'Content', icon: FileText, permission: 'products' },
    { id: 'logistics', label: 'Coverage & Logistics', icon: MapPin, submenu: ['Coverage Map', 'Coverage Areas'], permission: ['products', 'services'] },
    { id: 'reports', label: 'Reports', icon: BarChart3, permission: 'analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, permission: ['settings', 'password_change'] },
  ];

  // Filter menu items based on permissions
  const menuItems = allMenuItems.filter(item => {
    if (!item.permission) return true;
    if (Array.isArray(item.permission)) {
      return item.permission.some(p => hasPermission(p));
    }
    return hasPermission(item.permission);
  });

  // Filter submenu for orders based on role
  const getOrdersSubmenu = () => {
    if (isOrderManager()) return ['Product Orders'];
    return ['Product Orders', 'Repair Requests'];
  };

  const getSubmenuActiveIndex = (itemId) => {
    if (itemId === 'orders') {
      return orderTab === 'products' ? 0 : 1;
    } else if (itemId === 'products') {
      const viewMap = ['inventory', 'categories', 'deals'];
      return viewMap.indexOf(productView);
    } else if (itemId === 'services') {
      const viewMap = ['services', 'categories'];
      return viewMap.indexOf(serviceView);
    } else if (itemId === 'logistics') {
      const viewMap = ['map', 'areas'];
      return viewMap.indexOf(logisticsView);
    }
    return -1;
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const displaySubmenu = item.customSubmenu && item.id === 'orders' ? getOrdersSubmenu() : item.submenu;
          
          return (
            <div key={item.id}>
              <button
                className={`admin-menu-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
              {displaySubmenu && activeSection === item.id && (
                <div className="admin-submenu">
                  {displaySubmenu.map((sub, idx) => (
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
                          const viewMap = ['services', 'categories'];
                          setServiceView(viewMap[idx]);
                        } else if (item.id === 'logistics') {
                          // Map submenu items to logistics views
                          const viewMap = ['map', 'areas'];
                          setLogisticsView(viewMap[idx]);
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
