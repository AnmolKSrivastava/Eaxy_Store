import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';

function ProductFormModal({ product, onClose, onSave }) {
  const isEditing = !!product;
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'laptops',
    price: '',
    originalPrice: '',
    stockQuantity: '',
    badge: '',
    rating: '',
    image: '',
    specs: ['']
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || 'laptops',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        stockQuantity: product.stockQuantity || '',
        badge: product.badge || '',
        rating: product.rating || '',
        image: product.image || '',
        specs: product.specs && product.specs.length > 0 ? product.specs : ['']
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSpecChange = (index, value) => {
    const newSpecs = [...formData.specs];
    newSpecs[index] = value;
    setFormData(prev => ({
      ...prev,
      specs: newSpecs
    }));
  };

  const addSpecField = () => {
    setFormData(prev => ({
      ...prev,
      specs: [...prev.specs, '']
    }));
  };

  const removeSpecField = (index) => {
    if (formData.specs.length > 1) {
      const newSpecs = formData.specs.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        specs: newSpecs
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.stockQuantity || formData.stockQuantity < 0) {
      newErrors.stockQuantity = 'Valid stock quantity is required (0 or more)';
    }

    // Optional original price validation
    if (formData.originalPrice && parseFloat(formData.originalPrice) < parseFloat(formData.price)) {
      newErrors.originalPrice = 'Original price must be greater than current price';
    }

    // Rating validation
    if (formData.rating && (formData.rating < 0 || formData.rating > 5)) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    // Image validation
    if (!formData.image.trim()) {
      newErrors.image = 'Product image URL is required';
    }

    // Specs validation
    const validSpecs = formData.specs.filter(spec => spec.trim() !== '');
    if (validSpecs.length === 0) {
      newErrors.specs = 'At least one specification is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateSKU = (category, name) => {
    const categoryCode = category.toUpperCase().slice(0, 3);
    const nameCode = name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `SKU-${categoryCode}-${nameCode}-${randomNum}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Prepare product data
    const validSpecs = formData.specs.filter(spec => spec.trim() !== '');
    
    const productData = {
      id: product?.id || `product-${Date.now()}`,
      sku: product?.sku || generateSKU(formData.category, formData.name),
      name: formData.name.trim(),
      category: formData.category,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      badge: formData.badge.trim() || null,
      rating: formData.rating ? parseFloat(formData.rating) : 4.5,
      image: formData.image.trim(),
      specs: validSpecs,
      inStock: parseInt(formData.stockQuantity) > 0,
      lastRestocked: product?.lastRestocked || new Date().toISOString()
    };

    // Simulate API call
    setTimeout(() => {
      onSave(productData);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="modal-close" onClick={onClose} disabled={isSubmitting}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              {/* Product Name */}
              <div className="form-group full-width">
                <label htmlFor="name">
                  Product Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., MacBook Air M2"
                  className={errors.name ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <span className="error-message">
                    <AlertCircle size={14} />
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Category */}
              <div className="form-group">
                <label htmlFor="category">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  <option value="laptops">Laptops & Computers</option>
                  <option value="smartphones">Smartphones</option>
                  <option value="accessories">Accessories</option>
                  <option value="refurbished-laptops">Refurbished</option>
                </select>
              </div>

              {/* Badge */}
              <div className="form-group">
                <label htmlFor="badge">Badge (Optional)</label>
                <input
                  type="text"
                  id="badge"
                  name="badge"
                  value={formData.badge}
                  onChange={handleInputChange}
                  placeholder="e.g., Bestseller"
                  disabled={isSubmitting}
                />
              </div>

              {/* Price */}
              <div className="form-group">
                <label htmlFor="price">
                  Current Price (₹) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="84999"
                  min="0"
                  step="1"
                  className={errors.price ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.price && (
                  <span className="error-message">
                    <AlertCircle size={14} />
                    {errors.price}
                  </span>
                )}
              </div>

              {/* Original Price */}
              <div className="form-group">
                <label htmlFor="originalPrice">Original Price (₹)</label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  placeholder="94999 (optional)"
                  min="0"
                  step="1"
                  className={errors.originalPrice ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.originalPrice && (
                  <span className="error-message">
                    <AlertCircle size={14} />
                    {errors.originalPrice}
                  </span>
                )}
              </div>

              {/* Stock Quantity */}
              <div className="form-group">
                <label htmlFor="stockQuantity">
                  Stock Quantity <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="stockQuantity"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  placeholder="25"
                  min="0"
                  step="1"
                  className={errors.stockQuantity ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.stockQuantity && (
                  <span className="error-message">
                    <AlertCircle size={14} />
                    {errors.stockQuantity}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="form-group">
                <label htmlFor="rating">Rating (0-5)</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  placeholder="4.5"
                  min="0"
                  max="5"
                  step="0.1"
                  className={errors.rating ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.rating && (
                  <span className="error-message">
                    <AlertCircle size={14} />
                    {errors.rating}
                  </span>
                )}
              </div>

              {/* Image URL */}
              <div className="form-group full-width">
                <label htmlFor="image">
                  Image URL <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/product-image.jpg"
                  className={errors.image ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.image && (
                  <span className="error-message">
                    <AlertCircle size={14} />
                    {errors.image}
                  </span>
                )}
              </div>

              {/* Specifications */}
              <div className="form-group full-width">
                <label>
                  Specifications <span className="required">*</span>
                </label>
                <div className="specs-input-list">
                  {formData.specs.map((spec, index) => (
                    <div key={index} className="spec-input-row">
                      <input
                        type="text"
                        value={spec}
                        onChange={(e) => handleSpecChange(index, e.target.value)}
                        placeholder={`Specification ${index + 1}`}
                        disabled={isSubmitting}
                      />
                      {formData.specs.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-spec"
                          onClick={() => removeSpecField(index)}
                          disabled={isSubmitting}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn-add-spec"
                    onClick={addSpecField}
                    disabled={isSubmitting}
                  >
                    <Plus size={16} />
                    Add Specification
                  </button>
                </div>
                {errors.specs && (
                  <span className="error-message">
                    <AlertCircle size={14} />
                    {errors.specs}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="modal-btn secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormModal;
