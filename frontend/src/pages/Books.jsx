import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, X, Search, AlertCircle, Loader2 } from 'lucide-react';
import useBooks from '../hooks/useBooks';
import BookCard from '../components/BookCard';
import { SkeletonGrid } from '../components/BookSkeleton';
import './Books.css';

// ─── Constants ────────────────────────────────────────────────────────────────
const GENRES = ['All', 'Fiction', 'Non-Fiction', 'Science', 'Self Help', 'Sci-Fi', 'Romance', 'History', 'Biography', 'Children', 'Mystery'];
const SORT_OPTIONS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Top Rated', 'Newest'];
const SEARCH_DEBOUNCE_MS = 400;

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
  if (['literaryfiction','fantasy','historicalfiction','horror','adventure','shortstories'].includes(g)) return 'Fiction';
  if (['thriller','truecrime'].includes(g)) return 'Mystery';
  if (['business','psychology','healthwellness'].includes(g)) return 'Self Help';
  if (['philosophy','travel'].includes(g)) return 'Non-Fiction';
  if (['textbooks','reference','studyguides','competitiveexams','technology','mathematics','engineering','medical','law','artscrafts'].includes(g)) return 'Non-Fiction';
  if (['picturebooks','earlyreaders','middlegrade','yafiction','yanonfiction','graphicnovels','activitybooks','educational','fairytales','mythology'].includes(g)) return 'Children';
  return 'All';
};

