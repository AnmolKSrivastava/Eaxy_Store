import { useState } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Footer, Navbar } from '../components/layout';
import { allProducts } from '../data/productsData';
import './CartPage.css';

function CartPage() {
  // Mock cart data - in a real app, this would come from state management or backend
  const [cartItems, setCartItems] = useState([
    { ...allProducts[0], quantity: 1 }, // MacBook Air M2
    { ...allProducts[7], quantity: 2 }, // Samsung Galaxy S24
    { ...allProducts[13], quantity: 1 }, // AirPods Pro 2
  ]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50000 ? 0 : 500;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

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
                    key={item.id} 
                    className="cart-item reveal"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                  >
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p className="cart-item-specs">
                        {item.specs.slice(0, 2).join(' • ')}
                      </p>
                      <p className="cart-item-price">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    
                    <div className="cart-item-actions">
                      <div className="quantity-control">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                        onClick={() => removeFromCart(item.id)}
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
                  <strong>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</strong>
                </div>
                
                <div className="summary-row">
                  <span>Tax (GST 18%)</span>
                  <strong>{formatPrice(tax)}</strong>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total">
                  <span>Total</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
                
                {shipping > 0 && (
                  <p className="shipping-notice">
                    Add {formatPrice(50000 - subtotal)} more for FREE shipping
                  </p>
                )}
                
                <button className="btn btn-primary block">
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
              <ShoppingBag size={64} strokeWidth={1.5} />
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
