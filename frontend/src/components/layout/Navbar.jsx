import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, BookOpen, Heart } from 'lucide-react';
import './Navbar.css';
import logo from '../../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="navbar glass">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <img src={logo} alt="BookOra Logo" className="logo-img" />
          <span className="logo-text">Book<span className="gradient-text">ora</span></span>
        </Link>

        <div className="nav-search">
          <Search className="search-icon" size={18} />
          <input type="text" placeholder="Search for books, authors..." />
        </div>

        <div className="nav-actions">
          <Link to="/sell" className="sell-btn">Sell Books</Link>
          
          <div className="nav-icons">
            <button className="icon-btn"><Search size={22} /></button>
            <Link to="/wishlist" className="icon-btn hide-mobile">
              <Heart size={22} />
            </Link>
            <Link to="/cart" className="icon-btn cart-btn">
              <ShoppingCart size={22} />
              <span className="badge">0</span>
            </Link>
          </div>

          <Link to="/auth" className="profile-pill">
            <div className="profile-info hide-mobile">
              <span className="profile-name">Guest User</span>
              <span className="profile-status">Login to explore</span>
            </div>
            <div className="profile-avatar">
              <User size={20} />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
