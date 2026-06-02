import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Heart, Search, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useUser } from '../../contexts/UserContext';
import logo from '../../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlSearch = searchParams.get('search') || '';

  const { wishlist } = useWishlist();
  const { user, isAuthenticated, logout } = useUser();

  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Sync search input value with URL search parameter changes
  useEffect(() => {
    setSearchQuery(urlSearch);
  }, [urlSearch]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Close dropdown on location change
  useEffect(() => {
    setShowDropdown(false);
  }, [location.pathname]);

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
            {wishlist.length > 0 && (
              <span className="wishlist-badge">{wishlist.length}</span>
            )}
          </Link>

          {/* Account Dropdown Container */}
          <div className="nav-dropdown-container" ref={dropdownRef}>
            <button
              className="nav-icon-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              title="Account"
              aria-haspopup="true"
              aria-expanded={showDropdown}
            >
              {isAuthenticated && user && user.avatar ? (
                <img src={user.avatar} alt="Account" className="nav-avatar-mini" />
              ) : (
                <User size={24} />
              )}
            </button>

            {showDropdown && (
              <div className="nav-dropdown glass fade-in">
                {isAuthenticated ? (
                  <>
                    <div className="nav-dropdown-user-info">
                      <span className="nd-name">{user.fullName}</span>
                      <span className="nd-username">@{user.username}</span>
                    </div>
                    <div className="nav-dropdown-divider" />
                    <Link to="/profile" className="nav-dropdown-item">
                      <User size={16} />
                      <span>My Profile</span>
                    </Link>
                    <button className="nav-dropdown-item logout" onClick={logout}>
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth?mode=signin" className="nav-dropdown-item">
                      <LogIn size={16} />
                      <span>Sign In</span>
                    </Link>
                    <Link to="/auth?mode=signup" className="nav-dropdown-item signup-highlight">
                      <UserPlus size={16} />
                      <span>Create Account</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

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
