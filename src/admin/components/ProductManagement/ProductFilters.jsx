import React from 'react';
import { Search } from 'lucide-react';

function ProductFilters({ 
  searchTerm, 
  setSearchTerm, 
  categoryFilter, 
  setCategoryFilter, 
  stockFilter, 
  setStockFilter 
}) {
  return (
    <div className="product-filters">
      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search products by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <select
        className="filter-select"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="all">All Categories</option>
        <option value="laptops">Laptops & Computers</option>
        <option value="smartphones">Smartphones</option>
        <option value="accessories">Accessories</option>
        <option value="refurbished-laptops">Refurbished</option>
      </select>

      <select
        className="filter-select"
        value={stockFilter}
        onChange={(e) => setStockFilter(e.target.value)}
      >
        <option value="all">All Stock Status</option>
        <option value="high-stock">In Stock (High)</option>
        <option value="medium-stock">In Stock (Medium)</option>
        <option value="low-stock">Low Stock</option>
        <option value="out-of-stock">Out of Stock</option>
      </select>
    </div>
  );
}

export default ProductFilters;
