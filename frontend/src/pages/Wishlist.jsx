import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, BookOpen, ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import OptimizedBookCover from '../components/OptimizedBookCover';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, setSelectedBook } = useWishlist();

  return (
    <motion.div
      className="w-full min-h-[calc(100vh-173px)] py-10 pb-20 bg-bg-base"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-[1490px] mx-auto px-5 md:px-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-[2.5rem] font-extrabold tracking-tight text-white">
            <span>My </span>
            <span className="gradient-text">Wishlist</span>
          </h1>
          <p className="text-sm md:text-base text-text-secondary mt-2">
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
              className="flex flex-col items-center justify-center py-12 md:py-20 px-5 md:px-10 rounded-2xl text-center max-w-[600px] mx-auto mt-10 glass"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-24 h-24 rounded-full bg-pink-500/8 border border-pink-500/15 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,77,109,0.05)]">
                <Heart size={48} className="text-pink-500 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Your wishlist is empty</h2>
              <p className="text-sm md:text-base text-text-secondary max-w-[380px] leading-relaxed mb-7">Add books by clicking the heart icon on any book cover.</p>
              <Link to="/books" className="flex items-center gap-2.5 py-3 px-7 bg-accent-gradient text-white font-semibold text-[0.9rem] rounded-[30px] shadow-[0_4px_18px_rgba(139,92,246,0.35)] transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(139,92,246,0.5)]">
                <span>Explore Books</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 md:gap-8"
              layout
            >
              <AnimatePresence>
                {wishlist.map((book) => {
                  const reviews = 100 + ((book.title.length * 73 + book.id.length * 37) % 4900);

                  return (
                    <motion.article
                      key={book.id}
                      className="group flex flex-col wishlist-card glass rounded-2xl overflow-hidden border border-border-subtle transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:-translate-y-1.5 hover:border-accent-primary/40 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5),_0_0_20px_rgba(162,148,251,0.1)]"
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Cover image wrap */}
                      <div className="relative w-full aspect-[3/4] overflow-hidden bg-bg-elevated cursor-pointer" onClick={() => setSelectedBook(book)}>
                        <div className="w-full h-full group-hover:scale-[1.06] transition-transform duration-500 ease-out">
                          <OptimizedBookCover
                            coverId={book.coverId}
                            src={book.cover}
                            alt={book.title}
                          />
                        </div>
                        {book.isBestseller && (
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.75 rounded-full text-[0.65rem] font-bold uppercase tracking-wider bg-accent-gradient text-white pointer-events-none z-[2]">
                            Bestseller
                          </span>
                        )}
                        <button
                          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/75 backdrop-blur-md border border-white/10 flex items-center justify-center text-text-secondary cursor-pointer z-[5] transition-all duration-200 opacity-100 md:opacity-0 md:scale-75 group-hover:opacity-100 group-hover:scale-100 hover:bg-pink-500 hover:text-white hover:border-pink-500 hover:scale-110 hover:shadow-[0_0_12px_rgba(255,77,109,0.4)]"
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
                      <div className="p-4 flex-1 flex flex-col gap-1">
                        <span className="text-[0.7rem] uppercase tracking-wider font-bold text-accent-primary">{book.category}</span>
                        <h3 className="text-base font-bold text-text-primary leading-snug cursor-pointer line-clamp-2 transition-colors duration-200 hover:text-accent-primary" onClick={() => setSelectedBook(book)}>
                          {book.title}
                        </h3>
                        <p className="text-[0.82rem] text-text-dim">by {book.author}</p>

                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex text-yellow-500 gap-0.25">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <Star
                                key={n}
                                size={12}
                                fill={n <= Math.round(book.rating) ? 'currentColor' : 'none'}
                                stroke={n <= Math.round(book.rating) ? 'currentColor' : 'var(--text-dim)'}
                              />
                            ))}
                          </div>
                          <span className="text-[0.72rem] text-text-dim">({reviews.toLocaleString()})</span>
                        </div>

                        <span className="text-[1.15rem] font-extrabold text-text-primary tracking-tight mt-auto pt-2.5">₹{book.price.toFixed(2)}</span>
                      </div>

                      {/* Card footer buttons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 md:p-4 border-t border-border-subtle">
                        <button
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-[0.78rem] font-semibold cursor-pointer transition-all duration-200 bg-white/3 border border-border-subtle text-text-secondary hover:bg-white/8 hover:text-text-primary hover:border-white/15 whitespace-nowrap"
                          onClick={() => setSelectedBook(book)}
                        >
                          <BookOpen size={14} />
                          Details
                        </button>
                        <button className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-[0.78rem] font-semibold cursor-pointer transition-all duration-200 bg-accent-gradient text-white hover:brightness-110 shadow-[0_4px_10px_rgba(139,92,246,0.25)] whitespace-nowrap">
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
