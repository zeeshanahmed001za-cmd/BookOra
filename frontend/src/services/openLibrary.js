// ─── Open Library API Service ─────────────────────────────────────────────────
const BASE_URL    = 'https://openlibrary.org';
const COVERS_BASE = 'https://covers.openlibrary.org/b/id';

export const FALLBACK_COVER = 'https://images.unsplash.com/photo-1543004218-2bc3500d970c?auto=format&fit=crop&q=80&w=400';
export const FALLBACK_IMAGE = FALLBACK_COVER;
export const FALLBACK_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e1b4b"/><stop offset="100%" stop-color="%23311042"/></linearGradient></defs><rect width="300" height="400" fill="url(%23g)"/><path d="M110 130 h80 a10 10 0 0 1 10 10 v120 a10 10 0 0 1 -10 10 h-80 a10 10 0 0 1 -10 -10 v-120 a10 10 0 0 1 10 -10 z" fill="none" stroke="%23a294fb" stroke-width="4" stroke-linejoin="round" opacity="0.4"/><path d="M130 170 h40 M130 200 h40 M130 230 h30" stroke="%23a294fb" stroke-width="4" stroke-linecap="round" opacity="0.4"/></svg>`;

// Centralized API Cache
const apiCache = new Map();

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Deterministic integer hash from a string (used for stable mock metadata). */
const djb2Hash = (str = '') => {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return Math.abs(h >>> 0);
};

/** Build an Open Library cover URL, or return null if no cover id. */
export const buildCoverUrl = (coverId, size = 'L') =>
  coverId ? `${COVERS_BASE}/${coverId}-${size}.jpg?default=false` : null;

/** Normalize raw subject strings into tidy single-word categories. */
const mapCategory = (subjects = []) => {
  if (!subjects.length) return 'General';
  const s = subjects[0].toLowerCase();
  if (s.includes('fiction'))       return 'Fiction';
  if (s.includes('romance'))       return 'Romance';
  if (s.includes('mystery') || s.includes('thriller')) return 'Mystery';
  if (s.includes('sci-fi') || s.includes('science fiction')) return 'Sci-Fi';
  if (s.includes('self-help') || s.includes('self help')) return 'Self Help';
  if (s.includes('biography') || s.includes('memoir'))   return 'Biography';
  if (s.includes('history'))       return 'History';
  if (s.includes('children') || s.includes('juvenile'))  return 'Children';
  if (s.includes('science'))       return 'Science';
  return subjects[0].split(' ').slice(0, 2).join(' ');
};

// ─── Data Cleaner ─────────────────────────────────────────────────────────────

const toBook = (doc) => {
  const key  = doc.key || '';
  const hash = djb2Hash(key || doc.title);

  return {
    id:          key.replace('/works/', '') || `ol-${hash}`,
    key,
    title:       doc.title || 'Untitled',
    author:      Array.isArray(doc.author_name) ? doc.author_name.slice(0, 2).join(', ') : 'Unknown Author',
    cover:       buildCoverUrl(doc.cover_i, 'L'),   // Large cover for quality
    coverId:     doc.cover_i || null,
    year:        doc.first_publish_year || (Array.isArray(doc.publish_year) ? doc.publish_year[0] : null) || null,
    category:    mapCategory(doc.subject),
    // Stable mock fields (Open Library doesn't provide these)
    rating:      parseFloat((4.0 + (hash % 11) / 10).toFixed(1)),
    price:       parseFloat((8 + (hash % 41) + (hash % 100) / 100).toFixed(2)),
    isBestseller: hash % 4 === 0,
    pages:       120 + (hash % 500),
  };
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Search Open Library by any query string with caching.
 * @param {string} query   - Search term (title, author, genre, etc.)
 * @param {number} limit   - Max results (default 24)
 * @returns {Promise<Book[]>}
 */
export const fetchBooksByQuery = async (query, limit = 24) => {
  if (!query?.trim()) return [];

  const trimmedQuery = query.trim();
  const cacheKey = `${trimmedQuery.toLowerCase()}:${limit}`;

  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  const url = `${BASE_URL}/search.json?q=${encodeURIComponent(trimmedQuery)}&fields=key,title,author_name,cover_i,first_publish_year,publish_year,subject&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Open Library API error: ${response.status}`);

  const data = await response.json();
  if (!Array.isArray(data.docs)) return [];

  const books = data.docs
    .filter(doc => doc.title)          // skip docs with no title
    .map(toBook);

  apiCache.set(cacheKey, books);
  return books;
};

/**
 * Invalidate a specific query/limit from the API cache.
 */
export const invalidateCache = (query, limit = 24) => {
  if (!query) return;
  const cacheKey = `${query.trim().toLowerCase()}:${limit}`;
  apiCache.delete(cacheKey);
};

/**
 * Retrieve cached books synchronously if available.
 */
export const getCachedBooks = (query, limit = 24) => {
  if (!query) return null;
  const cacheKey = `${query.trim().toLowerCase()}:${limit}`;
  return apiCache.get(cacheKey) || null;
};
