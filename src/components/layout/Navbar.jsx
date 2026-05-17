import { Heart, ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { logo } from '../../assets/images';
import { navLinks } from '../../data';
import BrandName from '../shared/BrandName';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="nav-shell">
      <div className="nav-row">
        <Link to="/" className="brand" aria-label="EAXY STORE Home">
          <img className="brand-logo" src={logo} alt="" width="64" height="64" aria-hidden="true" />
          <BrandName />
        </Link>
        <div className="nav-links">
          {navLinks.map((link) => {
            // Check if it's a route link (starts with /) to use React Router Link
            if (link.href.startsWith('/')) {
              return (
                <Link key={link.href} to={link.href}>
                  {link.label}
                </Link>
              );
            }
            // Otherwise use regular anchor for hash links
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
          <button className="btn btn-primary">
            <User size={16} />
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
