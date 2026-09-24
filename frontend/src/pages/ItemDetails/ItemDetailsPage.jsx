import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import itemService from '../../services/itemService';
import claimService from '../../services/claimService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { MapPin, Calendar, Clock, User, Shield, Check, AlertCircle, ArrowLeft, Send } from 'lucide-react';

export const ItemDetailsPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await itemService.getItemById(id);
        if (res.success) {
          setItem(res.data);
        }
      } catch (err) {
        addToast('Item not found', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, addToast]);

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please login to submit a claim', 'error');
      navigate('/login', { state: { from: { pathname: `/items/${id}` } } });
      return;
    }

    if (!claimMessage.trim()) {
      addToast('Please provide details verifying your ownership', 'error');
      return;
    }

    setClaimLoading(true);
    try {
      const res = await claimService.createClaim({
        itemId: item._id,
        message: claimMessage.trim(),
      });
      if (res.success) {
        addToast('Claim submitted successfully! The reporter will review it.', 'success');
        setClaimModalOpen(false);
        setClaimMessage('');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error submitting claim', 'error');
    } finally {
      setClaimLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading item details..." />;
  if (!item) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Item not found</h2>
        <Link to="/lost-items" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Listings
        </Link>
      </div>
    );
  }

  const isOwner = user && item.reporter && item.reporter._id === user._id;
  const isLost = item.type === 'lost';

  return (
    <div className="container" style={{ maxWidth: '960px', padding: '2.5rem 1.5rem' }}>
      <Link to={isLost ? '/lost-items' : '/found-items'} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--slate-600)' }}>
        <ArrowLeft size={16} /> Back to {isLost ? 'Lost' : 'Found'} Bulletin
      </Link>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {/* Image */}
          <div style={{ backgroundColor: 'var(--slate-100)', position: 'relative', minHeight: '320px' }}>
            <img
              src={item.image || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'}
              alt={item.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
              <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`} style={{ padding: '0.375rem 0.875rem', fontSize: '0.875rem' }}>
                {isLost ? 'Lost Item' : 'Found Item'}
              </span>
            </div>
          </div>

          {/* Details */}
          <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-600)', textTransform: 'uppercase' }}>
                {item.category}
              </span>
              <span className={`badge badge-${item.status}`}>
                {item.status}
              </span>
            </div>

            <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--slate-900)' }}>
              {item.title}
            </h1>

            <p style={{ color: 'var(--slate-600)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {item.description}
            </p>

            {item.additionalDetails && (
              <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.875rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--slate-700)' }}>
                <strong>Additional Notes:</strong> {item.additionalDetails}
              </div>
            )}

            {/* Meta tags */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--slate-700)', fontSize: '0.9375rem' }}>
                <MapPin size={18} color="var(--primary-600)" />
                <span><strong>Location:</strong> {item.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--slate-700)', fontSize: '0.9375rem' }}>
                <Calendar size={18} color="var(--slate-400)" />
                <span><strong>Date:</strong> {item.date}</span>
                {item.time && (
                  <>
                    <Clock size={16} color="var(--slate-400)" style={{ marginLeft: '1rem' }} />
                    <span><strong>Time:</strong> {item.time}</span>
                  </>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--slate-700)', fontSize: '0.9375rem' }}>
                <User size={18} color="var(--slate-400)" />
                <span><strong>Reported by:</strong> {item.reporter?.name || 'Campus Student'}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ marginTop: 'auto' }}>
              {isOwner ? (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link to="/my-items" className="btn btn-secondary" style={{ flex: 1 }}>
                    Manage in My Items
                  </Link>
                </div>
              ) : item.status === 'recovered' ? (
                <div style={{ padding: '0.875rem', backgroundColor: 'var(--accent-emerald-light)', color: '#065f46', borderRadius: 'var(--radius-md)', textAlign: 'center', fontWeight: 600 }}>
                  ✓ This item has already been recovered and reunited!
                </div>
              ) : (
                <button
                  onClick={() => setClaimModalOpen(true)}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  <Shield size={20} />
                  Submit Ownership Claim
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      {claimModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.375rem', marginBottom: '0.5rem' }}>
              Claim "{item.title}"
            </h2>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Please describe unique details (e.g. wallpapers, serial markers, lock codes, engravings) that prove ownership.
            </p>

            <form onSubmit={handleClaimSubmit}>
              <div className="form-group">
                <label className="form-label">Proof of Ownership / Identifying Details *</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="e.g. It has a scratch on the top corner, and the sticker inside reads..."
                  value={claimMessage}
                  onChange={(e) => setClaimMessage(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setClaimModalOpen(false)}
                  className="btn btn-secondary"
                  disabled={claimLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={claimLoading}
                >
                  <Send size={16} />
                  {claimLoading ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailsPage;
