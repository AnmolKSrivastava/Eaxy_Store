import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import RepairServicesPage from './pages/RepairServicesPage';
import ContactPage from './pages/ContactPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import AdminDashboardPage from './admin/AdminDashboardPage';
import AdminLogin from './admin/pages/AdminLogin';
import AdminForgotPassword from './admin/pages/AdminForgotPassword';
import AdminResetPassword from './admin/pages/AdminResetPassword';
import AdminPasswordSetup from './admin/pages/AdminPasswordSetup';
import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute';
import { Chatbot } from './components/shared';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      <Routes>
        {/* User-facing routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/repair-services" element={<RepairServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Admin public auth routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />
        <Route path="/admin/setup" element={<AdminPasswordSetup />} />

        {/* Protected admin dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardPage />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
      {!isAdminPage && <Chatbot />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <AppContent />
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
