import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';

function ProtectedAdminRoute({ children }) {
  const { loadingAdminData, isAdminUser } = useAdmin();

  if (loadingAdminData) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#0f1115', flexDirection: 'column', gap: '1rem'
      }}>
        <div style={{
          width: 40, height: 40, border: '3px solid rgba(212,175,55,0.2)',
          borderTopColor: '#d4af37', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Verifying access…</p>
      </div>
    );
  }

  if (!isAdminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;
