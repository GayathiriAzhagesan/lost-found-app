import React from 'react';
import { PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  title = 'No items found',
  description = 'There are currently no items matching your criteria.',
  actionText,
  actionLink,
  onActionClick,
  icon: Icon = PackageSearch,
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '4rem 1.5rem',
      backgroundColor: '#ffffff',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--slate-300)',
      margin: '1.5rem 0',
    }}>
      <div style={{
        backgroundColor: 'var(--primary-50)',
        color: 'var(--primary-600)',
        padding: '1rem',
        borderRadius: '50%',
        marginBottom: '1rem',
      }}>
        <Icon size={36} />
      </div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--slate-800)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--slate-500)', maxWidth: '420px', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
        {description}
      </p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          {actionText}
        </Link>
      )}
      {actionText && onActionClick && !actionLink && (
        <button onClick={onActionClick} className="btn btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
