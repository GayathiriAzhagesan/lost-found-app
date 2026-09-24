import React from 'react';
import { Bell, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationItem = ({ notification, onMarkRead }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'claim_approved':
        return <CheckCircle2 size={18} color="#10b981" />;
      case 'new_claim':
        return <ShieldAlert size={18} color="#f59e0b" />;
      default:
        return <Bell size={18} color="#6366f1" />;
    }
  };

  return (
    <div
      onClick={() => !notification.isRead && onMarkRead && onMarkRead(notification._id)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.875rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: notification.isRead ? 'transparent' : 'var(--primary-50)',
        border: '1px solid var(--border-subtle)',
        cursor: notification.isRead ? 'default' : 'pointer',
      }}
    >
      <div style={{ marginTop: '2px' }}>
        {getIcon(notification.type)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--slate-900)' }}>
          {notification.title}
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', margin: '0.2rem 0' }}>
          {notification.message}
        </p>
        {notification.relatedItem && (
          <Link to={`/items/${notification.relatedItem}`} style={{ fontSize: '0.75rem' }}>
            View Item
          </Link>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
