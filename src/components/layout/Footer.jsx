import { Mail, MapPin, Phone } from 'lucide-react';
import { logo } from '../../assets/images';
import BrandName from '../shared/BrandName';
import './Footer.css';

function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="container footer-grid">
        <div>
          <a href="#top" className="brand">
            <img className="brand-logo" src={logo} alt="" width="64" height="64" aria-hidden="true" />
            <BrandName />
          </a>
          <p className="muted">Premium tech delivered and repaired within 4 hours across Pune.</p>
        </div>
        <div>
          <h4>Products</h4>
          <p>Laptops</p>
          <p>Smartphones</p>
          <p>Accessories</p>
          <p>Refurbished</p>
        </div>
        <div>
          <h4>Services</h4>
          <p>Laptop Repair</p>
          <p>Mobile Repair</p>
          <p>Computer Repair</p>
          <p>Printer Repair</p>
        </div>
        <div>
          <h4>Contact</h4>
          <p>
            <a href="tel:+919609955655" style={{color: 'inherit', textDecoration: 'none'}}>
              <Phone size={16} /> +91 96099 55655
            </a>
          </p>
          <p>
            <Mail size={16} /> support@eaxystore.in
          </p>
          <p>
            <MapPin size={16} /> Pune, Maharashtra, India
          </p>
        </div>
      </div>
      <div className="container footer-end">
        <p>
          Copyright 2026 <BrandName />. All rights reserved
          <span 
            className="admin-access-btn" 
            onClick={() => window.location.href = '/admin'}
            title="Admin Access"
          >
            .
          </span>
        </p>
        <div>
          <a href="#top">Privacy Policy</a>
          <a href="#top">Terms of Service</a>
          <a href="#top">Warranty Info</a>
          <button 
            className="back-to-top-link" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
