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
    dealPrice: '',
    mrpPrice: '',
  });

  useEffect(() => {
    if (editingDeal) {
      setFormData({
        productId: editingDeal.productId || '',
        badge: editingDeal.badge || '',
        priority: editingDeal.priority || 1,
        isActive: editingDeal.isActive !== undefined ? editingDeal.isActive : true,
        dealPrice: editingDeal.price || '',
        mrpPrice: editingDeal.originalPrice || '',
      });
    } else {
      setFormData({
        productId: '',
        badge: '',
        priority: 1,
        isActive: true,
        dealPrice: '',
        mrpPrice: '',
      });
    }
  }, [editingDeal, show]);

  const parsedDealPrice = Number(formData.dealPrice);
  const parsedMrpPrice = Number(formData.mrpPrice);
  const discountPercent =
    Number.isFinite(parsedDealPrice)
    && Number.isFinite(parsedMrpPrice)
    && parsedDealPrice > 0
    && parsedMrpPrice > 0
    && parsedDealPrice <= parsedMrpPrice
      ? Math.round(((parsedMrpPrice - parsedDealPrice) / parsedMrpPrice) * 100)
      : null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleProductChange = (e) => {
    const { value } = e.target;
    const selectedProduct = products.find((product) => product.id === value);

    setFormData((prev) => ({
      ...prev,
      productId: value,
      dealPrice: selectedProduct?.price ?? prev.dealPrice,
      mrpPrice: selectedProduct?.originalPrice ?? selectedProduct?.price ?? prev.mrpPrice,
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
              onChange={handleProductChange}
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
              <label>Discounted Price (INR) *</label>
              <input
                type="number"
                name="dealPrice"
                value={formData.dealPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="dm-form-group">
              <label>M.R.P (INR) *</label>
              <input
                type="number"
                name="mrpPrice"
                value={formData.mrpPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>
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
                type="text"
                name="discountPercent"
                value={discountPercent !== null ? `${discountPercent}%` : 'Auto calculated'}
                readOnly
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
