import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import notificationService from '../../services/notificationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Bell, CheckCheck, CheckCircle2, ShieldAlert, Sparkles, Clock } from 'lucide-react';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshUnreadCount, addToast } = useApp();

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (err) {
      addToast('Error fetching notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const res = await notificationService.markAllAsRead();
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        refreshUnreadCount();
        addToast('All notifications marked as read', 'success');
      }
    } catch (err) {
      addToast('Error marking as read', 'error');
    }
  };

  const handleMarkSingleRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      refreshUnreadCount();
    } catch (err) {
      // ignore
    }
  };

  if (loading) return <LoadingSpinner message="Checking notifications..." />;

  const unreadExist = notifications.some((n) => !n.isRead);

  const getIcon = (type) => {
    switch (type) {
      case 'claim_approved':
        return <CheckCircle2 size={20} color="#10b981" />;
      case 'new_claim':
        return <ShieldAlert size={20} color="#f59e0b" />;
      case 'claim_rejected':
        return <Bell size={20} color="#ef4444" />;
      default:
        return <Sparkles size={20} color="#6366f1" />;
    }
  };

  return (
    <div className="container" style={{ maxWidth: '780px', padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Notifications</h1>
          <p style={{ color: 'var(--slate-500)' }}>Stay updated on claims and items reported on campus</p>
        </div>

        {unreadExist && (
          <button onClick={handleMarkAllRead} className="btn btn-secondary btn-sm">
            <CheckCheck size={16} /> Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="You don't have any notifications right now."
          icon={Bell}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => !notif.isRead && handleMarkSingleRead(notif._id)}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1.25rem',
                backgroundColor: notif.isRead ? '#ffffff' : '#f8faff',
                borderColor: notif.isRead ? 'var(--border-subtle)' : 'var(--primary-300)',
                cursor: notif.isRead ? 'default' : 'pointer',
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: notif.isRead ? 'var(--slate-100)' : 'var(--primary-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {getIcon(notif.type)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '0.9375rem', color: 'var(--slate-900)' }}>{notif.title}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', margin: 0 }}>
                  {notif.message}
                </p>

                {notif.relatedItem && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <Link to={`/items/${notif.relatedItem}`} className="btn btn-outline btn-sm" style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem' }}>
                      View Related Item
                    </Link>
                  </div>
                )}
              </div>

              {!notif.isRead && (
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary-600)', flexShrink: 0, marginTop: '6px' }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
