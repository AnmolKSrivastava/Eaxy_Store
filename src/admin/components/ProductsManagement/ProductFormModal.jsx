import React, { useState, useEffect } from 'react';
import { Upload, Link as LinkIcon, X } from 'lucide-react';
import { uploadMultipleProductImages, deleteMultipleImages } from '../../../firebase/storageService';
import { validateImageFile } from '../../../utils/imageCompression';

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
    brand: '',
    modelNumber: '',
    productCode: '',
    partNumber: '',
    warranty: '',
    shippingNote: '',
    customerCare: '',
    emiNote: '',
    price: '',
    originalPrice: '',
    image: '',
    images: [],
    badge: '',
    rating: '4.5',
    inStock: true,
    isRefurbished: false,
    specs: [''],
    techSpecsText: '',
    description: '',
    includedInBoxText: '',
    offersText: '',
    faqText: '',
  });

  const [imageUpload, setImageUpload] = useState({
    useFile: true,
    files: [],
    previews: [],
    uploading: false,
    uploadProgress: 0,
    currentUploading: 0,
    totalFiles: 0,
  });

  useEffect(() => {
    if (editingProduct) {
      const images = editingProduct.images || (editingProduct.image ? [editingProduct.image] : []);

      setFormData({
        name: editingProduct.name || '',
        category: editingProduct.category || '',
        brand: editingProduct.brand || '',
        modelNumber: editingProduct.modelNumber || '',
        productCode: editingProduct.productCode || '',
        partNumber: editingProduct.partNumber || '',
        warranty: editingProduct.warranty || '',
        shippingNote: editingProduct.shippingNote || '',
        customerCare: editingProduct.customerCare || '',
        emiNote: editingProduct.emiNote || '',
        price: editingProduct.price || '',
        originalPrice: editingProduct.originalPrice || '',
        image: editingProduct.image || images[0] || '',
        images,
        badge: editingProduct.badge || '',
        rating: editingProduct.rating || '4.5',
        inStock: editingProduct.inStock !== undefined ? editingProduct.inStock : true,
        isRefurbished: editingProduct.isRefurbished !== undefined
          ? editingProduct.isRefurbished
          : false,
        specs: editingProduct.specs || [''],
        techSpecsText: Array.isArray(editingProduct.techSpecs)
          ? editingProduct.techSpecs
              .map((item) => `${item.label || ''} | ${item.value || ''}`)
              .join('\n')
          : '',
        description: editingProduct.description || '',
        includedInBoxText: Array.isArray(editingProduct.includedInBox)
          ? editingProduct.includedInBox.join('\n')
          : '',
        offersText: Array.isArray(editingProduct.offers)
          ? editingProduct.offers.join('\n')
          : '',
        faqText: Array.isArray(editingProduct.faq)
          ? editingProduct.faq
              .map((item) => (typeof item === 'string'
                ? item
                : `${item.question || ''} | ${item.answer || ''}`))
              .join('\n')
          : '',
      });

      if (images.length > 0) {
        setImageUpload((prev) => ({ 
          ...prev, 
          previews: images,
          files: [],
        }));
      } else {
        setImageUpload((prev) => ({
          ...prev,
          previews: [],
          files: [],
        }));
      }
    } else {
      setFormData({
        name: '',
        category: '',
        brand: '',
        modelNumber: '',
        productCode: '',
        partNumber: '',
        warranty: '',
        shippingNote: '',
        customerCare: '',
        emiNote: '',
        price: '',
        originalPrice: '',
        image: '',
        images: [],
        badge: '',
        rating: '4.5',
        inStock: true,
        isRefurbished: false,
        specs: [''],
        techSpecsText: '',
        description: '',
        includedInBoxText: '',
        offersText: '',
        faqText: '',
      });
      setImageUpload({
        useFile: true,
        files: [],
        previews: [],
        uploading: false,
        uploadProgress: 0,
        currentUploading: 0,
        totalFiles: 0,
      });
    }
  }, [editingProduct, show]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      if (name === 'image') {
        return {
          ...prev,
          image: value,
          images: value ? [value] : [],
        };
      }

      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
    });
  };

  const handleImageFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const validFiles = [];
    const invalidFiles = [];

    selectedFiles.forEach(file => {
      const validation = validateImageFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        invalidFiles.push({ name: file.name, error: validation.error });
      }
    });

    if (invalidFiles.length > 0) {
      alert(`Some files were invalid:\n${invalidFiles.map(f => `${f.name}: ${f.error}`).join('\n')}`);
    }

    if (validFiles.length === 0) {
      e.target.value = '';
      return;
    }

    const newPreviews = [];
    let loadedCount = 0;

    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews[index] = reader.result;
        loadedCount++;

        if (loadedCount === validFiles.length) {
          setImageUpload((prev) => ({
            ...prev,
            files: [...prev.files, ...validFiles],
            previews: [...prev.previews, ...newPreviews],
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = ''; // Reset input to allow re-selecting same files
  };

  const handleRemoveImage = (index) => {
    const existingCount = formData.images.length;

    setImageUpload((prev) => {
      const fileIndex = index - existingCount;
      const newFiles = fileIndex >= 0
        ? prev.files.filter((_, i) => i !== fileIndex)
        : prev.files;
      const newPreviews = prev.previews.filter((_, i) => i !== index);

      return {
        ...prev,
        files: newFiles,
        previews: newPreviews,
      };
    });

    if (index < existingCount) {
      setFormData((prev) => {
        const updatedImages = prev.images.filter((_, i) => i !== index);
        return {
          ...prev,
          images: updatedImages,
          image: updatedImages[0] || '',
        };
      });
    }
  };

  const handleRemoveAllImages = () => {
    setImageUpload((prev) => ({
      ...prev,
      files: [],
      previews: [],
    }));

    setFormData((prev) => ({
      ...prev,
      image: '',
      images: [],
    }));
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

    if (imageUpload.useFile && imageUpload.files.length > 0) {
      try {
        setImageUpload((prev) => ({ 
          ...prev, 
          uploading: true, 
          uploadProgress: 0,
          currentUploading: 0,
          totalFiles: prev.files.length,
        }));

        const newImageUrls = await uploadMultipleProductImages(
          imageUpload.files,
          (progress, current, total) => {
            setImageUpload((prev) => ({ 
              ...prev, 
              uploadProgress: progress,
              currentUploading: current,
              totalFiles: total,
            }));
          }
        );

        if (editingProduct) {
          const oldImages = editingProduct.images || (editingProduct.image ? [editingProduct.image] : []);
          const removedImages = oldImages.filter(url => !formData.images.includes(url));
          if (removedImages.length > 0) {
            await deleteMultipleImages(removedImages);
          }
        }

        const allImages = [...formData.images, ...newImageUrls];

        const updatedFormData = { 
          ...formData, 
          images: allImages,
          image: allImages[0] || '',
        };

        setImageUpload((prev) => ({ ...prev, uploading: false, uploadProgress: 100 }));

        onSubmit(updatedFormData, editingProduct);
      } catch (err) {
        setImageUpload((prev) => ({ ...prev, uploading: false, uploadProgress: 0 }));
        alert('Failed to upload images: ' + err.message);
      }
      return;
    }

    if (!imageUpload.useFile) {
      const urlImages = formData.image ? [formData.image] : [];
      onSubmit(
        {
          ...formData,
          images: urlImages,
          image: formData.image || '',
        },
        editingProduct
      );
    } else {
      const updatedFormData = {
        ...formData,
        image: formData.images[0] || '',
      };
      onSubmit(updatedFormData, editingProduct);
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
              <label>Brand *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="e.g., Apple, Samsung"
                required
                disabled={isUploading}
              />
            </div>
            <div className="pm-form-group">
              <label>Model Number *</label>
              <input
                type="text"
                name="modelNumber"
                value={formData.modelNumber}
                onChange={handleInputChange}
                placeholder="e.g., A2992"
                required
                disabled={isUploading}
              />
            </div>
          </div>

          <div className="pm-form-row">
            <div className="pm-form-group">
              <label>Product Code *</label>
              <input
                type="text"
                name="productCode"
                value={formData.productCode}
                onChange={handleInputChange}
                placeholder="e.g., EAXY-IP15-128-BLK"
                required
                disabled={isUploading}
              />
            </div>
            <div className="pm-form-group">
              <label>Part Number</label>
              <input
                type="text"
                name="partNumber"
                value={formData.partNumber}
                onChange={handleInputChange}
                placeholder="e.g., 90NB17T2-M00020"
                disabled={isUploading}
              />
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

          <div className="pm-form-row">
            <div className="pm-form-group">
              <label>Warranty</label>
              <input
                type="text"
                name="warranty"
                value={formData.warranty}
                onChange={handleInputChange}
                placeholder="e.g., 1 Year Warranty"
                disabled={isUploading}
              />
            </div>
            <div className="pm-form-group">
              <label>EMI / Payment Note</label>
              <input
                type="text"
                name="emiNote"
                value={formData.emiNote}
                onChange={handleInputChange}
                placeholder="e.g., No Cost EMI available on select cards"
                disabled={isUploading}
              />
            </div>
          </div>

          <div className="pm-form-row">
            <div className="pm-form-group">
              <label>Shipping Note</label>
              <input
                type="text"
                name="shippingNote"
                value={formData.shippingNote}
                onChange={handleInputChange}
                placeholder="e.g., Free shipping on all orders"
                disabled={isUploading}
              />
            </div>
            <div className="pm-form-group">
              <label>Customer Care</label>
              <input
                type="text"
                name="customerCare"
                value={formData.customerCare}
                onChange={handleInputChange}
                placeholder="e.g., 1800-266-4416 | support@example.com"
                disabled={isUploading}
              />
            </div>
          </div>

          <div className="pm-form-row">
            <div className="pm-form-group pm-form-group-full">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Product description..."
                required
                disabled={isUploading}
              />
            </div>
          </div>

          <div className="pm-form-row">
            <div className="pm-form-group">
              <label>Included In The Box</label>
              <textarea
                name="includedInBoxText"
                value={formData.includedInBoxText}
                onChange={handleInputChange}
                rows="4"
                placeholder="One item per line"
                disabled={isUploading}
              />
              <small>Enter one included item per line.</small>
            </div>
            <div className="pm-form-group">
              <label>Offers</label>
              <textarea
                name="offersText"
                value={formData.offersText}
                onChange={handleInputChange}
                rows="4"
                placeholder="One offer per line"
                disabled={isUploading}
              />
              <small>Enter one offer per line.</small>
            </div>
          </div>

          <div className="pm-form-row">
            <div className="pm-form-group pm-form-group-full">
              <label>FAQ</label>
              <textarea
                name="faqText"
                value={formData.faqText}
                onChange={handleInputChange}
                rows="4"
                placeholder="Question | Answer"
                disabled={isUploading}
              />
              <small>Use one FAQ per line in the format: Question | Answer</small>
            </div>
          </div>

          <div className="pm-form-row">
            <div className="pm-form-group pm-form-group-full">
              <label>Structured Tech Specs</label>
              <textarea
                name="techSpecsText"
                value={formData.techSpecsText}
                onChange={handleInputChange}
                rows="5"
                placeholder="Processor | Intel Core i5&#10;Memory | 16GB DDR4&#10;Storage | 512GB SSD"
                disabled={isUploading}
              />
              <small>Use one spec per line in the format: Label | Value</small>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="pm-form-group">
            <label>
              Product Images
              {imageUpload.previews.length > 0 && (
                <span className="pm-image-count"> ({imageUpload.previews.length} image{imageUpload.previews.length !== 1 ? 's' : ''})</span>
              )}
            </label>
            
            {/* Toggle between Upload and URL */}
            <div className="pm-image-toggle">
              <button
                type="button"
                className={`pm-toggle-btn ${imageUpload.useFile ? 'active' : ''}`}
                onClick={() => setImageUpload((prev) => ({ ...prev, useFile: true }))}
                disabled={isUploading}
              >
                <Upload size={16} />
                Upload Files
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
                  multiple
                  onChange={handleImageFileChange}
                  disabled={isUploading}
                  style={{ display: 'none' }}
                />
                <label htmlFor="image-upload" className="pm-file-label">
                  <Upload size={20} />
                  <span>
                    {imageUpload.files.length > 0
                      ? `${imageUpload.files.length} file${imageUpload.files.length !== 1 ? 's' : ''} selected`
                      : 'Click to upload or drag & drop multiple images'}
                  </span>
                  <small>JPEG, PNG, or WebP (max 10MB each) • Select multiple files</small>
                </label>

                {imageUpload.previews.length > 0 && (
                  <div className="pm-images-grid">
                    {imageUpload.previews.map((preview, index) => (
                      <div key={index} className="pm-image-preview-item">
                        <img src={preview} alt={`Preview ${index + 1}`} />
                        <div className="pm-image-preview-overlay">
                          <span className="pm-image-number">{index + 1}</span>
                          {index === 0 && <span className="pm-primary-badge">Primary</span>}
                          <button
                            type="button"
                            className="pm-remove-image-btn"
                            onClick={() => handleRemoveImage(index)}
                            disabled={isUploading}
                            title="Remove image"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {imageUpload.previews.length > 0 && (
                  <button
                    type="button"
                    className="pm-clear-images-btn"
                    onClick={handleRemoveAllImages}
                    disabled={isUploading}
                  >
                    <X size={16} />
                    Clear All Images
                  </button>
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
                      ({imageUpload.currentUploading} of {imageUpload.totalFiles} images)
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
            <div className="pm-form-group pm-checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isRefurbished"
                  checked={formData.isRefurbished}
                  onChange={handleInputChange}
                  disabled={isUploading}
                />
                Refurbished Product
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
