import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, Heart, Calendar, BookOpen, Loader2 } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { fetchBookDetails } from '../services/openLibrary';
import BookCoverImage from './BookCoverImage';
import './BookDetailsModal.css';

const BookDetailsModal = () => {
  const { selectedBook, setSelectedBook, toggleWishlist, isWishlisted } = useWishlist();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedBook) {
      setDetails(null);
      setError(null);
      return;
    }

    let isMounted = true;
    const loadDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBookDetails(selectedBook.id);
        if (isMounted) {
          setDetails(data);
        }
      } catch (err) {
        console.error('Error fetching book details:', err);
        if (isMounted) {
          setError('Could not retrieve extended details for this book.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDetails();

    return () => {
      isMounted = false;
    };
  }, [selectedBook]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedBook(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedBook]);

  if (!selectedBook) return null;

  const wishlisted = isWishlisted(selectedBook.id);
  const reviews = 100 + ((selectedBook.title.length * 73 + selectedBook.id.length * 37) % 4900);

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={() => setSelectedBook(null)}>
        <motion.div
          className="modal-container glass"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', duration: 0.45 }}
        >
          {/* Close Button */}
          <button className="modal-close-btn" onClick={() => setSelectedBook(null)} aria-label="Close modal">
            <X size={20} />
          </button>

          <div className="modal-content">
            {/* Left: Book Cover and Primary actions */}
            <div className="modal-sidebar">
              <div className="modal-cover-wrap">
                <BookCoverImage src={selectedBook.cover} alt={selectedBook.title} />
                {selectedBook.isBestseller && (
                  <span className="modal-badge">Bestseller</span>
                )}
              </div>

              <div className="modal-actions">
                <button className="modal-cart-btn btn-primary">
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>
                <button
                  className={`modal-wishlist-btn ${wishlisted ? 'active' : ''}`}
                  onClick={() => toggleWishlist(selectedBook)}
                >
                  <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
                  <span>{wishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                </button>
              </div>
            </div>

            {/* Right: Book Meta, rating, prices, description */}
            <div className="modal-main">
              <div className="modal-header-section">
                <span className="modal-category">{selectedBook.category}</span>
                <h2 className="modal-title">{selectedBook.title}</h2>
                <p className="modal-author">by {selectedBook.author}</p>
              </div>

              {/* Rating and Price */}
              <div className="modal-row-meta">
                <div className="modal-stars-wrap">
                  <div className="modal-stars">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={14}
                        fill={n <= Math.round(selectedBook.rating) ? 'currentColor' : 'none'}
                        stroke={n <= Math.round(selectedBook.rating) ? 'currentColor' : 'var(--text-dim)'}
                      />
                    ))}
                  </div>
                  <span className="modal-rating-val">{selectedBook.rating.toFixed(1)}</span>
                  <span className="modal-reviews">({reviews.toLocaleString()} reviews)</span>
                </div>

                <div className="modal-pricing">
                  <span className="modal-price">₹{selectedBook.price.toFixed(2)}</span>
                  {selectedBook.discount > 0 && (
                    <>
                      <span className="modal-orig-price">₹{selectedBook.originalPrice.toFixed(2)}</span>
                      <span className="modal-discount">{selectedBook.discount}% OFF</span>
                    </>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div className="modal-availability">
                <span className={`status-dot ${selectedBook.stock > 0 ? 'instock' : 'outstock'}`} />
                <span>{selectedBook.availability}</span>
              </div>

              {/* Description section */}
              <div className="modal-description-section">
                <h3>Synopsis</h3>
                {loading ? (
                  <div className="modal-loader">
                    <Loader2 className="spin-icon" size={20} />
                    <span>Fetching synopsis from Open Library...</span>
                  </div>
                ) : error ? (
                  <p className="modal-desc-text error-msg">{error}</p>
                ) : details?.description ? (
                  <p className="modal-desc-text">{details.description}</p>
                ) : (
                  <p className="modal-desc-text empty-msg">No synopsis available for this work.</p>
                )}
              </div>

              {/* Footer details like publish date & tags */}
              <div className="modal-meta-grid">
                {selectedBook.year && (
                  <div className="meta-item">
                    <Calendar size={14} />
                    <div>
                      <span className="meta-label">First Published</span>
                      <span className="meta-value">{selectedBook.year}</span>
                    </div>
                  </div>
                )}
                {details?.firstPublishDate && details.firstPublishDate !== selectedBook.year && (
                  <div className="meta-item">
                    <Calendar size={14} />
                    <div>
                      <span className="meta-label">Edition Date</span>
                      <span className="meta-value">{details.firstPublishDate}</span>
                    </div>
                  </div>
                )}
                {selectedBook.editionCount && (
                  <div className="meta-item">
                    <BookOpen size={14} />
                    <div>
                      <span className="meta-label">Editions Available</span>
                      <span className="meta-value">{selectedBook.editionCount} editions</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags / Subjects */}
              {selectedBook.subjects && selectedBook.subjects.length > 0 && (
                <div className="modal-tags-section">
                  <span className="tags-title">Tags:</span>
                  <div className="modal-tags">
                    {selectedBook.subjects.map((tag, i) => (
                      <span key={i} className="modal-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookDetailsModal;
