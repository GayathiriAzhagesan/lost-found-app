import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, Tag } from 'lucide-react';

export const ItemCard = ({ item }) => {
  const isLost = item.type === 'lost';

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: 0 }}>
      {/* Image header */}
      <div style={{ position: 'relative', height: '180px', backgroundColor: 'var(--slate-100)', overflow: 'hidden' }}>
        <img
          src={item.image || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80'}
          alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
          <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
            {isLost ? 'Lost' : 'Found'}
          </span>
          {item.status === 'recovered' && (
            <span className="badge badge-recovered">Recovered</span>
          )}
        </div>
        <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
          <span style={{
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            color: '#ffffff',
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)'
          }}>
            {item.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
          {item.title}
        </h3>

        <p style={{
          fontSize: '0.875rem',
          color: 'var(--slate-600)',
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.4,
        }}>
          {item.description || 'No description provided.'}
        </p>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--slate-500)', borderTop: '1px solid var(--slate-100)', paddingTop: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={14} color="var(--primary-600)" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={14} color="var(--slate-400)" />
            <span>{item.date} {item.time ? `• ${item.time}` : ''}</span>
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <Link to={`/items/${item._id}`} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
