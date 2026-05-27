import { Link } from 'react-router-dom';
import { Globe, AtSign, Camera, Video, Mail, MapPin, Phone, Send } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Column 1: Brand & Identity */}
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <span className="logo-icon">B</span>
            <span className="logo-text">Bookora</span>
          </div>
          <h3 className="footer-subheader">SELL YOUR BOOKS</h3>
          <div className="footer-address">
            <p><MapPin size={16} /> 123 Bibliophile Lane, Storytown, ST 56789</p>
            <p><Phone size={16} /> +1 (555) BOOK-ORA</p>
            <p><Mail size={16} /> hello@bookora.com</p>
          </div>
          <div className="social-icons">
            <a href="#" aria-label="Facebook"><Globe size={20} /></a>
            <a href="#" aria-label="Twitter"><AtSign size={20} /></a>
            <a href="#" aria-label="Instagram"><Camera size={20} /></a>
            <a href="#" aria-label="Youtube"><Video size={20} /></a>
          </div>
        </div>

        {/* Column 2: LEARN MORE */}
        <div className="footer-col">
          <h4 className="col-heading">LEARN MORE</h4>
          <ul className="footer-links">
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/blog">Book Blog</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/sustainability">Sustainability</Link></li>
            <li><Link to="/press">Press Kit</Link></li>
          </ul>
        </div>

        {/* Column 3: SHOPPING & Newsletter */}
        <div className="footer-col">
          <h4 className="col-heading">SHOPPING</h4>
          <ul className="footer-links">
            <li><Link to="/books">Browse All Books</Link></li>
            <li><Link to="/deals">Special Offers</Link></li>
            <li><Link to="/gift-cards">Gift Cards</Link></li>
            <li><Link to="/membership">Membership</Link></li>
          </ul>
          <div className="newsletter-box">
            <h5 className="newsletter-title">Subscribe to our newsletter</h5>
            <div className="email-input-wrapper">
              <input type="email" placeholder="Enter your email" className="footer-email-input" />
              <button className="email-send-btn"><Send size={18} /></button>
            </div>
          </div>
        </div>

        {/* Column 4: CUSTOMER SERVICE */}
        <div className="footer-col">
          <h4 className="col-heading">CUSTOMER SERVICE</h4>
          <ul className="footer-links">
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/track-order">Track My Order</Link></li>
            <li><Link to="/returns">Returns & Exchanges</Link></li>
            <li><Link to="/shipping">Shipping Info</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Bookora. Designed for the true bibliophile.</p>
      </div>
    </footer>
  );
};

export default Footer;
