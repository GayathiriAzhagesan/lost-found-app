import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import claimService from '../../../services/claimService';
import { useApp } from '../../../context/AppContext';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { ArrowLeft, CheckCircle2, XCircle, Eye } from 'lucide-react';

export const AdminClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useApp();

  const fetchClaims = async () => {
    try {
      const res = await claimService.getClaims();
      if (res.success) {
        setClaims(res.data);
      }
    } catch (err) {
      addToast('Error retrieving claims', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await claimService.updateClaimStatus(id, { status });
      if (res.success) {
        addToast(`Claim marked as ${status}`, 'success');
        setClaims((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
      }
    } catch (err) {
      addToast('Error updating claim status', 'error');
    }
  };

  if (loading) return <LoadingSpinner message="Retrieving campus claims..." />;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--slate-600)' }}>
        <ArrowLeft size={16} /> Back to Admin Dashboard
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem' }}>Claims Oversight & Resolution</h1>
        <p style={{ color: 'var(--slate-500)' }}>Review and authorize ownership claims submitted by campus members</p>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--slate-600)' }}>
              <th style={{ padding: '1rem' }}>Target Item</th>
              <th style={{ padding: '1rem' }}>Claimant</th>
              <th style={{ padding: '1rem' }}>Verification Details</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>
                    {claim.itemDetails?.title || 'Campus Item'}
                  </div>
                  <Link to={`/items/${claim.item}`} style={{ fontSize: '0.75rem' }}>
                    View Item Page
                  </Link>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 500 }}>{claim.claimant?.name || 'Student'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{claim.claimant?.email}</div>
                </td>
                <td style={{ padding: '1rem', maxWidth: '300px' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--slate-700)', backgroundColor: 'var(--slate-50)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                    {claim.message}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span className={`badge badge-${claim.status}`}>
                    {claim.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  {claim.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleUpdateStatus(claim._id, 'approved')}
                        className="btn btn-outline btn-sm"
                        style={{ borderColor: 'var(--accent-emerald)', color: 'var(--accent-emerald)' }}
                        title="Approve Claim"
                      >
                        <CheckCircle2 size={14} /> Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(claim._id, 'rejected')}
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--accent-rose)' }}
                        title="Reject Claim"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Resolved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminClaimsPage;
