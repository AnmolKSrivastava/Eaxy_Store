import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

function RepairServiceFormModal({
  show,
  editingService,
  categories,
  onClose,
  onSubmit,
  loading,
  error,
  success
}) {
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    price: '',
    duration: '',
    warranty: '',
    rating: '4.5',
    features: []
  });

  const [currentFeature, setCurrentFeature] = useState('');

  useEffect(() => {
    if (editingService) {
      setFormData({
        category: editingService.category || '',
        title: editingService.title || '',
        description: editingService.description || '',
        price: editingService.price || '',
        duration: editingService.duration || '',
        warranty: editingService.warranty || '',
        rating: editingService.rating || '4.5',
        features: editingService.features || []
      });
    } else {
      setFormData({
        category: '',
        title: '',
        description: '',
        price: '',
        duration: '',
        warranty: '',
        rating: '4.5',
        features: []
      });
    }
  }, [editingService]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddFeature = () => {
    if (currentFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()]
      }));
      setCurrentFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="category">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                disabled={loading}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <small className="form-hint warning">
                  ⚠️ No categories available. Please add service categories first.
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="title">
                Service Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Screen Replacement"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the service"
                rows="3"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">
                Price (₹) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 2999"
                min="0"
                step="1"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration">
                Duration <span className="required">*</span>
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 2-3 hours, 1 day"
                required
                disabled={loading}
              />
              <small className="form-hint">Example: "1-2 hours", "2-3 days", "30 mins"</small>
            </div>

            <div className="form-group">
              <label htmlFor="warranty">
                Warranty <span className="required">*</span>
              </label>
              <input
                type="text"
                id="warranty"
                name="warranty"
                value={formData.warranty}
                onChange={handleInputChange}
                placeholder="e.g., 6 months, 1 year"
                required
                disabled={loading}
              />
              <small className="form-hint">Example: "6 months", "1 year", "No warranty"</small>
            </div>

            <div className="form-group">
              <label htmlFor="rating">
                Rating (1-5)
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                placeholder="4.5"
                min="1"
                max="5"
                step="0.1"
                disabled={loading}
              />
            </div>

            <div className="form-group full-width">
              <label>Features</label>
              <div className="features-input">
                <input
                  type="text"
                  value={currentFeature}
                  onChange={(e) => setCurrentFeature(e.target.value)}
                  placeholder="Add a feature (e.g., Genuine Parts)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAddFeature}
                  disabled={loading || !currentFeature.trim()}
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>
              
              {formData.features.length > 0 && (
                <ul className="features-list">
                  {formData.features.map((feature, index) => (
                    <li key={index}>
                      <span>{feature}</span>
                      <button
                        type="button"
                        className="btn-icon btn-danger"
                        onClick={() => handleRemoveFeature(index)}
                        disabled={loading}
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || categories.length === 0}
            >
              {loading ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RepairServiceFormModal;
