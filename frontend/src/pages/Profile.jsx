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

const getInitials = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

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
    shippingAddress: ''
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
        shippingAddress: user.shippingAddress || ''
      });
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

  // ─── Logged Out Flow ────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[calc(100vh-173px)] py-10 pb-20 bg-bg-base flex items-center justify-center animate-fade-in">
        <div className="max-w-[460px] w-full mx-auto px-4 my-10">
          <div className="p-10 rounded-[20px] flex flex-col gap-7 glass">
            <div className="text-center flex flex-col gap-2">
              <h2 className="text-2xl md:text-[1.8rem] font-extrabold text-text-primary">Welcome to <span className="gradient-text">Bookora</span></h2>
              <p className="text-[0.9rem] text-text-secondary leading-normal">Sign in to view your profile, manage orders, and access your wishlist.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="login-email" className="text-[0.82rem] font-semibold text-text-secondary">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full py-3 px-4 bg-white/2 border border-border-subtle rounded-lg text-text-primary text-[0.9rem] transition-all duration-200 outline-none focus:border-accent-primary focus:bg-white/4 focus:shadow-[0_0_0_2px_rgba(162,148,251,0.15)]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-[0.82rem] font-semibold text-text-secondary">Password</label>
                <div className="relative flex items-center w-full">
                  <input
                    id="password"
                    type={showPassword.login ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                    required
                    className="w-full py-3 px-4 pr-11 bg-white/2 border border-border-subtle rounded-lg text-text-primary text-[0.9rem] transition-all duration-200 outline-none focus:border-accent-primary focus:bg-white/4 focus:shadow-[0_0_0_2px_rgba(162,148,251,0.15)]"
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 text-text-dim cursor-pointer hover:text-text-secondary"
                    onClick={() => setShowPassword((prev) => ({ ...prev, login: !prev.login }))}
                    aria-label={showPassword.login ? 'Hide password' : 'Show password'}
                  >
                    {showPassword.login ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary py-3 px-6 rounded-[30px] font-semibold text-[0.95rem] mt-2 flex items-center justify-center disabled:opacity-50" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                    Signing In...
                  </span>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            <div className="text-center text-[0.85rem] text-text-secondary border-t border-border-subtle pt-5 mt-2.5">
              <span>Don&apos;t have an account? </span>
              <Link to="/auth?mode=signup" className="text-accent-primary font-semibold hover:underline">Create Account</Link>
            </div>

            <div className="p-4 px-5 rounded-lg flex gap-3 items-start text-[0.82rem] leading-normal glass">
              <span className="text-[1.1rem]">💡</span>
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
              className={`fixed top-[30px] left-1/2 -translate-x-1/2 z-[2000] py-3 px-6 rounded-[30px] flex items-center gap-2.5 text-[0.88rem] font-semibold text-white shadow-xl backdrop-blur-md ${
                notification.type === 'success'
                  ? 'bg-green-500/85 border border-green-500/30 shadow-[0_10px_30px_rgba(34,197,94,0.25)]'
                  : 'bg-red-500/85 border border-red-500/30 shadow-[0_10px_30px_rgba(239,68,68,0.25)]'
              }`}
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
    <div className="w-full min-h-[calc(100vh-173px)] py-10 pb-20 bg-bg-base animate-fade-in">
      <div className="max-w-[1490px] mx-auto px-5 md:px-10 flex flex-col gap-9">
        
        {/* Profile Header Card */}
        <div className="p-8 rounded-[20px] bg-bg-card/60 border border-border-subtle shadow-xl overflow-hidden relative glass">
          <div className="flex gap-8 items-center flex-wrap">
            <div className="ph-avatar-section">
              <div className="w-[110px] h-[110px] rounded-full border-3 border-white/8 overflow-hidden bg-bg-elevated shadow-md relative flex items-center justify-center">
                <div className="w-full h-full bg-accent-gradient text-white flex items-center justify-center text-[2.2rem] font-extrabold [text-shadow:0_2px_4px_rgba(0,0,0,0.3)] tracking-tight">
                  {getInitials(user.fullName || user.name)}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="self-start py-1 px-3 rounded-full text-[0.75rem] font-bold text-accent-primary bg-accent-primary/8 border border-accent-primary/15">@{user.username}</span>
              <h1 className="text-[2.2rem] font-extrabold text-white tracking-tight leading-none">{user.fullName}</h1>
              <p className="flex items-center gap-2 text-[0.88rem] text-text-secondary">
                <Mail size={14} className="text-accent-primary opacity-80" />
                <span>{user.email}</span>
              </p>
              <p className="flex items-center gap-2 text-[0.88rem] text-text-secondary">
                <Calendar size={14} className="text-accent-primary opacity-80" />
                <span>Joined {user.dateJoined}</span>
              </p>
            </div>

            <div className="ml-auto">
              <button
                className={`flex items-center gap-2 py-2.5 px-5 rounded-[30px] border border-border-subtle bg-white/2 text-text-secondary text-[0.88rem] font-semibold cursor-pointer transition-colors duration-200 hover:bg-white/8 hover:text-text-primary hover:border-white/15 ${
                  activeTab === 'profile' && isEditing ? 'border-accent-primary! text-accent-primary! bg-accent-primary/8!' : ''
                }`}
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
        </div>

        {/* Dynamic Statistics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-5 p-6 rounded-2xl transition-transform duration-200 hover:-translate-y-1 glass">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-accent-primary/8 text-accent-primary">
              <ShoppingBag size={22} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[0.8rem] font-semibold text-text-dim uppercase tracking-wider">Books Purchased</span>
              <h3 className="text-[1.6rem] font-extrabold text-text-primary m-0 leading-none">{stats.booksPurchased}</h3>
            </div>
          </div>

          <div className="flex items-center gap-5 p-6 rounded-2xl transition-transform duration-200 hover:-translate-y-1 glass">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-green-500/8 text-green-500">
              <PackageCheck size={22} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[0.8rem] font-semibold text-text-dim uppercase tracking-wider">Total Orders</span>
              <h3 className="text-[1.6rem] font-extrabold text-text-primary m-0 leading-none">{stats.totalOrders}</h3>
            </div>
          </div>

          <div className="flex items-center gap-5 p-6 rounded-2xl transition-transform duration-200 hover:-translate-y-1 glass" onClick={() => setActiveTab('wishlist')} style={{ cursor: 'pointer' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-pink-500/8 text-pink-500">
              <Heart size={22} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[0.8rem] font-semibold text-text-dim uppercase tracking-wider">In Wishlist</span>
              <h3 className="text-[1.6rem] font-extrabold text-text-primary m-0 leading-none">{stats.wishlistCount}</h3>
            </div>
          </div>

          <div className="flex items-center gap-5 p-6 rounded-2xl transition-transform duration-200 hover:-translate-y-1 glass">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-violet-500/8 text-violet-500">
              <BookOpen size={22} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[0.8rem] font-semibold text-text-dim uppercase tracking-wider">Currently Reading</span>
              <h3 className="text-[1.6rem] font-extrabold text-text-primary m-0 leading-none">{stats.currentlyReading}</h3>
            </div>
          </div>
        </div>

        {/* Profile Core Sub-sections (Layout: Sidebar nav + Content cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-9 items-start">
          
          {/* Navigation Sidebar */}
          <aside className="flex flex-col gap-8 p-6 rounded-[20px] glass">
            <nav className="flex flex-col gap-2">
              <button
                className={`flex items-center gap-3 py-3 px-4 rounded-lg text-text-secondary text-[0.92rem] font-medium text-left cursor-pointer transition-all duration-200 relative hover:bg-white/3 hover:text-text-primary ${
                  activeTab === 'profile' ? 'bg-accent-primary/6 text-accent-primary font-semibold before:content-[""] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-accent-gradient before:rounded-r' : ''
                }`}
                onClick={() => {
                  setActiveTab('profile');
                  setIsEditing(false);
                }}
              >
                <User size={18} />
                <span>My Information</span>
              </button>

              <button
                className={`flex items-center gap-3 py-3 px-4 rounded-lg text-text-secondary text-[0.92rem] font-medium text-left cursor-pointer transition-all duration-200 relative hover:bg-white/3 hover:text-text-primary ${
                  activeTab === 'orders' ? 'bg-accent-primary/6 text-accent-primary font-semibold before:content-[""] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-accent-gradient before:rounded-r' : ''
                }`}
                onClick={() => setActiveTab('orders')}
              >
                <ShoppingBag size={18} />
                <span>Order History</span>
                <span className="ml-auto text-[0.75rem] font-bold py-0.5 px-1.75 rounded-full bg-white/5 border border-border-subtle text-text-secondary">{orders.length}</span>
              </button>

              <button
                className={`flex items-center gap-3 py-3 px-4 rounded-lg text-text-secondary text-[0.92rem] font-medium text-left cursor-pointer transition-all duration-200 relative hover:bg-white/3 hover:text-text-primary ${
                  activeTab === 'wishlist' ? 'bg-accent-primary/6 text-accent-primary font-semibold before:content-[""] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-accent-gradient before:rounded-r' : ''
                }`}
                onClick={() => setActiveTab('wishlist')}
              >
                <Heart size={18} />
                <span>My Wishlist</span>
                <span className="ml-auto text-[0.75rem] font-bold py-0.5 px-1.75 rounded-full bg-white/5 border border-border-subtle text-text-secondary">{wishlist.length}</span>
              </button>

              <button
                className={`flex items-center gap-3 py-3 px-4 rounded-lg text-text-secondary text-[0.92rem] font-medium text-left cursor-pointer transition-all duration-200 relative hover:bg-white/3 hover:text-text-primary ${
                  activeTab === 'settings' ? 'bg-accent-primary/6 text-accent-primary font-semibold before:content-[""] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-accent-gradient before:rounded-r' : ''
                }`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={18} />
                <span>Account Settings</span>
              </button>
            </nav>

            <div className="border-t border-white/6 pt-6">
              <button className="w-full flex items-center gap-2.5 py-3 px-4 rounded-lg text-text-dim text-[0.9rem] font-semibold cursor-pointer transition-colors duration-200 hover:text-red-400 hover:bg-red-500/5" onClick={logout}>
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Primary Active Tab Panels */}
          <main className="min-h-[500px]">
            <AnimatePresence mode="wait">
              
              {/* TAB: PROFILE / MY INFORMATION */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile-tab"
                  className="rounded-[20px] p-6 md:p-10 flex flex-col gap-8 glass"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex flex-col gap-1.5">
                    <h2 className="text-xl md:text-[1.6rem] font-extrabold text-text-primary tracking-tight">Personal Information</h2>
                    <p className="text-[0.9rem] text-text-secondary leading-normal">Manage your public display details and primary billing credentials.</p>
                  </div>

                  {loading ? (
                    /* Loading skeletons while updates occur */
                    <div className="flex flex-col gap-5">
                      <div className="shimmer-bg h-14 rounded-lg" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="shimmer-bg h-12 rounded-lg" />
                        <div className="shimmer-bg h-12 rounded-lg" />
                        <div className="shimmer-bg h-12 rounded-lg" />
                      </div>
                    </div>
                  ) : !isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="p-5 rounded-xl flex flex-col gap-1.5 glass">
                        <span className="text-[0.75rem] font-semibold text-text-dim uppercase tracking-wider">Full Display Name</span>
                        <p className="text-[0.95rem] font-medium text-text-primary leading-normal break-words">{user.fullName || <span className="text-text-dim italic">Not Provided</span>}</p>
                      </div>

                      <div className="p-5 rounded-xl flex flex-col gap-1.5 glass">
                        <span className="text-[0.75rem] font-semibold text-text-dim uppercase tracking-wider">Username Account</span>
                        <p className="text-[0.95rem] font-medium text-text-primary leading-normal break-words">@{user.username}</p>
                      </div>

                      <div className="p-5 rounded-xl flex flex-col gap-1.5 glass">
                        <span className="text-[0.75rem] font-semibold text-text-dim uppercase tracking-wider">Primary Email Address</span>
                        <p className="text-[0.95rem] font-medium text-text-primary leading-normal break-words">{user.email || <span className="text-text-dim italic">Not Provided</span>}</p>
                      </div>

                      <div className="p-5 rounded-xl flex flex-col gap-1.5 glass">
                        <span className="text-[0.75rem] font-semibold text-text-dim uppercase tracking-wider">Phone Reference</span>
                        <p className="text-[0.95rem] font-medium text-text-primary leading-normal break-words">{user.phone || <span className="text-text-dim italic">Not Provided</span>}</p>
                      </div>

                      <div className="p-5 rounded-xl flex flex-col gap-1.5 glass col-span-1 sm:col-span-2">
                        <span className="text-[0.75rem] font-semibold text-text-dim uppercase tracking-wider">Primary Shipping Destination</span>
                        <p className="text-[0.95rem] font-medium text-text-primary leading-normal break-words">{user.shippingAddress || <span className="text-text-dim italic">No destination address set. Click Edit Profile below to add your address.</span>}</p>
                      </div>

                      <div className="flex justify-end gap-4 mt-3 col-span-1 sm:col-span-2">
                        <button className="py-3 px-7 rounded-[30px] bg-accent-gradient text-white font-semibold text-[0.9rem] cursor-pointer transition-all duration-250 hover:brightness-110 hover:shadow-[0_4px_14px_rgba(162,148,251,0.4)]" onClick={() => setIsEditing(true)}>
                          <span>Modify Information</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label htmlFor="form-fullName" className="text-[0.82rem] font-semibold text-text-secondary">Full Name</label>
                          <input
                            id="form-fullName"
                            type="text"
                            value={profileForm.fullName}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, fullName: e.target.value }))}
                            required
                            className="w-full py-3 px-4 bg-white/2 border border-border-subtle rounded-lg text-text-primary text-[0.9rem] transition-all duration-200 outline-none focus:border-accent-primary focus:bg-white/4 focus:shadow-[0_0_0_2px_rgba(162,148,251,0.15)]"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label htmlFor="form-username" className="text-[0.82rem] font-semibold text-text-secondary">Username (Non-editable)</label>
                          <input
                            id="form-username"
                            type="text"
                            value={`@${user.username}`}
                            disabled
                            className="w-full py-3 px-4 bg-white/2 border border-border-subtle rounded-lg text-text-primary text-[0.9rem] transition-all duration-200 outline-none focus:border-accent-primary focus:bg-white/4 focus:shadow-[0_0_0_2px_rgba(162,148,251,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label htmlFor="form-email" className="text-[0.82rem] font-semibold text-text-secondary">Email Address</label>
                          <input
                            id="form-email"
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                            required
                            className="w-full py-3 px-4 bg-white/2 border border-border-subtle rounded-lg text-text-primary text-[0.9rem] transition-all duration-200 outline-none focus:border-accent-primary focus:bg-white/4 focus:shadow-[0_0_0_2px_rgba(162,148,251,0.15)]"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label htmlFor="form-phone" className="text-[0.82rem] font-semibold text-text-secondary">Phone Number</label>
                          <input
                            id="form-phone"
                            type="tel"
                            placeholder="Enter phone number"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                            className="w-full py-3 px-4 bg-white/2 border border-border-subtle rounded-lg text-text-primary text-[0.9rem] transition-all duration-200 outline-none focus:border-accent-primary focus:bg-white/4 focus:shadow-[0_0_0_2px_rgba(162,148,251,0.15)]"
                          />
                        </div>

                        <div className="flex flex-col gap-2 col-span-1 sm:col-span-2">
                          <label htmlFor="form-address" className="text-[0.82rem] font-semibold text-text-secondary">Shipping Destination Address</label>
                          <textarea
                            id="form-address"
                            rows="3"
                            placeholder="Enter street, flat, pincode, state, and city details..."
                            value={profileForm.shippingAddress}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, shippingAddress: e.target.value }))}
                            className="w-full py-3 px-4 bg-white/2 border border-border-subtle rounded-lg text-text-primary text-[0.9rem] transition-all duration-200 outline-none focus:border-accent-primary focus:bg-white/4 focus:shadow-[0_0_0_2px_rgba(162,148,251,0.15)] resize-none"
                          />
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-6 mt-4 flex flex-col-reverse sm:flex-row justify-end gap-4">
                        <button
                          type="button"
                          className="py-3 px-7 rounded-[30px] bg-white/3 border border-border-subtle text-text-secondary font-semibold text-[0.9rem] cursor-pointer transition-colors duration-200 hover:bg-white/8 hover:text-text-primary hover:border-white/15"
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
                        <button type="submit" className="py-3 px-7 rounded-[30px] bg-accent-gradient text-white font-semibold text-[0.9rem] cursor-pointer transition-all duration-250 hover:brightness-110 hover:shadow-[0_4px_14px_rgba(162,148,251,0.4)] disabled:opacity-50" disabled={loading}>
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
                  className="rounded-[20px] p-6 md:p-10 flex flex-col gap-8 glass"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex flex-col gap-1.5">
                    <h2 className="text-xl md:text-[1.6rem] font-extrabold text-text-primary tracking-tight">Order History</h2>
                    <p className="text-[0.9rem] text-text-secondary leading-normal">Review current deliveries and complete records of past book purchases.</p>
                  </div>

                  {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-16 px-8 rounded-xl glass">
                      <div className="w-18 h-18 rounded-full flex items-center justify-center mb-5 bg-accent-primary/8 text-accent-primary border border-accent-primary/15">
                        <ShoppingBag size={36} />
                      </div>
                      <h3 className="text-[1.3rem] font-bold text-text-primary mb-1.5">No Orders Placed Yet</h3>
                      <p className="text-[0.9rem] text-text-secondary max-w-[320px] leading-relaxed mb-6">Browse our extensive collections to add your first physical book.</p>
                      <Link to="/books" className="py-3 px-7 rounded-[30px] bg-accent-gradient text-white font-semibold text-[0.9rem] cursor-pointer transition-all duration-250 hover:brightness-110 hover:shadow-[0_4px_14px_rgba(162,148,251,0.4)] flex items-center gap-2">
                        <span>Browse Catalog</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-4">
                        {paginatedOrders.map((order) => {
                          const isExpanded = expandedOrders[order.id];
                          return (
                            <div key={order.id} className="rounded-2xl border border-border-subtle overflow-hidden glass">
                              <div className="p-5 md:p-6 cursor-pointer flex flex-col gap-3 transition-colors duration-200 hover:bg-white/1" onClick={() => toggleOrderExpand(order.id)}>
                                <div className="flex justify-between items-start flex-wrap gap-3">
                                  <div className="flex flex-col gap-1">
                                    <span className="text-[0.95rem] font-bold text-text-primary tracking-tight">{order.id}</span>
                                    <span className="text-[0.82rem] text-text-dim">{order.date}</span>
                                  </div>
                                  <span className={`py-1 px-3 rounded-full text-[0.72rem] font-bold uppercase tracking-wider ${
                                    order.status === 'Processing'
                                      ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                                      : 'bg-green-500/10 text-green-500 border border-green-500/20'
                                  }`}>
                                    {order.status}
                                  </span>
                                </div>

                                <div className="flex justify-between items-center border-t border-white/4 pt-3 flex-wrap gap-3">
                                  <div className="flex items-center gap-2 text-[0.88rem] text-text-secondary">
                                    <span>{order.itemsCount} {order.itemsCount === 1 ? 'Book' : 'Books'}</span>
                                    <span className="text-text-dim">•</span>
                                    <span className="font-extrabold text-text-primary text-[0.95rem]">₹{order.total.toFixed(2)}</span>
                                  </div>

                                  <button className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-accent-primary transition-colors duration-200 hover:text-text-primary" aria-label="Toggle details">
                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                                  </button>
                                </div>
                              </div>

                              {/* Accordion expand block */}
                              <AnimatePresence initial={false}>
                                {isExpanded && (
                                  <motion.div
                                    className="border-t border-white/6 bg-white/1 overflow-hidden"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <div className="p-6 flex flex-col gap-5">
                                      
                                      {/* Order shipping status tracking step block */}
                                      <div className="flex items-center justify-between py-2.5 px-4 pb-5 border-b border-white/4">
                                        <div className={`flex flex-col items-center gap-2 relative z-[2] transition-all duration-300 ${
                                          order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? 'text-accent-primary' : 'text-text-dim'
                                        }`}>
                                          <div className={`w-7 h-7 rounded-full border-2 bg-bg-card flex items-center justify-center transition-all duration-300 ${
                                            order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? 'border-accent-primary bg-accent-primary/10 shadow-[0_0_10px_rgba(162,148,251,0.2)]' : 'border-border-subtle'
                                          }`}><BagIcon size={12} /></div>
                                          <span className="text-[0.72rem] font-semibold uppercase tracking-wider">Processing</span>
                                        </div>
                                        <div className="flex-1 h-[2px] bg-border-subtle -mt-4 mx-2 relative z-10" />
                                        <div className={`flex flex-col items-center gap-2 relative z-[2] transition-all duration-300 ${
                                          order.status === 'Shipped' || order.status === 'Delivered' ? 'text-accent-primary' : 'text-text-dim'
                                        }`}>
                                          <div className={`w-7 h-7 rounded-full border-2 bg-bg-card flex items-center justify-center transition-all duration-300 ${
                                            order.status === 'Shipped' || order.status === 'Delivered' ? 'border-accent-primary bg-accent-primary/10 shadow-[0_0_10px_rgba(162,148,251,0.2)]' : 'border-border-subtle'
                                          }`}><Truck size={12} /></div>
                                          <span className="text-[0.72rem] font-semibold uppercase tracking-wider">Shipped</span>
                                        </div>
                                        <div className="flex-1 h-[2px] bg-border-subtle -mt-4 mx-2 relative z-10" />
                                        <div className={`flex flex-col items-center gap-2 relative z-[2] transition-all duration-300 ${
                                          order.status === 'Delivered' ? 'text-accent-primary' : 'text-text-dim'
                                        }`}>
                                          <div className={`w-7 h-7 rounded-full border-2 bg-bg-card flex items-center justify-center transition-all duration-300 ${
                                            order.status === 'Delivered' ? 'border-accent-primary bg-accent-primary/10 shadow-[0_0_10px_rgba(162,148,251,0.2)]' : 'border-border-subtle'
                                          }`}><PackageCheck size={12} /></div>
                                          <span className="text-[0.72rem] font-semibold uppercase tracking-wider">Delivered</span>
                                        </div>
                                      </div>

                                      <h4 className="text-[0.9rem] font-bold uppercase tracking-wider text-text-secondary">Items in this Shipment</h4>
                                      <div className="flex flex-col gap-3">
                                        {order.books.map((b) => (
                                          <div key={b.id} className="p-3 rounded-lg flex items-center gap-4 glass">
                                            <div
                                              className="w-[45px] aspect-[3/4] rounded overflow-hidden bg-bg-elevated cursor-pointer"
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

                                            <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                                              <h5
                                                className="text-[0.9rem] font-semibold text-text-primary truncate cursor-pointer hover:text-accent-primary"
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
                                              <p className="text-[0.78rem] text-text-dim">by {b.author}</p>
                                              <span className="text-[0.75rem] font-semibold text-text-secondary mt-0.5">{b.quantity}x @ ₹{b.price.toFixed(2)}</span>
                                            </div>

                                            <div className="text-[0.9rem] font-bold text-text-primary">
                                              <span>₹{(b.price * b.quantity).toFixed(2)}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>

                                      <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
                                        <div className="flex justify-between text-[0.85rem] text-text-dim">
                                          <span>Subtotal:</span>
                                          <span>₹{(order.total - 40).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-[0.85rem] text-text-dim">
                                          <span>Shipping & Handling:</span>
                                          <span>₹40.00</span>
                                        </div>
                                        <div className="text-base font-extrabold text-text-primary border-t border-white/8 pt-2.5 mt-1 flex justify-between">
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
                        <div className="flex items-center justify-center gap-5 py-2.5 px-5 rounded-[30px] self-center glass">
                          <button
                            className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary border border-border-subtle bg-white/2 transition-all duration-200 hover:not-disabled:bg-white/8 hover:not-disabled:text-text-primary hover:not-disabled:border-white/15 disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={() => setOrderPage((p) => Math.max(p - 1, 1))}
                            disabled={orderPage === 1}
                            aria-label="Previous Page"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          
                          <div className="text-[0.85rem] font-semibold text-text-secondary">
                            <span>Page {orderPage} of {totalOrderPages}</span>
                          </div>

                          <button
                            className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary border border-border-subtle bg-white/2 transition-all duration-200 hover:not-disabled:bg-white/8 hover:not-disabled:text-text-primary hover:not-disabled:border-white/15 disabled:opacity-30 disabled:cursor-not-allowed"
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
                  className="rounded-[20px] p-6 md:p-10 flex flex-col gap-8 glass"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex flex-col gap-1.5">
                    <h2 className="text-xl md:text-[1.6rem] font-extrabold text-text-primary tracking-tight">Wishlisted Books</h2>
                    <p className="text-[0.9rem] text-text-secondary leading-normal">Quick access to saved publications you are planning to purchase later.</p>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-16 px-8 rounded-xl glass">
                      <div className="w-18 h-18 rounded-full flex items-center justify-center mb-5 bg-pink-500/8 text-pink-500 border border-pink-500/15 animate-pulse">
                        <Heart size={36} fill="currentColor" />
                      </div>
                      <h3 className="text-[1.3rem] font-bold text-text-primary mb-1.5">Your Wishlist is Empty</h3>
                      <p className="text-[0.9rem] text-text-secondary max-w-[320px] leading-relaxed mb-6">Explore titles on the Bookstore storefront to populate your wishlist.</p>
                      <Link to="/books" className="py-3 px-7 rounded-[30px] bg-accent-gradient text-white font-semibold text-[0.9rem] cursor-pointer transition-all duration-250 hover:brightness-110 hover:shadow-[0_4px_14px_rgba(162,148,251,0.4)] flex items-center gap-2">
                        <span>Browse Bookstore</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-5">
                      {wishlist.map((book) => (
                        <div key={book.id} className="group bg-bg-card border border-border-subtle rounded-xl overflow-hidden flex flex-col glass">
                          <div className="relative w-full aspect-[3/4] overflow-hidden bg-bg-elevated cursor-pointer" onClick={() => setSelectedBook(book)}>
                            <div className="w-full h-full group-hover:scale-105 transition-transform duration-300">
                              <OptimizedBookCover
                                coverId={book.coverId}
                                src={book.cover}
                                alt={book.title}
                              />
                            </div>
                            
                            <button
                              className="absolute top-2 right-2 w-6.5 h-6.5 rounded-full bg-[#0f0f0f]/85 border border-white/10 flex items-center justify-center text-text-secondary cursor-pointer z-[5] transition-colors duration-200 hover:bg-pink-500 hover:text-white hover:border-pink-500"
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

                          <div className="p-3 flex flex-col gap-0.5 flex-1">
                            <h4 className="text-[0.85rem] font-bold text-text-primary line-clamp-2 cursor-pointer leading-tight hover:text-accent-primary" onClick={() => setSelectedBook(book)}>{book.title}</h4>
                            <p className="text-[0.75rem] text-text-dim">by {book.author}</p>
                            
                            <div className="flex justify-between items-center mt-auto pt-2.5">
                              <span className="text-[0.95rem] font-extrabold text-text-primary">₹{book.price.toFixed(2)}</span>
                              <button className="text-[0.72rem] font-semibold text-accent-primary bg-accent-primary/5 border border-accent-primary/15 py-1 px-2.5 rounded-full hover:bg-accent-primary/10 hover:text-text-primary" onClick={() => setSelectedBook(book)}>
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
                  className="rounded-[20px] p-6 md:p-10 flex flex-col gap-8 glass"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex flex-col gap-1.5">
                    <h2 className="text-xl md:text-[1.6rem] font-extrabold text-text-primary tracking-tight">Account Settings & Policies</h2>
                    <p className="text-[0.9rem] text-text-secondary leading-normal">Control password variables, preference systems, and public privacy standards.</p>
                  </div>

                  {/* Block: Password */}
                  <div className="p-6 rounded-xl flex flex-col gap-5 glass">
                    <div className="flex items-center gap-2.5 border-b border-white/4 pb-3">
                      <Lock size={16} className="text-accent-primary" />
                      <h3 className="text-[1rem] font-bold uppercase tracking-wider text-text-primary">Change Password</h3>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label htmlFor="settings-curr-password" className="text-[0.82rem] font-semibold text-text-secondary">Current Password</label>
                          <div className="relative flex items-center w-full">
                            <input
                              id="settings-curr-password"
                              type={showPassword.current ? 'text' : 'password'}
                              placeholder="Enter current password"
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                              required
                              className="w-full py-3 px-4 pr-11 bg-white/2 border border-border-subtle rounded-lg text-text-primary text-[0.9rem] transition-all duration-200 outline-none focus:border-accent-primary focus:bg-white/4 focus:shadow-[0_0_0_2px_rgba(162,148,251,0.15)]"
                            />
                            <button
                              type="button"
                              className="absolute right-3.5 text-text-dim cursor-pointer hover:text-text-secondary"
                              onClick={() => setShowPassword((prev) => ({ ...prev, current: !prev.current }))}
                              aria-label={showPassword.current ? 'Hide password' : 'Show password'}
                            >
                              {showPassword.current ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label htmlFor="settings-new-password" className="text-[0.82rem] font-semibold text-text-secondary">New Password</label>
                          <div className="relative flex items-center w-full">
                            <input
                              id="settings-new-password"
                              type={showPassword.new ? 'text' : 'password'}
                              placeholder="Enter new password"
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                              required
                              className="w-full py-3 px-4 pr-11 bg-white/2 border border-border-subtle rounded-lg text-text-primary text-[0.9rem] transition-all duration-200 outline-none focus:border-accent-primary focus:bg-white/4 focus:shadow-[0_0_0_2px_rgba(162,148,251,0.15)]"
                            />
                            <button
                              type="button"
                              className="absolute right-3.5 text-text-dim cursor-pointer hover:text-text-secondary"
                              onClick={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
                              aria-label={showPassword.new ? 'Hide password' : 'Show password'}
                            >
                              {showPassword.new ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label htmlFor="settings-conf-password" className="text-[0.82rem] font-semibold text-text-secondary">Confirm Password</label>
                          <div className="relative flex items-center w-full">
                            <input
                              id="settings-conf-password"
                              type={showPassword.confirm ? 'text' : 'password'}
                              placeholder="Confirm new password"
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                              required
                              className="w-full py-3 px-4 pr-11 bg-white/2 border border-border-subtle rounded-lg text-text-primary text-[0.9rem] transition-all duration-200 outline-none focus:border-accent-primary focus:bg-white/4 focus:shadow-[0_0_0_2px_rgba(162,148,251,0.15)]"
                            />
                            <button
                              type="button"
                              className="absolute right-3.5 text-text-dim cursor-pointer hover:text-text-secondary"
                              onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
                              aria-label={showPassword.confirm ? 'Hide password' : 'Show password'}
                            >
                              {showPassword.confirm ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                          {passwordForm.newPassword && passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                            <span className="text-[0.75rem] text-pink-500 font-medium mt-1">Passwords do not match.</span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-4 mt-3">
                        <button type="submit" className="py-3 px-7 rounded-[30px] bg-accent-gradient text-white font-semibold text-[0.9rem] cursor-pointer transition-all duration-250 hover:brightness-110 hover:shadow-[0_4px_14px_rgba(162,148,251,0.4)] disabled:opacity-50" disabled={loading}>
                          {loading ? 'Changing Password...' : 'Change Password'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Block: Notifications */}
                  <div className="p-6 rounded-xl flex flex-col gap-5 glass">
                    <div className="flex items-center gap-2.5 border-b border-white/4 pb-3">
                      <Bell size={16} className="text-accent-primary" />
                      <h3 className="text-[1rem] font-bold uppercase tracking-wider text-text-primary">Notification Preferences</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center gap-6 py-2 border-b border-white/2 pb-4">
                        <div className="flex flex-col gap-0.5">
                          <h4 className="text-[0.95rem] font-semibold text-text-primary">Email Notifications</h4>
                          <p className="text-[0.8rem] text-text-secondary">Receive order invoices, receipt records, and shipping codes.</p>
                        </div>
                        <label className="relative inline-block w-11 h-6 shrink-0 cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={user.preferences.emailNotifications}
                            onChange={(e) => updatePreferences({ emailNotifications: e.target.checked })}
                          />
                          <span className="absolute inset-0 bg-bg-elevated border border-border-subtle rounded-full transition-all duration-300 peer-checked:bg-accent-gradient peer-checked:border-transparent after:content-[''] after:absolute after:h-4 after:w-4 after:left-[3px] after:bottom-[3px] after:bg-text-secondary after:rounded-full after:transition-all after:duration-300 peer-checked:after:translate-x-[20px] peer-checked:after:bg-white" />
                        </label>
                      </div>

                      <div className="flex justify-between items-center gap-6 py-2 border-b border-white/2 pb-4">
                        <div className="flex flex-col gap-0.5">
                          <h4 className="text-[0.95rem] font-semibold text-text-primary">SMS Notifications</h4>
                          <p className="text-[0.8rem] text-text-secondary">Instant SMS text updates regarding book deliveries.</p>
                        </div>
                        <label className="relative inline-block w-11 h-6 shrink-0 cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={user.preferences.smsNotifications}
                            onChange={(e) => updatePreferences({ smsNotifications: e.target.checked })}
                          />
                          <span className="absolute inset-0 bg-bg-elevated border border-border-subtle rounded-full transition-all duration-300 peer-checked:bg-accent-gradient peer-checked:border-transparent after:content-[''] after:absolute after:h-4 after:w-4 after:left-[3px] after:bottom-[3px] after:bg-text-secondary after:rounded-full after:transition-all after:duration-300 peer-checked:after:translate-x-[20px] peer-checked:after:bg-white" />
                        </label>
                      </div>

                      <div className="flex justify-between items-center gap-6 py-2">
                        <div className="flex flex-col gap-0.5">
                          <h4 className="text-[0.95rem] font-semibold text-text-primary">Push Notifications</h4>
                          <p className="text-[0.8rem] text-text-secondary">Browser reminders for active wishlist price discounts.</p>
                        </div>
                        <label className="relative inline-block w-11 h-6 shrink-0 cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={user.preferences.pushNotifications}
                            onChange={(e) => updatePreferences({ pushNotifications: e.target.checked })}
                          />
                          <span className="absolute inset-0 bg-bg-elevated border border-border-subtle rounded-full transition-all duration-300 peer-checked:bg-accent-gradient peer-checked:border-transparent after:content-[''] after:absolute after:h-4 after:w-4 after:left-[3px] after:bottom-[3px] after:bg-text-secondary after:rounded-full after:transition-all after:duration-300 peer-checked:after:translate-x-[20px] peer-checked:after:bg-white" />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Block: Privacy */}
                  <div className="p-6 rounded-xl flex flex-col gap-5 glass">
                    <div className="flex items-center gap-2.5 border-b border-white/4 pb-3">
                      <Shield size={16} className="text-accent-primary" />
                      <h3 className="text-[1rem] font-bold uppercase tracking-wider text-text-primary">Privacy Settings</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center gap-6 py-2 border-b border-white/2 pb-4">
                        <div className="flex flex-col gap-0.5">
                          <h4 className="text-[0.95rem] font-semibold text-text-primary">Public Display Profile</h4>
                          <p className="text-[0.8rem] text-text-secondary">Allow friends or public accounts to view your reading list & wishlist.</p>
                        </div>
                        <label className="relative inline-block w-11 h-6 shrink-0 cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={user.settings.publicProfile}
                            onChange={(e) => updateSettings({ publicProfile: e.target.checked })}
                          />
                          <span className="absolute inset-0 bg-bg-elevated border border-border-subtle rounded-full transition-all duration-300 peer-checked:bg-accent-gradient peer-checked:border-transparent after:content-[''] after:absolute after:h-4 after:w-4 after:left-[3px] after:bottom-[3px] after:bg-text-secondary after:rounded-full after:transition-all after:duration-300 peer-checked:after:translate-x-[20px] peer-checked:after:bg-white" />
                        </label>
                      </div>

                      <div className="flex justify-between items-center gap-6 py-2">
                        <div className="flex flex-col gap-0.5">
                          <h4 className="text-[0.95rem] font-semibold text-text-primary">Search Engine Indexing</h4>
                          <p className="text-[0.8rem] text-text-secondary">Allow Google, Bing, and external agents to crawl your book profile link.</p>
                        </div>
                        <label className="relative inline-block w-11 h-6 shrink-0 cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={user.settings.searchIndexing}
                            onChange={(e) => updateSettings({ searchIndexing: e.target.checked })}
                          />
                          <span className="absolute inset-0 bg-bg-elevated border border-border-subtle rounded-full transition-all duration-300 peer-checked:bg-accent-gradient peer-checked:border-transparent after:content-[''] after:absolute after:h-4 after:w-4 after:left-[3px] after:bottom-[3px] after:bg-text-secondary after:rounded-full after:transition-all after:duration-300 peer-checked:after:translate-x-[20px] peer-checked:after:bg-white" />
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
            className={`fixed top-[30px] left-1/2 -translate-x-1/2 z-[2000] py-3 px-6 rounded-[30px] flex items-center gap-2.5 text-[0.88rem] font-semibold text-white shadow-xl backdrop-blur-md ${
              notification.type === 'success'
                ? 'bg-green-500/85 border border-green-500/30 shadow-[0_10px_30px_rgba(34,197,94,0.25)]'
                : 'bg-red-500/85 border border-red-500/30 shadow-[0_10px_30px_rgba(239,68,68,0.25)]'
            }`}
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
