import { useState, useEffect, useRef, useCallback } from 'react';

const API_BASE = 'http://localhost:5000/api/v1';

// Global cache for backend API queries
const clientCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes TTL

/**
 * Custom hook — fetches books from the Bookora backend with:
 * - Category and search filtering via query params
 * - Memory-based caching with TTL to prevent duplicate API requests
 * - Bandwidth optimization (fields limiting to exclude description)
 * - Load-more pagination support
 * - Proper stale-state cancellation
 * - Manual retry support
 *
 * @param {string}  query   - Search term or category name
 * @param {number}  limit   - Max results per page (default 24)
 * @param {object}  options - Extra options: { isBestseller }
 * @returns {{ books, loading, error, hasMore, loadMore, retry }}
 */
const useBooks = (query, limit = 24, options = {}) => {
  const [books,    setBooks]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [page,     setPage]     = useState(1);
  const [hasMore,  setHasMore]  = useState(true);
  const [retryKey, setRetryKey] = useState(0);

  const abortRef = useRef(null);
  const isFirstMount = useRef(true);

  // Reset page and books when query or options change
  useEffect(() => {
    // Skip on first mount because it will initialize page to 1 and fetch
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setBooks([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [query, options.isBestseller]);

  useEffect(() => {
    // Cancel any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    const load = async () => {
      // Build request URL
      const params = new URLSearchParams();
      params.set('limit', String(limit));
      params.set('page', String(page));
      // Optimize bandwidth by fetching only required fields (excluding long descriptions)
      params.set('fields', 'title,author,price,category,stock,coverId,cover,ratingsAverage,isBestseller');

      const knownCategories = [
        'Fiction', 'Non-Fiction', 'Science', 'History', 'Biography',
        'Children', 'Self Help', 'Sci-Fi', 'Romance', 'Mystery', 'All'
      ];
      const isCategory = knownCategories.includes(query);

      if (query && query !== 'All') {
        if (isCategory) {
          params.set('category', query);
        } else {
          params.set('search', query);
        }
      }

      if (options.isBestseller) {
        params.set('isBestseller', 'true');
      }

      const url = `${API_BASE}/books?${params.toString()}`;

      // Check client-side cache
      const cached = clientCache.get(url);
      if (cached && Date.now() < cached.expiry) {
        if (page === 1) {
          setBooks(cached.books);
        } else {
          setBooks(prev => {
            // Avoid adding duplicates if state was somehow already updated
            const existingIds = new Set(prev.map(b => b.id));
            const newBooks = cached.books.filter(b => !existingIds.has(b.id));
            return [...prev, ...newBooks];
          });
        }
        setHasMore(cached.hasMore);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();
        if (controller.signal.aborted) return;

        const rawBooks = data.data?.books || [];

        // Normalize fields to match existing UI expectations
        const normalized = rawBooks.map(b => ({
          id:            b._id,
          _id:           b._id,
          title:         b.title,
          author:        b.author,
          price:         b.price,
          originalPrice: b.originalPrice || null,
          category:      b.category,
          stock:         b.stock,
          coverId:       b.coverId || null,
          cover:         b.cover || null,
          rating:        b.ratingsAverage || 4.5,
          isBestseller:  b.isBestseller || false,
        }));

        // Determine if more pages exist (if returned results are less than request limit, we hit the end)
        const currentHasMore = normalized.length === limit;

        // Cache results
        clientCache.set(url, {
          books: normalized,
          hasMore: currentHasMore,
          expiry: Date.now() + CACHE_TTL_MS
        });

        if (page === 1) {
          setBooks(normalized);
        } else {
          setBooks(prev => {
            const existingIds = new Set(prev.map(b => b.id));
            const newBooks = normalized.filter(b => !existingIds.has(b.id));
            return [...prev, ...newBooks];
          });
        }
        setHasMore(currentHasMore);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Failed to load books.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();

    return () => {
      controller.abort();
    };
  }, [query, limit, page, options.isBestseller, retryKey]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  const retry = useCallback(() => {
    setRetryKey(k => k + 1);
  }, []);

  return { books, loading, error, hasMore, loadMore, retry };
};

export default useBooks;
