import React from 'react';
import { FolderOpen, Edit2, Trash2 } from 'lucide-react';

function CategoryCard({ category, onEdit, onDelete }) {
  return (
    <div className="cm-card">
      <div className="cm-card-image">
        {category.image ? (
          <img src={category.image} alt={category.title} />
        ) : (
          <div className="cm-card-placeholder">
            <FolderOpen size={40} />
          </div>
        )}
      </div>
      <div className="cm-card-content">
        <h3>{category.title}</h3>
        <div className="cm-card-details">
          <span className="cm-slug">{category.slug}</span>
          {category.count && <span className="cm-count">{category.count} items</span>}
        </div>
        {category.icon && (
          <span className="cm-icon-badge">Icon: {category.icon}</span>
        )}
      </div>
      <div className="cm-card-actions">
        <button
          className="cm-action-btn edit"
          onClick={() => onEdit(category)}
          title="Edit"
        >
          <Edit2 size={16} />
        </button>
        <button
          className="cm-action-btn delete"
          onClick={() => onDelete(category.id, category.title)}
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default CategoryCard;