// ─── Books Page ───────────────────────────────────────────────────────────────
const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const urlGenre = searchParams.get('genre');
  const urlBadge = searchParams.get('badge') || '';
  const urlSort  = searchParams.get('sort');

  const [showSort,    setShowSort]    = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange,  setPriceRange]  = useState(1000);

  // Single Source of Truth from URL params
  const activeGenre = useMemo(() => mapUrlGenre(urlGenre), [urlGenre]);
  
  const sortBy = useMemo(() => {
    const s = urlSort?.toLowerCase();
    if (s === 'newest') return 'Newest';
    if (s === 'toprated') return 'Top Rated';
    if (s === 'price_asc' || s === 'price: low to high') return 'Price: Low to High';
    if (s === 'price_desc' || s === 'price: high to low') return 'Price: High to Low';
    return 'Featured';
  }, [urlSort]);

  // ── Debounced API query ───────────────────────────────────────────────────
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const debounceTimer = useRef(null);
  
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(
      () => setDebouncedSearch(searchQuery),
      searchQuery ? SEARCH_DEBOUNCE_MS : 0,
    );
    return () => clearTimeout(debounceTimer.current);
  }, [searchQuery]);

  // ── Resolve API query ─────────────────────────────────────────────────────
  const apiQuery = useMemo(() => {
    if (debouncedSearch.trim()) return debouncedSearch.trim();
    if (activeGenre !== 'All')  return activeGenre;
    if (urlBadge === 'Bestseller') return 'bestseller';
    return 'classics';
  }, [debouncedSearch, activeGenre, urlBadge]);

  const { books, loading, error, retry } = useBooks(apiQuery, 24);

  // ── Local filter + sort (instant, no extra fetches) ──────────────────────
  const sorted = useMemo(() => {
    let result = books;

    // Genre filter only applies when searching (genre tab drives the API query otherwise)
    if (debouncedSearch.trim() && activeGenre !== 'All') {
      result = result.filter(book => {
        const cat = book.category.toLowerCase();
        if (activeGenre === 'Fiction') {
          return ['fiction','romance','sci-fi','mystery','children','literature','novel'].some(c => cat.includes(c));
        }
        if (activeGenre === 'Non-Fiction') {
          return ['biography','history','science','self help','non-fiction','academic'].some(c => cat.includes(c));
        }
        return cat.includes(activeGenre.toLowerCase());
      });
    }

    // Price cap
    result = result.filter(b => b.price <= priceRange);

    // Badge filter
    if (urlBadge?.toLowerCase() === 'bestseller') {
      result = result.filter(b => b.isBestseller);
    }

    // Sort
    const arr = [...result];
    if (sortBy === 'Price: Low to High') arr.sort((a, b) => a.price - b.price);
    else if (sortBy === 'Price: High to Low') arr.sort((a, b) => b.price - a.price);
    else if (sortBy === 'Top Rated') arr.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'Newest')    arr.sort((a, b) => b.year - a.year);

    return arr;
  }, [books, debouncedSearch, activeGenre, priceRange, urlBadge, sortBy]);

  const isSearchMode = debouncedSearch.trim().length > 0;
  const hasBooks     = sorted.length > 0;

  const handleGenreTabClick = useCallback((genre) => {
    const newParams = new URLSearchParams(searchParams);
    if (genre === 'All') {
      newParams.delete('genre');
    } else {
      newParams.set('genre', genre);
    }
    newParams.delete('search'); // Clear search query when changing genre tab
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handleSortChange = useCallback((opt) => {
    const newParams = new URLSearchParams(searchParams);
    if (opt === 'Featured') {
      newParams.delete('sort');
    } else {
      newParams.set('sort', opt);
    }
    setSearchParams(newParams);
    setShowSort(false);
  }, [searchParams, setSearchParams]);

  const handleClearSearch = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handleResetAll = useCallback(() => {
    setSearchParams({});
    setPriceRange(1000);
  }, [setSearchParams]);

  // ── Whether this is a "cold" first load (no data yet) or an overlay reload
  const isColdLoad = loading && books.length === 0;

  return (
    <div className="books-page">

      {/* ── Page Header ── */}
      <div className="books-header">
        <div>
          <h1>
            {isSearchMode
              ? <><span>Search Results for </span><span className="gradient-text">"{debouncedSearch}"</span></>
              : <><span>Explore </span><span className="gradient-text">Books</span></>
            }
          </h1>
          <p className="books-subtitle">
            {!loading && `${sorted.length} ${sorted.length === 1 ? 'book' : 'books'} found`}
            {isSearchMode && !loading && (
              <button onClick={handleClearSearch} className="clear-search-link">
                <X size={13} /> Clear Search
              </button>
            )}
          </p>
        </div>

        <div className="books-controls">
          <button
            className={`filter-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(s => !s)}
          >
            <Filter size={17} /> Filters {showFilters && <X size={15} />}
          </button>

          <div className="sort-wrap">
            <button className="sort-btn" onClick={() => setShowSort(s => !s)}>
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
                  {SORT_OPTIONS.map(opt => (
                    <li
                      key={opt}
                      className={opt === sortBy ? 'active' : ''}
                      onClick={() => handleSortChange(opt)}
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

      {/* ── Filter Panel ── */}
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
                type="range" min={100} max={1000} step={50}
                value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                className="price-range"
              />
              <div className="price-labels"><span>₹100</span><span>₹1000</span></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Genre Tabs ── */}
      <div className="genre-tabs">
        {GENRES.map(g => (
          <button
            key={g}
            className={`genre-tab ${activeGenre === g ? 'active' : ''}`}
            onClick={() => handleGenreTabClick(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* ── Content Area ── */}
      {error ? (
        <div className="search-error-state glass">
          <AlertCircle size={40} style={{ color: 'var(--accent-primary)', opacity: 0.7 }} />
          <h3>Unable to Load Books</h3>
          <p>{error}</p>
          <button className="retry-search-btn" onClick={retry}>Retry</button>
        </div>
      ) : isColdLoad ? (
        /* First load — show full skeleton grid */
        <div className="books-loading-cold">
          <div className="books-loading-spinner">
            <Loader2 className="spin-icon" size={28} />
            <span>Loading...</span>
          </div>
          <SkeletonGrid count={8} />
        </div>
      ) : (
        /* Data present — show grid; overlay spinner for subsequent loads */
        <div className="books-content-wrap">
          {loading && (
            <div className="books-overlay-spinner">
              <Loader2 className="spin-icon" size={28} />
              <span>Loading...</span>
            </div>
          )}

          {hasBooks ? (
            <motion.div className={`books-grid ${loading ? 'books-grid--faded' : ''}`} layout>
              {sorted.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </motion.div>
          ) : !loading ? (
            <div className="no-results">
              <Search size={40} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <h3>No Books Found</h3>
              <p>No books match your selected filters.</p>
              <button onClick={handleResetAll}>Reset All Filters</button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Books;
