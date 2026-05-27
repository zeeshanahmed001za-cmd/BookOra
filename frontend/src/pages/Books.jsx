import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, ShoppingCart, Heart, Filter, ChevronDown,
  X, Search,
} from 'lucide-react';
import booksData from '../data/books.json';
import { matchBookCover, fallbackImage } from '../utils/bookImages';
import './Books.css';

const GENRES       = ['All', 'Fiction', 'Non-Fiction', 'Science', 'Self Help', 'Sci-Fi', 'Romance', 'History', 'Biography', 'Children', 'Mystery'];
const SORT_OPTIONS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Top Rated', 'Newest'];

const mapUrlGenre = (genre) => {
  if (!genre) return 'All';
  const g = genre.toLowerCase().trim();
  
  if (g === 'all') return 'All';
  if (g === 'fiction') return 'Fiction';
  if (g === 'non-fiction' || g === 'nonfiction') return 'Non-Fiction';
  if (g === 'science') return 'Science';
  if (g === 'self help' || g === 'selfhelp') return 'Self Help';
  if (g === 'sci-fi' || g === 'scifi') return 'Sci-Fi';
  if (g === 'romance') return 'Romance';
  if (g === 'history') return 'History';
  if (g === 'biography') return 'Biography';
  if (g === 'children') return 'Children';
  if (g === 'mystery') return 'Mystery';

  // Subnav mega-menu mapping
  // Fiction subcategories
  if (['literaryfiction', 'fantasy', 'historicalfiction', 'horror', 'adventure', 'shortstories'].includes(g)) {
    return 'Fiction';
  }
  if (['thriller', 'truecrime'].includes(g)) {
    return 'Mystery';
  }
  // Non-fiction subcategories
  if (['business', 'psychology', 'healthwellness'].includes(g)) {
    return 'Self Help';
  }
  if (['philosophy', 'travel'].includes(g)) {
    return 'Non-Fiction';
  }
  // Academic & learning maps to Non-Fiction
  if (['textbooks', 'reference', 'studyguides', 'competitiveexams', 'technology', 'mathematics', 'engineering', 'medical', 'law', 'artscrafts'].includes(g)) {
    return 'Non-Fiction';
  }
  // Children & YA
  if (['picturebooks', 'earlyreaders', 'middlegrade', 'yafiction', 'yanonfiction', 'graphicnovels', 'activitybooks', 'educational', 'fairytales', 'mythology'].includes(g)) {
    return 'Children';
  }

  return 'All';
};



// ─── Stars ────────────────────────────────────────────────────────────────────
const Stars = ({ rating }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={13}
        fill={s <= Math.round(rating) ? 'currentColor' : 'none'}
        stroke={s <= Math.round(rating) ? 'currentColor' : 'var(--text-dim)'}
      />
    ))}
    <span className="rating-val">{rating}</span>
  </div>
);

