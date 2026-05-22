import React, { useState } from 'react';
import { X, Package, AlertCircle } from 'lucide-react';

function BulkActionsModal({ type, selectedCount, onClose, onConfirm, isProcessing }) {
  const [stockQuantity, setStockQuantity] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (type === 'updateStock') {
      const quantity = parseInt(stockQuantity);
      if (isNaN(quantity) || quantity < 0) {
        setError('Please enter a valid quantity (0 or more)');
        return;
      }
      onConfirm(quantity);
    } else {
      onConfirm();
    }
  };

  const getModalContent = () => {
    switch (type) {
      case 'updateStock':
        return {
          title: 'Bulk Update Stock',
          icon: <Package size={24} className="bulk-icon primary-icon" />,
          message: `Update stock quantity for ${selectedCount} selected product${selectedCount > 1 ? 's' : ''}?`,
          confirmText: 'Update Stock',
          confirmClass: 'primary'
        };
      case 'delete':
        return {
          title: 'Bulk Delete Products',
          icon: <AlertCircle size={24} className="bulk-icon warning-icon" />,
          message: `Are you sure you want to delete ${selectedCount} selected product${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`,
          confirmText: 'Delete Products',
          confirmClass: 'danger',
          warning: true
        };
      default:
        return {};
    }
  };

  const content = getModalContent();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content bulk-actions-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-header ${content.warning ? 'delete-header' : ''}`}>
          <div className="delete-header-content">
            {content.icon}
            <h2>{content.title}</h2>
          </div>
          <button className="modal-close" onClick={onClose} disabled={isProcessing}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {content.warning && (
              <div className="delete-warning">
                <p className="delete-message">{content.message}</p>
              </div>
            )}

            {!content.warning && (
              <p className="bulk-message">{content.message}</p>
            )}

            {type === 'updateStock' && (
              <div className="bulk-input-group">
                <label htmlFor="stockQuantity">
                  New Stock Quantity <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="stockQuantity"
                  value={stockQuantity}
                  onChange={(e) => {
                    setStockQuantity(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter quantity (e.g., 25)"
                  min="0"
                  step="1"
                  className={error ? 'error' : ''}
                  disabled={isProcessing}
                  autoFocus
                />
                {error && (
                  <span className="error-message">
                    <AlertCircle size={14} />
                    {error}
                  </span>
                )}
                <div className="bulk-help-text">
                  This will set the stock quantity to the same value for all selected products.
                </div>
              </div>
            )}

            {type === 'delete' && (
              <div className="delete-consequences">
                <h4>What will happen:</h4>
                <ul>
                  <li>All {selectedCount} selected products will be permanently removed</li>
                  <li>Products will no longer appear in search results</li>
                  <li>Existing orders with these products will not be affected</li>
                  <li>This action cannot be undone</li>
                </ul>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="modal-btn secondary"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`modal-btn ${content.confirmClass}`}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : content.confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BulkActionsModal;
