import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
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
            <a href="#" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
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
