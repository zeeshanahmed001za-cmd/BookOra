import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft,
  PackageCheck, ShieldCheck, Truck, AlertCircle, CheckCircle
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import OptimizedBookCover from '../components/OptimizedBookCover';
import './Cart.css';

const SHIPPING_FEE = 49;
const TAX_RATE = 0.18;

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, subtotal, cartCount } = useCart();
  const { user, isAuthenticated, showToast } = useUser();
  const navigate = useNavigate();

  const [placing, setPlacing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const taxableAmount = subtotal - discount;
  const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
  const taxes = Math.round(taxableAmount * TAX_RATE);
  const total = taxableAmount + shipping + taxes;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'BOOKORA10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try BOOKORA10 for 10% off!');
      setPromoApplied(false);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      showToast('error', 'Please sign in to place an order.');
      navigate('/auth?mode=signin');
      return;
    }
    if (cartItems.length === 0) return;

    setPlacing(true);
    try {
      const token = localStorage.getItem('bookora_token');
      const items = cartItems.map(item => ({
        book: item._id || item.id,
        quantity: item.quantity,
        price: item.price
      }));
      const shippingAddress = user?.shippingAddress || 'Not provided';

      const response = await fetch('http://localhost:5000/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items, totalPrice: total, shippingAddress })
      });

      const data = await response.json();
      if (data.status === 'success') {
        clearCart();
        showToast('success', 'Order placed successfully! Check your profile for details.');
        navigate('/profile');
      } else {
        showToast('error', data.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      showToast('error', 'Network error. Please check your connection.');
    } finally {
      setPlacing(false);
    }
  };

  // ── Empty cart ──────────────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="cart-page fade-in">
        <div className="cart-empty-state">
          <motion.div
            className="cart-empty-icon"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <ShoppingCart size={64} />
          </motion.div>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any books yet. Explore our catalog and find something you'll love!</p>
          <Link to="/books" className="cart-browse-btn btn-primary">
            <span>Browse Books</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page fade-in">
      {/* Header */}
      <div className="cart-header">
        <div>
          <h1>Your <span className="gradient-text">Cart</span></h1>
          <p className="cart-subheading">{cartCount} {cartCount === 1 ? 'item' : 'items'} ready to checkout</p>
        </div>
        <Link to="/books" className="cart-continue-link">
          <ArrowLeft size={16} />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="cart-layout">
        {/* ── Left: Cart Items ── */}
        <div className="cart-items-panel">
          <AnimatePresence>
            {cartItems.map(item => (
              <motion.div
                key={item.id}
                className="cart-item glass"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -60, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {/* Cover */}
                <div className="ci-cover" onClick={() => {}}>
                  <OptimizedBookCover
                    coverId={item.coverId}
                    src={item.cover}
                    alt={item.title}
                  />
                </div>

                {/* Details */}
                <div className="ci-details">
                  <span className="ci-category">{item.category}</span>
                  <h3 className="ci-title">{item.title}</h3>
                  <p className="ci-author">by {item.author}</p>
                  <div className="ci-price-row">
                    <span className="ci-price">₹{item.price.toFixed(2)}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="ci-original-price">₹{item.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                {/* Quantity + Remove */}
                <div className="ci-actions">
                  <div className="ci-quantity-control">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="ci-line-total">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    className="ci-remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove from cart"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Clear Cart */}
          <div className="cart-clear-row">
            <button className="clear-cart-btn" onClick={clearCart}>
              <Trash2 size={14} />
              <span>Clear All Items</span>
            </button>
          </div>
        </div>

        {/* ── Right: Order Summary ── */}
        <div className="cart-summary-panel">
          <div className="cart-summary glass">
            <h2 className="summary-title">Order Summary</h2>

            {/* Promo Code */}
            <div className="promo-section">
              <label className="promo-label">Promo Code</label>
              <div className="promo-input-row">
                <input
                  type="text"
                  className="promo-input"
                  placeholder="Enter code..."
                  value={promoCode}
                  onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
                  disabled={promoApplied}
                />
                <button
                  className={`promo-apply-btn ${promoApplied ? 'applied' : ''}`}
                  onClick={handleApplyPromo}
                  disabled={promoApplied || !promoCode.trim()}
                >
                  {promoApplied ? <CheckCircle size={16} /> : 'Apply'}
                </button>
              </div>
              {promoApplied && (
                <p className="promo-success">
                  <CheckCircle size={13} /> 10% discount applied!
                </p>
              )}
              {promoError && (
                <p className="promo-error">
                  <AlertCircle size={13} /> {promoError}
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {promoApplied && (
                <div className="summary-row discount-row">
                  <span>Promo Discount (10%)</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Shipping & Handling</span>
                <span className={shipping === 0 ? 'free-tag' : ''}>
                  {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="summary-row">
                <span>GST (18%)</span>
                <span>₹{taxes.toFixed(2)}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <motion.button
              className="checkout-btn btn-primary"
              onClick={handleCheckout}
              disabled={placing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {placing ? (
                <span className="spinner-loader">Placing Order...</span>
              ) : (
                <>
                  <span>Place Order</span>
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>

            {!isAuthenticated && (
              <p className="signin-notice">
                <AlertCircle size={13} />
                <span>
                  <Link to="/auth?mode=signin" className="signin-link">Sign in</Link> to place your order
                </span>
              </p>
            )}

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="trust-badge">
                <ShieldCheck size={16} />
                <span>Secure Checkout</span>
              </div>
              <div className="trust-badge">
                <Truck size={16} />
                <span>Fast Delivery</span>
              </div>
              <div className="trust-badge">
                <PackageCheck size={16} />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
