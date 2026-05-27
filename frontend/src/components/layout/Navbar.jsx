import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Heart, Search } from 'lucide-react';
import logo from '../../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(urlSearch);

  // Sync search input value with URL search parameter changes
  useEffect(() => {
    setSearchQuery(urlSearch);
  }, [urlSearch]);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (location.pathname === '/books') {
      const newParams = new URLSearchParams(window.location.search);
      const trimmed = val.trim();
      if (trimmed) {
        newParams.set('search', trimmed);
      } else {
        newParams.delete('search');
      }
      navigate(`/books?${newParams.toString()}`, { replace: true });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/books');
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
        <form onSubmit={handleSearchSubmit} className="nav-search-wrap">
          <input
            type="text"
            className="nav-search-input"
            placeholder="Enter Keyword To Search..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
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
