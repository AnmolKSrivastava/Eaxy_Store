import React from 'react';
import { Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

function ProductsTable({ 
  products, 
  loading, 
  onEdit, 
  onDelete, 
  onToggleStock 
}) {
  if (loading) {
    return <div className="pm-loading">Loading products...</div>;
  }

  return (
    <div className="pm-table-wrap">
      <table className="pm-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Badge</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                No products found
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img 
                    src={
                      product.images && product.images.length > 0 
                        ? product.images[0] 
                        : product.image
                    } 
                    alt={product.name} 
                    className="pm-product-img" 
                  />
                </td>
                <td>
                  <strong>{product.name}</strong>
                </td>
                <td>
                  <span className="pm-category-tag">{product.category}</span>
                </td>
                <td>
                  <div>
                    <strong>₹{product.price?.toLocaleString()}</strong>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <small style={{ textDecoration: 'line-through', marginLeft: '0.5rem', opacity: 0.6 }}>
                        ₹{product.originalPrice.toLocaleString()}
                      </small>
                    )}
                  </div>
                </td>
                <td>
                  {product.badge && <span className="pm-badge">{product.badge}</span>}
                </td>
                <td>
                  <button
                    className={`pm-stock-btn ${product.inStock ? 'in-stock' : 'out-of-stock'}`}
                    onClick={() => onToggleStock(product.id, product.inStock)}
                    title="Toggle stock status"
                  >
                    {product.inStock ? (
                      <>
                        <CheckCircle size={16} /> In Stock
                      </>
                    ) : (
                      <>
                        <XCircle size={16} /> Out
                      </>
                    )}
                  </button>
                </td>
                <td>
                  <div className="pm-actions">
                    <button
                      className="pm-action-btn edit"
                      onClick={() => onEdit(product)}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="pm-action-btn delete"
                      onClick={() => onDelete(product.id, product.name)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsTable;
