import { Heart, ShoppingCart, User, ChevronDown, LogOut, Package, Settings, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { logo } from '../../assets/images';
import { navLinks } from '../../data';
import BrandName from '../shared/BrandName';
import UserLoginModal from '../auth/UserLoginModal';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import './Navbar.css';

function Navbar() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowProfileDropdown(false);
    setMobileMenuOpen(false);
    await logout();
  };

  const getDisplayName = () => {
    if (currentUser?.displayName) return currentUser.displayName;
    if (currentUser?.phoneNumber) return currentUser.phoneNumber;
    if (currentUser?.email) return currentUser.email.split('@')[0];
    return 'My Account';
  };

  const getAvatar = () => {
    if (currentUser?.photoURL) {
      return <img src={currentUser.photoURL} alt="avatar" className="nav-avatar-img" />;
    }
    return <User size={18} />;
  };

  return (
    <>
      <nav className="nav-shell">
        <div className="nav-row">
          <button
            className="btn-icon hamburger-btn"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(prev => !prev)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <Link to="/" className="brand" aria-label="EAXY STORE Home">
            <img className="brand-logo" src={logo} alt="" width="64" height="64" aria-hidden="true" />
            <BrandName />
          </Link>
          <div className="nav-links">
            {navLinks.map((link) => {
              if (link.href.startsWith('/')) {
                return (
                  <Link key={link.href} to={link.href}>
                    {link.label}
                  </Link>
                );
              }
              return (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              );
            })}
          </div>
          <div className="nav-actions">
            <Link to="/wishlist" className="btn-icon wishlist-icon" aria-label="Wishlist">
              <Heart size={20} />
              {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="btn-icon cart-icon" aria-label="Cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {currentUser ? (
              <div className="profile-menu" ref={dropdownRef}>
                <button
                  className="profile-trigger"
                  onClick={() => setShowProfileDropdown(prev => !prev)}
                >
                  <div className="nav-avatar">{getAvatar()}</div>
                  <span className="profile-name">{getDisplayName()}</span>
                  <ChevronDown size={14} className={`chevron ${showProfileDropdown ? 'open' : ''}`} />
                </button>

                {showProfileDropdown && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <div className="nav-avatar large">{getAvatar()}</div>
                      <div>
                        <p className="dropdown-name">{getDisplayName()}</p>
                        <p className="dropdown-sub">{currentUser.phoneNumber || currentUser.email || 'User'}</p>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/orders" className="dropdown-item" onClick={() => setShowProfileDropdown(false)}>
                      <Package size={15} /> My Orders
                    </Link>
                    <Link to="/profile" className="dropdown-item" onClick={() => setShowProfileDropdown(false)}>
                      <Settings size={15} /> Settings
                    </Link>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout" onClick={handleLogout}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="btn btn-primary login-btn"
                onClick={() => setShowLoginModal(true)}
                aria-label="Login"
              >
                <User size={16} />
                <span className="login-btn-text">Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-nav-links">
              {navLinks.map((link) => {
                if (link.href.startsWith('/')) {
                  return (
                    <Link key={link.href} to={link.href} onClick={() => setMobileMenuOpen(false)}>
                      {link.label}
                    </Link>
                  );
                }
                return (
                  <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                    {link.label}
                  </a>
                );
              })}
            </div>
            {currentUser ? (
              <div className="mobile-user-section">
                <div className="mobile-user-info">
                  <div className="nav-avatar">{getAvatar()}</div>
                  <div>
                    <p className="dropdown-name">{getDisplayName()}</p>
                    <p className="dropdown-sub">{currentUser.phoneNumber || currentUser.email || 'User'}</p>
                  </div>
                </div>
                <Link to="/orders" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
                  <Package size={16} /> My Orders
                </Link>
                <Link to="/profile" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
                  <Settings size={16} /> Settings
                </Link>
                <button className="mobile-menu-item logout" onClick={handleLogout}>
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
                onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }}
              >
                <User size={16} />
                Login
              </button>
            )}
          </div>
        )}
      </nav>

      <UserLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}

export default Navbar;
