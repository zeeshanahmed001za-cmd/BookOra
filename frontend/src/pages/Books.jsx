import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Heart, Filter, ChevronDown, X, Search, WifiOff, Loader } from 'lucide-react';
import './Books.css';

const GENRES = ['All', 'Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Children', 'Mystery', 'Romance'];
const SORT_OPTIONS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Top Rated', 'Newest'];

// Local catalog shown when no search is active
const SAMPLE_BOOKS = [
  { id: 1, title: 'The Midnight Library', author: 'Matt Haig', price: 24.99, rating: 4.8, reviews: 1240, genre: 'Fiction', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400', badge: 'Bestseller' },
  { id: 2, title: 'Project Hail Mary', author: 'Andy Weir', price: 29.99, rating: 4.9, reviews: 980, genre: 'Science', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=400', badge: 'Top Rated' },
  { id: 3, title: 'Circe', author: 'Madeline Miller', price: 21.50, rating: 4.7, reviews: 760, genre: 'Fiction', image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400', badge: null },
  { id: 4, title: 'Sapiens', author: 'Yuval Noah Harari', price: 18.99, rating: 4.6, reviews: 2100, genre: 'History', image: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=400', badge: 'Bestseller' },
  { id: 5, title: 'The Great Alone', author: 'Kristin Hannah', price: 22.00, rating: 4.5, reviews: 540, genre: 'Romance', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400', badge: null },
  { id: 6, title: 'Educated', author: 'Tara Westover', price: 19.99, rating: 4.8, reviews: 1870, genre: 'Biography', image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400', badge: 'New' },
  { id: 7, title: 'The Name of the Wind', author: 'Patrick Rothfuss', price: 27.50, rating: 4.9, reviews: 3200, genre: 'Fiction', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400', badge: 'Top Rated' },
  { id: 8, title: 'Deep Work', author: 'Cal Newport', price: 16.99, rating: 4.7, reviews: 890, genre: 'Non-Fiction', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=400', badge: null },
  { id: 9, title: 'The Silent Patient', author: 'Alex Michaelides', price: 20.00, rating: 4.6, reviews: 1650, genre: 'Mystery', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=400', badge: 'New' },
];

// Map a Google Books API item to the BookCard format
const mapApiBook = (item, index) => {
  const v = item.volumeInfo || {};
  const s = item.saleInfo || {};

  const title = v.title || 'Untitled';
  const author = v.authors ? v.authors.join(', ') : 'Unknown Author';
  const genre = v.categories ? v.categories[0] : 'General';

  // Cover image — upgrade to HTTPS
  let image = 'https://images.unsplash.com/photo-1543004218-2bc3500d970c?auto=format&fit=crop&q=80&w=400';
  if (v.imageLinks) {
    const raw = v.imageLinks.thumbnail || v.imageLinks.smallThumbnail || '';
    image = raw.startsWith('http://') ? raw.replace('http://', 'https://') : raw || image;
  }

  // Price in USD
  let price = 9.99 + ((title.length + author.length) % 20);
  if (s.retailPrice?.amount) {
    price = s.retailPrice.currencyCode === 'USD'
      ? s.retailPrice.amount
      : +(s.retailPrice.amount / 83).toFixed(2);
  } else if (s.listPrice?.amount) {
    price = s.listPrice.currencyCode === 'USD'
      ? s.listPrice.amount
      : +(s.listPrice.amount / 83).toFixed(2);
  }

  // Simulated rating & reviews from page count / index
  const rating = parseFloat((3.8 + ((v.pageCount || 200) % 12) / 10).toFixed(1));
  const reviews = 100 + ((title.length * 73 + index * 37) % 4900);

  return {
    id: item.id || `api-book-${index}`,
    title,
    author,
    price: parseFloat(price.toFixed(2)),
    rating: Math.min(rating, 5.0),
    reviews,
    genre: genre || 'General',
    image,
    badge: index < 3 ? (index === 0 ? 'Top Result' : index === 1 ? 'Popular' : 'New') : null,
  };
};

// Fetch from Google Books via Vite proxy, fall back to direct URL
const searchGoogleBooks = async (query, maxResults = 30) => {
  const encoded = encodeURIComponent(query);
  const proxyUrl = `/api-google/books/v1/volumes?q=${encoded}&maxResults=${maxResults}`;
  const directUrl = `https://www.googleapis.com/books/v1/volumes?q=${encoded}&maxResults=${maxResults}`;

  // Try proxy first
  try {
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.items)) {
        console.log(`[Search] Proxy OK — ${data.items.length} results for "${query}"`);
        return data.items;
      }
    }
    console.warn('[Search] Proxy returned empty/non-OK, trying direct...');
  } catch (e) {
    console.warn('[Search] Proxy failed, trying direct...', e.message);
  }

  // Fall back to direct
  const res = await fetch(directUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const data = await res.json();
  if (!data || !Array.isArray(data.items)) throw new Error('No results from Google Books API');
  console.log(`[Search] Direct OK — ${data.items.length} results for "${query}"`);
  return data.items;
};

// ─── Stars Component ──────────────────────────────────────────────────────────
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

  return (
    <motion.div
      className="book-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      layout
    >
      <div className="book-cover">
        <img
          src={book.image}
          alt={book.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1543004218-2bc3500d970c?auto=format&fit=crop&q=80&w=400';
          }}
        />
        {book.badge && <span className="book-badge">{book.badge}</span>}
        <button
          className={`wishlist-toggle ${wishlisted ? 'active' : ''}`}
          onClick={() => setWishlisted(!wishlisted)}
          title="Add to Wishlist"
        >
          <Heart size={17} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="book-body">
        <span className="book-genre">{book.genre}</span>
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        <Stars rating={book.rating} />
        <span className="book-reviews">({book.reviews.toLocaleString()} reviews)</span>
      </div>

      <div className="book-footer">
        <span className="book-price">${book.price.toFixed(2)}</span>
        <button className="add-cart-btn">
          <ShoppingCart size={15} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

// ─── Loading Skeleton Grid ────────────────────────────────────────────────────
const SkeletonGrid = () => (
  <div className="books-grid">
    {Array.from({ length: 9 }).map((_, i) => (
      <div key={i} className="book-card skeleton-card">
        <div className="skeleton-cover shimmer-bg" />
        <div className="book-body">
          <div className="skeleton-line short shimmer-bg" />
          <div className="skeleton-line wide shimmer-bg" />
          <div className="skeleton-line mid shimmer-bg" />
          <div className="skeleton-line short shimmer-bg" />
        </div>
        <div className="book-footer">
          <div className="skeleton-line short shimmer-bg" />
          <div className="skeleton-line mid shimmer-bg" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Books Page Component ─────────────────────────────────────────────────────
const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [activeGenre, setActiveGenre] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  const [showSort, setShowSort] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(50);

  // Live search state
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Trigger API search whenever the query param changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    let cancelled = false;
    const runSearch = async () => {
      setIsSearchLoading(true);
      setSearchError(null);
      setSearchResults([]);
      try {
        const items = await searchGoogleBooks(searchQuery, 30);
        if (!cancelled) {
          setSearchResults(items.map(mapApiBook));
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[Books Search] Failed:', err);
          setSearchError(err.message || 'Search failed. Please check your connection and try again.');
        }
      } finally {
        if (!cancelled) setIsSearchLoading(false);
      }
    };

    runSearch();
    return () => { cancelled = true; };
  }, [searchQuery]);

  // Local catalog filtering (only active when no search query)
  const filtered = SAMPLE_BOOKS
    .filter((b) => activeGenre === 'All' || b.genre === activeGenre)
    .filter((b) => b.price <= priceRange);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Top Rated') return b.rating - a.rating;
    return 0;
  });

  // Decide what to display
  const isSearchMode = searchQuery.trim().length > 0;
  const displayBooks = isSearchMode ? searchResults : sorted;
  const bookCount = displayBooks.length;

  return (
    <div className="books-page">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
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
            {isSearchLoading
              ? 'Searching Google Books...'
              : `${bookCount} ${bookCount === 1 ? 'book' : 'books'} found`}
            {isSearchMode && !isSearchLoading && (
              <button
                onClick={() => setSearchParams({})}
                className="clear-search-link"
              >
                <X size={13} /> Clear Search
              </button>
            )}
          </p>
        </div>

        {/* Controls (only visible when not in search mode) */}
        {!isSearchMode && (
          <div className="books-controls">
            <button
              className={`filter-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={17} />
              Filters
              {showFilters && <X size={15} />}
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
        )}
      </div>

      {/* ── Filter Panel (local mode only) ──────────────────────────────── */}
      {!isSearchMode && (
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="filter-panel glass"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="filter-section">
                <h4>Max Price: <span className="gradient-text">${priceRange}</span></h4>
                <input
                  type="range"
                  min={5}
                  max={50}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="price-range"
                />
                <div className="price-labels"><span>$5</span><span>$50</span></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ── Genre Tabs (local mode only) ────────────────────────────────── */}
      {!isSearchMode && (
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
      )}

      {/* ── Loading State (search mode) ──────────────────────────────────── */}
      {isSearchMode && isSearchLoading && (
        <div className="search-loading-state">
          <div className="search-loading-spinner">
            <Loader size={32} className="spin-icon" />
          </div>
          <p>Searching Google Books for <strong>"{searchQuery}"</strong>...</p>
          <SkeletonGrid />
        </div>
      )}

      {/* ── Search Error State ───────────────────────────────────────────── */}
      {isSearchMode && !isSearchLoading && searchError && (
        <div className="search-error-state">
          <WifiOff size={40} />
          <h3>Search Failed</h3>
          <p>{searchError}</p>
          <button
            className="retry-search-btn"
            onClick={() => {
              const q = searchQuery;
              setSearchParams({});
              setTimeout(() => setSearchParams({ search: q }), 50);
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* ── Search Results (live from API) ───────────────────────────────── */}
      {isSearchMode && !isSearchLoading && !searchError && (
        <>
          {bookCount > 0 ? (
            <motion.div className="books-grid" layout>
              {displayBooks.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </motion.div>
          ) : (
            <div className="no-results">
              <Search size={40} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <p>No books found for "<strong>{searchQuery}</strong>".</p>
              <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Try a different keyword or check your spelling.</p>
              <button onClick={() => setSearchParams({})}>Browse All Books</button>
            </div>
          )}
        </>
      )}

      {/* ── Local Catalog (no search active) ────────────────────────────── */}
      {!isSearchMode && (
        <>
          {sorted.length > 0 ? (
            <motion.div className="books-grid" layout>
              {sorted.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </motion.div>
          ) : (
            <div className="no-results">
              <p>No books match your filters.</p>
              <button onClick={() => { setActiveGenre('All'); setPriceRange(50); }}>Clear Filters</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Books;
