import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import itemService from '../../../services/itemService';
import api from '../../../services/api';
import { useApp } from '../../../context/AppContext';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { ArrowLeft, Trash2, Eye, CheckCircle2 } from 'lucide-react';

export const AdminItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useApp();

  const fetchItems = async () => {
    try {
      const res = await itemService.getItems();
      if (res.success) {
        setItems(res.data);
      }
    } catch (err) {
      addToast('Error fetching items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Delete this report as administrator?')) return;
    try {
      const res = await itemService.deleteItem(id);
      if (res.success) {
        addToast('Item removed', 'info');
        setItems((prev) => prev.filter((i) => i._id !== id));
      }
    } catch (err) {
      addToast('Error deleting item', 'error');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/admin/items/${id}`, { status });
      if (res.data.success) {
        addToast(`Item status changed to ${status}`, 'success');
        setItems((prev) => prev.map((i) => (i._id === id ? { ...i, status } : i)));
      }
    } catch (err) {
      addToast('Error updating item status', 'error');
    }
  };

  if (loading) return <LoadingSpinner message="Fetching campus item listings..." />;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--slate-600)' }}>
        <ArrowLeft size={16} /> Back to Admin Dashboard
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem' }}>Item Postings Moderation</h1>
        <p style={{ color: 'var(--slate-500)' }}>Audit and manage all lost and found listings across campus</p>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--slate-600)' }}>
              <th style={{ padding: '1rem' }}>Item</th>
              <th style={{ padding: '1rem' }}>Type</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Location</th>
              <th style={{ padding: '1rem' }}>Reporter</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{item.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{item.date}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span className={`badge ${item.type === 'lost' ? 'badge-lost' : 'badge-found'}`}>
                    {item.type}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--slate-600)' }}>{item.category}</td>
                <td style={{ padding: '1rem', color: 'var(--slate-600)' }}>{item.location}</td>
                <td style={{ padding: '1rem', color: 'var(--slate-600)' }}>{item.reporter?.name || 'Unknown'}</td>
                <td style={{ padding: '1rem' }}>
                  <select
                    className="form-control"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto' }}
                    value={item.status}
                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                  >
                    <option value="open">Open</option>
                    <option value="claimed">Claimed</option>
                    <option value="recovered">Recovered</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <Link to={`/items/${item._id}`} className="btn btn-secondary btn-sm" title="View Details">
                      <Eye size={14} />
                    </Link>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--accent-rose)' }}
                      title="Delete Report"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminItemsPage;
