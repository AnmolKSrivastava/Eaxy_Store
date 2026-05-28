import React from 'react';
import { Search, Filter } from 'lucide-react';

function ProductFilters({ searchTerm, onSearchChange, filterCategory, onFilterChange, categories }) {
  return (
    <div className="pm-filters">
      <div className="pm-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="pm-filter">
        <Filter size={18} />
        <select value={filterCategory} onChange={(e) => onFilterChange(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug || cat.title}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ProductFilters;
