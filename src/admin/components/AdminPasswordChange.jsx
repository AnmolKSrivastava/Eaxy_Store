import React, { useState } from 'react';
import { Lock, CheckCircle } from 'lucide-react';
import { changeAdminPassword } from '../../firebase/authService';
import { logActivity } from '../../firebase/activityLogger';
import { useAdmin } from '../../contexts/AdminContext';

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  padding: '0.7rem 0.85rem 0.7rem 2.4rem',
  color: 'var(--foreground)',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'var(--muted)',
  marginBottom: 4,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

function PasswordField({ label, value, onChange, autoComplete, disabled }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <Lock size={16} style={{
          position: 'absolute', left: 10, top: '50%',
          transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none'
        }} />
        <input
          type="password"
          value={value}
          onChange={onChange}
          onInput={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          required
          style={inputStyle}
        />
      </div>
    </div>
  );
}

function AdminPasswordChange() {
  const { adminSession } = useAdmin();
  const [current, setCurrent] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPw.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (newPw !== confirm) { setError('Passwords do not match.'); return; }
    try {
      setLoading(true);
      setError('');
      await changeAdminPassword(current, newPw);
      await logActivity('password_changed', 'Admin changed their password', adminSession?.email);
      setDone(true);
      setCurrent(''); setNewPw(''); setConfirm('');
      setTimeout(() => setDone(false), 4000);
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Current password is incorrect.');
      } else {
        setError(err.message || 'Failed to change password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 460 }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '1.25rem' }}>
        Change Password
      </h3>

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 8, padding: '0.7rem 1rem', color: '#f87171',
          fontSize: '0.85rem', marginBottom: '1rem'
        }}>{error}</div>
      )}

      {done && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(15,107,83,0.15)', border: '1px solid rgba(15,107,83,0.3)',
          borderRadius: 8, padding: '0.7rem 1rem', color: '#6ee7b7',
          fontSize: '0.85rem', marginBottom: '1rem'
        }}>
          <CheckCircle size={16} /> Password updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <PasswordField
          label="Current Password"
          value={current}
          onChange={e => setCurrent(e.target.value)}
          autoComplete="current-password"
          disabled={loading}
        />
        <PasswordField
          label="New Password"
          value={newPw}
          onChange={e => setNewPw(e.target.value)}
          autoComplete="new-password"
          disabled={loading}
        />
        <PasswordField
          label="Confirm New Password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          autoComplete="new-password"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            background: 'var(--primary, #0f6b53)', color: '#fff', border: 'none',
            borderRadius: 10, padding: '0.75rem', fontWeight: 600, fontSize: '0.95rem',
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
            marginTop: '0.25rem'
          }}
        >
          {loading ? 'Updatingâ€¦' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

export default AdminPasswordChange;
