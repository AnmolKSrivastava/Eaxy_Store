import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

function DeleteConfirmModal({ product, onClose, onConfirm, isDeleting }) {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header delete-header">
          <div className="delete-header-content">
            <AlertTriangle size={24} className="warning-icon" />
            <h2>Delete Product</h2>
          </div>
          <button className="modal-close" onClick={onClose} disabled={isDeleting}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="delete-warning">
            <p className="delete-message">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
          </div>

          <div className="delete-product-info">
            <div className="delete-product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="delete-product-details">
              <h3>{product.name}</h3>
              <div className="delete-detail-row">
                <span className="detail-label">SKU:</span>
                <span className="detail-value">{product.sku}</span>
              </div>
              <div className="delete-detail-row">
                <span className="detail-label">Stock:</span>
                <span className="detail-value">{product.stockQuantity} units</span>
              </div>
              {product.badge && (
                <div className="delete-detail-row">
                  <span className="product-badge">{product.badge}</span>
                </div>
              )}
            </div>
          </div>

          <div className="delete-consequences">
            <h4>What will happen:</h4>
            <ul>
              <li>Product will be permanently removed from inventory</li>
              <li>Product will no longer appear in search results</li>
              <li>Existing orders with this product will not be affected</li>
              <li>Product images and data will be deleted</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="modal-btn secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal-btn danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Trash2 size={16} className="spinning" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete Product
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
