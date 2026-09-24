import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { LogIn, Compass, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res.success) {
        addToast(`Welcome back, ${res.data.name}!`, 'success');
        navigate(from, { replace: true });
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for testing
  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="container" style={{ maxWidth: '440px', padding: '4rem 1.5rem' }}>
      <div className="card" style={{ padding: '2.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--primary-100)',
            color: 'var(--primary-600)',
            marginBottom: '1rem'
          }}>
            <LogIn size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Sign In to Campus Recover</h2>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>Access your reports, claims, and campus bulletin</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Campus Email</label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              placeholder="e.g. student@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Fillers */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px dashed var(--slate-200)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Demo Accounts (Click to Fill):
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleQuickFill('student@campus.edu', 'password123')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.75rem' }}
            >
              <UserCheck size={13} /> Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@campus.edu', 'password123')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.75rem' }}
            >
              <ShieldCheck size={13} /> Campus Admin
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
