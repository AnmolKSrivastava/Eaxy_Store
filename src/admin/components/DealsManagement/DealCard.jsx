import React from 'react';
import { Tag, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

function DealCard({ deal, onEdit, onDelete, onToggleStatus }) {
  return (
    <div className={`dm-card ${!deal.isActive ? 'inactive' : ''}`}>
      <div className="dm-card-image">
        {deal.image ? (
          <img src={deal.image} alt={deal.productName} />
        ) : (
          <div className="dm-card-placeholder">
            <Tag size={40} />
          </div>
        )}
        <div className="dm-card-badge">{deal.badge}</div>
        {!deal.isActive && (
          <div className="dm-inactive-overlay">
            <EyeOff size={24} />
            <span>Inactive</span>
          </div>
        )}
      </div>
      <div className="dm-card-content">
        <h3>{deal.productName}</h3>
        <div className="dm-price-section">
          <span className="dm-price">₹{deal.price?.toLocaleString()}</span>
          {deal.originalPrice && deal.originalPrice > deal.price && (
            <span className="dm-original-price">₹{deal.originalPrice.toLocaleString()}</span>
          )}
        </div>
        {deal.discountPercent && (
          <div className="dm-discount">{deal.discountPercent}% OFF</div>
        )}
        <div className="dm-priority">Priority: {deal.priority}</div>
      </div>
      <div className="dm-card-actions">
        <button
          className={`dm-toggle-btn ${deal.isActive ? 'active' : 'inactive'}`}
          onClick={() => onToggleStatus(deal.id, deal.isActive)}
          title={deal.isActive ? 'Deactivate' : 'Activate'}
        >
          {deal.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
        <button
          className="dm-action-btn edit"
          onClick={() => onEdit(deal)}
          title="Edit"
        >
          <Edit2 size={16} />
        </button>
        <button
          className="dm-action-btn delete"
          onClick={() => onDelete(deal.id, deal.productName)}
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default DealCard;
