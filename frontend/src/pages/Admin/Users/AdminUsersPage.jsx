import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { useApp } from '../../../context/AppContext';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { ArrowLeft, Trash2, UserCheck } from 'lucide-react';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useApp();

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      addToast('Error fetching users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await api.delete(`/admin/users/${id}`);
      if (res.data.success) {
        addToast('User removed', 'info');
        setUsers((prev) => prev.filter((u) => u._id !== id));
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error deleting user', 'error');
    }
  };

  if (loading) return <LoadingSpinner message="Fetching campus users..." />;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--slate-600)' }}>
        <ArrowLeft size={16} /> Back to Admin Dashboard
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem' }}>Campus User Management</h1>
        <p style={{ color: 'var(--slate-500)' }}>Audit and manage active campus profiles</p>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--slate-600)' }}>
              <th style={{ padding: '1rem' }}>User</th>
              <th style={{ padding: '1rem' }}>Role</th>
              <th style={{ padding: '1rem' }}>Department</th>
              <th style={{ padding: '1rem' }}>Phone</th>
              <th style={{ padding: '1rem' }}>Joined</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{u.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{u.email}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span className={`badge ${u.role === 'admin' ? 'badge-lost' : 'badge-approved'}`} style={{ textTransform: 'capitalize' }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--slate-600)' }}>{u.department || 'N/A'}</td>
                <td style={{ padding: '1rem', color: 'var(--slate-600)' }}>{u.phone || 'N/A'}</td>
                <td style={{ padding: '1rem', color: 'var(--slate-500)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--accent-rose)' }}
                      title="Delete User"
                    >
                      <Trash2 size={14} />
                    </button>
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

export default AdminUsersPage;
