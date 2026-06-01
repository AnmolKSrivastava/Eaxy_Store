import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import {
  fetchAllCoverageAreas,
  saveCoverageArea,
  deleteCoverageArea
} from '../../../firebase/coverageService';
import { logActivity } from '../../../firebase/activityLogger';
import { useAdmin } from '../../../contexts/AdminContext';
import './CoverageAreasManagement.css';

function CoverageAreasManagement() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    order: 0
  });
  
  const { adminSession, hasPermission } = useAdmin();

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      setLoading(true);
      const data = await fetchAllCoverageAreas();
      setAreas(data);
      setError('');
    } catch (err) {
      setError('Failed to load coverage areas');
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

    // Auto-generate ID from name (for new areas)
    if (name === 'name' && !editingArea) {
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
      setError('You do not have permission to manage coverage areas');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const areaData = {
        id: formData.id,
        name: formData.name,
        order: Number(formData.order) || 0
      };

      await saveCoverageArea(areaData);
      
      await logActivity(
        editingArea ? 'coverage_area_updated' : 'coverage_area_added',
        { areaId: areaData.id, areaName: areaData.name },
        adminSession?.email
      );
      
      setSuccess(editingArea ? 'Area updated successfully!' : 'Area added successfully!');
      
      await loadAreas();
      setShowModal(false);
      setEditingArea(null);
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save area');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (area) => {
    setEditingArea(area);
    setFormData({
      id: area.id,
      name: area.name,
      order: area.order || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (area) => {
    if (!hasPermission('products')) {
      setError('You do not have permission to delete coverage areas');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${area.name}"?`)) {
      return;
    }

    try {
      await deleteCoverageArea(area.id);
      await logActivity(
        'coverage_area_deleted',
        { areaId: area.id, areaName: area.name },
        adminSession?.email
      );
      await loadAreas();
      setSuccess('Area deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete area');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      order: 0
    });
  };

  const handleAddNew = () => {
    setEditingArea(null);
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="coverage-areas-management">
      <header className="management-header">
        <div>
          <h2>Coverage Areas</h2>
          <p>Manage delivery coverage areas displayed on homepage</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleAddNew}
          disabled={!hasPermission('products')}
        >
          <Plus size={20} />
          Add Area
        </button>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <div className="loading-state">Loading coverage areas...</div>
      ) : (
        <div className="areas-grid">
          {areas.length === 0 ? (
            <div className="empty-state">
              No coverage areas found. {hasPermission('products') && 'Add your first area to get started.'}
            </div>
          ) : (
            areas.map(area => (
              <div key={area.id} className="area-card">
                <div className="area-icon">
                  <MapPin size={32} />
                </div>
                <div className="area-info">
                  <h3>{area.name}</h3>
                  <span className="area-id">{area.id}</span>
                  <span className="order-badge">Order: {area.order}</span>
                </div>
                {hasPermission('products') && (
                  <div className="area-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(area)}
                      title="Edit Area"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => handleDelete(area)}
                      title="Delete Area"
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
              <h2>{editingArea ? 'Edit Coverage Area' : 'Add New Coverage Area'}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}>
                <Plus size={20} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">
                  Area Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Pimpri-Chinchwad"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="id">
                  Area ID <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  placeholder="e.g., pimpri-chinchwad"
                  required
                  disabled={submitting || editingArea}
                />
                <small className="form-hint">
                  Lowercase, no spaces. Auto-generated from name.
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
                  {submitting ? 'Saving...' : editingArea ? 'Update Area' : 'Add Area'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoverageAreasManagement;
