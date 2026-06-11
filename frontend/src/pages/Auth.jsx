import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Phone,
  MapPin
} from 'lucide-react';
import { useUser, validatePassword } from '../contexts/UserContext';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, notification, login, signup, showToast } = useUser();

  // Determine current mode ('signin' or 'signup') based on URL parameters
  const queryParams = new URLSearchParams(location.search);
  const initialMode = queryParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const [mode, setMode] = useState(initialMode);

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    signinEmail: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    shippingAddress: ''
  });

  const [agreeSignup, setAgreeSignup] = useState(false);
  const [agreeSignin, setAgreeSignin] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  // Sync mode with URL queries
  useEffect(() => {
    const currentMode = queryParams.get('mode') === 'signup' ? 'signup' : 'signin';
    setMode(currentMode);
    setLocalError('');
  }, [location.search]);

  // If already authenticated, redirect immediately to profile
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setLocalError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (mode === 'signup') {
      // Validate Terms Agreement
      if (!agreeSignup) {
        setLocalError('You must agree to the Terms & Conditions and Privacy Policy.');
        return;
      }
      // Validate registration details
      if (!formData.fullName.trim()) {
        setLocalError('Please enter your full name.');
        return;
      }
      if (formData.username.trim().length < 3) {
        setLocalError('Username must be at least 3 characters.');
        return;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setLocalError('Please enter a valid email address.');
        return;
      }
      if (!formData.phone.trim()) {
        setLocalError('Please enter your phone number.');
        return;
      }
      if (!formData.shippingAddress.trim()) {
        setLocalError('Please enter your shipping address.');
        return;
      }
      
      // Complexity validation checks
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        setLocalError(passwordError);
        return;
      }

      await signup(
        formData.fullName.trim(),
        formData.email,
        formData.username,
        formData.password,
        formData.password,
        formData.phone.trim(),
        formData.shippingAddress.trim()
      );
    } else {
      // Validate Terms Agreement for Sign In
      if (!agreeSignin) {
        setLocalError('You must agree to the Terms & Conditions and Privacy Policy.');
        return;
      }
      // Sign In validation
      if (!formData.signinEmail.trim()) {
        setLocalError('Please enter your username or email.');
        return;
      }
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        setLocalError(passwordError);
        return;
      }

      await login(formData.signinEmail, formData.password);
    }
  };

  // Mock social sign-in brand triggers
  const handleSocialSignIn = (brand) => {
    // If not agreed to terms, block social sign-in as well to maintain high compliance standards
    const currentAgreement = mode === 'signup' ? agreeSignup : agreeSignin;
    if (!currentAgreement) {
      setLocalError('You must agree to the Terms & Conditions and Privacy Policy first.');
      showToast('error', 'Please accept Terms & Conditions.');
      return;
    }

    showToast('success', `Simulating ${brand} single sign-on connection...`);
    // After short delay, perform mock authentication with conforming complexity password
    setTimeout(() => {
      login('social_user', 'Password123!');
    }, 1200);
  };

  return (
    <div className="w-full min-h-[calc(100vh-173px)] py-10 md:py-16 bg-bg-base flex flex-col justify-center animate-fade-in">
      <div className="max-w-[500px] w-full mx-auto px-6 flex flex-col gap-5">
        
        {/* Back Link to Bookstore Catalog */}
        <Link to="/books" className="inline-flex items-center gap-2 text-text-secondary text-[0.85rem] font-medium self-start transition-colors duration-200 hover:text-accent-primary">
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </Link>

        <div className="relative rounded-[20px] bg-bg-card/60 border border-border-subtle shadow-xl overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[4px] before:bg-accent-gradient glass">
          {/* Form Side */}
          <div className="p-8 md:p-12 flex flex-col gap-7">
            <div className="flex flex-col gap-1.5 text-center">
              <h2 className="text-2xl md:text-[1.8rem] font-extrabold text-text-primary tracking-tight">
                {mode === 'signin' ? 'Welcome ' : 'Create Your '}
                <span className="gradient-text">{mode === 'signin' ? 'Back' : 'Account'}</span>
              </h2>
              <p className="text-[0.88rem] text-text-secondary leading-normal">
                {mode === 'signin'
                  ? 'Sign in to access your bookshelf, history, and wishlist.'
                  : 'Start your literary adventure with personal catalogs today.'}
              </p>
            </div>

            {/* Local Error Block */}
            {localError && (
              <div className="glass p-3 px-4 rounded-lg bg-red-500/8 border border-red-500/15 flex items-center gap-2.5 text-red-500 text-[0.82rem] font-medium leading-normal">
                <AlertCircle size={16} />
                <span>{localError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4.5">
              {mode === 'signup' ? (
                <>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="fullName" className="text-[0.82rem] font-semibold text-text-secondary">Full Name</label>
                    <div className="relative flex items-center w-full">
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="peer w-full py-3 px-4 pl-10 bg-white/2 border border-border-subtle rounded-lg text-text-primary text-[0.9rem] transition-all duration-200 outline-none focus:border-accent-primary focus:bg-white/4 focus:shadow-[0_0_0_2px_rgba(162,148,251,0.15)]"
                      />
                      <User size={16} className="absolute left-3.5 text-text-dim pointer-events-none transition-colors duration-200 peer-focus:text-accent-primary" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="username" className="text-[0.82rem] font-semibold text-text-secondary">Username</label>
                    <div className="relative flex items-center w-full">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        className="peer w-full py-3 px-4 pl-10 bg-white/2 border border-border-subtle rounded-lg text-text-primary text-[0.9rem] transition-all duration-200 outline-none focus:border-accent-primary focus:bg-white/4 focus:shadow-[0_0_0_2px_rgba(162,148,251,0.15)]"
                      />
                      <User size={16} className="absolute left-3.5 text-text-dim pointer-events-none transition-colors duration-200 peer-focus:text-accent-primary" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-[0.82rem] font-semibold text-text-secondary">Email Address</label>
                    <div className="relative flex items-center w-full">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="peer w-full py-3 px-4 pl-10 bg-white/2 border border-border-subtle rounded-lg text-text-primary text-[0.9rem] transition-all duration-200 outline-none focus:border-accent-primary focus:bg-white/4 focus:shadow-[0_0_0_2px_rgba(162,148,251,0.15)]"
                      />
                      <Mail size={16} className="absolute left-3.5 text-text-dim pointer-events-none transition-colors duration-200 peer-focus:text-accent-primary" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-[0.82rem] font-semibold text-text-secondary">Phone Number</label>
                    <div className="relative flex items-center w-full">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="peer w-full py-3 px-4 pl-10 bg-white/2 border border-border-subtle rounded-lg text-text-primary text-[0.9rem] transition-all duration-200 outline-none focus:border-accent-primary focus:bg-white/4 focus:shadow-[0_0_0_2px_rgba(162,148,251,0.15)]"
                      />
                      <Phone size={16} className="absolute left-3.5 text-text-dim pointer-events-none transition-colors duration-200 peer-focus:text-accent-primary" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="shippingAddress" className="text-[0.82rem] font-semibold text-text-secondary">Shipping Address</label>
                    <div className="relative flex items-center w-full">
                      <textarea
                        id="shippingAddress"
                        name="shippingAddress"
                        placeholder="Enter your shipping address"
                        value={formData.shippingAddress}
                        onChange={handleInputChange}
                        required
                        rows="3"
                        className="peer w-full py-3.5 px-4 pl-10 bg-white/2 border border-border-subtle rounded-lg text-text-primary text-[0.9rem] transition-all duration-200 outline-none focus:border-accent-primary focus:bg-white/4 focus:shadow-[0_0_0_2px_rgba(162,148,251,0.15)] resize-none"
                      />
                      <MapPin size={16} className="absolute left-3.5 top-3.5 text-text-dim pointer-events-none transition-colors duration-200 peer-focus:text-accent-primary" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <label htmlFor="signinEmail" className="text-[0.82rem] font-semibold text-text-secondary">Username or Email</label>
                  <div className="relative flex items-center w-full">
                    <input
                      id="signinEmail"
                      name="signinEmail"
                      type="text"
                      placeholder="Enter username or email address"
                      value={formData.signinEmail}
                      onChange={handleInputChange}
                      required
                      className="peer w-full py-3 px-4 pl-10 bg-white/2 border border-border-subtle rounded-lg text-text-primary text-[0.9rem] transition-all duration-200 outline-none focus:border-accent-primary focus:bg-white/4 focus:shadow-[0_0_0_2px_rgba(162,148,251,0.15)]"
                    />
                    <User size={16} className="absolute left-3.5 text-text-dim pointer-events-none transition-colors duration-200 peer-focus:text-accent-primary" />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-[0.82rem] font-semibold text-text-secondary">Password</label>
                <div className="relative flex items-center w-full">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="peer w-full py-3 px-4 pl-10 pr-10 bg-white/2 border border-border-subtle rounded-lg text-text-primary text-[0.9rem] transition-all duration-200 outline-none focus:border-accent-primary focus:bg-white/4 focus:shadow-[0_0_0_2px_rgba(162,148,251,0.15)]"
                  />
                  <Lock size={16} className="absolute left-3.5 text-text-dim pointer-events-none transition-colors duration-200 peer-focus:text-accent-primary" />
                  <button
                    type="button"
                    className="absolute right-3.5 text-text-dim cursor-pointer bg-none border-none flex items-center justify-center hover:text-text-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions custom styled tickbox */}
              <div className="my-2.5">
                <label className="flex items-start gap-3 cursor-pointer text-[0.82rem] text-text-secondary select-none leading-normal text-left">
                  <div className="relative flex items-center justify-center w-[18px] h-[18px] rounded border border-border-subtle bg-white/2 mt-0.5 transition-all duration-200 shrink-0">
                    <input
                      type="checkbox"
                      className="peer absolute opacity-0 cursor-pointer h-full w-full"
                      checked={mode === 'signup' ? agreeSignup : agreeSignin}
                      onChange={(e) => {
                        if (mode === 'signup') {
                          setAgreeSignup(e.target.checked);
                        } else {
                          setAgreeSignin(e.target.checked);
                        }
                        setLocalError('');
                      }}
                      required
                    />
                    <div className="w-full h-full rounded bg-accent-gradient flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity duration-200">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span>
                    I agree to the <a href="#terms" className="text-accent-primary font-semibold underline hover:text-text-primary">Terms & Conditions</a> and <a href="#privacy" className="text-accent-primary font-semibold underline hover:text-text-primary">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <button type="submit" className="btn-primary py-3 px-6 rounded-[30px] font-semibold text-[0.95rem] mt-2.5 flex items-center justify-center disabled:opacity-50" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>
            </form>

            {/* Standarized Divider */}
            <div className="flex items-center gap-4 my-2.5">
              <span className="flex-1 h-[1px] bg-border-subtle" />
              <span className="text-[0.75rem] font-semibold text-text-dim uppercase tracking-wider whitespace-nowrap">Or Continue With</span>
              <span className="flex-1 h-[1px] bg-border-subtle" />
            </div>

            {/* Branded Social Sign-In Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                className="group flex items-center justify-center gap-2.5 py-3 px-5 rounded-[30px] border border-border-subtle bg-white/2 text-text-primary text-[0.88rem] font-semibold transition-all duration-200 cursor-pointer hover:bg-white/6 hover:border-white/15 hover:-translate-y-0.5"
                onClick={() => handleSocialSignIn('Google')}
                disabled={loading}
              >
                <svg className="shrink-0 transition-transform duration-200 group-hover:scale-108" width="18" height="18" viewBox="0 0 18 18">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.59.1-1.17.282-1.706V4.962H.957A8.995 8.995 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.32 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                className="group flex items-center justify-center gap-2.5 py-3 px-5 rounded-[30px] border border-border-subtle bg-white/2 text-text-primary text-[0.88rem] font-semibold transition-all duration-200 cursor-pointer hover:bg-white/6 hover:border-white/15 hover:-translate-y-0.5"
                onClick={() => handleSocialSignIn('Facebook')}
                disabled={loading}
              >
                <svg className="shrink-0 transition-transform duration-200 group-hover:scale-108 text-[#1877F2]" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>

            {/* Mode Switch Footer */}
            <div className="text-center text-[0.85rem] text-text-secondary border-t border-border-subtle pt-5 mt-2.5">
              <span>
                {mode === 'signin' ? "Don't have an account? " : 'Already registered? '}
              </span>
              <Link
                to={mode === 'signin' ? '/auth?mode=signup' : '/auth?mode=signin'}
                className="text-accent-primary font-semibold hover:underline"
              >
                {mode === 'signin' ? 'Create Account' : 'Sign In Now'}
              </Link>
            </div>
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
};

export default Auth;
