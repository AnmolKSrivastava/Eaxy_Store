import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';
import { confirmAdminPasswordReset } from '../../firebase/authService';
import './AdminAuth.css';

function AdminResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!oobCode) setError('Invalid or expired reset link.');
  }, [oobCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    try {
      setLoading(true);
      setError('');
      await confirmAdminPasswordReset(oobCode, password);
      setDone(true);
      setTimeout(() => navigate('/admin/login'), 2500);
    } catch (err) {
      if (err.code === 'auth/expired-action-code') {
        setError('This reset link has expired. Please request a new one.');
      } else if (err.code === 'auth/invalid-action-code') {
        setError('Invalid reset link. Please request a new one.');
      } else {
        setError(err.message || 'Failed to reset password.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="admin-auth-page">
        <div className="admin-auth-card" style={{ textAlign: 'center' }}>
          <CheckCircle size={48} color="#6ee7b7" style={{ marginBottom: '1rem' }} />
          <h1 style={{ color: '#f5f7fa', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Password Updated!</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Redirecting to login…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-card">
        <div className="admin-auth-logo">
          <div className="brand-icon">
            <Shield size={24} color="#fff" />
          </div>
          <h1>Set New Password</h1>
          <p>Choose a strong password for your admin account</p>
        </div>

        {error && <div className="admin-auth-error">{error}</div>}

        {oobCode && !error && (
          <form className="admin-auth-form" onSubmit={handleSubmit}>
            <div className="admin-auth-group">
              <label>New Password</label>
              <div className="admin-input-wrap">
                <Lock size={16} className="field-icon" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  disabled={loading}
                  required
                />
                <button type="button" className="toggle-pw" onClick={() => setShowPw(p => !p)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="admin-auth-group">
              <label>Confirm Password</label>
              <div className="admin-input-wrap">
                <Lock size={16} className="field-icon" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <button type="submit" className="admin-auth-submit" disabled={loading}>
              {loading ? 'Updating…' : 'Update Password'}
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

export default AdminResetPassword;
