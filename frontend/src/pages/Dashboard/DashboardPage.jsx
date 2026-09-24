import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import itemService from '../../services/itemService';
import claimService from '../../services/claimService';
import notificationService from '../../services/notificationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Sparkles,
  Search,
  PlusCircle,
  FileQuestion,
  CheckCircle2,
  ShieldCheck,
  Bell,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myLost: 0,
    myFound: 0,
    myClaims: 0,
    recovered: 0,
  });
  const [recentItems, setRecentItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [itemsRes, claimsRes, notifsRes] = await Promise.all([
          itemService.getItems(),
          claimService.getClaims({ myClaims: 'true' }),
          notificationService.getNotifications(),
        ]);

        if (itemsRes.success && user) {
          const myItems = itemsRes.data.filter((i) => i.reporter?._id === user._id);
          const myLost = myItems.filter((i) => i.type === 'lost').length;
          const myFound = myItems.filter((i) => i.type === 'found').length;
          const recovered = myItems.filter((i) => i.status === 'recovered').length;

          setStats({
            myLost,
            myFound,
            myClaims: claimsRes.success ? claimsRes.count : 0,
            recovered,
          });

          setRecentItems(itemsRes.data.slice(0, 4));
        }

        if (notifsRes.success) {
          setNotifications(notifsRes.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  if (loading) return <LoadingSpinner message="Assembling your campus dashboard..." />;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Welcome Hero Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
        color: '#ffffff',
        padding: '2.25rem',
        marginBottom: '2rem',
        border: 'none',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.9, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              <Sparkles size={16} /> Campus Member Portal
            </div>
            <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.5rem' }}>
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <p style={{ opacity: 0.85, maxWidth: '560px', fontSize: '0.9375rem' }}>
              Keep track of your lost item reports, respond to ownership claims, and view campus recovery updates.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/report?type=lost" className="btn btn-primary" style={{ background: '#ffffff', color: 'var(--primary-700)', fontWeight: 600 }}>
              <PlusCircle size={16} /> Report Lost
            </Link>
            <Link to="/report?type=found" className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: 'transparent' }}>
              <CheckCircle2 size={16} /> Report Found
            </Link>
          </div>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--slate-500)', fontWeight: 500 }}>Total Lost Reports</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fee2e2', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileQuestion size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)' }}>{stats.myLost}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Items you're searching for</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--slate-500)', fontWeight: 500 }}>Total Found Reports</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#d1fae5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)' }}>{stats.myFound}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Items turned in by you</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--slate-500)', fontWeight: 500 }}>My Active Claims</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)' }}>{stats.myClaims}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Verification in progress</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--slate-500)', fontWeight: 500 }}>Recovered Items</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)' }}>{stats.recovered}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Reunited successfully</div>
        </div>
      </div>

      {/* Two Column Layout: Recent Items & Recent Notifications */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Recent Items */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Recent Campus Items</h2>
            <Link to="/lost-items" style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {recentItems.map((item) => (
              <Link
                key={item._id}
                to={`/items/${item._id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=120&q=80'}
                  alt={item.title}
                  style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    {item.location} • {item.date}
                  </div>
                </div>
                <span className={`badge ${item.type === 'lost' ? 'badge-lost' : 'badge-found'}`}>
                  {item.type}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={18} color="var(--primary-600)" />
              Recent Notifications
            </h2>
            <Link to="/notifications" style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              All alerts <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.length === 0 ? (
              <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', padding: '1rem 0' }}>No notifications yet.</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  style={{
                    padding: '0.875rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: notif.isRead ? 'transparent' : 'var(--primary-50)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--slate-900)' }}>
                      {notif.title}
                    </div>
                    {!notif.isRead && (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--primary-600)' }} />
                    )}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', margin: 0 }}>
                    {notif.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
