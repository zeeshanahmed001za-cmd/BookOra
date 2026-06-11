import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, CheckCircle } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import OptimizedBookCover from './OptimizedBookCover';

// ─── Stars sub-component ──────────────────────────────────────────────────────
const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5 text-[#f9a825] mt-1" aria-label={`Rating: ${rating} out of 5`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={12}
        fill={n <= Math.round(rating) ? 'currentColor' : 'none'}
        stroke={n <= Math.round(rating) ? 'currentColor' : '#606060'}
      />
    ))}
    <span className="text-[0.8rem] font-semibold text-[#a0a0a0] ml-1">{rating.toFixed(1)}</span>
  </div>
);

// ─── BookCard ─────────────────────────────────────────────────────────────────
const BookCard = ({ book, index = 0 }) => {
  const { toggleWishlist, isWishlisted, setSelectedBook } = useWishlist();
  const { addToCart, isInCart } = useCart();

  const wishlisted = isWishlisted(book.id);
  const inCart = isInCart(book.id);

  const reviews = 100 + ((book.title.length * 73 + book.id.length * 37) % 4900);

  return (
    <motion.article
      className="bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(162,148,251,0.4)]"
      style={{ '--hover-shadow': '0 16px 40px rgba(0,0,0,0.5),0 0 20px rgba(162,148,251,0.1)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.5),0 0 20px rgba(162,148,251,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.35 }}
      layout
    >
      {/* Cover */}
      <div
        className="relative w-full overflow-hidden bg-[#1a1a1a] flex-shrink-0 cursor-pointer"
        style={{ aspectRatio: '3/4' }}
        onClick={() => setSelectedBook(book)}
      >
        <OptimizedBookCover
          coverId={book.coverId}
          src={book.cover}
          alt={book.title}
          priority={index < 4}
        />

        {book.isBestseller && (
          <span
            className="absolute top-2.5 left-2.5 px-2.5 py-[3px] rounded-full text-[0.68rem] font-bold uppercase tracking-[0.05em] text-white pointer-events-none"
            style={{ background: 'linear-gradient(135deg,#a294fb,#8b5cf6)' }}
          >
            Bestseller
          </span>
        )}

        <button
          className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-[5] transition-all duration-200 hover:scale-110 ${
            wishlisted
              ? 'text-[#ff4d6d] border-[rgba(255,77,109,0.3)] hover:bg-[rgba(255,77,109,0.25)]'
              : 'text-[#a0a0a0] hover:text-white hover:bg-[rgba(15,15,15,0.85)]'
          }`}
          style={{
            background: wishlisted ? 'rgba(255,77,109,0.15)' : 'rgba(5,5,5,0.65)',
            backdropFilter: 'blur(6px)',
            border: wishlisted ? '1px solid rgba(255,77,109,0.3)' : '1px solid rgba(255,255,255,0.1)',
          }}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(book); }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Body */}
      <div
        className="px-3.5 pt-3.5 pb-2 flex-1 flex flex-col gap-[3px] cursor-pointer"
        onClick={() => setSelectedBook(book)}
      >
        <span className="text-[0.7rem] uppercase tracking-[0.08em] font-bold text-[#a294fb]">
          {book.category}
        </span>
        <h3 className="text-[1rem] font-bold text-white leading-snug mt-0.5 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-[0.82rem] text-[#606060]">by {book.author}</p>
        <Stars rating={book.rating} />
        <span className="text-[0.75rem] text-[#606060]">({reviews.toLocaleString()} reviews)</span>
      </div>

      {/* Footer */}
      <div className="px-3.5 pb-3.5 pt-2.5 border-t border-white/10 flex justify-between items-center gap-2.5">
        <span className="text-[1.15rem] font-extrabold text-white tracking-tight">
          ₹{book.price.toFixed(2)}
        </span>
        <button
          className={`flex items-center gap-[5px] px-3.5 py-[7px] rounded-full text-white text-[0.8rem] font-semibold whitespace-nowrap transition-all duration-200 hover:opacity-85 hover:scale-[1.04] ${
            inCart ? 'opacity-80' : ''
          }`}
          style={{ background: 'linear-gradient(135deg,#a294fb,#8b5cf6)' }}
          onClick={(e) => { e.stopPropagation(); addToCart(book); }}
          aria-label={inCart ? 'Added to cart' : 'Add to cart'}
        >
          {inCart ? <CheckCircle size={14} /> : <ShoppingCart size={14} />}
          {inCart ? 'Added' : 'Add to Cart'}
        </button>
      </div>
    </motion.article>
  );
};

export default BookCard;
