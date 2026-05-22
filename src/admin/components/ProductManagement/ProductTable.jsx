import React from 'react';
import { Package, Eye, Edit, Trash2 } from 'lucide-react';
import { categoryLabels, getStockStatus } from '../../data/mockProducts';

function ProductTable({ 
  products, 
  onViewProduct, 
  onEditProduct, 
  onDeleteProduct,
  selectedProductIds = [],
  onSelectProduct,
  onSelectAll
}) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="products-table-container">
      <table className="products-table">
        <thead>
          <tr>
            <th className="checkbox-column">
              <input
                type="checkbox"
                checked={products.length > 0 && selectedProductIds.length === products.length}
                onChange={onSelectAll}
                className="product-checkbox"
              />
            </th>
            <th>Image</th>
            <th>Product</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="9" className="no-results">
                <Package size={48} />
                <p>No products found</p>
                <span>Try adjusting your search or filters</span>
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const stockInfo = getStockStatus(product.stockQuantity);
              const isSelected = selectedProductIds.includes(product.id);
              
              return (
                <tr key={product.id} className={isSelected ? 'selected-row' : ''}>
                  <td className="checkbox-column">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectProduct(product.id)}
                      className="product-checkbox"
                    />
                  </td>
                  <td>
                    <div className="product-image-cell">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="product-thumbnail"
                      />
                    </div>
                  </td>
                  <td>
                    <div className="product-name-cell">
                      <strong>{product.name}</strong>
                      {product.badge && (
                        <span className="product-badge">{product.badge}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="product-sku">{product.sku}</span>
                  </td>
                  <td>
                    <span className="category-label">
                      {categoryLabels[product.category]}
                    </span>
                  </td>
                  <td>
                    <div className="price-cell">
                      <strong>{formatPrice(product.price)}</strong>
                      {product.originalPrice > product.price && (
                        <span className="original-price">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="stock-quantity">{product.stockQuantity} units</span>
                  </td>
                  <td>
                    <span 
                      className="stock-status-badge"
                      style={{ 
                        background: `${stockInfo.color}20`, 
                        color: stockInfo.color 
                      }}
                    >
                      {stockInfo.label}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn view"
                        title="View Details"
                        onClick={() => onViewProduct(product)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="action-btn edit"
                        title="Edit Product"
                        onClick={() => onEditProduct(product)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="action-btn delete"
                        title="Delete Product"
                        onClick={() => onDeleteProduct(product)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
