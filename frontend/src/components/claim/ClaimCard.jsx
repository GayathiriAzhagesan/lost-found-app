import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, ArrowRight } from 'lucide-react';

export const ClaimCard = ({ claim, onStatusChange, isAdmin = false }) => {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <span className={`badge badge-${claim.status}`} style={{ marginBottom: '0.35rem' }}>
            {claim.status}
          </span>
          <h4 style={{ fontSize: '1.1rem', margin: 0 }}>
            {claim.itemDetails?.title || 'Reported Item'}
          </h4>
        </div>
        <Link to={`/items/${claim.item}`} className="btn btn-outline btn-sm">
          View Item <ArrowRight size={13} />
        </Link>
      </div>

      <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', color: 'var(--slate-700)', marginBottom: '0.75rem' }}>
        <strong>Claim Proof Note:</strong> {claim.message}
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
        Claimant: {claim.claimant?.name} ({claim.claimant?.email})
      </div>
    </div>
  );
};

export default ClaimCard;
