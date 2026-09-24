import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import itemService from '../../services/itemService';
import ItemCard from '../../components/item/ItemCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const CATEGORIES = [
  'All',
  'Electronics',
  'Keys',
  'Bottles & Containers',
  'Wallets & IDs',
  'Clothing & Accessories',
  'Books & Stationery',
  'Other',
];

export const FoundItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchFoundItems = async () => {
      setLoading(true);
      try {
        const res = await itemService.getItems({
          type: 'found',
          search: search.trim() || undefined,
          category: category !== 'All' ? category : undefined,
        });
        if (res.success) {
          setItems(res.data);
        }
      } catch (err) {
        console.error('Error fetching found items:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchFoundItems, 300);
    return () => clearTimeout(debounceTimer);
  }, [search, category]);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Found Items Bulletin</h1>
          <p style={{ color: 'var(--slate-500)' }}>Items turned in by students, professors, and facilities across campus</p>
        </div>
        <Link to="/report?type=found" className="btn btn-primary" style={{ backgroundColor: 'var(--accent-emerald)', borderColor: 'var(--accent-emerald)' }}>
          <CheckCircle size={18} />
          Report Found Item
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search found items by title, location, keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} color="var(--slate-400)" />
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>Category: {cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Items List */}
      {loading ? (
        <LoadingSpinner message="Searching found items bulletin..." />
      ) : items.length === 0 ? (
        <EmptyState
          title="No found items matching"
          description={search ? `No items found matching "${search}".` : 'No found items reported yet.'}
          actionText="Turn In / Report Item"
          actionLink="/report?type=found"
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoundItemsPage;
