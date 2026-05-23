import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Heart, Search } from 'lucide-react';
import logo from '../../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar glass">
      <div className="navbar-container">

        {/* Left: Logo */}
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Bookora" className="nav-logo-img" />
          <span className="nav-logo-text">Book<span className="gradient-text">ora</span></span>
        </Link>

        {/* Center: Search Bar */}
        <div className="nav-search-wrap">
          <input
            type="text"
            className="nav-search-input"
            placeholder="Enter Keyword To Search..."
          />
          <button className="nav-search-btn" aria-label="Search">
            <Search size={18} />
            <span>Search</span>
          </button>
        </div>

        {/* Right: Action Icons */}
        <div className="nav-actions">
          <Link to="/wishlist" className="nav-icon-btn" title="My Favorites">
            <Heart size={24} />
          </Link>

          <Link to="/auth" className="nav-icon-btn" title="Account">
            <User size={24} />
          </Link>

          <Link to="/cart" className="nav-icon-btn" title="Cart">
            <ShoppingCart size={24} />
            <span className="cart-badge">0</span>
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
