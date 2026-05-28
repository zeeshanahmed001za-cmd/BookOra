import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchBooksByQuery, invalidateCache, getCachedBooks } from '../services/openLibrary';
import { mergePricing } from '../utils/pricing';

/**
 * Custom hook — fetches books from Open Library with:
 * - Centralized service-level caching
 * - Pricing merged via internal prices.json (no random pricing)
 * - Overlay loading (keeps previous results visible while fetching)
 * - Synchronous cache resolution to prevent flashing
 * - Proper stale-state cancellation
 * - Manual retry support
 *
 * @param {string}  query  - Search term
 * @param {number}  limit  - Max results (default 24)
 * @returns {{ books, loading, error, retry }}
 */
const useBooks = (query, limit = 24) => {
  const [books,    setBooks]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  const abortRef = useRef(null);

  useEffect(() => {
    const trimmed = query?.trim();

    if (!trimmed) {
      setBooks([]);
      setLoading(false);
      setError(null);
      return;
    }

    // ── Cache hit: return instantly, no fetch needed ──────────────────────────
    const cached = getCachedBooks(trimmed, limit);
    if (cached) {
      setBooks(cached);
      setLoading(false);
      setError(null);
      return;
    }

    // ── Cancel any in-flight request ─────────────────────────────────────────
    if (abortRef.current) {
      abortRef.current.cancelled = true;
    }
    const token = { cancelled: false };
    abortRef.current = token;

    // ── Show overlay spinner (don't wipe existing books) ──────────────────────
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const rawBooks = await fetchBooksByQuery(trimmed, limit);
        if (token.cancelled) return;

        // Merge internal pricing into every book object
        const pricedBooks = rawBooks.map(mergePricing);
        setBooks(pricedBooks);
      } catch (err) {
        if (token.cancelled) return;
        setError(err.message || 'Failed to load books.');
      } finally {
        if (!token.cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      token.cancelled = true;
    };
  }, [query, limit, retryKey]);

  const retry = useCallback(() => {
    // Bust cache for this query on retry so we get fresh data
    invalidateCache(query, limit);
    setRetryKey(k => k + 1);
  }, [query, limit]);

  return { books, loading, error, retry };
};

export default useBooks;
