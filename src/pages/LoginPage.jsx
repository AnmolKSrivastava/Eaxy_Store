import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const { signInWithEmail, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

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
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-section">
              <LogIn size={48} className="logo-icon" />
              <h1>Eaxy Store</h1>
              <p>Admin Dashboard</p>
            </div>
          </div>

          <div className="login-body">
            <h2>Welcome Back</h2>
            <p className="subtitle">Sign in to access your admin dashboard</p>

            {(authError || error) && (
              <div className="error-alert">
                <span>⚠️</span>
                <p>{authError || error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    id="email"
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
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    id="password"
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
                    disabled={loading}
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
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>Secure authentication powered by Firebase</p>
            </div>
          </div>
        </div>

        <div className="login-info">
          <div className="info-card">
            <h3>🚀 Fast Delivery</h3>
            <p>4-hour delivery guarantee across Pune & PCMC</p>
          </div>
          <div className="info-card">
            <h3>🛠️ Expert Service</h3>
            <p>Professional repair services for all tech products</p>
          </div>
          <div className="info-card">
            <h3>📊 Powerful Dashboard</h3>
            <p>Manage orders, products, services, and more</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
