import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, BookOpen, ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import BookCoverImage from '../components/BookCoverImage';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, setSelectedBook } = useWishlist();

  return (
    <motion.div
      className="wishlist-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="wishlist-container">
        {/* Header */}
        <div className="wishlist-header">
          <h1>
            <span>My </span>
            <span className="gradient-text">Wishlist</span>
          </h1>
          <p className="wishlist-subtitle">
            {wishlist.length === 0
              ? 'Save your favorite books for later'
              : `You have ${wishlist.length} ${wishlist.length === 1 ? 'item' : 'items'} in your wishlist`}
          </p>
        </div>

        {/* Content */}
        <AnimatePresence mode="popLayout">
          {wishlist.length === 0 ? (
            <motion.div
              key="empty"
              className="wishlist-empty-state glass"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="empty-icon-wrap">
                <Heart size={48} className="empty-heart-icon" />
              </div>
              <h2>Your wishlist is empty</h2>
              <p>Add books by clicking the heart icon on any book cover.</p>
              <Link to="/books" className="explore-btn">
                <span>Explore Books</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="wishlist-grid"
              layout
            >
              <AnimatePresence>
                {wishlist.map((book) => {
                  const reviews = 100 + ((book.title.length * 73 + book.id.length * 37) % 4900);

                  return (
                    <motion.article
                      key={book.id}
                      className="wishlist-card glass"
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Cover image wrap */}
                      <div className="wc-cover-wrap" onClick={() => setSelectedBook(book)}>
                        <BookCoverImage src={book.cover} alt={book.title} />
                        {book.isBestseller && (
                          <span className="wc-badge">Bestseller</span>
                        )}
                        <button
                          className="wc-remove-overlay"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromWishlist(book.id);
                          }}
                          title="Remove from wishlist"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Card body info */}
                      <div className="wc-body">
                        <span className="wc-category">{book.category}</span>
                        <h3 className="wc-title" onClick={() => setSelectedBook(book)}>
                          {book.title}
                        </h3>
                        <p className="wc-author">by {book.author}</p>

                        <div className="wc-rating-row">
                          <div className="wc-stars">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <Star
                                key={n}
                                size={12}
                                fill={n <= Math.round(book.rating) ? 'currentColor' : 'none'}
                                stroke={n <= Math.round(book.rating) ? 'currentColor' : 'var(--text-dim)'}
                              />
                            ))}
                          </div>
                          <span className="wc-reviews">({reviews.toLocaleString()})</span>
                        </div>

                        <span className="wc-price">₹{book.price.toFixed(2)}</span>
                      </div>

                      {/* Card footer buttons */}
                      <div className="wc-actions">
                        <button
                          className="wc-action-btn details"
                          onClick={() => setSelectedBook(book)}
                        >
                          <BookOpen size={14} />
                          Details
                        </button>
                        <button className="wc-action-btn cart btn-primary">
                          <ShoppingCart size={14} />
                          Cart
                        </button>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Wishlist;
