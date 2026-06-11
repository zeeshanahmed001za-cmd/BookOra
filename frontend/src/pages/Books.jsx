import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, X, Search, AlertCircle, Loader2 } from 'lucide-react';
import useBooks from '../hooks/useBooks';
import BookCard from '../components/BookCard';
import { SkeletonGrid } from '../components/BookSkeleton';

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
    return activeGenre;
  }, [debouncedSearch, activeGenre]);

  const { books, loading, error, hasMore, loadMore, retry } = useBooks(apiQuery, 24);

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
    else if (sortBy === 'Newest')    arr.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : 0;
      const dateB = b.createdAt ? new Date(b.createdAt) : 0;
      return dateB - dateA;
    });

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
    <div className="max-w-[1490px] mx-auto py-10 px-[5%] pb-20">

      {/* ── Page Header ── */}
      <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-[2.8rem] font-bold leading-none md:leading-[1.1]">
            {isSearchMode
              ? <><span>Search Results for </span><span className="gradient-text">"{debouncedSearch}"</span></>
              : <><span>Explore </span><span className="gradient-text">Books</span></>
            }
          </h1>
          <p className="text-text-dim text-[0.95rem] mt-1.5">
            {!loading && `${sorted.length} ${sorted.length === 1 ? 'book' : 'books'} found`}
            {isSearchMode && !loading && (
              <button onClick={handleClearSearch} className="inline-flex items-center gap-1 bg-none border-none text-accent-primary cursor-pointer ml-2.5 text-[0.82rem] font-semibold opacity-80 transition-opacity duration-200 hover:opacity-100 hover:underline align-middle">
                <X size={13} /> Clear Search
              </button>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className={`flex items-center gap-2 py-2.5 px-4.5 rounded-[30px] border border-border-subtle bg-bg-card text-text-secondary text-[0.9rem] font-medium cursor-pointer transition-colors duration-200 hover:border-accent-primary hover:text-text-primary ${
              showFilters ? 'border-accent-primary text-accent-primary bg-accent-primary/8' : ''
            }`}
            onClick={() => setShowFilters(s => !s)}
          >
            <Filter size={17} /> Filters {showFilters && <X size={15} />}
          </button>

          <div className="relative">
            <button className="flex items-center gap-2 py-2.5 px-4.5 rounded-[30px] border border-border-subtle bg-bg-card text-text-secondary text-[0.9rem] font-medium cursor-pointer whitespace-nowrap transition-colors duration-200 hover:border-accent-primary hover:text-text-primary" onClick={() => setShowSort(s => !s)}>
              Sort: {sortBy}
              <ChevronDown size={16} className={`transition-transform duration-200 ${showSort ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showSort && (
                <motion.ul
                  className="absolute right-0 top-[calc(100%+8px)] bg-bg-card border border-border-subtle rounded-xl overflow-hidden min-w-[200px] z-[100] shadow-xl list-none p-1.5"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {SORT_OPTIONS.map(opt => (
                    <li
                      key={opt}
                      className={`py-2.5 px-3.5 rounded-lg text-[0.9rem] text-text-secondary cursor-pointer transition-colors duration-150 hover:bg-bg-elevated hover:text-text-primary ${
                        opt === sortBy ? 'text-accent-primary bg-accent-primary/10 font-semibold' : ''
                      }`}
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
            className="rounded-2xl p-6 px-7 mb-7 overflow-hidden glass"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col">
              <h4 className="text-[0.95rem] text-text-secondary mb-3.5 font-medium">Max Price: <span className="gradient-text font-semibold">₹{priceRange}</span></h4>
              <input
                type="range" min={100} max={1000} step={50}
                value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                className="w-full max-w-[380px] accent-accent-primary cursor-pointer h-1"
              />
              <div className="flex justify-between max-w-[380px] text-[0.8rem] text-text-dim mt-1.5"><span>₹100</span><span>₹1000</span></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Genre Tabs ── */}
      <div className="flex gap-2.5 flex-wrap mb-9">
        {GENRES.map(g => (
          <button
            key={g}
            className={`py-2 px-5 rounded-[30px] border border-border-subtle bg-transparent text-text-secondary text-[0.88rem] font-medium cursor-pointer transition-all duration-200 hover:border-accent-primary hover:text-text-primary ${
              activeGenre === g ? 'bg-accent-gradient border-transparent text-white shadow-[0_4px_14px_rgba(162,148,251,0.35)]' : ''
            }`}
            onClick={() => handleGenreTabClick(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* ── Content Area ── */}
      {error ? (
        <div className="flex flex-col items-center gap-3.5 py-18 px-6 text-center text-text-dim glass rounded-2xl">
          <AlertCircle size={40} className="text-accent-primary opacity-70" />
          <h3 className="text-[1.3rem] text-text-secondary font-bold m-0">Unable to Load Books</h3>
          <p className="text-[0.9rem] max-w-[420px] leading-relaxed m-0">{error}</p>
          <button className="mt-2 py-2.5 px-7 rounded-[30px] bg-accent-gradient text-white text-[0.9rem] font-semibold cursor-pointer transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5" onClick={retry}>Retry</button>
        </div>
      ) : isColdLoad ? (
        /* First load — show full skeleton grid */
        <div className="flex flex-col items-center justify-center min-h-[450px] gap-8 w-full">
          <div className="flex flex-col items-center justify-center gap-2.5 text-accent-primary font-medium">
            <Loader2 className="animate-spin text-accent-primary" size={28} />
            <span>Loading...</span>
          </div>
          <SkeletonGrid count={8} />
        </div>
      ) : (
        /* Data present — show grid; overlay spinner for subsequent loads */
        <div className="relative min-h-[400px] w-full">
          {loading && (
            <div className="absolute inset-0 bg-bg-base/45 backdrop-blur-[5px] flex flex-col items-center justify-center gap-3 z-10 rounded-2xl text-accent-primary font-medium animate-fade-in">
              <Loader2 className="animate-spin text-accent-primary" size={28} />
              <span>Loading...</span>
            </div>
          )}

          {hasBooks ? (
            <>
              <motion.div className={`grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 md:gap-7 transition-opacity duration-300 ${loading ? 'opacity-35 pointer-events-none' : ''}`} layout>
                {sorted.map((book, i) => (
                  <BookCard key={book.id} book={book} index={i} />
                ))}
              </motion.div>
              {hasMore && (
                <div className="flex justify-center mt-12 w-full">
                  <button 
                    className="inline-flex items-center gap-2 py-3 px-9 rounded-[30px] text-[0.95rem] font-semibold text-text-primary bg-bg-card border border-border-subtle cursor-pointer transition-all duration-250 ease-out hover:border-accent-primary hover:text-accent-primary hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(162,148,251,0.15)] disabled:opacity-55 disabled:cursor-not-allowed glass" 
                    onClick={loadMore} 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin text-accent-primary" size={16} />
                        <span>Loading...</span>
                      </>
                    ) : (
                      'Load More Books'
                    )}
                  </button>
                </div>
              )}
            </>
          ) : !loading ? (
            <div className="text-center py-20 px-5 text-text-dim flex flex-col items-center justify-center">
              <Search size={40} className="opacity-30 mb-4" />
              <h3 className="text-lg font-bold text-text-secondary mb-1">No Books Found</h3>
              <p className="text-[1.1rem] mb-4">No books match your selected filters.</p>
              <button className="py-2.5 px-6 rounded-[30px] bg-bg-elevated border border-border-subtle text-accent-primary font-semibold cursor-pointer hover:border-accent-primary" onClick={handleResetAll}>Reset All Filters</button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Books;
