import React from 'react';
import { X, Save, XCircle } from 'lucide-react';
import './ContentEditModal.css';

function ContentEditModal({ 
  section, 
  editForm, 
  setEditForm, 
  onClose, 
  onSave 
}) {
  const hasButton = ['hero', 'categories', 'services', 'deals', 'coverage', 'cta'].includes(section.type);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content edit-section-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit {section.name}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Section Title</label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              placeholder="Enter section title"
            />
          </div>
          <div className="form-group">
            <label>Subtitle</label>
            <input
              type="text"
              value={editForm.subtitle}
              onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
              placeholder="Enter subtitle"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              placeholder="Enter description"
              rows="4"
            />
          </div>
          {hasButton && (
            <>
              <div className="form-group">
                <label>Button Text</label>
                <input
                  type="text"
                  value={editForm.buttonText}
                  onChange={(e) => setEditForm({ ...editForm, buttonText: e.target.value })}
                  placeholder="Enter button text"
                />
              </div>
              <div className="form-group">
                <label>Button Link</label>
                <input
                  type="text"
                  value={editForm.buttonLink}
                  onChange={(e) => setEditForm({ ...editForm, buttonLink: e.target.value })}
                  placeholder="/products"
                />
              </div>
            </>
          )}
          <div className="preview-section">
            <h4>Preview</h4>
            <div className="preview-card">
              <h3>{editForm.title || 'Title'}</h3>
              <p className="preview-subtitle">{editForm.subtitle || 'Subtitle'}</p>
              <p className="preview-description">{editForm.description || 'Description'}</p>
              {editForm.buttonText && (
                <button className="preview-btn">{editForm.buttonText}</button>
              )}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            <XCircle size={18} />
            Cancel
          </button>
          <button className="save-btn" onClick={onSave}>
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContentEditModal;
