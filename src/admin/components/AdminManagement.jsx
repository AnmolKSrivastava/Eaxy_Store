import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, Trash2, RefreshCw, Shield, User } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import {
  fetchAllAdmins, removeAdmin, updateAdminRole, ROLES
} from '../../firebase/adminService';
import { sendAdminInviteViaCloudFunction } from '../../firebase/cloudFunctionsService';
import { sendAdminPasswordResetEmail } from '../../firebase/authService';
import { logActivity } from '../../firebase/activityLogger';

const ROLE_LABELS = { 
  super_admin: 'Super Admin', 
  admin: 'Admin', 
  order_manager: 'Order Manager'
};
const ROLE_COLORS = { 
  super_admin: '#d4af37', 
  admin: '#6ee7b7', 
  order_manager: '#3b82f6'
};

function AdminManagement() {
  const { adminSession, isSuperAdmin } = useAdmin();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('admin');
  const [adding, setAdding] = useState(false);

  const loadAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const list = await fetchAllAdmins();
      setAdmins(list.sort((a, b) => {
        const order = { super_admin: 0, admin: 1, order_manager: 2 };
        return (order[a.role] ?? 4) - (order[b.role] ?? 4);
      }));
    } catch (err) {
      setError('Failed to load admins.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAdmins(); }, [loadAdmins]);

  const flash = (type, msg) => {
    if (type === 'success') { setSuccess(msg); setTimeout(() => setSuccess(''), 4000); }
    else { setError(msg); setTimeout(() => setError(''), 5000); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    try {
      setAdding(true);
      const targetEmail = newEmail.trim();
      console.log('[AdminInvite] Step 1: Starting invite for', targetEmail, 'role:', newRole);
      
      // Step 1: Call Cloud Function to create Firebase Auth user + Firestore admin document
      const cloudResult = await sendAdminInviteViaCloudFunction(
        targetEmail, 
        newRole,
        targetEmail.split('@')[0]
      );
      console.log('[AdminInvite] Step 1 complete: Cloud Function response =', cloudResult);

      // Step 2: Now that the user exists in Firebase Auth, send the password reset email
      console.log('[AdminInvite] Step 2: Sending password reset email to', targetEmail);
      await sendAdminPasswordResetEmail(targetEmail);
      console.log('[AdminInvite] Step 2 complete: Password reset email sent successfully to', targetEmail);
      
      flash('success', `Invite sent to ${targetEmail}. They'll receive a password setup email shortly.`);
      setNewEmail('');
      setNewRole('admin');
      loadAdmins();
    } catch (err) {
      console.error('[AdminInvite] ERROR:', err.code || '(no code)', err.message, err);
      flash('error', err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (email) => {
    if (!window.confirm(`Remove admin access for ${email}?`)) return;
    try {
      await removeAdmin(email, adminSession.email);
      await logActivity('admin_removed', `Removed ${email}`, adminSession.email);
      flash('success', `${email} has been removed.`);
      loadAdmins();
    } catch (err) {
      flash('error', err.message);
    }
  };

  const handleRoleChange = async (email, newRoleVal) => {
    try {
      await updateAdminRole(email, newRoleVal);
      await logActivity('admin_role_updated', `Changed ${email} role to ${newRoleVal}`, adminSession.email);
      flash('success', `Role updated for ${email}.`);
      loadAdmins();
    } catch (err) {
      flash('error', err.message);
    }
  };

  if (!isSuperAdmin()) {
    return (
      <div style={{ padding: '2rem', color: '#9ca3af', textAlign: 'center' }}>
        <Shield size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
        <p>Super admin access required to manage admins.</p>
      </div>
    );
  }

  return (
    <div className="admin-management">
      <div className="am-header">
        <h2>Admin Management</h2>
        <button className="am-refresh" onClick={loadAdmins} disabled={loading}>
          <RefreshCw size={16} />
        </button>
      </div>

      {error && <div className="am-alert error">{error}</div>}
      {success && <div className="am-alert success">{success}</div>}

      {/* Add Admin */}
      <div className="am-card">
        <h3><UserPlus size={16} /> Invite New Admin</h3>
        <form className="am-add-form" onSubmit={handleAdd}>
          <input
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            placeholder="admin@example.com"
            disabled={adding}
            required
          />
          <select value={newRole} onChange={e => setNewRole(e.target.value)} disabled={adding}>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="order_manager">Order Manager</option>
          </select>
          <button type="submit" disabled={adding || !newEmail}>
            {adding ? 'Sending…' : 'Send Invite'}
          </button>
        </form>
        <p className="am-hint">
          An email will be sent with a link to set up their password.
        </p>
      </div>

      {/* Admin List */}
      <div className="am-card">
        <h3><User size={16} /> All Admins ({admins.length})</h3>
        {loading ? (
          <p style={{ color: '#9ca3af', padding: '1rem 0' }}>Loading…</p>
        ) : (
          <div className="am-list">
            {admins.map(admin => (
              <div key={admin.email} className="am-row">
                <div className="am-row-info">
                  <div className="am-avatar" style={{ 
                    background: ROLE_COLORS[admin.role] + '33',
                    color: ROLE_COLORS[admin.role]
                  }}>
                    {admin.role === 'super_admin' ? <Shield size={16} /> : <User size={16} />}
                  </div>
                  <div>
                    <p className="am-email">{admin.email}</p>
                    <p className="am-added">
                      Added {admin.addedAt ? new Date(admin.addedAt).toLocaleDateString() : '—'}
                      {admin.addedBy ? ` by ${admin.addedBy}` : ''}
                    </p>
                  </div>
                </div>

                <div className="am-row-actions">
                  {admin.role !== 'super_admin' ? (
                    <select
                      value={admin.role}
                      onChange={e => handleRoleChange(admin.email, e.target.value)}
                      className="am-role-select"
                      style={{ borderColor: ROLE_COLORS[admin.role] }}
                    >
                      {Object.entries(ROLES).map(([k, v]) => (
                        <option key={k} value={v}>{ROLE_LABELS[v]}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="am-role-badge" style={{ color: ROLE_COLORS[admin.role] }}>
                      🔒 {ROLE_LABELS[admin.role]}
                    </span>
                  )}

                  {admin.role !== 'super_admin' && admin.email !== adminSession?.email && (
                    <button className="am-remove-btn" onClick={() => handleRemove(admin.email)} title="Remove admin">
                      <Trash2 size={14} />
                    </button>
                  )}
                  {admin.role === 'super_admin' && (
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '0.5rem' }}>
                      (Protected)
                    </span>
                  )}
                  {admin.email === adminSession?.email && (
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>(you)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminManagement;
