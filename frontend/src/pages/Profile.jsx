import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Bell,
  Shield,
  LogOut,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Upload,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  ShoppingBag as BagIcon,
  PackageCheck,
  Truck,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useWishlist } from '../contexts/WishlistContext';
import OptimizedBookCover from '../components/OptimizedBookCover';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const {
    user,
    orders,
    isAuthenticated,
    loading,
    notification,
    login,
    logout,
    updateProfile,
    changePassword,
    updatePreferences,
    updateSettings,
    getStats
  } = useUser();

  const { wishlist, removeFromWishlist, setSelectedBook } = useWishlist();

  // Navigation tab state: 'profile' | 'orders' | 'wishlist' | 'settings'
  const [activeTab, setActiveTab] = useState('profile');

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    shippingAddress: '',
    avatar: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
    login: false
  });

  // Avatar upload visual panel
  const [showAvatarPrompt, setShowAvatarPrompt] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Orders pagination and detail expansion states
  const [expandedOrders, setExpandedOrders] = useState({});
  const [orderPage, setOrderPage] = useState(1);
  const ordersPerPage = 3;

  // Initialize profile form once user data is loaded
  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        shippingAddress: user.shippingAddress || '',
        avatar: user.avatar || ''
      });
      setCustomAvatarUrl(user.avatar || '');
    }
  }, [user]);

  // Sync user details stats
  const stats = getStats(wishlist.length);

  // Pagination handlers
  const totalOrderPages = Math.ceil(orders.length / ordersPerPage);
  const paginatedOrders = orders.slice(
    (orderPage - 1) * ordersPerPage,
    orderPage * ordersPerPage
  );

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const res = await updateProfile(profileForm);
    if (res.success) {
      setIsEditing(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      // Handled via local check
      return;
    }
    const res = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
    if (res.success) {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await login(loginForm.email, loginForm.password);
  };

  const handleAvatarUpdate = () => {
    if (customAvatarUrl.trim()) {
      setProfileForm((prev) => ({ ...prev, avatar: customAvatarUrl.trim() }));
      updateProfile({ ...profileForm, avatar: customAvatarUrl.trim() });
      setShowAvatarPrompt(false);
    }
  };

  // Preset avatars for ease of customization
  const presetAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150&h=150',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
    'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=150&h=150',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150'
  ];

  // ─── Logged Out Flow ────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="profile-page flex-center fade-in">
        <div className="auth-card-wrap">
          <div className="auth-card glass">
            <div className="auth-header">
              <h2>Welcome to <span className="gradient-text">Bookora</span></h2>
              <p>Sign in to view your profile, manage orders, and access your wishlist.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword.login ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword((prev) => ({ ...prev, login: !prev.login }))}
                    aria-label={showPassword.login ? 'Hide password' : 'Show password'}
                  >
                    {showPassword.login ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="spinner-loader">Signing In...</span>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            <div className="auth-pane-footer" style={{ marginTop: '16px', textAlign: 'center' }}>
              <span>Don&apos;t have an account? </span>
              <Link to="/auth?mode=signup" className="auth-toggle-link">Create Account</Link>
            </div>

            <div className="auth-footer-help glass">
              <span className="info-icon">💡</span>
              <p>
                <strong>Demo Tip:</strong> Enter any email and a strong password (e.g. <code>user@bookora.com</code> / <code>Password123!</code>) to log in instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Global Floating Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              className={`toast-alert ${notification.type}`}
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {notification.type === 'success' ? (
                <CheckCircle size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              <span>{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ─── Main Logged In Profile Page Flow ──────────────────────────────────────────
  return (
    <div className="profile-page fade-in">
      <div className="profile-container">
        
        {/* Profile Header Card */}
        <div className="profile-header-card glass">
          <div className="ph-flex-container">
            <div className="ph-avatar-section">
              <div className="ph-avatar-wrap">
                <img src={user.avatar} alt={user.fullName} className="ph-avatar-img" />
                <button
                  className="avatar-edit-overlay"
                  onClick={() => setShowAvatarPrompt(true)}
                  title="Change avatar picture"
                  aria-label="Change avatar picture"
                >
                  <Upload size={16} />
                  <span>Update</span>
                </button>
              </div>
            </div>

            <div className="ph-details-section">
              <span className="ph-username-badge">@{user.username}</span>
              <h1 className="ph-fullname">{user.fullName}</h1>
              <p className="ph-email">
                <Mail size={14} />
                <span>{user.email}</span>
              </p>
              <p className="ph-joined">
                <Calendar size={14} />
                <span>Joined {user.dateJoined}</span>
              </p>
            </div>

            <div className="ph-action-section">
              <button
                className={`ph-edit-btn ${activeTab === 'profile' && isEditing ? 'active-save' : ''}`}
                onClick={() => {
                  setActiveTab('profile');
                  setIsEditing((prev) => !prev);
                }}
              >
                <User size={14} />
                <span>{activeTab === 'profile' && isEditing ? 'Viewing Mode' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>

          {/* Preset/URL Avatar Customizer modal overlay */}
          <AnimatePresence>
            {showAvatarPrompt && (
              <motion.div
                className="avatar-dialog-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAvatarPrompt(false)}
              >
                <motion.div
                  className="avatar-dialog glass"
                  onClick={(e) => e.stopPropagation()}
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                >
                  <h3>Select Profile Avatar</h3>
                  <div className="preset-avatars-grid">
                    {presetAvatars.map((url, i) => (
                      <div
                        key={i}
                        className={`preset-item ${customAvatarUrl === url ? 'selected' : ''}`}
                        onClick={() => setCustomAvatarUrl(url)}
                      >
                        <img src={url} alt={`Preset ${i + 1}`} />
                      </div>
                    ))}
                  </div>

                  <div className="avatar-url-input">
                    <label>Or Paste Custom Image URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={customAvatarUrl}
                      onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    />
                  </div>

                  <div className="avatar-dialog-buttons">
                    <button className="avatar-btn-cancel" onClick={() => setShowAvatarPrompt(false)}>
                      Cancel
                    </button>
                    <button className="avatar-btn-save btn-primary" onClick={handleAvatarUpdate}>
                      Apply Avatar
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Statistics Row */}
        <div className="stats-grid">
          <div className="stat-card glass">
            <div className="sc-icon-wrap purchases">
              <ShoppingBag size={22} />
            </div>
            <div className="sc-numbers-wrap">
              <span className="sc-label">Books Purchased</span>
              <h3>{stats.booksPurchased}</h3>
            </div>
          </div>

          <div className="stat-card glass">
            <div className="sc-icon-wrap orders">
              <PackageCheck size={22} />
            </div>
            <div className="sc-numbers-wrap">
              <span className="sc-label">Total Orders</span>
              <h3>{stats.totalOrders}</h3>
            </div>
          </div>

          <div className="stat-card glass" onClick={() => setActiveTab('wishlist')} style={{ cursor: 'pointer' }}>
            <div className="sc-icon-wrap wishlist">
              <Heart size={22} />
            </div>
            <div className="sc-numbers-wrap">
              <span className="sc-label">In Wishlist</span>
              <h3>{stats.wishlistCount}</h3>
            </div>
          </div>

          <div className="stat-card glass">
            <div className="sc-icon-wrap reading">
              <BookOpen size={22} />
            </div>
            <div className="sc-numbers-wrap">
              <span className="sc-label">Currently Reading</span>
              <h3>{stats.currentlyReading}</h3>
            </div>
          </div>
        </div>

        {/* Profile Core Sub-sections (Layout: Sidebar nav + Content cards) */}
        <div className="profile-layout">
          
          {/* Navigation Sidebar */}
          <aside className="profile-sidebar glass">
            <nav className="profile-nav">
              <button
                className={`profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('profile');
                  setIsEditing(false);
                }}
              >
                <User size={18} />
                <span>My Information</span>
              </button>

              <button
                className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <ShoppingBag size={18} />
                <span>Order History</span>
                <span className="sidebar-badge">{orders.length}</span>
              </button>

              <button
                className={`profile-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('wishlist')}
              >
                <Heart size={18} />
                <span>My Wishlist</span>
                <span className="sidebar-badge">{wishlist.length}</span>
              </button>

              <button
                className={`profile-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={18} />
                <span>Account Settings</span>
              </button>
            </nav>

            <div className="sidebar-footer">
              <button className="logout-btn" onClick={logout}>
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Primary Active Tab Panels */}
          <main className="profile-content-area">
            <AnimatePresence mode="wait">
              
              {/* TAB: PROFILE / MY INFORMATION */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile-tab"
                  className="profile-pane glass"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="pane-header">
                    <h2>Personal Information</h2>
                    <p>Manage your public display details and primary billing credentials.</p>
                  </div>

                  {loading ? (
                    /* Loading skeletons while updates occur */
                    <div className="skeleton-container">
                      <div className="skeleton-row header-shimmer" />
                      <div className="skeleton-grid">
                        <div className="skeleton-field input-shimmer" />
                        <div className="skeleton-field input-shimmer" />
                        <div className="skeleton-field input-shimmer" />
                      </div>
                    </div>
                  ) : !isEditing ? (
                    <div className="profile-details-grid">
                      <div className="detail-item glass">
                        <span className="di-label">Full Display Name</span>
                        <p className="di-val">{user.fullName || <span className="empty-field">Not Provided</span>}</p>
                      </div>

                      <div className="detail-item glass">
                        <span className="di-label">Username Account</span>
                        <p className="di-val">@{user.username}</p>
                      </div>

                      <div className="detail-item glass">
                        <span className="di-label">Primary Email Address</span>
                        <p className="di-val">{user.email || <span className="empty-field">Not Provided</span>}</p>
                      </div>

                      <div className="detail-item glass">
                        <span className="di-label">Phone Reference</span>
                        <p className="di-val">{user.phone || <span className="empty-field">Not Provided</span>}</p>
                      </div>

                      <div className="detail-item full-width glass">
                        <span className="di-label">Primary Shipping Destination</span>
                        <p className="di-val">{user.shippingAddress || <span className="empty-field">No destination address set. Click Edit Profile below to add your address.</span>}</p>
                      </div>

                      <div className="form-action-row">
                        <button className="btn-primary" onClick={() => setIsEditing(true)}>
                          <span>Modify Information</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleProfileSubmit} className="profile-edit-form">
                      <div className="form-grid">
                        <div className="form-group">
                          <label htmlFor="form-fullName">Full Name</label>
                          <input
                            id="form-fullName"
                            type="text"
                            value={profileForm.fullName}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, fullName: e.target.value }))}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="form-username">Username (Non-editable)</label>
                          <input
                            id="form-username"
                            type="text"
                            value={`@${user.username}`}
                            disabled
                            className="disabled-input"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="form-email">Email Address</label>
                          <input
                            id="form-email"
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="form-phone">Phone Number</label>
                          <input
                            id="form-phone"
                            type="tel"
                            placeholder="Enter phone number"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>

                        <div className="form-group full-width">
                          <label htmlFor="form-address">Shipping Destination Address</label>
                          <textarea
                            id="form-address"
                            rows="3"
                            placeholder="Enter street, flat, pincode, state, and city details..."
                            value={profileForm.shippingAddress}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, shippingAddress: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="form-action-row edit-actions">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => {
                            setIsEditing(false);
                            setProfileForm({
                              fullName: user.fullName,
                              email: user.email,
                              phone: user.phone,
                              shippingAddress: user.shippingAddress,
                              avatar: user.avatar
                            });
                          }}
                        >
                          Cancel Changes
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                          {loading ? 'Saving details...' : 'Save Settings'}
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}

              {/* TAB: ORDERS */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders-tab"
                  className="profile-pane glass"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="pane-header">
                    <h2>Order History</h2>
                    <p>Review current deliveries and complete records of past book purchases.</p>
                  </div>

                  {orders.length === 0 ? (
                    <div className="pane-empty-state glass">
                      <div className="pes-icon-wrap purple">
                        <ShoppingBag size={36} />
                      </div>
                      <h3>No Orders Placed Yet</h3>
                      <p>Browse our extensive collections to add your first physical book.</p>
                      <Link to="/books" className="explore-btn">
                        <span>Browse Catalog</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  ) : (
                    <div className="orders-list-wrapper">
                      <div className="orders-list">
                        {paginatedOrders.map((order) => {
                          const isExpanded = expandedOrders[order.id];
                          return (
                            <div key={order.id} className="order-item-container glass">
                              <div className="order-item-summary" onClick={() => toggleOrderExpand(order.id)}>
                                <div className="ois-header">
                                  <div className="ois-id-date">
                                    <span className="order-id-label">{order.id}</span>
                                    <span className="order-date-label">{order.date}</span>
                                  </div>
                                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                                    {order.status}
                                  </span>
                                </div>

                                <div className="ois-footer">
                                  <div className="ois-meta-summary">
                                    <span>{order.itemsCount} {order.itemsCount === 1 ? 'Book' : 'Books'}</span>
                                    <span className="divider">•</span>
                                    <span className="order-total-bold">₹{order.total.toFixed(2)}</span>
                                  </div>

                                  <button className="details-toggle-trigger" aria-label="Toggle details">
                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                                  </button>
                                </div>
                              </div>

                              {/* Accordion expand block */}
                              <AnimatePresence initial={false}>
                                {isExpanded && (
                                  <motion.div
                                    className="order-item-details-drawer"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <div className="drawer-inner">
                                      
                                      {/* Order shipping status tracking step block */}
                                      <div className="shipping-tracking-bar">
                                        <div className={`step-node ${order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? 'active' : ''}`}>
                                          <div className="node-dot"><BagIcon size={12} /></div>
                                          <span>Processing</span>
                                        </div>
                                        <div className="step-connector" />
                                        <div className={`step-node ${order.status === 'Shipped' || order.status === 'Delivered' ? 'active' : ''}`}>
                                          <div className="node-dot"><Truck size={12} /></div>
                                          <span>Shipped</span>
                                        </div>
                                        <div className="step-connector" />
                                        <div className={`step-node ${order.status === 'Delivered' ? 'active' : ''}`}>
                                          <div className="node-dot"><PackageCheck size={12} /></div>
                                          <span>Delivered</span>
                                        </div>
                                      </div>

                                      <h4>Items in this Shipment</h4>
                                      <div className="drawer-books-list">
                                        {order.books.map((b) => (
                                          <div key={b.id} className="drawer-book-row glass">
                                            <div
                                              className="db-cover"
                                              onClick={() => setSelectedBook({
                                                id: b.id,
                                                title: b.title,
                                                author: b.author,
                                                price: b.price,
                                                coverId: b.coverId,
                                                cover: `https://covers.openlibrary.org/b/id/${b.coverId}-M.jpg`
                                              })}
                                            >
                                              <OptimizedBookCover
                                                coverId={b.coverId}
                                                src={`https://covers.openlibrary.org/b/id/${b.coverId}-M.jpg`}
                                                alt={b.title}
                                              />
                                            </div>

                                            <div className="db-info">
                                              <h5
                                                onClick={() => setSelectedBook({
                                                  id: b.id,
                                                  title: b.title,
                                                  author: b.author,
                                                  price: b.price,
                                                  coverId: b.coverId,
                                                  cover: `https://covers.openlibrary.org/b/id/${b.coverId}-M.jpg`
                                                })}
                                              >
                                                {b.title}
                                              </h5>
                                              <p>by {b.author}</p>
                                              <span className="quantity-multiplier">{b.quantity}x @ ₹{b.price.toFixed(2)}</span>
                                            </div>

                                            <div className="db-price-col">
                                              <span>₹{(b.price * b.quantity).toFixed(2)}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>

                                      <div className="drawer-summary-block">
                                        <div className="summary-row text-dim">
                                          <span>Subtotal:</span>
                                          <span>₹{(order.total - 40).toFixed(2)}</span>
                                        </div>
                                        <div className="summary-row text-dim">
                                          <span>Shipping & Handling:</span>
                                          <span>₹40.00</span>
                                        </div>
                                        <div className="summary-row total-bold-line">
                                          <span>Grand Total:</span>
                                          <span>₹{order.total.toFixed(2)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>

                      {/* Pagination Controls */}
                      {totalOrderPages > 1 && (
                        <div className="pagination-wrapper glass">
                          <button
                            className="pag-btn"
                            onClick={() => setOrderPage((p) => Math.max(p - 1, 1))}
                            disabled={orderPage === 1}
                            aria-label="Previous Page"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          
                          <div className="page-indicator">
                            <span>Page {orderPage} of {totalOrderPages}</span>
                          </div>

                          <button
                            className="pag-btn"
                            onClick={() => setOrderPage((p) => Math.min(p + 1, totalOrderPages))}
                            disabled={orderPage === totalOrderPages}
                            aria-label="Next Page"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB: WISHLIST */}
              {activeTab === 'wishlist' && (
                <motion.div
                  key="wishlist-tab"
                  className="profile-pane glass"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="pane-header">
                    <h2>Wishlisted Books</h2>
                    <p>Quick access to saved publications you are planning to purchase later.</p>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="pane-empty-state glass">
                      <div className="pes-icon-wrap red animate-pulse">
                        <Heart size={36} fill="currentColor" />
                      </div>
                      <h3>Your Wishlist is Empty</h3>
                      <p>Explore titles on the Bookstore storefront to populate your wishlist.</p>
                      <Link to="/books" className="explore-btn">
                        <span>Browse Bookstore</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  ) : (
                    <div className="wishlist-subgrid">
                      {wishlist.map((book) => (
                        <div key={book.id} className="wishlist-mini-card glass">
                          <div className="wmc-cover" onClick={() => setSelectedBook(book)}>
                            <OptimizedBookCover
                              coverId={book.coverId}
                              src={book.cover}
                              alt={book.title}
                            />
                            
                            <button
                              className="wmc-remove-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromWishlist(book.id);
                              }}
                              title="Remove from wishlist"
                              aria-label="Remove from wishlist"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="wmc-body">
                            <h4 onClick={() => setSelectedBook(book)}>{book.title}</h4>
                            <p>by {book.author}</p>
                            
                            <div className="wmc-footer">
                              <span className="wmc-price">₹{book.price.toFixed(2)}</span>
                              <button className="wmc-details-btn" onClick={() => setSelectedBook(book)}>
                                Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB: SETTINGS */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings-tab"
                  className="profile-pane glass"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="pane-header">
                    <h2>Account Settings & Policies</h2>
                    <p>Control password variables, preference systems, and public privacy standards.</p>
                  </div>

                  {/* Block: Password */}
                  <div className="settings-section glass">
                    <div className="section-title-wrap">
                      <Lock size={16} />
                      <h3>Change Password</h3>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="settings-form">
                      <div className="form-grid">
                        <div className="form-group">
                          <label htmlFor="settings-curr-password">Current Password</label>
                          <div className="password-input-wrapper">
                            <input
                              id="settings-curr-password"
                              type={showPassword.current ? 'text' : 'password'}
                              placeholder="Enter current password"
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                              required
                            />
                            <button
                              type="button"
                              className="password-toggle-btn"
                              onClick={() => setShowPassword((prev) => ({ ...prev, current: !prev.current }))}
                              aria-label={showPassword.current ? 'Hide password' : 'Show password'}
                            >
                              {showPassword.current ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>

                        <div className="form-group">
                          <label htmlFor="settings-new-password">New Password</label>
                          <div className="password-input-wrapper">
                            <input
                              id="settings-new-password"
                              type={showPassword.new ? 'text' : 'password'}
                              placeholder="Enter new password"
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                              required
                            />
                            <button
                              type="button"
                              className="password-toggle-btn"
                              onClick={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
                              aria-label={showPassword.new ? 'Hide password' : 'Show password'}
                            >
                              {showPassword.new ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>

                        <div className="form-group">
                          <label htmlFor="settings-conf-password">Confirm Password</label>
                          <div className="password-input-wrapper">
                            <input
                              id="settings-conf-password"
                              type={showPassword.confirm ? 'text' : 'password'}
                              placeholder="Confirm new password"
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                              required
                            />
                            <button
                              type="button"
                              className="password-toggle-btn"
                              onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
                              aria-label={showPassword.confirm ? 'Hide password' : 'Show password'}
                            >
                              {showPassword.confirm ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                          {passwordForm.newPassword && passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                            <span className="field-error-desc">Passwords do not match.</span>
                          )}
                        </div>
                      </div>

                      <div className="form-action-row">
                        <button type="submit" className="btn-primary" disabled={loading}>
                          {loading ? 'Changing Password...' : 'Change Password'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Block: Notifications */}
                  <div className="settings-section glass">
                    <div className="section-title-wrap">
                      <Bell size={16} />
                      <h3>Notification Preferences</h3>
                    </div>

                    <div className="settings-options-list">
                      <div className="option-toggle-row">
                        <div className="option-info">
                          <h4>Email Notifications</h4>
                          <p>Receive order invoices, receipt records, and shipping codes.</p>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={user.preferences.emailNotifications}
                            onChange={(e) => updatePreferences({ emailNotifications: e.target.checked })}
                          />
                          <span className="slider-round" />
                        </label>
                      </div>

                      <div className="option-toggle-row">
                        <div className="option-info">
                          <h4>SMS Notifications</h4>
                          <p>Instant SMS text updates regarding book deliveries.</p>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={user.preferences.smsNotifications}
                            onChange={(e) => updatePreferences({ smsNotifications: e.target.checked })}
                          />
                          <span className="slider-round" />
                        </label>
                      </div>

                      <div className="option-toggle-row">
                        <div className="option-info">
                          <h4>Push Notifications</h4>
                          <p>Browser reminders for active wishlist price discounts.</p>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={user.preferences.pushNotifications}
                            onChange={(e) => updatePreferences({ pushNotifications: e.target.checked })}
                          />
                          <span className="slider-round" />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Block: Privacy */}
                  <div className="settings-section glass">
                    <div className="section-title-wrap">
                      <Shield size={16} />
                      <h3>Privacy Settings</h3>
                    </div>

                    <div className="settings-options-list">
                      <div className="option-toggle-row">
                        <div className="option-info">
                          <h4>Public Display Profile</h4>
                          <p>Allow friends or public accounts to view your reading list & wishlist.</p>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={user.settings.publicProfile}
                            onChange={(e) => updateSettings({ publicProfile: e.target.checked })}
                          />
                          <span className="slider-round" />
                        </label>
                      </div>

                      <div className="option-toggle-row">
                        <div className="option-info">
                          <h4>Search Engine Indexing</h4>
                          <p>Allow Google, Bing, and external agents to crawl your book profile link.</p>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={user.settings.searchIndexing}
                            onChange={(e) => updateSettings({ searchIndexing: e.target.checked })}
                          />
                          <span className="slider-round" />
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Global Floating Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`toast-alert ${notification.type}`}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {notification.type === 'success' ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
