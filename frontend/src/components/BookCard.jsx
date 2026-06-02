import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import OptimizedBookCover from './OptimizedBookCover';
import './BookCard.css';

// ─── Stars sub-component ──────────────────────────────────────────────────────
const Stars = ({ rating }) => (
  <div className="bc-stars" aria-label={`Rating: ${rating} out of 5`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={12}
        fill={n <= Math.round(rating) ? 'currentColor' : 'none'}
        stroke={n <= Math.round(rating) ? 'currentColor' : 'var(--text-dim)'}
      />
    ))}
    <span className="bc-rating-val">{rating.toFixed(1)}</span>
  </div>
);

// ─── BookCard ─────────────────────────────────────────────────────────────────
const BookCard = ({ book, index = 0 }) => {
  const { toggleWishlist, isWishlisted, setSelectedBook } = useWishlist();

  const wishlisted = isWishlisted(book.id);

  // Stable pseudo-review count derived from title length
  const reviews = 100 + ((book.title.length * 73 + book.id.length * 37) % 4900);

  return (
    <motion.article
      className="book-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.35 }}
      layout
    >
      {/* ── Cover ── */}
      <div className="bc-cover-wrap" onClick={() => setSelectedBook(book)}>
        <OptimizedBookCover
          coverId={book.coverId}
          src={book.cover}
          alt={book.title}
          priority={index < 4}
        />

        {book.isBestseller && (
          <span className="bc-badge">Bestseller</span>
        )}

        <button
          className={`bc-wishlist ${wishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(book);
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="bc-body" onClick={() => setSelectedBook(book)}>
        <span className="bc-category">{book.category}</span>
        <h3 className="bc-title">{book.title}</h3>
        <p className="bc-author">by {book.author}</p>
        <Stars rating={book.rating} />
        <span className="bc-reviews">({reviews.toLocaleString()} reviews)</span>
      </div>

      {/* ── Footer ── */}
      <div className="bc-footer">
        <span className="bc-price">₹{book.price.toFixed(2)}</span>
        <button className="bc-cart-btn">
          <ShoppingCart size={14} />
          Add to Cart
        </button>
      </div>
    </motion.article>
  );
};

export default BookCard;
