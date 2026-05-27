import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Shield } from 'lucide-react';
import { sendAdminPasswordResetEmail } from '../../firebase/authService';
import './AdminAuth.css';

function AdminForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email.'); return; }
    try {
      setLoading(true);
      setError('');
      await sendAdminPasswordResetEmail(email.trim());
      setSent(true);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        // Don't reveal if email exists
        setSent(true);
      } else {
        setError(err.message || 'Failed to send reset email.');
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
          <h1>Reset Password</h1>
          <p>Enter your admin email to receive a reset link</p>
        </div>

        {error && <div className="admin-auth-error">{error}</div>}
        {sent && (
          <div className="admin-auth-success">
            If that email is registered, a reset link has been sent. Check your inbox.
          </div>
        )}

        {!sent && (
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
                  disabled={loading}
                  required
                />
              </div>
            </div>
            <button type="submit" className="admin-auth-submit" disabled={loading}>
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="admin-auth-footer">
          <Link to="/admin/login">← Back to login</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminForgotPassword;
