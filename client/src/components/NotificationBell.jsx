import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Sparkles, Inbox, RefreshCw, X } from 'lucide-react';
import api from '../services/api.js';

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications?limit=8');
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch {
      // silent catch in background
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 45000); // refresh every 45s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, notification) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      setIsOpen(false);
      if (notification.relatedReportId) {
        navigate(`/items/${notification.relatedReportId._id || notification.relatedReportId}`);
      } else {
        navigate('/dashboard');
      }
    } catch {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setLoading(true);
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          padding: '0.5rem',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-main)',
          transition: 'background-color 0.15s ease',
        }}
        aria-label="View notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              backgroundColor: 'var(--status-danger)',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: 700,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #ffffff',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div
          className="card"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '360px',
            maxWidth: '90vw',
            zIndex: 1100,
            boxShadow: 'var(--shadow-xl)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          <div className="card-header" style={{ padding: '0.85rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={16} style={{ color: 'var(--primary-500)' }} />
              <h4 style={{ fontSize: '0.95rem', margin: 0 }}>Notifications</h4>
              {unreadCount > 0 && (
                <span className="badge badge-pending" style={{ fontSize: '0.65rem' }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-500)',
                  fontSize: '0.785rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Inbox size={32} style={{ margin: '0 auto 0.5rem', color: 'var(--text-subtle)' }} />
                <p style={{ fontSize: '0.875rem' }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleMarkAsRead(n._id, n)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: n.isRead ? '#ffffff' : 'var(--primary-50)',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = n.isRead ? '#ffffff' : 'var(--primary-50)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    {n.type === 'match_found' ? (
                      <Sparkles size={14} style={{ color: 'var(--primary-500)', marginTop: '2px', flexShrink: 0 }} />
                    ) : (
                      <Bell size={14} style={{ color: 'var(--accent-teal)', marginTop: '2px', flexShrink: 0 }} />
                    )}
                    <h5 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-900)' }}>
                      {n.title}
                    </h5>
                    {!n.isRead && (
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary-500)',
                          marginLeft: 'auto',
                          flexShrink: 0,
                        }}
                      ></span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>
                    {n.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
