import { useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Footer, Navbar } from '../components/layout';
import { useCart } from '../contexts/CartContext';
import './CartPage.css';

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, loading, updateQuantity, removeItem, calculateTotals } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity. Please try again.');
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeItem(productId);
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item. Please try again.');
    }
  };

  const { subtotal, shippingCharges, tax, totalAmount } = calculateTotals();

  if (loading) {
    return (
      <div className="page">
        <Navbar />
        <section className="cart-page">
          <div className="container">
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <p>Loading cart...</p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />
      
      <section className="cart-page">
        <div className="container">
          <div className="page-header reveal">
            <div>
              <h1>Shopping Cart</h1>
              <p>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
            </div>
          </div>

          {cartItems.length > 0 ? (
            <div className="cart-layout">
              {/* Cart Items */}
              <div className="cart-items">
                {cartItems.map((item, idx) => (
                  <article 
                    key={item.productId} 
                    className="cart-item reveal"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                  >
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p className="cart-item-specs">
                        {item.specs && item.specs.length > 0 ? item.specs.slice(0, 2).join(' • ') : 'Product details'}
                      </p>
                      <p className="cart-item-price">
                        {formatPrice(item.price)}
                      </p>
                      {!item.inStock && (
                        <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                          Out of stock
                        </p>
                      )}
                    </div>
                    
                    <div className="cart-item-actions">
                      <div className="quantity-control">
                        <button 
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <p className="cart-item-total">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      
                      <button 
                        className="btn-remove"
                        onClick={() => handleRemoveFromCart(item.productId)}
                        aria-label="Remove from cart"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* Order Summary */}
              <aside className="order-summary reveal">
                <h2>Order Summary</h2>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>
                
                <div className="summary-row">
                  <span>Shipping</span>
                  <strong>{shippingCharges === 0 ? 'FREE' : formatPrice(shippingCharges)}</strong>
                </div>
                
                <div className="summary-row">
                  <span>Tax (GST 18%)</span>
                  <strong>{formatPrice(tax)}</strong>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total">
                  <span>Total</span>
                  <strong>{formatPrice(totalAmount)}</strong>
                </div>
                
                {shippingCharges > 0 && (
                  <p className="shipping-notice">
                    Add {formatPrice(50000 - subtotal)} more for FREE shipping
                  </p>
                )}
                
                <button 
                  className="btn btn-primary block"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </button>
                
                <a href="/products" className="continue-shopping">
                  Continue Shopping
                </a>
              </aside>
            </div>
          ) : (
            <div className="empty-state reveal">
              <ShoppingBag size={64} strokeWidth={1.5} className="empty-cart-icon" />
              <h2>Your cart is empty</h2>
              <p>Add some amazing products to your cart and they'll show up here</p>
              <a href="/products" className="btn btn-primary">
                Start Shopping
              </a>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default CartPage;
