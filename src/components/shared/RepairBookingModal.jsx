import { useState } from 'react';
import { X, Calendar, Clock, MapPin, Smartphone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createRepairBooking } from '../../firebase/repairBookingService';
import './RepairBookingModal.css';

function RepairBookingModal({ service, onClose }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [bookingId, setBookingId] = useState('');

  const [formData, setFormData] = useState({
    customerName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    deviceDetails: '',
    issueDescription: '',
    preferredDate: '',
    preferredTime: '',
    pickupRequired: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.customerName || !formData.email || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Phone validation (Indian format)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone.replace(/[\s-]/g, ''))) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      const bookingData = {
        userId: currentUser?.uid || null,
        serviceId: service.id,
        serviceName: service.title,
        servicePrice: service.price,
        ...formData
      };

      const createdBookingId = await createRepairBooking(bookingData);
      setBookingId(createdBookingId);
      setSuccess(true);
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get minimum date (today)
  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Get maximum date (30 days from now)
  const getMaxDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content booking-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>

          <div className="booking-success">
            <div className="success-icon">
              <CheckCircle2 size={64} />
            </div>
            <h2>Booking Confirmed!</h2>
            <p className="booking-id">Booking ID: <strong>{bookingId}</strong></p>
            <p className="success-message">
              Thank you for choosing our services. We'll contact you shortly to confirm your appointment.
            </p>
            <div className="success-details">
              <div className="detail-item">
                <span className="label">Service:</span>
                <span className="value">{service.title}</span>
              </div>
              <div className="detail-item">
                <span className="label">Price:</span>
                <span className="value">{formatPrice(service.price)}</span>
              </div>
              {formData.preferredDate && (
                <div className="detail-item">
                  <span className="label">Preferred Date:</span>
                  <span className="value">{new Date(formData.preferredDate).toLocaleDateString('en-IN')}</span>
                </div>
              )}
            </div>
            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content booking-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>

        <div className="modal-header">
          <h2>Book Repair Service</h2>
          <p>Fill in the details below to schedule your repair</p>
        </div>

        {/* Service Summary */}
        <div className="service-summary">
          <h3>{service.title}</h3>
          <div className="summary-details">
            <span className="price">{formatPrice(service.price)}</span>
            <span className="duration">{service.duration}</span>
            <span className="warranty">{service.warranty} warranty</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          {error && (
            <div className="form-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Contact Information */}
          <div className="form-section">
            <h4>Contact Information</h4>
            
            <div className="form-group">
              <label htmlFor="customerName">Full Name *</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">
                <MapPin size={16} />
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your address for pickup/drop-off (optional)"
                rows="2"
              />
            </div>
          </div>

          {/* Device & Issue Details */}
          <div className="form-section">
            <h4>Device & Issue Details</h4>
            
            <div className="form-group">
              <label htmlFor="deviceDetails">
                <Smartphone size={16} />
                Device Details
              </label>
              <input
                type="text"
                id="deviceDetails"
                name="deviceDetails"
                value={formData.deviceDetails}
                onChange={handleChange}
                placeholder="e.g., Dell XPS 15, iPhone 14 Pro, HP Desktop"
              />
            </div>

            <div className="form-group">
              <label htmlFor="issueDescription">Issue Description</label>
              <textarea
                id="issueDescription"
                name="issueDescription"
                value={formData.issueDescription}
                onChange={handleChange}
                placeholder="Describe the problem you're experiencing..."
                rows="3"
              />
            </div>
          </div>

          {/* Scheduling */}
          <div className="form-section">
            <h4>Preferred Schedule</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="preferredDate">
                  <Calendar size={16} />
                  Preferred Date
                </label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={getMinDate()}
                  max={getMaxDate()}
                />
              </div>

              <div className="form-group">
                <label htmlFor="preferredTime">
                  <Clock size={16} />
                  Preferred Time
                </label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                >
                  <option value="">Select time slot</option>
                  <option value="09:00-12:00">Morning (9 AM - 12 PM)</option>
                  <option value="12:00-15:00">Afternoon (12 PM - 3 PM)</option>
                  <option value="15:00-18:00">Evening (3 PM - 6 PM)</option>
                  <option value="18:00-21:00">Late Evening (6 PM - 9 PM)</option>
                </select>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="pickupRequired"
                  checked={formData.pickupRequired}
                  onChange={handleChange}
                />
                <span>I need pickup service from my location</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RepairBookingModal;
