import { Edit2, Trash2, Clock, Shield, Star } from 'lucide-react';

function RepairServiceCard({ service, onEdit, onDelete, canEdit }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="repair-service-card">
      <div className="service-card-header">
        <div>
          <h3>{service.title}</h3>
          <span className="category-badge">{service.category}</span>
        </div>
        {canEdit && (
          <div className="card-actions">
            <button
              className="btn-icon"
              onClick={() => onEdit(service)}
              title="Edit Service"
            >
              <Edit2 size={18} />
            </button>
            <button
              className="btn-icon btn-danger"
              onClick={() => onDelete(service)}
              title="Delete Service"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <p className="service-description">{service.description}</p>

      <div className="service-meta">
        <div className="meta-item">
          <span className="price-label">Price</span>
          <span className="price-value">{formatPrice(service.price)}</span>
        </div>
        <div className="meta-item">
          <Clock size={14} />
          <span>{service.duration}</span>
        </div>
        <div className="meta-item">
          <Shield size={14} />
          <span>{service.warranty}</span>
        </div>
        <div className="meta-item">
          <Star size={14} fill="var(--gold)" color="var(--gold)" />
          <span>{service.rating}</span>
        </div>
      </div>

      {service.features && service.features.length > 0 && (
        <div className="service-features">
          <strong>Features:</strong>
          <ul>
            {service.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RepairServiceCard;
