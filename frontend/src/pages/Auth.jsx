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
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Phone,
  MapPin
} from 'lucide-react';
import { useUser, validatePassword } from '../contexts/UserContext';
import './Auth.css';

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <div className="auth-page fade-in">
      <div className="auth-container">
        
        {/* Back Link to Bookstore Catalog */}
        <Link to="/books" className="back-catalog-link">
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </Link>

        <div className="auth-split-card glass">
          {/* Form Side */}
          <div className="auth-main-panel">
            <div className="auth-pane-header">
              <h2>
                {mode === 'signin' ? 'Welcome ' : 'Create Your '}
                <span className="gradient-text">{mode === 'signin' ? 'Back' : 'Account'}</span>
              </h2>
              <p>
                {mode === 'signin'
                  ? 'Sign in to access your bookshelf, history, and wishlist.'
                  : 'Start your literary adventure with personal catalogs today.'}
              </p>
            </div>

            {/* Local Error Block */}
            {localError && (
              <div className="auth-local-error glass">
                <AlertCircle size={16} />
                <span>{localError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="auth-core-form">
              {mode === 'signup' ? (
                <>
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <div className="input-with-icon">
                      <User size={16} className="field-icon" />
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <div className="input-with-icon">
                      <User size={16} className="field-icon" />
                      <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-with-icon">
                      <Mail size={16} className="field-icon" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <div className="input-with-icon">
                      <Phone size={16} className="field-icon" />
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="shippingAddress">Shipping Address</label>
                    <div className="input-with-icon">
                      <MapPin size={16} className="field-icon" style={{ alignSelf: 'flex-start', marginTop: '12px' }} />
                      <textarea
                        id="shippingAddress"
                        name="shippingAddress"
                        placeholder="Enter your shipping address"
                        value={formData.shippingAddress}
                        onChange={handleInputChange}
                        required
                        rows="3"
                        style={{ width: '100%', paddingLeft: '40px', paddingTop: '10px' }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label htmlFor="signinEmail">Username or Email</label>
                  <div className="input-with-icon">
                    <User size={16} className="field-icon" />
                    <input
                      id="signinEmail"
                      name="signinEmail"
                      type="text"
                      placeholder="Enter username or email address"
                      value={formData.signinEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon password-field">
                  <Lock size={16} className="field-icon" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-trigger"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm password removed as per user simplified signup request */}

              {/* Terms and Conditions Tickboxes for Sign In & Sign Up */}
              <div className="auth-terms-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
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
                  <span className="checkbox-checkmark" />
                  <span className="checkbox-text">
                    I agree to the <a href="#terms" className="terms-link">Terms & Conditions</a> and <a href="#privacy" className="terms-link">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="spinner-loader">Authenticating...</span>
                ) : (
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>
            </form>

            {/* Standarized Divider */}
            <div className="auth-social-divider">
              <span className="divider-line" />
              <span className="divider-text">Or Continue With</span>
              <span className="divider-line" />
            </div>

            {/* Branded Social Sign-In Buttons */}
            <div className="auth-social-brands">
              <button
                className="brand-btn google"
                onClick={() => handleSocialSignIn('Google')}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.59.1-1.17.282-1.706V4.962H.957A8.995 8.995 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.32 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                className="brand-btn facebook"
                onClick={() => handleSocialSignIn('Facebook')}
                disabled={loading}
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>

            {/* Mode Switch Footer */}
            <div className="auth-pane-footer">
              <span>
                {mode === 'signin' ? "Don't have an account? " : 'Already registered? '}
              </span>
              <Link
                to={mode === 'signin' ? '/auth?mode=signup' : '/auth?mode=signin'}
                className="auth-toggle-link"
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

export default Auth;
