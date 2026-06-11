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

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
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
      <div className="w-full min-h-screen py-12 px-6 max-w-[1280px] mx-auto animate-fade-in">
        <div className="flex flex-col items-center justify-center text-center py-24 px-6 gap-4">
          <motion.div
            className="w-30 h-30 rounded-full bg-gradient-to-br from-accent-primary/15 to-accent-secondary/15 border border-accent-primary/20 flex items-center justify-center text-accent-primary mb-4"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <ShoppingCart size={64} />
          </motion.div>
          <h2 className="text-3xl font-bold text-text-primary">Your Cart is Empty</h2>
          <p className="text-text-dim max-w-[420px] text-base leading-relaxed">Looks like you haven't added any books yet. Explore our catalog and find something you'll love!</p>
          <Link to="/books" className="inline-flex items-center gap-2 mt-2 py-3.5 px-7 rounded-xl text-base font-semibold bg-accent-gradient text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(109,89,255,0.35)]">
            <span>Browse Books</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-12 px-6 max-w-[1280px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-9 flex-wrap gap-3">
        <div>
          <h1 className="text-[2.2rem] font-extrabold text-text-primary mb-1">Your <span className="gradient-text">Cart</span></h1>
          <p className="text-text-dim text-[0.95rem]">{cartCount} {cartCount === 1 ? 'item' : 'items'} ready to checkout</p>
        </div>
        <Link to="/books" className="inline-flex items-center gap-1.5 text-accent-primary text-[0.9rem] font-medium py-2.5 px-4.5 border border-accent-primary/30 rounded-xl bg-accent-primary/6 transition-colors duration-200 hover:bg-accent-primary/12 hover:border-accent-primary/5">
          <ArrowLeft size={16} />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7 items-start">
        {/* ── Left: Cart Items ── */}
        <div className="flex flex-col gap-3.5">
          <AnimatePresence>
            {cartItems.map(item => (
              <motion.div
                key={item.id}
                className="grid grid-cols-[90px_1fr] md:grid-cols-[90px_1fr_auto] gap-5 p-5 rounded-2xl align-items-center transition-shadow duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] glass"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -60, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {/* Cover */}
                <div className="w-[90px] h-[120px] rounded-lg overflow-hidden shrink-0" onClick={() => {}}>
                  <OptimizedBookCover
                    coverId={item.coverId}
                    src={item.cover}
                    alt={item.title}
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[0.72rem] uppercase tracking-wider text-accent-primary font-semibold">{item.category}</span>
                  <h3 className="text-[1.05rem] font-bold text-text-primary truncate">{item.title}</h3>
                  <p className="text-[0.85rem] text-text-dim">by {item.author}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[1.1rem] font-bold text-accent-primary">₹{item.price.toFixed(2)}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-[0.85rem] text-text-dim line-through">₹{item.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                {/* Quantity + Remove */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2.5 col-span-2 md:col-span-1 mt-4 md:mt-0">
                  <div className="flex items-center border border-accent-primary/20 rounded-xl overflow-hidden bg-accent-primary/5">
                    <button
                      className="bg-none border-none text-text-primary cursor-pointer py-2 px-3 flex items-center justify-center transition-colors duration-150 hover:not-disabled:bg-accent-primary/15 disabled:opacity-35 disabled:cursor-not-allowed"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="min-w-[32px] text-center text-[0.95rem] font-semibold text-text-primary">{item.quantity}</span>
                    <button
                      className="bg-none border-none text-text-primary cursor-pointer py-2 px-3 flex items-center justify-center transition-colors duration-150 hover:not-disabled:bg-accent-primary/15 disabled:opacity-35 disabled:cursor-not-allowed"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="text-base font-bold text-text-primary text-right">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    className="bg-none border-none text-text-dim cursor-pointer p-1.5 rounded-lg flex items-center transition-all duration-200 hover:text-red-500 hover:bg-red-500/10"
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
          <div className="flex justify-end mt-1">
            <button className="bg-none border-none text-text-dim cursor-pointer inline-flex items-center gap-1.5 text-[0.85rem] py-2 px-3 rounded-lg transition-all duration-200 hover:text-red-500 hover:bg-red-500/8" onClick={clearCart}>
              <Trash2 size={14} />
              <span>Clear All Items</span>
            </button>
          </div>
        </div>

        {/* ── Right: Order Summary ── */}
        <div className="lg:sticky lg:top-[100px]">
          <div className="rounded-[20px] p-7 flex flex-col gap-5 glass">
            <h2 className="text-lg font-bold text-text-primary pb-4 border-b border-white/6">Order Summary</h2>

            {/* Promo Code */}
            <div className="flex flex-col gap-2">
              <label className="text-[0.82rem] font-semibold text-text-dim uppercase tracking-wider">Promo Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 py-2.5 px-3.5 rounded-lg border border-white/10 bg-white/4 text-text-primary text-[0.9rem] outline-none transition-colors duration-200 focus:border-accent-primary disabled:opacity-60"
                  placeholder="Enter code..."
                  value={promoCode}
                  onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
                  disabled={promoApplied}
                />
                <button
                  className={`py-2.5 px-4 rounded-lg border border-accent-primary/35 bg-accent-primary/10 text-accent-primary font-semibold text-[0.87rem] cursor-pointer flex items-center justify-center transition-colors duration-200 hover:not-disabled:bg-accent-primary/20 disabled:opacity-45 disabled:cursor-not-allowed ${
                    promoApplied ? 'text-green-500 border-green-500/30 bg-green-500/10' : ''
                  }`}
                  onClick={handleApplyPromo}
                  disabled={promoApplied || !promoCode.trim()}
                >
                  {promoApplied ? <CheckCircle size={16} /> : 'Apply'}
                </button>
              </div>
              {promoApplied && (
                <p className="flex items-center gap-1.5 text-green-500 text-[0.82rem] font-medium">
                  <CheckCircle size={13} /> 10% discount applied!
                </p>
              )}
              {promoError && (
                <p className="flex items-center gap-1.5 text-red-500 text-[0.82rem]">
                  <AlertCircle size={13} /> {promoError}
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-[0.9rem] text-text-dim">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between items-center text-[0.9rem] text-text-dim text-green-500">
                  <span>Promo Discount (10%)</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-[0.9rem] text-text-dim">
                <span>Shipping & Handling</span>
                <span className={shipping === 0 ? 'text-green-500 font-semibold' : ''}>
                  {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center text-[0.9rem] text-text-dim">
                <span>GST (18%)</span>
                <span>₹{taxes.toFixed(2)}</span>
              </div>
              <div className="h-[1px] bg-white/7 my-1" />
              <div className="flex justify-between items-center text-[1.15rem] font-bold text-text-primary">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <motion.button
              className="w-full py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 bg-accent-gradient text-white transition-opacity duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleCheckout}
              disabled={placing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {placing ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                  Placing Order...
                </span>
              ) : (
                <>
                  <span>Place Order</span>
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>

            {!isAuthenticated && (
              <p className="flex items-center gap-1.5 text-[0.82rem] text-text-dim text-center justify-center">
                <AlertCircle size={13} />
                <span>
                  <Link to="/auth?mode=signin" className="text-accent-primary font-semibold hover:underline">Sign in</Link> to place your order
                </span>
              </p>
            )}

            {/* Trust Badges */}
            <div className="flex justify-between border-t border-white/6 pt-4 gap-2">
              <div className="flex flex-col items-center gap-1 text-text-dim text-[0.72rem] font-medium text-center">
                <ShieldCheck size={16} className="text-accent-primary opacity-70" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-text-dim text-[0.72rem] font-medium text-center">
                <Truck size={16} className="text-accent-primary opacity-70" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-text-dim text-[0.72rem] font-medium text-center">
                <PackageCheck size={16} className="text-accent-primary opacity-70" />
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
