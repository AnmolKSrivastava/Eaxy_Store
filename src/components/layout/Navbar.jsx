import { Heart, ShoppingCart, User, ChevronDown, LogOut, Package, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { logo } from '../../assets/images';
import { navLinks } from '../../data';
import BrandName from '../shared/BrandName';
import UserLoginModal from '../auth/UserLoginModal';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { currentUser, logout } = useAuth();
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
            <Link to="/wishlist" className="btn-icon" aria-label="Wishlist">
              <Heart size={20} />
            </Link>
            <Link to="/cart" className="btn-icon" aria-label="Cart">
              <ShoppingCart size={20} />
              <span className="cart-badge">0</span>
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
                className="btn btn-primary"
                onClick={() => setShowLoginModal(true)}
              >
                <User size={16} />
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <UserLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}

export default Navbar;
