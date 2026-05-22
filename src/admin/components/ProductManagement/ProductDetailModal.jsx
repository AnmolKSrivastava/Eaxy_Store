import React from 'react';
import { X, Star, TrendingUp, Package } from 'lucide-react';
import { categoryLabels, getStockStatus } from '../../data/mockProducts';

function ProductDetailModal({ product, onClose }) {
  if (!product) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Product Details</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="product-detail-grid">
            {/* Product Image */}
            <div className="product-detail-image">
              <img src={product.image} alt={product.name} />
              {product.badge && (
                <span className="detail-badge">{product.badge}</span>
              )}
            </div>

            {/* Product Info */}
            <div className="product-detail-info">
              <h3>{product.name}</h3>
              <div className="detail-sku">SKU: {product.sku}</div>
              
              <div className="detail-rating">
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span>{product.rating}</span>
                <span className="rating-label">(4.5k reviews)</span>
              </div>

              <div className="detail-price-section">
                <div className="detail-current-price">
                  {formatPrice(product.price)}
                </div>
                {product.originalPrice > product.price && (
                  <div className="detail-price-info">
                    <span className="detail-original-price">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="detail-discount">
                      <TrendingUp size={14} />
                      Save {formatPrice(product.originalPrice - product.price)}
                    </span>
                  </div>
                )}
              </div>

              <div className="detail-row">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{categoryLabels[product.category]}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Stock Status:</span>
                <span 
                  className="stock-status-badge"
                  style={{ 
                    background: `${getStockStatus(product.stockQuantity).color}20`, 
                    color: getStockStatus(product.stockQuantity).color 
                  }}
                >
                  {getStockStatus(product.stockQuantity).label}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Available Quantity:</span>
                <span className="detail-value detail-quantity">{product.stockQuantity} units</span>
              </div>

              {product.lastRestocked && (
                <div className="detail-row">
                  <span className="detail-label">Last Restocked:</span>
                  <span className="detail-value">
                    {new Date(product.lastRestocked).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Specifications */}
          <div className="product-specs-section">
            <h4>Specifications</h4>
            <div className="specs-grid">
              {product.specs.map((spec, index) => (
                <div key={index} className="spec-item">
                  <Package size={14} />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;
