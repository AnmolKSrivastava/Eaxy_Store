import React from 'react';
import { Package, Plus, Edit3, Trash2, X } from 'lucide-react';

function ProductHeader({ 
  totalProducts, 
  lowStockCount, 
  onAddProduct,
  selectedCount = 0,
  onBulkUpdateStock,
  onBulkDelete,
  onDeselectAll
}) {
  return (
    <div className="product-header">
      <div>
        <h1>Product Management</h1>
        <p className="product-subtitle">
          {selectedCount > 0 
            ? `${selectedCount} product${selectedCount > 1 ? 's' : ''} selected`
            : 'Manage your inventory across all categories'
          }
        </p>
      </div>
      <div className="product-header-right">
        {selectedCount > 0 ? (
          <div className="bulk-actions">
            <button className="bulk-btn update" onClick={onBulkUpdateStock}>
              <Edit3 size={16} />
              Update Stock
            </button>
            <button className="bulk-btn delete" onClick={onBulkDelete}>
              <Trash2 size={16} />
              Delete ({selectedCount})
            </button>
            <button className="bulk-btn cancel" onClick={onDeselectAll}>
              <X size={16} />
              Deselect All
            </button>
          </div>
        ) : (
          <>
            <div className="product-stats">
              <div className="stat-card">
                <Package size={20} />
                <div>
                  <div className="stat-value">{totalProducts}</div>
                  <div className="stat-label">Total Products</div>
                </div>
              </div>
              <div className="stat-card">
                <Package size={20} />
                <div>
                  <div className="stat-value">{lowStockCount}</div>
                  <div className="stat-label">Low Stock Alerts</div>
                </div>
              </div>
            </div>
            <button className="btn-add-product" onClick={onAddProduct}>
              <Plus size={18} />
              Add Product
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductHeader;
