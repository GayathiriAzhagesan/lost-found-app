import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Building, Phone, ShieldCheck, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container" style={{ maxWidth: '640px', padding: '3rem 1.5rem' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 700,
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{user?.name}</h1>
              <span className="badge badge-approved" style={{ fontSize: '0.75rem' }}>
                {user?.role === 'admin' ? 'Campus Staff / Admin' : 'Verified Student'}
              </span>
            </div>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', margin: 0 }}>{user?.email}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Mail size={18} color="var(--slate-400)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Campus Email</div>
              <div style={{ fontWeight: 500, fontSize: '0.9375rem' }}>{user?.email}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Building size={18} color="var(--slate-400)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Department / Faculty</div>
              <div style={{ fontWeight: 500, fontSize: '0.9375rem' }}>{user?.department || 'General Campus'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Phone size={18} color="var(--slate-400)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Contact Phone</div>
              <div style={{ fontWeight: 500, fontSize: '0.9375rem' }}>{user?.phone || 'Not provided'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={18} color="var(--slate-400)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Account Privilege</div>
              <div style={{ fontWeight: 500, fontSize: '0.9375rem', textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ color: 'var(--accent-rose)' }}>
            <LogOut size={16} /> Sign Out of Platform
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
