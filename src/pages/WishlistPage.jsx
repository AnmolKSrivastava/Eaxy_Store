import { useState } from 'react';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { Footer, Navbar } from '../components/layout';
import { allProducts } from '../data/productsData';
import './WishlistPage.css';

function WishlistPage() {
  // Mock wishlist data - in a real app, this would come from state management or backend
  const [wishlistItems, setWishlistItems] = useState([
    allProducts[0], // MacBook Air M2
    allProducts[6], // iPhone 15 Pro
    allProducts[12], // Sony WH-1000XM5
  ]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== productId));
  };

  const moveToCart = (productId) => {
    // In a real app, this would add to cart and remove from wishlist
    console.log('Moving to cart:', productId);
    removeFromWishlist(productId);
  };

  return (
    <div className="page">
      <Navbar />
      
      <section className="wishlist-page">
        <div className="container">
          <div className="page-header reveal">
            <div>
              <h1>My Wishlist</h1>
              <p>{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later</p>
            </div>
          </div>

          {wishlistItems.length > 0 ? (
            <div className="wishlist-grid">
              {wishlistItems.map((item, idx) => (
                <article 
                  key={item.id} 
                  className="wishlist-card reveal"
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromWishlist(item.id)}
                    aria-label="Remove from wishlist"
                  >
                    <X size={18} />
                  </button>
                  
                  {item.badge && (
                    <span className="product-badge">{item.badge}</span>
                  )}
                  
                  <div className="wishlist-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  
                  <div className="wishlist-info">
                    <h3>{item.name}</h3>
                    
                    <div className="wishlist-pricing">
                      <strong className="price">{formatPrice(item.price)}</strong>
                      {item.originalPrice && (
                        <span className="original-price">{formatPrice(item.originalPrice)}</span>
                      )}
                    </div>
                    
                    <ul className="product-specs">
                      {item.specs.slice(0, 3).map((spec, i) => (
                        <li key={i}>{spec}</li>
                      ))}
                    </ul>
                    
                    <div className="wishlist-actions">
                      <button 
                        className="btn btn-primary block"
                        onClick={() => moveToCart(item.id)}
                        disabled={!item.inStock}
                      >
                        <ShoppingCart size={16} />
                        {item.inStock ? 'Move to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state reveal">
              <Heart size={64} strokeWidth={1.5} />
              <h2>Your wishlist is empty</h2>
              <p>Save items you love for later by clicking the heart icon on any product</p>
              <a href="/products" className="btn btn-primary">
                Browse Products
              </a>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default WishlistPage;
