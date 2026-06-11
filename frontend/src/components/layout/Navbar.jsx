import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Heart, Search, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useUser } from '../../contexts/UserContext';
import { useCart } from '../../contexts/CartContext';
import logo from '../../assets/logo.png';

/** Derive up to 2 uppercase initials from a name string */
const getInitials = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlSearch = searchParams.get('search') || '';

  const { wishlist } = useWishlist();
  const { user, isAuthenticated, logout } = useUser();
  const { cartCount } = useCart();

  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => { setSearchQuery(urlSearch); }, [urlSearch]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => { setShowDropdown(false); }, [location.pathname]);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (location.pathname === '/books') {
      const newParams = new URLSearchParams(window.location.search);
      const trimmed = val.trim();
      if (trimmed) { newParams.set('search', trimmed); }
      else { newParams.delete('search'); }
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

  const initials = user ? getInitials(user.fullName || user.name || user.username) : 'U';

  return (
    <nav className="glass relative w-full z-[1000]" style={{ height: '103px' }}>
      <div className="max-w-[1490px] h-full mx-auto px-10 flex items-center justify-between gap-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3.5 flex-shrink-0 no-underline">
          <img
            src={logo}
            alt="Bookora"
            className="h-[68px] w-[68px] object-cover rounded-full bg-white p-1"
            style={{
              border: '2px solid rgba(162,148,251,0.4)',
              boxShadow: '0 0 18px rgba(162,148,251,0.2)',
            }}
          />
          <span className="text-[1.7rem] font-bold tracking-tight whitespace-nowrap">
            Book<span className="gradient-text">ora</span>
          </span>
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-1 max-w-[680px] items-center bg-[#1a1a1a] rounded-full overflow-hidden transition-all"
          style={{ border: '1.5px solid rgba(255,255,255,0.1)' }}
          onFocus={() => {}}
        >
          <input
            type="text"
            placeholder="Enter Keyword To Search..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 h-[52px] px-6 bg-transparent border-none outline-none text-[0.95rem] text-white placeholder:text-[#606060] font-[inherit]"
          />
          <button
            type="submit"
            aria-label="Search"
            className="flex items-center justify-center gap-2 px-[22px] h-[52px] bg-accent-gradient text-white text-[0.9rem] font-semibold flex-shrink-0 tracking-wide hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#a294fb,#8b5cf6)' }}
          >
            <Search size={18} />
            <span>Search</span>
          </button>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Wishlist */}
          <Link
            to="/wishlist"
            title="My Favorites"
            className="relative flex items-center justify-center w-12 h-12 rounded-full text-[#a0a0a0] hover:bg-[#1a1a1a] hover:text-white transition-colors"
          >
            <Heart size={24} />
            {wishlist.length > 0 && (
              <span
                className="absolute top-2.5 right-2.5 w-[18px] h-[18px] rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg,#a294fb,#8b5cf6)',
                  border: '2px solid #050505',
                }}
              >
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Account Dropdown */}
          <div className="relative flex" ref={dropdownRef}>
            <button
              className="relative flex items-center justify-center w-12 h-12 rounded-full text-[#a0a0a0] hover:bg-[#1a1a1a] hover:text-white transition-colors"
              onClick={() => setShowDropdown(!showDropdown)}
              title="Account"
              aria-haspopup="true"
              aria-expanded={showDropdown}
            >
              {isAuthenticated && user ? (
                <div
                  className="w-[34px] h-[34px] rounded-full text-white text-xs font-bold flex items-center justify-center tracking-wide flex-shrink-0 transition-transform hover:scale-105"
                  aria-label={initials}
                  style={{
                    background: 'linear-gradient(135deg,#a294fb,#8b5cf6)',
                    border: '2px solid rgba(162,148,251,0.4)',
                    boxShadow: '0 0 10px rgba(162,148,251,0.25)',
                  }}
                >
                  {initials}
                </div>
              ) : (
                <User size={24} />
              )}
            </button>

            {showDropdown && (
              <div
                className="animate-fade-in absolute top-[calc(100%+10px)] right-0 w-[220px] rounded-xl p-2 flex flex-col gap-0.5 z-[1100]"
                style={{
                  background: '#0f0f0f',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 16px 32px rgba(0,0,0,0.6)',
                }}
              >
                {isAuthenticated ? (
                  <>
                    <div className="flex flex-col px-3.5 py-2.5">
                      <span className="text-[0.9rem] font-bold text-white leading-tight">
                        {user.fullName || user.name}
                      </span>
                      <span className="text-[0.75rem] text-[#606060] mt-0.5">@{user.username}</span>
                    </div>
                    <div className="h-px bg-white/10 mx-1.5 my-1.5" />
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[#a0a0a0] text-[0.85rem] font-medium hover:bg-white/[0.04] hover:text-white transition-colors [&:hover_svg]:text-[#a294fb]"
                    >
                      <User size={16} className="text-[#606060] transition-colors" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[#a0a0a0] text-[0.85rem] font-medium w-full text-left hover:bg-[rgba(255,77,109,0.06)] hover:text-[#ff4d6d] transition-colors [&:hover_svg]:text-[#ff4d6d]"
                      onClick={logout}
                    >
                      <LogOut size={16} className="text-[#606060] transition-colors" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth?mode=signin"
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[#a0a0a0] text-[0.85rem] font-medium hover:bg-white/[0.04] hover:text-white transition-colors [&:hover_svg]:text-[#a294fb]"
                    >
                      <LogIn size={16} className="text-[#606060] transition-colors" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      to="/auth?mode=signup"
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[#a294fb] text-[0.85rem] font-semibold hover:bg-[rgba(162,148,251,0.08)] transition-colors [&:hover_svg]:text-[#a294fb]"
                    >
                      <UserPlus size={16} className="text-[#606060] transition-colors" />
                      <span>Create Account</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            to="/cart"
            title="Cart"
            className="relative flex items-center justify-center w-12 h-12 rounded-full text-[#a0a0a0] hover:bg-[#1a1a1a] hover:text-white transition-colors"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span
                className="absolute top-2.5 right-2.5 w-[18px] h-[18px] rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg,#a294fb,#8b5cf6)',
                  border: '2px solid #050505',
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
