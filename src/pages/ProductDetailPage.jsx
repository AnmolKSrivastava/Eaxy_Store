import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Check,
  AlertCircle,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Headphones,
  BadgePercent,
  CreditCard,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Footer, Navbar } from '../components/layout';
import { ReviewSection } from '../components/shared';
import { fetchProductById, fetchProductsByCategory } from '../firebase/productsService';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [thumbnailStart, setThumbnailStart] = useState(0);
  const [zoomState, setZoomState] = useState({ visible: false, x: 50, y: 50 });
  const zoomFrameRef = useRef(null);

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
        setActiveTab('overview');
        setThumbnailStart(0);
        setZoomState({ visible: false, x: 50, y: 50 });

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

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setAddingToCart(true);
      await addToCart(product, quantity);
      setCartSuccess(true);
      
      // Reset success message after 2 seconds
      setTimeout(() => setCartSuccess(false), 2000);
      
      // Reset quantity to 1
      setQuantity(1);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add to cart. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;
    
    try {
      await toggleWishlist(product.id);
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      setError('Failed to update wishlist. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (zoomFrameRef.current) {
        cancelAnimationFrame(zoomFrameRef.current);
      }
    };
  }, []);

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

  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
      ? [product.image] 
      : [];
  const isRefurbished = product.isRefurbished !== undefined
    ? product.isRefurbished
    : Boolean(product.category && product.category.toLowerCase().includes('refurbish'));
  const productHighlights = Array.isArray(product.specs)
    ? product.specs.filter(Boolean).slice(0, 6)
    : [];
  const productDescription = product.description || 'No description available for this product.';
  const savings = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;
  const productOffers = Array.isArray(product.offers) ? product.offers.filter(Boolean) : [];
  const includedInBox = Array.isArray(product.includedInBox) ? product.includedInBox.filter(Boolean) : [];
  const productFaqs = Array.isArray(product.faq)
    ? product.faq
        .map((item) => (typeof item === 'string'
          ? { question: item, answer: '' }
          : item))
        .filter((item) => item?.question)
    : [];
  const structuredTechSpecs = Array.isArray(product.techSpecs)
    ? product.techSpecs.filter((item) => item?.label && item?.value)
    : [];
  const tabItems = [
    { key: 'overview', label: 'Overview' },
    { key: 'specs', label: 'Tech Specs' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'faq', label: 'FAQ' },
    { key: 'offers', label: 'Offers' },
  ];
  const visibleThumbnailCount = 4;
  const maxThumbnailStart = Math.max(0, images.length - visibleThumbnailCount);
  const visibleThumbnails = images.slice(
    thumbnailStart,
    thumbnailStart + visibleThumbnailCount
  );

  const handleSelectImage = (index) => {
    setSelectedImage(index);

    if (index < thumbnailStart) {
      setThumbnailStart(index);
      return;
    }

    if (index >= thumbnailStart + visibleThumbnailCount) {
      setThumbnailStart(index - visibleThumbnailCount + 1);
    }
  };

  const handleThumbnailStep = (direction) => {
    setThumbnailStart((current) => {
      const next = current + direction;
      return Math.min(Math.max(0, next), maxThumbnailStart);
    });
  };

  const handleGalleryPrevious = () => {
    if (images.length === 0) return;
    const nextIndex = selectedImage === 0 ? images.length - 1 : selectedImage - 1;
    handleSelectImage(nextIndex);
  };

  const handleGalleryNext = () => {
    if (images.length === 0) return;
    const nextIndex = selectedImage === images.length - 1 ? 0 : selectedImage + 1;
    handleSelectImage(nextIndex);
  };

  const handleZoomMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    if (zoomFrameRef.current) {
      cancelAnimationFrame(zoomFrameRef.current);
    }

    zoomFrameRef.current = requestAnimationFrame(() => {
      setZoomState({
        visible: true,
        x: Math.min(100, Math.max(0, x)),
        y: Math.min(100, Math.max(0, y)),
      });
    });
  };

  const handleZoomLeave = () => {
    if (zoomFrameRef.current) {
      cancelAnimationFrame(zoomFrameRef.current);
      zoomFrameRef.current = null;
    }
    setZoomState((current) => ({ ...current, visible: false }));
  };

  return (
    <div className="page">
      <Navbar />

      <section className="section product-detail-section">
        <div className="container">
          <button className="back-btn reveal" onClick={() => navigate('/products')}>
            <ArrowLeft size={20} />
            Back to Products
          </button>

          <div className="product-detail-grid" id="product-overview">
            <div className="product-gallery reveal">
              <div className="gallery-stage">
                {images.length > 1 && (
                  <div className="gallery-thumbnail-rail">
                    <button
                      type="button"
                      className="gallery-nav-btn thumbnail-nav-btn"
                      onClick={() => handleThumbnailStep(-1)}
                      disabled={thumbnailStart === 0}
                      aria-label="Previous thumbnails"
                    >
                      <ChevronUp size={18} />
                    </button>
                    <div className="gallery-thumbnails vertical-thumbnails">
                      {visibleThumbnails.map((img, idx) => {
                        const actualIndex = thumbnailStart + idx;
                        return (
                          <button
                            key={`${img}-${actualIndex}`}
                            className={`thumbnail ${selectedImage === actualIndex ? 'active' : ''}`}
                            onClick={() => handleSelectImage(actualIndex)}
                          >
                            <img src={img} alt={`${product.name} ${actualIndex + 1}`} />
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      className="gallery-nav-btn thumbnail-nav-btn"
                      onClick={() => handleThumbnailStep(1)}
                      disabled={thumbnailStart >= maxThumbnailStart}
                      aria-label="Next thumbnails"
                    >
                      <ChevronDown size={18} />
                    </button>
                  </div>
                )}

                <div className="gallery-main zoom-main-wrap">
                  <div
                    className="zoom-image-stage"
                    onMouseMove={handleZoomMove}
                    onMouseEnter={handleZoomMove}
                    onMouseLeave={handleZoomLeave}
                  >
                    <img 
                      src={images[selectedImage] || product.image} 
                      alt={product.name}
                      className="main-image"
                    />
                    {!product.inStock ? (
                      <span className="gallery-badge out-of-stock">Out of Stock</span>
                    ) : product.badge && (
                      <span className="gallery-badge">{product.badge}</span>
                    )}

                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="gallery-nav-btn gallery-main-nav gallery-main-prev"
                          onClick={handleGalleryPrevious}
                          aria-label="Previous product image"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          type="button"
                          className="gallery-nav-btn gallery-main-nav gallery-main-next"
                          onClick={handleGalleryNext}
                          aria-label="Next product image"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                    
                    <div className="gallery-action-buttons">
                      <button 
                        className={`btn btn-ghost icon-btn ${isInWishlist(product.id) ? 'wishlist-active' : ''}`}
                        onClick={handleAddToWishlist}
                        title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <Heart 
                          size={20} 
                          fill={isInWishlist(product.id) ? 'var(--gold)' : 'none'}
                          stroke="var(--gold)"
                        />
                      </button>
                      <button className="btn btn-ghost icon-btn share-btn" onClick={handleShare}>
                        <Share2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div
                    className={`zoom-preview-panel ${zoomState.visible ? 'visible' : ''}`}
                    style={{
                      backgroundImage: `url(${images[selectedImage] || product.image})`,
                      backgroundPosition: `${zoomState.x}% ${zoomState.y}%`,
                    }}
                    aria-hidden={!zoomState.visible}
                  />
                </div>
              </div>
            </div>

            <div className="product-detail-info reveal">
              <div className="product-header">
                <div className="product-title-stack">
                  <p className="product-series">{product.brand || 'Eaxy Store'} {product.modelNumber || ''}</p>
                  <h1>{product.name}</h1>
                </div>
                {isRefurbished && (
                  <span className="refurbished-tag">Refurbished</span>
                )}
              </div>

              <div className="product-rating-row">
                <div className="rating-stars">
                  <Star size={18} fill="var(--gold)" stroke="var(--gold)" />
                  <span className="rating-value">{product.rating || '4.0'}</span>
                  <span className="review-count">({product.reviewCount || '0'} reviews)</span>
                </div>
              </div>

              <div className="product-summary-card">
                <h2>Product Description</h2>
                <p>{productDescription}</p>
                {productHighlights.length > 0 && (
                  <ul className="product-highlights-list">
                    {productHighlights.map((spec, idx) => (
                      <li key={idx}>{spec}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="product-identifiers-card">
                <div className="identifier-item">
                  <span className="identifier-label">Model Number</span>
                  <span className="identifier-value">{product.modelNumber || 'N/A'}</span>
                </div>
                <div className="identifier-item">
                  <span className="identifier-label">Part Number</span>
                  <span className="identifier-value">{product.partNumber || 'N/A'}</span>
                </div>
                <div className="identifier-item">
                  <span className="identifier-label">Product Code</span>
                  <span className="identifier-value">{product.productCode || 'N/A'}</span>
                </div>
              </div>

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
                {savings > 0 && (
                  <div className="price-savings-row">
                    <span className="mrp-label">M.R.P</span>
                    <span className="save-label">Save {formatPrice(savings)}</span>
                  </div>
                )}
                <p className="price-note">Inclusive of all taxes</p>
                <div className="product-stock-line">
                  <span className={`stock-pill ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  <span className="emi-note">
                    {product.emiNote || 'No Cost EMI style offers can be highlighted here'}
                  </span>
                </div>
              </div>

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

                <div className="action-buttons action-buttons-dual">
                  <button 
                    className="btn btn-primary btn-large"
                    onClick={handleAddToCart}
                    disabled={!product.inStock || addingToCart}
                  >
                    <ShoppingCart size={20} />
                    {addingToCart 
                      ? 'Adding...' 
                      : cartSuccess 
                        ? 'Added!' 
                        : !product.inStock 
                          ? 'Out of Stock' 
                          : isInCart(product.id)
                            ? 'Add More'
                            : 'Add to Cart'
                    }
                  </button>
                  <button
                    className={`btn btn-ghost btn-large secondary-action ${isInWishlist(product.id) ? 'wishlist-active' : ''}`}
                    onClick={handleAddToWishlist}
                  >
                    <Heart
                      size={20}
                      fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                    />
                    {isInWishlist(product.id) ? 'Wishlisted' : 'Add to Wish List'}
                  </button>
                </div>

                <div className="offer-strip">
                  {(productOffers.slice(0, 2).length > 0 ? productOffers.slice(0, 2) : [
                    'Instant discount and promotional pricing can be highlighted here.',
                    'Flexible payment, EMI, or card-based offers can be listed here.',
                  ]).map((offer, index) => (
                    <div className="offer-card" key={index}>
                      {index === 0 ? <BadgePercent size={18} /> : <CreditCard size={18} />}
                      <div>
                        <strong>{index === 0 ? 'Featured Offer' : 'Payment Benefit'}</strong>
                        <p>{offer}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {cartSuccess && (
                  <div className="cart-success-message">
                    <Check size={18} />
                    <span>Product added to cart successfully!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="product-service-strip reveal">
            <div className="service-item">
              <Truck size={18} />
              <div>
                <strong>Free Shipping</strong>
                <span>{product.shippingNote || 'Shipping support on eligible orders'}</span>
              </div>
            </div>
            <div className="service-item">
              <ShieldCheck size={18} />
              <div>
                <strong>Warranty</strong>
                <span>{product.warranty || 'Standard warranty applies'}</span>
              </div>
            </div>
            <div className="service-item">
              <Headphones size={18} />
              <div>
                <strong>Customer Care</strong>
                <span>{product.customerCare || 'Support available for product assistance'}</span>
              </div>
            </div>
          </div>

          <div className="product-content-sections reveal">
            <div className="product-anchor-nav" role="tablist" aria-label="Product detail sections">
              {tabItems.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`product-tab-trigger ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                  role="tab"
                  aria-selected={activeTab === tab.key}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="product-section-tabs">
              {activeTab === 'overview' && (
                <section className="product-section-card product-tab-panel" id="product-overview-panel">
                  <h2>Overview</h2>
                  <div className="product-meta-list detailed-meta-list">
                    <div className="product-meta-item">
                      <span className="meta-label">Brand</span>
                      <span className="meta-value">{product.brand || 'N/A'}</span>
                    </div>
                    <div className="product-meta-item">
                      <span className="meta-label">Model Number</span>
                      <span className="meta-value">{product.modelNumber || 'N/A'}</span>
                    </div>
                    <div className="product-meta-item">
                      <span className="meta-label">Product Code</span>
                      <span className="meta-value">{product.productCode || 'N/A'}</span>
                    </div>
                    <div className="product-meta-item">
                      <span className="meta-label">Description</span>
                      <span className="meta-value">{productDescription}</span>
                    </div>
                    <div className="product-meta-item">
                      <span className="meta-label">Price</span>
                      <span className="meta-value">{formatPrice(product.price)}</span>
                    </div>
                  </div>
                  {includedInBox.length > 0 && (
                    <div className="tab-subsection">
                      <h3>Included In The Box</h3>
                      <ul className="specs-list specs-list-detailed compact-list">
                        {includedInBox.map((item, idx) => (
                          <li key={idx}>
                            <Check size={16} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              )}

              {activeTab === 'specs' && (
                <section className="product-section-card product-tab-panel" id="product-specs">
                  <h2>Tech Specs</h2>
                  {structuredTechSpecs.length > 0 ? (
                    <div className="product-meta-list detailed-meta-list tech-specs-grid">
                      {structuredTechSpecs.map((spec, idx) => (
                        <div className="product-meta-item" key={idx}>
                          <span className="meta-label">{spec.label}</span>
                          <span className="meta-value">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="product-meta-list detailed-meta-list">
                      <div className="product-meta-item">
                        <span className="meta-label">Part Number</span>
                        <span className="meta-value">{product.partNumber || 'N/A'}</span>
                      </div>
                      <div className="product-meta-item">
                        <span className="meta-label">Warranty</span>
                        <span className="meta-value">{product.warranty || 'N/A'}</span>
                      </div>
                      <div className="product-meta-item">
                        <span className="meta-label">Shipping</span>
                        <span className="meta-value">{product.shippingNote || 'N/A'}</span>
                      </div>
                      <div className="product-meta-item">
                        <span className="meta-label">Category</span>
                        <span className="meta-value">{product.category || 'N/A'}</span>
                      </div>
                    </div>
                  )}
                  {Array.isArray(product.specs) && product.specs.length > 0 && (
                    <div className="tab-subsection">
                      <h3>Key Specifications</h3>
                      <ul className="specs-list specs-list-detailed">
                        {product.specs.map((spec, idx) => (
                          <li key={idx}>
                            <Check size={16} />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              )}

              {activeTab === 'reviews' && product && (
                <section className="product-section-card product-tab-panel" id="product-reviews">
                  <ReviewSection 
                    type="product" 
                    itemId={product.id} 
                    itemName={product.name} 
                  />
                </section>
              )}

              {activeTab === 'faq' && (
                <section className="product-section-card product-tab-panel" id="product-faq">
                  <h2>FAQ</h2>
                  {productFaqs.length > 0 ? (
                    <div className="faq-list">
                      {productFaqs.map((item, idx) => (
                        <div className="faq-item" key={idx}>
                          <h3>{item.question}</h3>
                          <p>{item.answer || 'Answer coming soon.'}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="tab-empty-state">No FAQs available for this product yet.</p>
                  )}
                </section>
              )}

              {activeTab === 'offers' && (
                <section className="product-section-card product-tab-panel" id="product-offers">
                  <h2>Offers</h2>
                  {productOffers.length > 0 ? (
                    <div className="offers-list-detailed">
                      {productOffers.map((offer, idx) => (
                        <div className="offer-line-item" key={idx}>
                          <BadgePercent size={16} />
                          <span>{offer}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="tab-empty-state">No active offers available right now.</p>
                  )}
                </section>
              )}
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="related-products-section reveal" id="related-products">
              <h2>Related Products</h2>
              <div className="related-products-grid">
                {relatedProducts.map((relatedProduct) => (
                  <article 
                    key={relatedProduct.id} 
                    className="related-product-card"
                    onClick={() => navigate(`/products/${relatedProduct.id}`)}
                  >
                    <div className="related-product-image">
                      <img 
                        src={
                          relatedProduct.images && relatedProduct.images.length > 0 
                            ? relatedProduct.images[0] 
                            : relatedProduct.image
                        } 
                        alt={relatedProduct.name} 
                      />
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
