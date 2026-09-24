import React, { useState, useEffect } from 'react';
import { Search, Filter, PlusCircle } from 'lucide-react';
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

export const LostItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchLostItems = async () => {
      setLoading(true);
      try {
        const res = await itemService.getItems({
          type: 'lost',
          search: search.trim() || undefined,
          category: category !== 'All' ? category : undefined,
        });
        if (res.success) {
          setItems(res.data);
        }
      } catch (err) {
        console.error('Error fetching lost items:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchLostItems, 300);
    return () => clearTimeout(debounceTimer);
  }, [search, category]);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Lost Items Bulletin</h1>
          <p style={{ color: 'var(--slate-500)' }}>Browse or search for possessions currently missing across campus</p>
        </div>
        <Link to="/report?type=lost" className="btn btn-primary">
          <PlusCircle size={18} />
          Report Lost Item
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
              placeholder="Search by title, details, location..."
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
        <LoadingSpinner message="Searching lost items bulletin..." />
      ) : items.length === 0 ? (
        <EmptyState
          title="No lost items found"
          description={search ? `No results match "${search}". Try clearing search filters or report the lost item.` : 'No lost items have been reported yet.'}
          actionText="Report Lost Item"
          actionLink="/report?type=lost"
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

export default LostItemsPage;
