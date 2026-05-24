import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Heart, Search } from 'lucide-react';
import logo from '../../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar glass">
      <div className="navbar-container">

        {/* Left: Logo */}
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Bookora" className="nav-logo-img" />
          <span className="nav-logo-text">Book<span className="gradient-text">ora</span></span>
        </Link>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearch} className="nav-search-wrap">
          <input
            type="text"
            className="nav-search-input"
            placeholder="Enter Keyword To Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="nav-search-btn" aria-label="Search">
            <Search size={18} />
            <span>Search</span>
          </button>
        </form>

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
