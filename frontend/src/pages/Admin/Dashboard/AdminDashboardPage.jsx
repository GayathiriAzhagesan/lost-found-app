import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { Users, FileText, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) return <LoadingSpinner message="Gathering campus administration statistics..." />;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
          <ShieldAlert size={16} /> Campus Security & Facilities Management
        </div>
        <h1 style={{ fontSize: '2rem' }}>Administration Dashboard</h1>
        <p style={{ color: 'var(--slate-500)' }}>Manage registered students, listings moderation, claims, and campus metrics</p>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginBottom: '0.5rem' }}>Registered Users</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.totalUsers || 0}</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginBottom: '0.5rem' }}>Total Lost Reports</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#b91c1c' }}>{stats?.totalLost || 0}</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginBottom: '0.5rem' }}>Total Found Reports</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#047857' }}>{stats?.totalFound || 0}</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginBottom: '0.5rem' }}>Active Claims Pending</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#b45309' }}>{stats?.activeClaims || 0}</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginBottom: '0.5rem' }}>Successfully Recovered</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0369a1' }}>{stats?.recoveredItems || 0}</div>
        </div>
      </div>

      {/* Admin Modules Navigation */}
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Administrative Controls</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div className="card card-hover">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem' }}>User Management</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>View and audit registered campus accounts</p>
            </div>
          </div>
          <Link to="/admin/users" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            Manage Users <ArrowRight size={14} />
          </Link>
        </div>

        <div className="card card-hover">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#d1fae5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem' }}>Items Moderation</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>Audit and manage lost & found postings</p>
            </div>
          </div>
          <Link to="/admin/items" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            Manage Items <ArrowRight size={14} />
          </Link>
        </div>

        <div className="card card-hover">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem' }}>Claims Oversight</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>Review pending student ownership claims</p>
            </div>
          </div>
          <Link to="/admin/claims" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            Manage Claims <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
