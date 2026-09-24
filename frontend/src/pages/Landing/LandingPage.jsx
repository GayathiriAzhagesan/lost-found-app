import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, CheckCircle, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import itemService from '../../services/itemService';

export const LandingPage = () => {
  const [stats, setStats] = useState({ lost: 2, found: 2, recovered: 1 });

  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        const res = await itemService.getItems();
        if (res.success && res.data) {
          const lost = res.data.filter(i => i.type === 'lost').length;
          const found = res.data.filter(i => i.type === 'found').length;
          const recovered = res.data.filter(i => i.status === 'recovered').length;
          setStats({ lost, found, recovered: Math.max(recovered, 1) });
        }
      } catch (err) {
        // use default stats
      }
    };
    fetchQuickStats();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 50%), radial-gradient(circle at bottom left, rgba(245, 158, 11, 0.1), transparent 50%), #ffffff',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '5rem 0 4rem',
        textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.875rem',
            background: 'var(--primary-50)',
            color: 'var(--primary-700)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
          }}>
            <Sparkles size={16} /> Campus Item Recovery Network
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>
            Lost something on campus? <br />
            <span style={{ color: 'var(--primary-600)' }}>Let’s help you get it back.</span>
          </h1>

          <p style={{ fontSize: '1.2rem', color: 'var(--slate-600)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            The official community recovery hub for students, faculty, and campus security.
            Report lost possessions, log discovered items, and verify claims with ease.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/report?type=lost" className="btn btn-primary btn-lg">
              <PlusCircle size={20} />
              Report Lost Item
            </Link>
            <Link to="/report?type=found" className="btn btn-secondary btn-lg">
              <CheckCircle size={20} />
              Report Found Item
            </Link>
            <Link to="/lost-items" className="btn btn-outline btn-lg">
              <Search size={20} />
              Browse Bulletin
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section style={{ backgroundColor: 'var(--slate-900)', color: '#ffffff', padding: '2.5rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-400)' }}>{stats.lost}+</div>
            <div style={{ color: 'var(--slate-400)', fontSize: '0.9375rem' }}>Lost Items Reported</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{stats.found}+</div>
            <div style={{ color: 'var(--slate-400)', fontSize: '0.9375rem' }}>Found Items Handed In</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{stats.recovered}+</div>
            <div style={{ color: 'var(--slate-400)', fontSize: '0.9375rem' }}>Items Successfully Reunited</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff' }}>100%</div>
            <div style={{ color: 'var(--slate-400)', fontSize: '0.9375rem' }}>Verified Campus Community</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>How Campus Recovery Works</h2>
            <p style={{ color: 'var(--slate-600)' }}>
              A seamless, three-step process built specifically for campus grounds, halls, and lecture buildings.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="card card-hover">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--primary-100)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.25rem',
                marginBottom: '1.25rem'
              }}>1</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Publish or Browse</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9375rem' }}>
                Lost your keys, calculator, or water bottle? File a detailed report with photos, location, and timestamps in seconds.
              </p>
            </div>

            <div className="card card-hover">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--accent-amber-light)',
                color: '#b45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.25rem',
                marginBottom: '1.25rem'
              }}>2</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Submit a Claim</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9375rem' }}>
                Spotted your item on the found bulletin? Send an ownership claim stating identifying marks or proof details.
              </p>
            </div>

            <div className="card card-hover">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--accent-emerald-light)',
                color: '#065f46',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.25rem',
                marginBottom: '1.25rem'
              }}>3</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Verify & Recover</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9375rem' }}>
                Once your claim is accepted, coordinate safe handoff at Campus Security or designated student union desk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-subtle)', padding: '3rem 0', marginTop: 'auto' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--slate-900)' }}>Campus Item Recovery Platform</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>Designed for university campuses, student housing, and campus departments.</div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
            <Link to="/lost-items">Lost Bulletin</Link>
            <Link to="/found-items">Found Bulletin</Link>
            <Link to="/report">Report Item</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
