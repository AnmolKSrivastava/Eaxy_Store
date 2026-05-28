import { Search } from 'lucide-react';

function ServiceFilters({ searchTerm, onSearchChange, filterCategory, onFilterChange, categories }) {
  return (
    <div className="service-filters">
      <div className="search-input">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <select
        value={filterCategory}
        onChange={(e) => onFilterChange(e.target.value)}
        className="filter-select"
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ServiceFilters;