// ─── Book Card ────────────────────────────────────────────────────────────────
const BookCard = ({ book, index }) => {
  const [wishlisted, setWishlisted] = useState(false);
  
  // Dynamic reviews count based on book attributes
  const reviewsCount = 100 + ((book.title.length * 73 + book.id * 37) % 4900);

  return (
    <motion.div
      className="book-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.4 }}
      layout
    >
      <div className="book-cover">
        <img
          src={matchBookCover(book.cover, book.title) || fallbackImage}
          alt={book.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />
        {book.isBestseller && <span className="book-badge">Bestseller</span>}
        <button
          className={`wishlist-toggle ${wishlisted ? 'active' : ''}`}
          onClick={() => setWishlisted(!wishlisted)}
          title="Add to Wishlist"
        >
          <Heart size={17} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="book-body">
        <span className="book-genre">{book.category}</span>
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        <Stars rating={book.rating} />
        <span className="book-reviews">({reviewsCount.toLocaleString()} reviews)</span>
      </div>

      <div className="book-footer">
        <span className="book-price">₹{book.price.toFixed(2)}</span>
        <button className="add-cart-btn">
          <ShoppingCart size={15} /> Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

// ─── Books Page ───────────────────────────────────────────────────────────────
const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const urlGenre = searchParams.get('genre');
  const urlBadge = searchParams.get('badge');
  const urlSort = searchParams.get('sort');

  const [activeGenre,  setActiveGenre]  = useState('All');
  const [sortBy,       setSortBy]       = useState('Featured');
  const [showSort,     setShowSort]     = useState(false);
  const [showFilters,  setShowFilters]  = useState(false);
  const [priceRange,   setPriceRange]   = useState(50);

  // Sync URL query parameters with local state variables
  useEffect(() => {
    if (urlGenre) {
      setActiveGenre(mapUrlGenre(urlGenre));
    }
  }, [urlGenre]);

  useEffect(() => {
    if (urlSort) {
      if (urlSort.toLowerCase() === 'newest') setSortBy('Newest');
      if (urlSort.toLowerCase() === 'toprated') setSortBy('Top Rated');
    }
  }, [urlSort]);

  // ── Instant local filtering logic ───────────────────────────────────────────
  const filtered = booksData.filter((book) => {
    // 1. Search Query filter (title & author)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchesTitle = book.title.toLowerCase().includes(q);
      const matchesAuthor = book.author.toLowerCase().includes(q);
      if (!matchesTitle && !matchesAuthor) return false;
    }

    // 2. Category / Genre filter
    if (activeGenre !== 'All') {
      if (activeGenre === 'Fiction') {
        const fictionCategories = ['Fiction', 'Romance', 'Sci-Fi', 'Mystery', 'Children'];
        if (!fictionCategories.includes(book.category)) return false;
      } else if (activeGenre === 'Non-Fiction') {
        const nonFictionCategories = ['Biography', 'History', 'Science', 'Self Help', 'Non-Fiction'];
        if (!nonFictionCategories.includes(book.category)) return false;
      } else {
        if (book.category !== activeGenre) return false;
      }
    }

    // 3. Price limit filter
    if (book.price > priceRange) return false;

    // 4. Badge URL filter (e.g. bestseller)
    if (urlBadge) {
      if (urlBadge.toLowerCase() === 'bestseller') {
        if (!book.isBestseller) return false;
      }
    }

    return true;
  });

  // ── Instant local sorting logic ─────────────────────────────────────────────
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Top Rated')          return b.rating - a.rating;
    if (sortBy === 'Newest')             return b.year - a.year;
    return 0; // Featured / Natural order
  });

  const bookCount = sorted.length;
  const isSearchMode = searchQuery.trim().length > 0;

  // Clear search function
  const handleClearSearch = () => {
    setSearchParams({});
  };

  // Reset all filters function
  const handleResetAll = () => {
    setSearchParams({});
    setActiveGenre('All');
    setPriceRange(50);
    setSortBy('Featured');
  };

  return (
    <div className="books-page">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="books-header">
        <div>
          <h1>
            {isSearchMode ? (
              <>Search Results for <span className="gradient-text">"{searchQuery}"</span></>
            ) : (
              <>Explore <span className="gradient-text">Books</span></>
            )}
          </h1>
          <p className="books-subtitle">
            {`${bookCount} ${bookCount === 1 ? 'book' : 'books'} found`}
            {isSearchMode && (
              <button onClick={handleClearSearch} className="clear-search-link">
                <X size={13} /> Clear Search
              </button>
            )}
          </p>
        </div>

        {/* Controls — instant local controls */}
        <div className="books-controls">
          <button
            className={`filter-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={17} /> Filters {showFilters && <X size={15} />}
          </button>

          <div className="sort-wrap">
            <button className="sort-btn" onClick={() => setShowSort(!showSort)}>
              Sort: {sortBy}
              <ChevronDown size={16} className={showSort ? 'rotated' : ''} />
            </button>
            <AnimatePresence>
              {showSort && (
                <motion.ul
                  className="sort-dropdown"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <li
                      key={opt}
                      className={opt === sortBy ? 'active' : ''}
                      onClick={() => { setSortBy(opt); setShowSort(false); }}
                    >
                      {opt}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Filter Panel ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="filter-panel glass"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="filter-section">
              <h4>Max Price: <span className="gradient-text">₹{priceRange}</span></h4>
              <input
                type="range"
                min={5} max={50}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="price-range"
              />
              <div className="price-labels"><span>₹5</span><span>₹50</span></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Genre Tabs ───────────────────────────────────────────────────── */}
      <div className="genre-tabs">
        {GENRES.map((g) => (
          <button
            key={g}
            className={`genre-tab ${activeGenre === g ? 'active' : ''}`}
            onClick={() => setActiveGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* ── Local Catalog Grid ───────────────────────────────────────────── */}
      {sorted.length > 0 ? (
        <motion.div className="books-grid" layout>
          {sorted.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </motion.div>
      ) : (
        <div className="no-results">
          <Search size={40} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <h3>No Books Found</h3>
          <p>No books match your selected search keyword or filters.</p>
          <button onClick={handleResetAll}>Reset All Filters</button>
        </div>
      )}
    </div>
  );
};

export default Books;
