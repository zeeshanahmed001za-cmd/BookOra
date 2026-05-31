// ─── Open Library API Service ─────────────────────────────────────────────────
const BASE_URL    = 'https://openlibrary.org';
const COVERS_BASE = 'https://covers.openlibrary.org/b/id';

export const FALLBACK_COVER = 'https://images.unsplash.com/photo-1543004218-2bc3500d970c?auto=format&fit=crop&q=80&w=400';
export const FALLBACK_IMAGE = FALLBACK_COVER;
export const FALLBACK_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e1b4b"/><stop offset="100%" stop-color="%23311042"/></linearGradient></defs><rect width="300" height="400" fill="url(%23g)"/><path d="M110 130 h80 a10 10 0 0 1 10 10 v120 a10 10 0 0 1 -10 10 h-80 a10 10 0 0 1 -10 -10 v-120 a10 10 0 0 1 10 -10 z" fill="none" stroke="%23a294fb" stroke-width="4" stroke-linejoin="round" opacity="0.4"/><path d="M130 170 h40 M130 200 h40 M130 230 h30" stroke="%23a294fb" stroke-width="4" stroke-linecap="round" opacity="0.4"/></svg>`;

// Centralized API Cache
const apiCache = new Map();
const CACHE_PREFIX = 'bookora-api-cache';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

// Helper to get from local storage cache
const getLocalStorageCache = (key) => {
  try {
    const itemStr = localStorage.getItem(`${CACHE_PREFIX}:${key}`);
    if (!itemStr) return null;
    const item = JSON.parse(itemStr);
    if (Date.now() > item.expiry) {
      localStorage.removeItem(`${CACHE_PREFIX}:${key}`);
      return null;
    }
    return item.value;
  } catch (e) {
    return null;
  }
};

// Helper to set local storage cache
const setLocalStorageCache = (key, value) => {
  try {
    const item = {
      value,
      expiry: Date.now() + CACHE_TTL_MS,
    };
    localStorage.setItem(`${CACHE_PREFIX}:${key}`, JSON.stringify(item));
  } catch (e) {
    // Silent fail if quota exceeded
  }
};

// Helper to remove local storage cache
const removeLocalStorageCache = (key) => {
  try {
    localStorage.removeItem(`${CACHE_PREFIX}:${key}`);
  } catch (e) {}
};

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
// NOTE: pricing fields (price, originalPrice, discount, stock) are NOT set here.
// They are injected by mergePricing() in utils/pricing.js after this transform.

const toBook = (doc) => {
  const key  = doc.key || '';
  const hash = djb2Hash(key || doc.title);

  return {
    id:           key.replace('/works/', '') || `ol-${hash}`,
    key,
    title:        doc.title || 'Untitled',
    author:       Array.isArray(doc.author_name) ? doc.author_name.slice(0, 2).join(', ') : 'Unknown Author',
    cover:        buildCoverUrl(doc.cover_i, 'L'),
    coverId:      doc.cover_i || null,
    year:         doc.first_publish_year || (Array.isArray(doc.publish_year) ? doc.publish_year[0] : null) || null,
    category:     mapCategory(doc.subject),
    subjects:     Array.isArray(doc.subject) ? doc.subject.slice(0, 6) : [],
    editionCount: doc.edition_count || null,
    // Stable rating (not random — hash-derived so it never changes for same book)
    rating:       parseFloat((4.0 + (hash % 11) / 10).toFixed(1)),
    isBestseller: hash % 4 === 0,
  };
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Search Open Library by any query string with caching.
 * Returns books WITHOUT pricing — call mergePricing() from utils/pricing.js
 * to attach price, originalPrice, discount, stock, availability.
 *
 * @param {string} query   - Search term (title, author, genre, etc.)
 * @param {number} limit   - Max results (default 24)
 * @returns {Promise<Book[]>}
 */
export const fetchBooksByQuery = async (query, limit = 24) => {
  if (!query?.trim()) return [];

  const trimmedQuery = query.trim();
  const cacheKey = `search:${trimmedQuery.toLowerCase()}:${limit}`;

  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  const localCached = getLocalStorageCache(cacheKey);
  if (localCached) {
    apiCache.set(cacheKey, localCached);
    return localCached;
  }

  const url = `${BASE_URL}/search.json?q=${encodeURIComponent(trimmedQuery)}&fields=key,title,author_name,cover_i,first_publish_year,publish_year,subject,edition_count&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Open Library API error: ${response.status}`);

  const data = await response.json();
  if (!Array.isArray(data.docs)) return [];

  const books = data.docs
    .filter(doc => doc.title)
    .map(toBook);

  apiCache.set(cacheKey, books);
  setLocalStorageCache(cacheKey, books);
  return books;
};

/**
 * Fetch extended details for a single work from Open Library Works API.
 * Returns description, subjects, links, etc. for use in BookModal/BookDetails.
 * Results are cached to avoid redundant fetches on repeated opens.
 *
 * @param {string} workId - Open Library Work ID (e.g. "OL82563W")
 * @returns {Promise<object>} Extended work details
 */
export const fetchBookDetails = async (workId) => {
  if (!workId) return null;

  const cacheKey = `work:${workId}`;
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  const localCached = getLocalStorageCache(cacheKey);
  if (localCached) {
    apiCache.set(cacheKey, localCached);
    return localCached;
  }

  const url = `${BASE_URL}/works/${workId}.json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Open Library Works API error: ${response.status}`);

  const data = await response.json();

  // Normalize description (can be a string or {type, value} object)
  const rawDesc = data.description;
  const description =
    typeof rawDesc === 'string'
      ? rawDesc
      : typeof rawDesc === 'object' && rawDesc?.value
        ? rawDesc.value
        : null;

  // Normalize subjects
  const subjects = Array.isArray(data.subjects)
    ? data.subjects.slice(0, 10)
    : [];

  const details = {
    workId,
    description,
    subjects,
    links:         Array.isArray(data.links) ? data.links : [],
    firstPublishDate: data.first_publish_date || null,
    created:       data.created?.value || null,
  };

  apiCache.set(cacheKey, details);
  setLocalStorageCache(cacheKey, details);
  return details;
};

/**
 * Invalidate a specific search query/limit from the API cache.
 */
export const invalidateCache = (query, limit = 24) => {
  if (!query) return;
  const cacheKey = `search:${query.trim().toLowerCase()}:${limit}`;
  apiCache.delete(cacheKey);
  removeLocalStorageCache(cacheKey);
};

/**
 * Retrieve cached search books synchronously if available.
 */
export const getCachedBooks = (query, limit = 24) => {
  if (!query) return null;
  const cacheKey = `search:${query.trim().toLowerCase()}:${limit}`;
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }
  const localCached = getLocalStorageCache(cacheKey);
  if (localCached) {
    apiCache.set(cacheKey, localCached);
    return localCached;
  }
  return null;
};
