import { useState, useEffect, useRef, useCallback } from 'react';

const API_BASE = 'http://localhost:5000/api/v1';

/**
 * Custom hook — fetches books from the Bookora backend with:
 * - Category and search filtering via query params
 * - Overlay loading (keeps previous results visible while fetching)
 * - Proper stale-state cancellation
 * - Manual retry support
 *
 * @param {string}  query   - Search term or category name
 * @param {number}  limit   - Max results (default 24, max 100)
 * @param {object}  options - Extra options: { isBestseller, category }
 * @returns {{ books, loading, error, retry }}
 */
const useBooks = (query, limit = 24, options = {}) => {
  const [books,    setBooks]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  const abortRef = useRef(null);

  useEffect(() => {
    // Cancel any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const params = new URLSearchParams();
        params.set('limit', String(limit));

        // If a query looks like a search term, use the search param
        const knownCategories = [
          'Fiction', 'Non-Fiction', 'Science', 'History',
          'Biography', 'Children', 'Self Help', 'Sci-Fi', 'All'
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
          description:   b.description,
          category:      b.category,
          stock:         b.stock,
          coverId:       b.coverId || null,
          cover:         b.cover || null,
          rating:        b.ratingsAverage || 4.5,
          isBestseller:  b.isBestseller || false,
        }));

        setBooks(normalized);
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
  }, [query, limit, options.isBestseller, retryKey]);

  const retry = useCallback(() => {
    setRetryKey(k => k + 1);
  }, []);

  return { books, loading, error, retry };
};

export default useBooks;
