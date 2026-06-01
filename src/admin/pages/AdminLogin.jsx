import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { signInWithEmailPassword } from '../../firebase/authService';
import { isAdmin } from '../../firebase/adminService';
import './AdminAuth.css';

function AdminLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isInvited = searchParams.get('invited') === 'true';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter email and password.'); return; }
    try {
      setLoading(true);
      setError('');
      const user = await signInWithEmailPassword(email.trim(), password);
      const admin = await isAdmin(user.email);
      if (!admin) {
        setError('Access denied. This account does not have admin privileges.');
        return;
      }
      navigate('/admin');
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-card">
        <div className="admin-auth-logo">
          <div className="brand-icon">
            <Shield size={24} color="#fff" />
          </div>
          <h1>Admin Portal</h1>
          <p>Sign in to manage Eaxy Store</p>
        </div>

        {isInvited && (
          <div className="admin-auth-invite-banner">
            🎉 You've been added as an admin to Eaxy Store! Please log in with your new password.
          </div>
        )}
        {error && <div className="admin-auth-error">{error}</div>}

        <form className="admin-auth-form" onSubmit={handleSubmit}>
          <div className="admin-auth-group">
            <label>Email Address</label>
            <div className="admin-input-wrap">
              <Mail size={16} className="field-icon" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="email"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="admin-auth-group">
            <label>Password</label>
            <div className="admin-input-wrap">
              <Lock size={16} className="field-icon" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                required
              />
              <button type="button" className="toggle-pw" onClick={() => setShowPw(p => !p)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="admin-auth-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="admin-auth-footer">
          <Link to="/admin/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
