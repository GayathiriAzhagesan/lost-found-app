import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import itemService from '../../services/itemService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { CheckCircle, Trash2, Edit3, Eye, PlusCircle } from 'lucide-react';

export const MyItemsPage = () => {
  const { user } = useAuth();
  const { addToast } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserItems = async () => {
    if (!user) return;
    try {
      const res = await itemService.getItems();
      if (res.success) {
        const myReports = res.data.filter((i) => i.reporter?._id === user._id);
        setItems(myReports);
      }
    } catch (err) {
      addToast('Error fetching your items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserItems();
  }, [user]);

  const handleMarkRecovered = async (id) => {
    try {
      const res = await itemService.updateItem(id, { status: 'recovered' });
      if (res.success) {
        addToast('Item marked as recovered!', 'success');
        setItems((prev) => prev.map((i) => (i._id === id ? { ...i, status: 'recovered' } : i)));
      }
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this report?')) return;
    try {
      const res = await itemService.deleteItem(id);
      if (res.success) {
        addToast('Report deleted successfully', 'info');
        setItems((prev) => prev.filter((i) => i._id !== id));
      }
    } catch (err) {
      addToast('Error deleting item', 'error');
    }
  };

  if (loading) return <LoadingSpinner message="Retrieving your reported items..." />;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>My Reported Items</h1>
          <p style={{ color: 'var(--slate-500)' }}>Manage your posted lost and found listings</p>
        </div>
        <Link to="/report" className="btn btn-primary">
          <PlusCircle size={18} /> New Report
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No reported items yet"
          description="You haven't reported any lost or found items."
          actionText="Report an Item"
          actionLink="/report"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item) => (
            <div key={item._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <img
                src={item.image || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=120&q=80'}
                alt={item.title}
                style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
              />

              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className={`badge ${item.type === 'lost' ? 'badge-lost' : 'badge-found'}`}>
                    {item.type}
                  </span>
                  <span className={`badge badge-${item.status}`}>
                    {item.status}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
                    {item.category}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
                  Location: {item.location} • Reported: {item.date}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Link to={`/items/${item._id}`} className="btn btn-secondary btn-sm" title="View details">
                  <Eye size={15} /> View
                </Link>

                {item.status !== 'recovered' && (
                  <button
                    onClick={() => handleMarkRecovered(item._id)}
                    className="btn btn-outline btn-sm"
                    style={{ borderColor: 'var(--accent-emerald)', color: 'var(--accent-emerald)' }}
                  >
                    <CheckCircle size={15} /> Mark Recovered
                  </button>
                )}

                <button
                  onClick={() => handleDelete(item._id)}
                  className="btn btn-secondary btn-sm"
                  style={{ color: 'var(--accent-rose)' }}
                  title="Delete report"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyItemsPage;
