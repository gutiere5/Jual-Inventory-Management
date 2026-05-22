import { Grid3x3, List, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import './ItemInventory.css';
import { useQuery } from '@tanstack/react-query';
import { listItemsQueryOptions } from '../../api/query-client';
import GridView from './grid-view';
import ListView from './list-view';

const ItemInventoryContainer = () => {
  const { data: items, isPending, isError, error } = useQuery(listItemsQueryOptions());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredItems = useMemo(() => {
    if (!items) return [];
    if (!searchQuery.trim()) {
      return items;
    }

    const query = searchQuery.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(query));
  }, [items, searchQuery]);

  // const getStockStatus = (quantity: number) => {
  //   if (quantity === 0) return { label: 'Out of Stock', variant: 'destructive' };
  //   if (quantity < 20) return { label: 'Low Stock', variant: 'outline' };
  //   return { label: 'In Stock', variant: 'secondary' };
  // };

  return (
    <main>
      <div className="inventory-header">
        <div className="inventory-details">
          <h1 className="inventory-header-title ">Inventory Management</h1>
          <p>Manage Stock and Item Details</p>
        </div>
        <div className="inventory-view-toggles">
          <button
            onClick={() => { setViewMode('grid'); }}
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            aria-label="Grid View"
          >
            <Grid3x3 />
          </button>
          <button
            onClick={() => { setViewMode('list'); }}
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            aria-label="List View"
          >
            <List />
          </button>
        </div>
      </div>

      <div className="inventory-search-container">
        <Search className="inventory-search-icon" />
        <input
          type="text"
          placeholder="Search by name, category, or SKU..."
          className="inventory-search-input"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); }}
        />
      </div>

      {isPending ? (
        <p>Loading items...</p>
      ) : isError ? (
        <p>There is an apparent error {error.message}</p>
      ) : (
        <div className="inventory-content">
          {/* Item Grid/List */}
          {viewMode === 'grid' ? (
            <GridView filteredItems={filteredItems} />
          ) : (
            <ListView filteredItems={filteredItems} />
          )}
        </div>
      )}
    </main>
  );
};

export default ItemInventoryContainer;

// 180 Lines
