import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLoginModal.css';

function AdminLoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { signInWithEmail, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setAuthError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      setAuthError(null);
      await signInWithEmail(email, password);
      onClose();
      navigate('/admin');
    } catch (error) {
      console.error('Login Error:', error);
      if (error.code === 'auth/invalid-credential') {
        setAuthError('Invalid email or password');
      } else if (error.code === 'auth/user-not-found') {
        setAuthError('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        setAuthError('Incorrect password');
      } else if (error.code === 'auth/too-many-requests') {
        setAuthError('Too many failed attempts. Please try again later.');
      } else {
        setAuthError(error.message || 'Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-overlay" onClick={onClose}>
      <div className="admin-login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <div className="shield-icon">
            <Shield size={40} />
          </div>
          <h2>Admin Access</h2>
          <p>Sign in to manage Eaxy Store</p>
        </div>

        {(authError || error) && (
          <div className="error-alert">
            <span>⚠️</span>
            <p>{authError || error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="admin-email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@eaxystore.com"
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              <>
                <Lock size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="modal-footer">
          <div className="security-notice">
            <Shield size={14} />
            <span>This is a secure admin area</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginModal;
