import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderOpen } from 'lucide-react';
import {
  fetchAllServiceCategories,
  addServiceCategory,
  updateServiceCategory,
  deleteServiceCategory
} from '../../../firebase/repairServicesService';
import { logActivity } from '../../../firebase/activityLogger';
import { useAdmin } from '../../../contexts/AdminContext';
import './ServiceCategoriesManagement.css';

function ServiceCategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    icon: '',
    order: 0,
    services: '',
    price: ''
  });
  
  const { adminSession, hasPermission } = useAdmin();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchAllServiceCategories();
      setCategories(data);
      setError('');
    } catch (err) {
      setError('Failed to load service categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? Number(value) : value
    }));

    // Auto-generate ID from name (for new categories)
    if (name === 'name' && !editingCategory) {
      const id = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setFormData(prev => ({
        ...prev,
        id: id
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasPermission('products')) {
      setError('You do not have permission to manage service categories');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      // Convert services string to array
      const servicesArray = typeof formData.services === 'string'
        ? formData.services.split('\n').map(s => s.trim()).filter(s => s)
        : formData.services || [];

      const categoryData = {
        id: formData.id,
        name: formData.name,
        icon: formData.icon || 'wrench',
        order: Number(formData.order) || 0,
        services: servicesArray,
        price: formData.price || ''
      };

      if (editingCategory) {
        await updateServiceCategory(editingCategory.id, categoryData);
        await logActivity(
          'service_category_updated',
          { categoryId: editingCategory.id, categoryName: categoryData.name },
          adminSession?.email
        );
        setSuccess('Category updated successfully!');
      } else {
        await addServiceCategory(categoryData);
        await logActivity(
          'service_category_added',
          { categoryId: categoryData.id, categoryName: categoryData.name },
          adminSession?.email
        );
        setSuccess('Category added successfully!');
      }

      await loadCategories();
      setShowModal(false);
      setEditingCategory(null);
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save category');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      id: category.id,
      name: category.name,
      icon: category.icon || '',
      order: category.order || 0,
      services: Array.isArray(category.services) ? category.services.join('\n') : '',
      price: category.price || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (category) => {
    if (!hasPermission('products')) {
      setError('You do not have permission to delete categories');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    try {
      await deleteServiceCategory(category.id);
      await logActivity(
        'service_category_deleted',
        { categoryId: category.id, categoryName: category.name },
        adminSession?.email
      );
      await loadCategories();
      setSuccess('Category deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete category');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      icon: '',
      order: 0,
      services: '',
      price: ''
    });
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="service-categories-management">
      <header className="management-header">
        <div>
          <h2>Service Categories</h2>
          <p>Manage repair service categories</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleAddNew}
          disabled={!hasPermission('products')}
        >
          <Plus size={20} />
          Add Category
        </button>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <div className="loading-state">Loading categories...</div>
      ) : (
        <div className="categories-grid">
          {categories.length === 0 ? (
            <div className="empty-state">
              No categories found. {hasPermission('products') && 'Add your first category to get started.'}
            </div>
          ) : (
            categories.map(category => (
              <div key={category.id} className="category-card">
                <div className="category-icon">
                  <FolderOpen size={32} />
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <span className="category-id">{category.id}</span>
                  {category.icon && <span className="icon-badge">{category.icon}</span>}
                  <span className="order-badge">Order: {category.order}</span>
                  {category.price && <span className="price-badge">{category.price}</span>}
                  {category.services && category.services.length > 0 && (
                    <div className="services-preview">
                      <strong>Services:</strong> {category.services.join(', ')}
                    </div>
                  )}
                </div>
                {hasPermission('products') && (
                  <div className="category-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(category)}
                      title="Edit Category"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => handleDelete(category)}
                      title="Delete Category"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}>
                <Plus size={20} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">
                  Category Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Laptop Repair"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="id">
                  Category ID <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  placeholder="e.g., laptop"
                  required
                  disabled={submitting || editingCategory}
                />
                <small className="form-hint">
                  Lowercase, no spaces. Auto-generated from name.
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="icon">Icon Name</label>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  placeholder="e.g., laptop, smartphone, monitor"
                  disabled={submitting}
                />
                <small className="form-hint">
                  Lucide icon name (lowercase). Default: wrench
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="order">Display Order</label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  disabled={submitting}
                />
                <small className="form-hint">
                  Lower numbers appear first
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="services">
                  Services Offered <span className="required">*</span>
                </label>
                <textarea
                  id="services"
                  name="services"
                  value={formData.services}
                  onChange={handleInputChange}
                  placeholder="Enter service names (one per line)&#10;e.g.,&#10;Screen Replacement&#10;Battery Upgrade&#10;Performance Boost&#10;Data Recovery"
                  rows="5"
                  required
                  disabled={submitting}
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                />
                <small className="form-hint">
                  Enter each service name on a new line
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="price">
                  Starting Price <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., Starting Rs 499"
                  required
                  disabled={submitting}
                />
                <small className="form-hint">
                  Display price (e.g., "Starting Rs 499", "From Rs 299")
                </small>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceCategoriesManagement;
