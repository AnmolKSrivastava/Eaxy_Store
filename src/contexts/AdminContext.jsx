import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { isAdmin, getAdminData, PERMISSIONS } from '../firebase/adminService';

const AdminContext = createContext();

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

export function AdminProvider({ children }) {
  const [adminSession, setAdminSession] = useState(null);   // Firebase user object
  const [adminRole, setAdminRole] = useState(null);          // 'superadmin' | 'admin' | 'viewer'
  const [adminPermissions, setAdminPermissions] = useState([]);
  const [loadingAdminData, setLoadingAdminData] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        try {
          const adminExists = await isAdmin(user.email);
          if (adminExists) {
            const data = await getAdminData(user.email);
            const role = data?.role || 'admin';
            setAdminSession(user);
            setAdminRole(role);
            setAdminPermissions(PERMISSIONS[role] || []);
            setIsAdminUser(true);
          } else {
            resetAdminState();
          }
        } catch (err) {
          console.error('AdminContext: admin check failed', err);
          resetAdminState();
        }
      } else {
        resetAdminState();
      }
      setLoadingAdminData(false);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetAdminState() {
    setAdminSession(null);
    setAdminRole(null);
    setAdminPermissions([]);
    setIsAdminUser(false);
  }

  const hasPermission = (permission) => adminPermissions.includes(permission);
  const isSuperAdmin = () => adminRole === 'superadmin';

  const value = {
    adminSession,
    adminRole,
    adminPermissions,
    loadingAdminData,
    isAdminUser,
    hasPermission,
    isSuperAdmin,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}
