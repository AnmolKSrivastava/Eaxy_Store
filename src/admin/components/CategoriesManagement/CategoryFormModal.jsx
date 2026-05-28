import React, { useState, useEffect } from 'react';
import { Upload, Link as LinkIcon, X } from 'lucide-react';
import { uploadCategoryImage } from '../../../firebase/storageService';
import { validateImageFile, formatFileSize } from '../../../utils/imageCompression';

function CategoryFormModal({
  show,
  editingCategory,
  onClose,
  onSubmit,
  loading,
  error,
  success,
}) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    icon: '',
    count: '',
    image: '',
    order: 0,
  });

  const [imageUpload, setImageUpload] = useState({
    useFile: true,
    file: null,
    preview: null,
    uploading: false,
    uploadProgress: 0,
  });

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        title: editingCategory.title || '',
        slug: editingCategory.slug || '',
        icon: editingCategory.icon || '',
        count: editingCategory.count || '',
        image: editingCategory.image || '',
        order: editingCategory.order || 0,
      });
      if (editingCategory.image) {
        setImageUpload((prev) => ({ ...prev, preview: editingCategory.image }));
      }
    } else {
      setFormData({
        title: '',
        slug: '',
        icon: '',
        count: '',
        image: '',
        order: 0,
      });
      setImageUpload({
        useFile: true,
        file: null,
        preview: null,
        uploading: false,
        uploadProgress: 0,
      });
    }
  }, [editingCategory, show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      e.target.value = '';
      return;
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload image if file is selected
    if (imageUpload.useFile && imageUpload.file) {
      try {
        setImageUpload((prev) => ({ ...prev, uploading: true, uploadProgress: 0 }));

        const imageUrl = await uploadCategoryImage(
          imageUpload.file,
          (progress) => {
            setImageUpload((prev) => ({ ...prev, uploadProgress: progress }));
          }
        );

        const updatedFormData = { ...formData, image: imageUrl };
        setImageUpload((prev) => ({ ...prev, uploading: false, uploadProgress: 100 }));
        
        onSubmit(updatedFormData, editingCategory);
      } catch (err) {
        setImageUpload((prev) => ({ ...prev, uploading: false, uploadProgress: 0 }));
        alert('Failed to upload image: ' + err.message);
      }
    } else {
      onSubmit(formData, editingCategory);
    }
  };

  if (!show) return null;

  const isUploading = imageUpload.uploading || loading;

  return (
    <div className="cm-modal-overlay" onClick={onClose}>
      <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cm-modal-header">
          <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
          <button className="cm-modal-close" onClick={onClose} type="button">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="cm-form">
          <div className="cm-form-group">
            <label>Category Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Laptops & Computers"
              required
              disabled={isUploading}
            />
          </div>

          <div className="cm-form-group">
            <label>Slug * (auto-generated)</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="e.g., laptops-computers"
              required
              disabled={isUploading}
            />
          </div>

          <div className="cm-form-row">
            <div className="cm-form-group">
              <label>Icon Name</label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                placeholder="e.g., laptop, smartphone"
                disabled={isUploading}
              />
              <small style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>
                Lucide icon name
              </small>
            </div>
            <div className="cm-form-group">
              <label>Item Count</label>
              <input
                type="text"
                name="count"
                value={formData.count}
                onChange={handleInputChange}
                placeholder="e.g., 150+"
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="cm-form-group">
            <label>Category Image</label>
            
            <div className="cm-image-toggle">
              <button
                type="button"
                className={`cm-toggle-btn ${imageUpload.useFile ? 'active' : ''}`}
                onClick={() => setImageUpload((prev) => ({ ...prev, useFile: true }))}
                disabled={isUploading}
              >
                <Upload size={16} />
                Upload File
              </button>
              <button
                type="button"
                className={`cm-toggle-btn ${!imageUpload.useFile ? 'active' : ''}`}
                onClick={() => setImageUpload((prev) => ({ ...prev, useFile: false }))}
                disabled={isUploading}
              >
                <LinkIcon size={16} />
                Use URL
              </button>
            </div>

            {imageUpload.useFile ? (
              <div className="cm-file-upload">
                <input
                  type="file"
                  id="category-image-upload"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageFileChange}
                  disabled={isUploading}
                  style={{ display: 'none' }}
                />
                <label htmlFor="category-image-upload" className="cm-file-label">
                  <Upload size={20} />
                  <span>
                    {imageUpload.file
                      ? `${imageUpload.file.name} (${formatFileSize(imageUpload.file.size)})`
                      : 'Click to upload category image'}
                  </span>
                  <small>JPEG, PNG, or WebP (max 10MB)</small>
                </label>

                {imageUpload.preview && (
                  <div className="cm-image-preview">
                    <img src={imageUpload.preview} alt="Preview" />
                    <button
                      type="button"
                      className="cm-remove-image"
                      onClick={handleRemoveImage}
                      disabled={isUploading}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {imageUpload.uploading && (
                  <div className="cm-upload-progress">
                    <div className="cm-progress-bar">
                      <div
                        className="cm-progress-fill"
                        style={{ width: `${imageUpload.uploadProgress}%` }}
                      />
                    </div>
                    <span className="cm-progress-text">
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

          <div className="cm-form-group">
            <label>Display Order</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              min="0"
              disabled={isUploading}
            />
            <small style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>
              Lower numbers appear first
            </small>
          </div>

          {error && <div className="cm-form-error">{error}</div>}
          {success && <div className="cm-form-success">{success}</div>}

          <div className="cm-form-actions">
            <button
              type="button"
              onClick={onClose}
              className="cm-btn-cancel"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button type="submit" className="cm-btn-submit" disabled={isUploading}>
              {imageUpload.uploading
                ? `Uploading ${imageUpload.uploadProgress}%...`
                : loading
                ? 'Saving...'
                : editingCategory
                ? 'Update Category'
                : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryFormModal;
