import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import itemService from '../../services/itemService';
import { AlertCircle, PlusCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';

const CATEGORIES = [
  'Electronics',
  'Keys',
  'Bottles & Containers',
  'Wallets & IDs',
  'Clothing & Accessories',
  'Books & Stationery',
  'Sports & Fitness',
  'Other',
];

const CAMPUS_LOCATIONS = [
  'Central Library (Floor 1/2/3)',
  'Student Union / Cafeteria',
  'Science & Technology Complex',
  'Engineering Block A/B/C',
  'Humanities & Arts Building',
  'University Sports Center & Gym',
  'North / South Student Dormitories',
  'Campus Parking Lots / Bus Stop',
  'Other Campus Location',
];

export const ReportItemPage = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'found' ? 'found' : 'lost';

  const [type, setType] = useState(initialType);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    description: '',
    location: 'Central Library (Floor 1/2/3)',
    customLocation: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    image: '',
    additionalDetails: '',
  });

  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('type')) {
      setType(searchParams.get('type'));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please sign in first to report an item', 'error');
      navigate('/login', { state: { from: { pathname: '/report' } } });
      return;
    }

    if (!formData.title || !formData.description) {
      addToast('Please provide an item title and description', 'error');
      return;
    }

    const finalLocation = formData.location === 'Other Campus Location' && formData.customLocation
      ? formData.customLocation
      : formData.location;

    setLoading(true);
    try {
      const res = await itemService.createItem({
        type,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        location: finalLocation,
        date: formData.date,
        time: formData.time,
        image: formData.image || undefined,
        additionalDetails: formData.additionalDetails,
      });

      if (res.success) {
        addToast(`${type === 'lost' ? 'Lost' : 'Found'} report created successfully!`, 'success');
        navigate(`/items/${res.data._id}`);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error submitting report', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '680px', padding: '3rem 1.5rem' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
            Report an Item to Campus Bulletin
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9375rem' }}>
            Help reunite possessions by providing clear details and location markers
          </p>
        </div>

        {/* Type Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          backgroundColor: 'var(--slate-100)',
          padding: '0.375rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem',
        }}>
          <button
            type="button"
            onClick={() => setType('lost')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              backgroundColor: type === 'lost' ? '#ffffff' : 'transparent',
              color: type === 'lost' ? '#b91c1c' : 'var(--slate-600)',
              boxShadow: type === 'lost' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <AlertCircle size={18} />
            I Lost an Item
          </button>
          <button
            type="button"
            onClick={() => setType('found')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              backgroundColor: type === 'found' ? '#ffffff' : 'transparent',
              color: type === 'found' ? '#047857' : 'var(--slate-600)',
              boxShadow: type === 'found' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <CheckCircle size={18} />
            I Found an Item
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="item-title">Item Title / Name *</label>
            <input
              id="item-title"
              name="title"
              type="text"
              className="form-control"
              placeholder={type === 'lost' ? 'e.g. Silver iPad Air with Black Case' : 'e.g. Blue Hydro Flask Bottle'}
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="item-category">Category *</label>
            <select
              id="item-category"
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="item-desc">Detailed Description *</label>
            <textarea
              id="item-desc"
              name="description"
              className="form-control"
              rows={4}
              placeholder="Provide color, brand, distinct scratches, contents, or distinguishing features..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label" htmlFor="item-location">Campus Location *</label>
            <select
              id="item-location"
              name="location"
              className="form-control"
              value={formData.location}
              onChange={handleChange}
            >
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {formData.location === 'Other Campus Location' && (
            <div className="form-group">
              <label className="form-label" htmlFor="item-custom-location">Specific Location Details</label>
              <input
                id="item-custom-location"
                name="customLocation"
                type="text"
                className="form-control"
                placeholder="Specify classroom, floor, room number..."
                value={formData.customLocation}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Date & Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="item-date">Date Lost / Found</label>
              <input
                id="item-date"
                name="date"
                type="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="item-time">Approximate Time</label>
              <input
                id="item-time"
                name="time"
                type="time"
                className="form-control"
                value={formData.time}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="form-group">
            <label className="form-label" htmlFor="item-image">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ImageIcon size={14} /> Item Photo URL (Optional)
              </span>
            </label>
            <input
              id="item-image"
              name="image"
              type="url"
              className="form-control"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={handleChange}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
              Tip: In Phase 1-9 you can paste any public image link. Full file upload/storage is integrated in Phase 11.
            </span>
          </div>

          {/* Additional details */}
          <div className="form-group">
            <label className="form-label" htmlFor="item-additional">Additional Notes / Safe Hand-off Advice</label>
            <input
              id="item-additional"
              name="additionalDetails"
              type="text"
              className="form-control"
              placeholder="e.g. Currently handed to Campus Security reception"
              value={formData.additionalDetails}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Submitting Report...' : `Publish ${type === 'lost' ? 'Lost' : 'Found'} Report`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportItemPage;
