import React, { useState, useEffect } from 'react';
import { Upload, Link as LinkIcon, X } from 'lucide-react';
import { uploadProductImage, replaceProductImage } from '../../../firebase/storageService';
import { validateImageFile, formatFileSize } from '../../../utils/imageCompression';

function ProductFormModal({
  show,
  editingProduct,
  categories,
  onClose,
  onSubmit,
  loading,
  error,
  success,
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    image: '',
    badge: '',
    rating: '4.5',
    inStock: true,
    specs: [''],
    description: '',
  });

  const [imageUpload, setImageUpload] = useState({
    useFile: true, // Toggle between file upload and URL
    file: null,
    preview: null,
    uploading: false,
    uploadProgress: 0,
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        category: editingProduct.category || '',
        price: editingProduct.price || '',
        originalPrice: editingProduct.originalPrice || '',
        image: editingProduct.image || '',
        badge: editingProduct.badge || '',
        rating: editingProduct.rating || '4.5',
        inStock: editingProduct.inStock !== undefined ? editingProduct.inStock : true,
        specs: editingProduct.specs || [''],
        description: editingProduct.description || '',
      });
      // Show existing image as preview
      if (editingProduct.image) {
        setImageUpload((prev) => ({ ...prev, preview: editingProduct.image }));
      }
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        category: '',
        price: '',
        originalPrice: '',
        image: '',
        badge: '',
        rating: '4.5',
        inStock: true,
        specs: [''],
        description: '',
      });
      setImageUpload({
        useFile: true,
        file: null,
        preview: null,
        uploading: false,
        uploadProgress: 0,
      });
    }
  }, [editingProduct, show]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      e.target.value = ''; // Reset file input
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUpload((prev) => ({
        ...prev,
        file,
        preview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageUpload((prev) => ({
      ...prev,
      file: null,
      preview: null,
    }));
    setFormData((prev) => ({ ...prev, image: '' }));
  };

  const handleSpecChange = (index, value) => {
    const newSpecs = [...formData.specs];
    newSpecs[index] = value;
    setFormData((prev) => ({ ...prev, specs: newSpecs }));
  };

  const addSpecField = () => {
    setFormData((prev) => ({ ...prev, specs: [...prev.specs, ''] }));
  };

  const removeSpecField = (index) => {
    const newSpecs = formData.specs.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, specs: newSpecs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload image if file is selected
    if (imageUpload.useFile && imageUpload.file) {
      try {
        setImageUpload((prev) => ({ ...prev, uploading: true, uploadProgress: 0 }));

        let imageUrl;
        if (editingProduct && editingProduct.image) {
          // Replace existing image
          imageUrl = await replaceProductImage(
            editingProduct.image,
            imageUpload.file,
            (progress) => {
              setImageUpload((prev) => ({ ...prev, uploadProgress: progress }));
            }
          );
        } else {
          // Upload new image
          imageUrl = await uploadProductImage(
            imageUpload.file,
            (progress) => {
              setImageUpload((prev) => ({ ...prev, uploadProgress: progress }));
            }
          );
        }

        // Update form data with uploaded image URL
        const updatedFormData = { ...formData, image: imageUrl };
        setImageUpload((prev) => ({ ...prev, uploading: false, uploadProgress: 100 }));
        
        // Submit form with uploaded image URL
        onSubmit(updatedFormData, editingProduct);
      } catch (err) {
        setImageUpload((prev) => ({ ...prev, uploading: false, uploadProgress: 0 }));
        alert('Failed to upload image: ' + err.message);
      }
    } else {
      // Submit form without uploading (using URL or no image)
      onSubmit(formData, editingProduct);
    }
  };

  if (!show) return null;

  const isUploading = imageUpload.uploading || loading;

  return (
    <div className="pm-modal-overlay" onClick={onClose}>
      <div className="pm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pm-modal-header">
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <button className="pm-modal-close" onClick={onClose} type="button">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="pm-form">
          <div className="pm-form-row">
            <div className="pm-form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isUploading}
              />
            </div>
            <div className="pm-form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                disabled={isUploading}
              >
                <option value="">
                  {categories.length === 0 
                    ? 'No categories available - Add categories first' 
                    : 'Select category'}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug || cat.title}>
                    {cat.title}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <small style={{ color: 'var(--gold)', display: 'block', marginTop: '0.5rem' }}>
                  ⚠️ Go to Categories tab to add product categories first
                </small>
              )}
            </div>
          </div>

          <div className="pm-form-row">
            <div className="pm-form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                required
                disabled={isUploading}
              />
            </div>
            <div className="pm-form-group">
              <label>Original Price (₹)</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                min="0"
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="pm-form-group">
            <label>Product Image</label>
            
            {/* Toggle between Upload and URL */}
            <div className="pm-image-toggle">
              <button
                type="button"
                className={`pm-toggle-btn ${imageUpload.useFile ? 'active' : ''}`}
                onClick={() => setImageUpload((prev) => ({ ...prev, useFile: true }))}
                disabled={isUploading}
              >
                <Upload size={16} />
                Upload File
              </button>
              <button
                type="button"
                className={`pm-toggle-btn ${!imageUpload.useFile ? 'active' : ''}`}
                onClick={() => setImageUpload((prev) => ({ ...prev, useFile: false }))}
                disabled={isUploading}
              >
                <LinkIcon size={16} />
                Use URL
              </button>
            </div>

            {imageUpload.useFile ? (
              <div className="pm-file-upload">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageFileChange}
                  disabled={isUploading}
                  style={{ display: 'none' }}
                />
                <label htmlFor="image-upload" className="pm-file-label">
                  <Upload size={20} />
                  <span>
                    {imageUpload.file
                      ? `${imageUpload.file.name} (${formatFileSize(imageUpload.file.size)})`
                      : 'Click to upload or drag & drop'}
                  </span>
                  <small>JPEG, PNG, or WebP (max 10MB)</small>
                </label>

                {imageUpload.preview && (
                  <div className="pm-image-preview">
                    <img src={imageUpload.preview} alt="Preview" />
                    <button
                      type="button"
                      className="pm-remove-image"
                      onClick={handleRemoveImage}
                      disabled={isUploading}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {imageUpload.uploading && (
                  <div className="pm-upload-progress">
                    <div className="pm-progress-bar">
                      <div
                        className="pm-progress-fill"
                        style={{ width: `${imageUpload.uploadProgress}%` }}
                      />
                    </div>
                    <span className="pm-progress-text">
                      Uploading: {imageUpload.uploadProgress}%
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                disabled={isUploading}
              />
            )}
          </div>

          <div className="pm-form-row">
            <div className="pm-form-group">
              <label>Badge</label>
              <input
                type="text"
                name="badge"
                value={formData.badge}
                onChange={handleInputChange}
                placeholder="e.g., Hot Deal, Bestseller"
                disabled={isUploading}
              />
            </div>
            <div className="pm-form-group">
              <label>Rating</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                min="0"
                max="5"
                step="0.1"
                disabled={isUploading}
              />
            </div>
          </div>

          <div className="pm-form-row">
            <div className="pm-form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Product description..."
                disabled={isUploading}
              />
            </div>
            <div className="pm-form-group pm-checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                  disabled={isUploading}
                />
                In Stock
              </label>
            </div>
          </div>

          <div className="pm-form-group">
            <label>Specifications</label>
            {formData.specs.map((spec, index) => (
              <div key={index} className="pm-spec-row">
                <input
                  type="text"
                  value={spec}
                  onChange={(e) => handleSpecChange(index, e.target.value)}
                  placeholder="e.g., 8GB RAM, M2 Chip"
                  disabled={isUploading}
                />
                {formData.specs.length > 1 && (
                  <button
                    type="button"
                    className="pm-spec-remove"
                    onClick={() => removeSpecField(index)}
                    disabled={isUploading}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="pm-spec-add"
              onClick={addSpecField}
              disabled={isUploading}
            >
              + Add Specification
            </button>
          </div>

          {error && <div className="pm-form-error">{error}</div>}
          {success && <div className="pm-form-success">{success}</div>}

          <div className="pm-form-actions">
            <button
              type="button"
              onClick={onClose}
              className="pm-btn-cancel"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button type="submit" className="pm-btn-submit" disabled={isUploading}>
              {imageUpload.uploading
                ? `Uploading ${imageUpload.uploadProgress}%...`
                : loading
                ? 'Saving...'
                : editingProduct
                ? 'Update Product'
                : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormModal;
