import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import claimService from '../../services/claimService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Shield, Clock, CheckCircle2, XCircle, Trash2, ArrowRight } from 'lucide-react';

export const MyClaimsPage = () => {
  const { user } = useAuth();
  const { addToast } = useApp();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await claimService.getClaims({ myClaims: 'true' });
        if (res.success) {
          setClaims(res.data);
        }
      } catch (err) {
        addToast('Error retrieving your claims', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [addToast]);

  const handleCancelClaim = async (id) => {
    if (!window.confirm('Cancel this claim?')) return;
    try {
      const res = await claimService.deleteClaim(id);
      if (res.success) {
        addToast('Claim cancelled', 'info');
        setClaims((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      addToast('Error cancelling claim', 'error');
    }
  };

  if (loading) return <LoadingSpinner message="Fetching your submitted claims..." />;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>My Ownership Claims</h1>
        <p style={{ color: 'var(--slate-500)' }}>Track the verification status of claims you have submitted</p>
      </div>

      {claims.length === 0 ? (
        <EmptyState
          title="No claims submitted"
          description="You haven't made any ownership claims yet. If you see an item that belongs to you on the bulletin, you can submit a claim with verification proof."
          actionText="Browse Found Items"
          actionLink="/found-items"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {claims.map((claim) => (
            <div key={claim._id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className={`badge badge-${claim.status}`}>
                      {claim.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                      Submitted {new Date(claim.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem' }}>
                    {claim.itemDetails?.title || 'Campus Item'}
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/items/${claim.item}`} className="btn btn-secondary btn-sm">
                    View Item <ArrowRight size={14} />
                  </Link>
                  {claim.status === 'pending' && (
                    <button
                      onClick={() => handleCancelClaim(claim._id)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--accent-rose)' }}
                      title="Cancel claim"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Message Details */}
              <div style={{ backgroundColor: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.25rem' }}>Your Verification Message:</div>
                <p style={{ color: 'var(--slate-600)', margin: 0 }}>{claim.message}</p>
              </div>

              {/* Status Note */}
              <div style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
                {claim.status === 'pending' && '⏳ Under review by the item finder or campus security.'}
                {claim.status === 'approved' && '✅ Claim Approved! You may pick up the item from the designated campus office.'}
                {claim.status === 'rejected' && '❌ Claim was not accepted. Contact campus security for assistance.'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClaimsPage;
