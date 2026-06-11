import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, Heart, Calendar, BookOpen, Loader2 } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { fetchBookDetails } from '../services/openLibrary';
import OptimizedBookCover from './OptimizedBookCover';

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
      <div className="fixed inset-0 w-screen h-screen bg-black/75 backdrop-blur-md flex items-center justify-center z-[2000] p-3 md:p-6" onClick={() => setSelectedBook(null)}>
        <motion.div
          className="w-full max-w-[900px] max-h-[calc(100vh-24px)] md:max-h-[calc(100vh-48px)] glass rounded-[20px] relative overflow-y-auto shadow-[0_12px_28px_rgba(0,0,0,0.5),_0_0_24px_rgba(162,148,251,0.15)] scrollbar-thin"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', duration: 0.45 }}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 md:top-5 md:right-5 w-9 h-9 rounded-full bg-white/5 border border-white/8 text-text-secondary flex items-center justify-center z-10 transition-all duration-200 hover:bg-white/10 hover:text-text-primary hover:rotate-90"
            onClick={() => setSelectedBook(null)}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 md:gap-10 p-6 md:p-10">
            {/* Left: Book Cover and Primary actions */}
            <div className="flex flex-col gap-6 items-center md:items-stretch w-full max-w-[320px] md:max-w-none mx-auto md:mx-0">
              <div className="relative w-[220px] md:w-full aspect-[3/4] rounded-xl overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.5)] border border-white/10">
                <OptimizedBookCover
                  coverId={selectedBook.coverId}
                  src={selectedBook.cover}
                  size="L"
                  alt={selectedBook.title}
                  priority={true}
                />
                {selectedBook.isBestseller && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[0.68rem] font-bold uppercase tracking-wider bg-accent-gradient text-white z-[2] shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                    Bestseller
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3 w-full">
                <button className="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-[30px] text-[0.9rem] font-semibold transition-all duration-250 ease-in-out bg-accent-gradient text-white hover:brightness-110 shadow-[0_4px_16px_rgba(139,92,246,0.3)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)]">
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>
                <button
                  className={`w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-[30px] text-[0.9rem] font-semibold transition-all duration-250 ease-in-out bg-white/4 border border-white/8 text-text-secondary hover:bg-white/8 hover:text-text-primary hover:border-white/15 ${
                    wishlisted ? 'bg-pink-500/15 border-pink-500/30 text-pink-500 hover:bg-pink-500/22' : ''
                  }`}
                  onClick={() => toggleWishlist(selectedBook)}
                >
                  <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
                  <span>{wishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                </button>
              </div>
            </div>

            {/* Right: Book Meta, rating, prices, description */}
            <div className="flex flex-col gap-5 text-text-primary">
              <div className="flex flex-col">
                <span className="text-[0.8rem] uppercase tracking-widest font-extrabold text-accent-primary">{selectedBook.category}</span>
                <h2 className="text-2xl md:text-[2.2rem] font-extrabold leading-tight mt-1">{selectedBook.title}</h2>
                <p className="text-[1.1rem] text-text-secondary mt-0.5">by {selectedBook.author}</p>
              </div>

              {/* Rating and Price */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 border-t border-b border-white/6">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5 text-yellow-500">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={14}
                        fill={n <= Math.round(selectedBook.rating) ? 'currentColor' : 'none'}
                        stroke={n <= Math.round(selectedBook.rating) ? 'currentColor' : 'var(--text-dim)'}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-[0.9rem]">{selectedBook.rating.toFixed(1)}</span>
                  <span className="text-[0.85rem] text-text-dim">({reviews.toLocaleString()} reviews)</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[1.6rem] font-extrabold text-white tracking-tight">₹{selectedBook.price.toFixed(2)}</span>
                  {selectedBook.discount > 0 && (
                    <>
                      <span className="text-[1.15rem] line-through text-text-dim">₹{selectedBook.originalPrice.toFixed(2)}</span>
                      <span className="bg-pink-500/12 border border-pink-500/20 text-pink-500 text-[0.75rem] font-bold px-2 py-0.5 rounded">
                        {selectedBook.discount}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2 text-[0.9rem] text-text-secondary">
                <span className={`w-2 h-2 rounded-full ${
                  selectedBook.stock > 0
                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                    : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                }`} />
                <span>{selectedBook.availability}</span>
              </div>

              {/* Description section */}
              <div className="flex flex-col gap-2.5">
                <h3 className="text-[1rem] uppercase tracking-wider text-text-secondary font-semibold">Synopsis</h3>
                {loading ? (
                  <div className="flex items-center gap-2.5 text-text-dim text-[0.9rem] py-3">
                    <Loader2 className="animate-spin text-accent-primary" size={20} />
                    <span>Fetching synopsis from Open Library...</span>
                  </div>
                ) : error ? (
                  <p className="text-[0.95rem] leading-relaxed text-red-400">{error}</p>
                ) : details?.description ? (
                  <p className="text-[0.95rem] leading-relaxed text-text-secondary max-h-[180px] overflow-y-auto pr-2 scrollbar-thin">{details.description}</p>
                ) : (
                  <p className="text-[0.95rem] leading-relaxed text-text-dim italic">No synopsis available for this work.</p>
                )}
              </div>

              {/* Footer details like publish date & tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/2 border border-white/4 p-4 rounded-xl">
                {selectedBook.year && (
                  <div className="flex items-start gap-2.5 text-text-dim">
                    <Calendar className="mt-0.75 text-accent-primary" size={14} />
                    <div className="flex flex-col">
                      <span className="text-[0.72rem] uppercase tracking-wider">First Published</span>
                      <span className="text-[0.88rem] font-medium text-text-secondary">{selectedBook.year}</span>
                    </div>
                  </div>
                )}
                {details?.firstPublishDate && details.firstPublishDate !== selectedBook.year && (
                  <div className="flex items-start gap-2.5 text-text-dim">
                    <Calendar className="mt-0.75 text-accent-primary" size={14} />
                    <div className="flex flex-col">
                      <span className="text-[0.72rem] uppercase tracking-wider">Edition Date</span>
                      <span className="text-[0.88rem] font-medium text-text-secondary">{details.firstPublishDate}</span>
                    </div>
                  </div>
                )}
                {selectedBook.editionCount && (
                  <div className="flex items-start gap-2.5 text-text-dim">
                    <BookOpen className="mt-0.75 text-accent-primary" size={14} />
                    <div className="flex flex-col">
                      <span className="text-[0.72rem] uppercase tracking-wider">Editions Available</span>
                      <span className="text-[0.88rem] font-medium text-text-secondary">{selectedBook.editionCount} editions</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags / Subjects */}
              {selectedBook.subjects && selectedBook.subjects.length > 0 && (
                <div className="flex items-start gap-3 flex-wrap">
                  <span className="text-[0.85rem] text-text-dim font-semibold mt-1">Tags:</span>
                  <div className="flex flex-wrap gap-2 flex-1">
                    {selectedBook.subjects.map((tag, i) => (
                      <span key={i} className="text-[0.75rem] bg-white/5 border border-white/6 px-2.5 py-1 rounded-full text-text-secondary">{tag}</span>
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
