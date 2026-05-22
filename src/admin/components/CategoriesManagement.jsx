import React, { useState } from 'react';
import { Tag, Plus, Edit, Trash2, Package, TrendingUp } from 'lucide-react';
import './CategoriesManagement.css';

function CategoriesManagement() {
  const [categories] = useState([
    { 
      id: 'laptops', 
      name: 'Laptops', 
      slug: 'laptops',
      productCount: 6,
      status: 'active',
      description: 'High-performance laptops for work and gaming',
      icon: '💻'
    },
    { 
      id: 'smartphones', 
      name: 'Smartphones', 
      slug: 'smartphones',
      productCount: 6,
      status: 'active',
      description: 'Latest flagship and mid-range smartphones',
      icon: '📱'
    },
    { 
      id: 'accessories', 
      name: 'Accessories', 
      slug: 'accessories',
      productCount: 6,
      status: 'active',
      description: 'Essential tech accessories and peripherals',
      icon: '🎧'
    },
    { 
      id: 'refurbished-laptops', 
      name: 'Refurbished Laptops', 
      slug: 'refurbished-laptops',
      productCount: 4,
      status: 'active',
      description: 'Certified refurbished laptops at great prices',
      icon: '♻️'
    },
  ]);

  return (
    <div className="categories-management">
      <div className="categories-header">
        <div>
          <h1>Product Categories</h1>
          <p className="categories-subtitle">Manage product categories and organization</p>
        </div>
        <button className="btn-add-category">
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <div className="categories-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Tag size={24} />
          </div>
          <div className="stat-details">
            <h3>{categories.length}</h3>
            <p>Total Categories</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-details">
            <h3>{categories.reduce((sum, cat) => sum + cat.productCount, 0)}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-details">
            <h3>{categories.filter(c => c.status === 'active').length}</h3>
            <p>Active Categories</p>
          </div>
        </div>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <div className="category-card-header">
              <div className="category-icon">{category.icon}</div>
              <div className="category-actions">
                <button className="action-btn edit" title="Edit Category">
                  <Edit size={16} />
                </button>
                <button className="action-btn delete" title="Delete Category">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="category-card-body">
              <h3>{category.name}</h3>
              <p className="category-description">{category.description}</p>
              <div className="category-meta">
                <span className="category-slug">/{category.slug}</span>
                <span className="category-count">
                  <Package size={14} />
                  {category.productCount} products
                </span>
              </div>
              <div className="category-status">
                <span className={`status-badge ${category.status}`}>
                  {category.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="categories-actions-panel">
        <h3>Category Management Actions</h3>
        <div className="action-buttons">
          <button className="action-panel-btn">
            <Tag size={18} />
            Bulk Edit Categories
          </button>
          <button className="action-panel-btn">
            <Package size={18} />
            Reorganize Products
          </button>
          <button className="action-panel-btn">
            <TrendingUp size={18} />
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoriesManagement;
