import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { Footer, Navbar } from '../components/layout';
import { ReviewSection } from '../components/shared';
import { fetchProductById, fetchProductsByCategory } from '../firebase/productsService';
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const productData = await fetchProductById(productId);
        if (!productData) {
          setError('Product not found');
          return;
        }
        
        setProduct(productData);
        setSelectedImage(0);

        // Load related products from same category
        if (productData.category) {
          const categoryProducts = await fetchProductsByCategory(productData.category);
          const filtered = categoryProducts
            .filter(p => p.id !== productId)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (err) {
        setError('Failed to load product: ' + err.message);
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [productId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscount = () => {
    if (product?.originalPrice && product?.price) {
      const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log('Add to cart:', { product, quantity });
  };

  const handleAddToWishlist = () => {
    // TODO: Implement wishlist functionality
    console.log('Add to wishlist:', product);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  if (loading) {
    return (
      <div className="page">
        <Navbar />
        <section className="section">
          <div className="container">
            <div className="product-detail-loading">
              <p>Loading product...</p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page">
        <Navbar />
        <section className="section">
          <div className="container">
            <div className="product-detail-error">
              <AlertCircle size={48} />
              <p>{error || 'Product not found'}</p>
              <button className="btn btn-primary" onClick={() => navigate('/products')}>
                Browse Products
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const images = product.image ? [product.image] : [];
  const isRefurbished = product.category && product.category.toLowerCase().includes('refurbish');

  return (
    <div className="page">
      <Navbar />

      <section className="section product-detail-section">
        <div className="container">
          {/* Back Button */}
          <button className="back-btn reveal" onClick={() => navigate('/products')}>
            <ArrowLeft size={20} />
            Back to Products
          </button>

          <div className="product-detail-grid">
            {/* Image Gallery */}
            <div className="product-gallery reveal">
              <div className="gallery-main">
                <img 
                  src={images[selectedImage] || product.image} 
                  alt={product.name}
                  className="main-image"
                />
                {product.badge && (
                  <span className="gallery-badge">{product.badge}</span>
                )}
                {!product.inStock && (
                  <span className="gallery-badge out-of-stock">Out of Stock</span>
                )}
              </div>
              {images.length > 1 && (
                <div className="gallery-thumbnails">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                      onClick={() => setSelectedImage(idx)}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="product-detail-info reveal">
              <div className="product-header">
                <h1>{product.name}</h1>
                {isRefurbished && (
                  <span className="refurbished-tag">Refurbished</span>
                )}
              </div>

              {product.rating && (
                <div className="product-rating-row">
                  <div className="rating-stars">
                    <Star size={18} fill="var(--gold)" stroke="var(--gold)" />
                    <span className="rating-value">{product.rating}</span>
                    {product.reviewCount && (
                      <span className="review-count">({product.reviewCount} reviews)</span>
                    )}
                  </div>
                </div>
              )}

              <div className="product-pricing">
                <div className="price-main">
                  <span className="current-price">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <>
                      <span className="original-price">{formatPrice(product.originalPrice)}</span>
                      <span className="discount-badge">{calculateDiscount()}% OFF</span>
                    </>
                  )}
                </div>
                <p className="price-note">Inclusive of all taxes</p>
              </div>

              {/* Specs */}
              {Array.isArray(product.specs) && product.specs.length > 0 && (
                <div className="product-specs-section">
                  <h3>Key Specifications</h3>
                  <ul className="specs-list">
                    {product.specs.map((spec, idx) => (
                      <li key={idx}>
                        <Check size={16} />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="product-description">
                  <h3>Description</h3>
                  <p>{product.description}</p>
                </div>
              )}

              {/* Stock Status */}
              <div className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                {product.inStock ? (
                  <>
                    <Check size={18} />
                    <span>In Stock</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={18} />
                    <span>Out of Stock</span>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="product-actions">
                {product.inStock && (
                  <div className="quantity-selector">
                    <label>Quantity:</label>
                    <div className="quantity-controls">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                      <span>{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                  </div>
                )}

                <div className="action-buttons">
                  <button 
                    className="btn btn-primary btn-large"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart size={20} />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  <button className="btn btn-ghost icon-btn" onClick={handleAddToWishlist}>
                    <Heart size={20} />
                  </button>
                  <button className="btn btn-ghost icon-btn" onClick={handleShare}>
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          {product && (
            <ReviewSection 
              type="product" 
              itemId={product.id} 
              itemName={product.name} 
            />
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="related-products-section reveal">
              <h2>Related Products</h2>
              <div className="related-products-grid">
                {relatedProducts.map((relatedProduct) => (
                  <article 
                    key={relatedProduct.id} 
                    className="related-product-card"
                    onClick={() => navigate(`/products/${relatedProduct.id}`)}
                  >
                    <div className="related-product-image">
                      <img src={relatedProduct.image} alt={relatedProduct.name} />
                    </div>
                    <div className="related-product-info">
                      <h4>{relatedProduct.name}</h4>
                      <div className="related-product-price">
                        <span className="price">{formatPrice(relatedProduct.price)}</span>
                        {relatedProduct.originalPrice && (
                          <span className="original">{formatPrice(relatedProduct.originalPrice)}</span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ProductDetailPage;
