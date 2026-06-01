import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { Footer, Navbar } from '../components/layout';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { fetchAllProducts } from '../firebase/productsService';
import './WishlistPage.css';

function WishlistPage() {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Load products from Firebase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await fetchAllProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    
    loadProducts();
  }, []);

  // Get full product details for wishlist items
  const wishlistWithDetails = wishlistItems
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        return {
          ...product,
          addedAt: item.addedAt
        };
      }
      return null;
    })
    .filter(item => item !== null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove from wishlist. Please try again.');
    }
  };

  const handleMoveToCart = async (product) => {
    try {
      // Add to cart
      await addToCart(product, 1);
      // Remove from wishlist
      await removeFromWishlist(product.id);
    } catch (error) {
      console.error('Error moving to cart:', error);
      alert('Failed to move to cart. Please try again.');
    }
  };

  if (loading || loadingProducts) {
    return (
      <div className="page">
        <Navbar />
        <section className="wishlist-page">
          <div className="container">
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <p>Loading wishlist...</p>
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
      
      <section className="wishlist-page">
        <div className="container">
          <div className="page-header reveal">
            <div>
              <h1>My Wishlist</h1>
              <p>{wishlistWithDetails.length} {wishlistWithDetails.length === 1 ? 'item' : 'items'} saved for later</p>
            </div>
          </div>

          {wishlistWithDetails.length > 0 ? (
            <div className="wishlist-grid">
              {wishlistWithDetails.map((item, idx) => (
                <article 
                  key={item.id} 
                  className="wishlist-card reveal"
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveFromWishlist(item.id)}
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
                      {item.specs && item.specs.length > 0 ? (
                        item.specs.slice(0, 3).map((spec, i) => (
                          <li key={i}>{spec}</li>
                        ))
                      ) : (
                        <li>Product details</li>
                      )}
                    </ul>
                    
                    <div className="wishlist-actions">
                      <button 
                        className="btn btn-primary block"
                        onClick={() => handleMoveToCart(item)}
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
              <Heart size={64} strokeWidth={1.5} className="empty-icon" />
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
