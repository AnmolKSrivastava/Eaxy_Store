import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Activity } from 'lucide-react';
import { fetchActivityLogs } from '../../firebase/activityLogger';

const ACTION_COLORS = {
  admin_added: '#6ee7b7',
  admin_removed: '#f87171',
  admin_role_updated: '#d4af37',
  password_changed: '#93c5fd',
};

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchActivityLogs(100);
      setLogs(data);
    } catch (err) {
      setError('Failed to load activity logs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const formatTime = (ts) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleString();
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: 'var(--foreground)' }}>
          Activity Logs
        </h2>
        <button
          onClick={load}
          disabled={loading}
          style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '6px 8px', color: 'var(--muted)', cursor: 'pointer'
          }}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '0.7rem 1rem', color: '#f87171', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading logs…</p>
      ) : logs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
          <Activity size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
          <p>No activity logged yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {logs.map(log => (
            <div key={log.id} style={{
              background: 'var(--card, #1a1f2b)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10, padding: '0.85rem 1.1rem',
              display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem', alignItems: 'start'
            }}>
              <div>
                <span style={{
                  display: 'inline-block', fontSize: '0.75rem', fontWeight: 700,
                  color: ACTION_COLORS[log.action] || '#9ca3af',
                  background: `${ACTION_COLORS[log.action] || '#9ca3af'}18`,
                  borderRadius: 5, padding: '2px 8px', marginBottom: '0.3rem'
                }}>
                  {log.action?.replace(/_/g, ' ').toUpperCase()}
                </span>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--foreground)' }}>{log.details}</p>
                <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: 'var(--muted)' }}>
                  by {log.adminEmail || '—'}
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                {formatTime(log.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityLogs;
