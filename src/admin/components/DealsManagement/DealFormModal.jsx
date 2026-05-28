import React, { useState, useEffect } from 'react';

function DealFormModal({
  show,
  editingDeal,
  products,
  onClose,
  onSubmit,
  loading,
  error,
  success,
}) {
  const [formData, setFormData] = useState({
    productId: '',
    badge: '',
    priority: 1,
    isActive: true,
    discountPercent: '',
  });

  useEffect(() => {
    if (editingDeal) {
      setFormData({
        productId: editingDeal.productId || '',
        badge: editingDeal.badge || '',
        priority: editingDeal.priority || 1,
        isActive: editingDeal.isActive !== undefined ? editingDeal.isActive : true,
        discountPercent: editingDeal.discountPercent || '',
      });
    } else {
      setFormData({
        productId: '',
        badge: '',
        priority: 1,
        isActive: true,
        discountPercent: '',
      });
    }
  }, [editingDeal, show]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, editingDeal);
  };

  if (!show) return null;

  return (
    <div className="dm-modal-overlay" onClick={onClose}>
      <div className="dm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dm-modal-header">
          <h3>{editingDeal ? 'Edit Deal' : 'Add New Deal'}</h3>
          <button className="dm-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="dm-form">
          <div className="dm-form-group">
            <label>Product *</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ₹{product.price?.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="dm-form-row">
            <div className="dm-form-group">
              <label>Badge Text *</label>
              <input
                type="text"
                name="badge"
                value={formData.badge}
                onChange={handleInputChange}
                placeholder="e.g., Hot Deal, Save Rs 10,000"
                required
              />
            </div>
            <div className="dm-form-group">
              <label>Discount %</label>
              <input
                type="number"
                name="discountPercent"
                value={formData.discountPercent}
                onChange={handleInputChange}
                min="0"
                max="100"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="dm-form-row">
            <div className="dm-form-group">
              <label>Priority</label>
              <input
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                min="1"
              />
              <small style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>
                Higher priority appears first
              </small>
            </div>
            <div className="dm-form-group dm-checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                Active
              </label>
            </div>
          </div>

          {error && <div className="dm-form-error">{error}</div>}
          {success && <div className="dm-form-success">{success}</div>}

          <div className="dm-form-actions">
            <button type="button" onClick={onClose} className="dm-btn-cancel">
              Cancel
            </button>
            <button type="submit" className="dm-btn-submit" disabled={loading}>
              {loading ? 'Saving...' : editingDeal ? 'Update Deal' : 'Add Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DealFormModal;
