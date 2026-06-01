import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ChevronRight,
  Plus,
  Trash2
} from 'lucide-react';
import { Footer, Navbar } from '../components/layout';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  getUserAddresses, 
  addAddress, 
  setDefaultAddress, 
  deleteAddress,
  getValidAreas 
} from '../firebase/addressService';
import { createOrder } from '../firebase/orderService';
import './CheckoutPage.css';

function CheckoutPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cartItems, clearCart, calculateTotals } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Address form state
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    pincode: '',
    area: '',
    addressType: 'Home'
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    // Load user addresses
    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && currentStep < 4) {
      navigate('/cart');
    }
  }, [cartItems, currentStep, navigate]);

  const loadAddresses = async () => {
    try {
      const userAddresses = await getUserAddresses(currentUser.uid);
      setAddresses(userAddresses);
      
      // Auto-select default address
      const defaultAddr = userAddresses.find(addr => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // If this is the first address, set it as default
      const isFirstAddress = addresses.length === 0;
      const addressDataToSave = {
        ...addressForm,
        isDefault: isFirstAddress
      };
      
      console.log('Saving address:', addressDataToSave);
      const addressId = await addAddress(currentUser.uid, addressDataToSave);
      console.log('Address saved successfully with ID:', addressId);
      
      await loadAddresses();
      setShowAddressForm(false);
      setSuccessMessage('Address added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setAddressForm({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        pincode: '',
        area: '',
        addressType: 'Home'
      });
    } catch (error) {
      console.error('Error adding address:', error);
      setError(error.message || 'Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress(addressId);
      await loadAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      await deleteAddress(addressId);
      await loadAddresses();
      if (selectedAddress?.id === addressId) {
        setSelectedAddress(null);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const totals = calculateTotals();
      
      const orderData = {
        userId: currentUser.uid,
        items: cartItems,
        customer: {
          name: currentUser.displayName || selectedAddress.fullName,
          email: currentUser.email,
          phone: selectedAddress.phone
        },
        deliveryAddress: selectedAddress,
        subtotal: totals.subtotal,
        shippingCharges: totals.shippingCharges,
        tax: totals.tax,
        totalAmount: totals.totalAmount,
        paymentMethod: 'pending', // No payment integration yet
        notes: ''
      };

      const createdOrderId = await createOrder(orderData);
      setOrderId(createdOrderId);
      await clearCart();
      setCurrentStep(4); // Move to confirmation step
    } catch (error) {
      setError(error.message);
      console.error('Error placing order:', error);
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

  const totals = calculateTotals();
  const validAreas = getValidAreas();

  const steps = [
    { number: 1, label: 'Cart', icon: ShoppingCart },
    { number: 2, label: 'Address', icon: MapPin },
    { number: 3, label: 'Payment', icon: CreditCard },
    { number: 4, label: 'Confirmation', icon: CheckCircle2 }
  ];

  return (
    <div className="page">
      <Navbar />

      <section className="checkout-page">
        <div className="container">
          <h1 className="page-title reveal">Checkout</h1>

          {/* Progress Steps */}
          <div className="checkout-steps reveal">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.number}
                  className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep === step.number ? 'current' : ''}`}
                >
                  <div className="step-icon">
                    <Icon size={20} />
                  </div>
                  <span className="step-label">{step.label}</span>
                  {idx < steps.length - 1 && <ChevronRight className="step-arrow" size={16} />}
                </div>
              );
            })}
          </div>

          <div className="checkout-layout">
            {/* Main Content */}
            <div className="checkout-main">
              {error && (
                <div className="error-message reveal">
                  {error}
                </div>
              )}
              
              {successMessage && (
                <div className="success-message reveal" style={{
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '0.5rem',
                  color: '#10b981'
                }}>
                  {successMessage}
                </div>
              )}

              {/* Step 1: Cart Review */}
              {currentStep === 1 && (
                <div className="checkout-step reveal">
                  <h2>Review Your Cart</h2>
                  <div className="cart-items-list">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="cart-item-row">
                        <img src={item.image} alt={item.name} />
                        <div className="item-details">
                          <h3>{item.name}</h3>
                          <p className="item-qty">Qty: {item.quantity}</p>
                        </div>
                        <div className="item-price">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => setCurrentStep(2)}
                  >
                    Continue to Address
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}

              {/* Step 2: Delivery Address */}
              {currentStep === 2 && (
                <div className="checkout-step reveal">
                  <div className="step-header">
                    <h2>Delivery Address</h2>
                    <button
                      className="btn btn-ghost"
                      onClick={() => setShowAddressForm(!showAddressForm)}
                    >
                      <Plus size={16} />
                      Add New Address
                    </button>
                  </div>

                  {showAddressForm && (
                    <form className="address-form" onSubmit={handleAddAddress}>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Full Name *</label>
                          <input
                            type="text"
                            required
                            value={addressForm.fullName}
                            onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone *</label>
                          <input
                            type="tel"
                            required
                            pattern="[0-9]{10}"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Address Line 1 *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.addressLine1}
                          onChange={(e) => setAddressForm({...addressForm, addressLine1: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Address Line 2</label>
                        <input
                          type="text"
                          value={addressForm.addressLine2}
                          onChange={(e) => setAddressForm({...addressForm, addressLine2: e.target.value})}
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Landmark</label>
                          <input
                            type="text"
                            value={addressForm.landmark}
                            onChange={(e) => setAddressForm({...addressForm, landmark: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label>Pincode *</label>
                          <input
                            type="text"
                            required
                            pattern="[0-9]{6}"
                            value={addressForm.pincode}
                            onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Delivery Area *</label>
                          <select
                            required
                            value={addressForm.area}
                            onChange={(e) => setAddressForm({...addressForm, area: e.target.value})}
                          >
                            <option value="">Select Area</option>
                            {validAreas.map(area => (
                              <option key={area} value={area}>{area}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Address Type</label>
                          <select
                            value={addressForm.addressType}
                            onChange={(e) => setAddressForm({...addressForm, addressType: e.target.value})}
                          >
                            <option value="Home">Home</option>
                            <option value="Office">Office</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                          {loading ? 'Saving...' : 'Save Address'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => setShowAddressForm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="addresses-list">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`address-card ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                        onClick={() => setSelectedAddress(address)}
                      >
                        <div className="address-header">
                          <h3>{address.fullName}</h3>
                          <span className="address-type">{address.addressType}</span>
                          {address.isDefault && <span className="default-badge">Default</span>}
                        </div>
                        <p>{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        <p>{address.area}, Pune - {address.pincode}</p>
                        <p className="address-phone">Phone: {address.phone}</p>
                        <div className="address-actions">
                          {!address.isDefault && (
                            <button
                              className="btn-link"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetDefault(address.id);
                              }}
                            >
                              Set as Default
                            </button>
                          )}
                          <button
                            className="btn-link danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddress(address.id);
                            }}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="step-navigation">
                    <button
                      className="btn btn-ghost"
                      onClick={() => setCurrentStep(1)}
                    >
                      Back to Cart
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => setCurrentStep(3)}
                      disabled={!selectedAddress}
                    >
                      Continue to Payment
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method */}
              {currentStep === 3 && (
                <div className="checkout-step reveal">
                  <h2>Payment Method</h2>
                  <div className="payment-info">
                    <CreditCard size={48} style={{ color: 'var(--muted)' }} />
                    <h3>Payment Integration Coming Soon</h3>
                    <p>We're working on integrating a secure payment gateway. For now, you can place your order and pay on delivery.</p>
                    <p className="note">Your order will be marked as "Pending Payment"</p>
                  </div>

                  <div className="step-navigation">
                    <button
                      className="btn btn-ghost"
                      onClick={() => setCurrentStep(2)}
                    >
                      Back to Address
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handlePlaceOrder}
                      disabled={loading}
                    >
                      {loading ? 'Placing Order...' : 'Place Order'}
                      <CheckCircle2 size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Order Confirmation */}
              {currentStep === 4 && orderId && (
                <div className="checkout-step confirmation reveal">
                  <div className="confirmation-icon">
                    <CheckCircle2 size={64} stroke="var(--primary)" />
                  </div>
                  <h2>Order Placed Successfully!</h2>
                  <p className="order-id">Order ID: <strong>{orderId}</strong></p>
                  <p className="delivery-info">
                    Your order will be delivered within 4 hours to:
                  </p>
                  <div className="delivery-address">
                    <MapPin size={20} />
                    <div>
                      <p><strong>{selectedAddress?.fullName}</strong></p>
                      <p>{selectedAddress?.addressLine1}</p>
                      <p>{selectedAddress?.area}, Pune - {selectedAddress?.pincode}</p>
                    </div>
                  </div>
                  <div className="confirmation-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate('/orders')}
                    >
                      View Order Details
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => navigate('/products')}
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            {currentStep < 4 && (
              <aside className="order-summary reveal">
                <h2>Order Summary</h2>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>{formatPrice(totals.subtotal)}</strong>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <strong>{totals.shippingCharges === 0 ? 'FREE' : formatPrice(totals.shippingCharges)}</strong>
                </div>
                <div className="summary-row">
                  <span>Tax (GST 18%)</span>
                  <strong>{formatPrice(totals.tax)}</strong>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total</span>
                  <strong>{formatPrice(totals.totalAmount)}</strong>
                </div>
                {totals.shippingCharges > 0 && (
                  <p className="shipping-notice">
                    Add {formatPrice(50000 - totals.subtotal)} more for FREE shipping
                  </p>
                )}
              </aside>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default CheckoutPage;
