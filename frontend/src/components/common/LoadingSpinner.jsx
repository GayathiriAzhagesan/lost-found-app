import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading...', size = 28 }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      color: 'var(--slate-500)',
      gap: '0.75rem',
    }}>
      <Loader2
        size={size}
        color="var(--primary-600)"
        style={{ animation: 'spin 1s linear infinite' }}
      />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{message}</span>
    </div>
  );
};

export default LoadingSpinner;
