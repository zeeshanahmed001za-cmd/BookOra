// ─── Pricing Utility ──────────────────────────────────────────────────────────
// Single source of truth for all pricing logic.
// Open Library API provides metadata only; prices come from prices.json.

import pricesData from '../data/prices.json';

// Build a fast lookup Map from the JSON array
const priceMap = new Map(pricesData.map(entry => [entry.id, entry]));

// ─── Category-based default price tiers ──────────────────────────────────────
// Deterministic defaults by genre — NOT random. Books outside prices.json get
// a stable price derived from their category so the UI never shows ₹0 or NaN.

const CATEGORY_TIERS = {
  'Fiction':     { price: 399, originalPrice: 549 },
  'Non-Fiction': { price: 349, originalPrice: 499 },
  'Science':     { price: 449, originalPrice: 599 },
  'Self Help':   { price: 429, originalPrice: 599 },
  'Sci-Fi':      { price: 389, originalPrice: 529 },
  'Romance':     { price: 329, originalPrice: 449 },
  'History':     { price: 369, originalPrice: 499 },
  'Biography':   { price: 419, originalPrice: 569 },
  'Children':    { price: 279, originalPrice: 399 },
  'Mystery':     { price: 359, originalPrice: 499 },
  'General':     { price: 349, originalPrice: 499 },
};

const DEFAULT_TIER = { price: 349, originalPrice: 499 };
const DEFAULT_STOCK = 20;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Look up internal pricing for a book ID.
 * @param {string} id - Open Library Work ID (e.g. "OL82563W")
 * @returns {object|null} pricing record or null
 */
export const getPricingById = (id) => priceMap.get(id) || null;

/**
 * Compute discount percentage between originalPrice and price.
 * @param {number} price
 * @param {number} originalPrice
 * @returns {number} integer discount percent (0 if no discount)
 */
export const computeDiscount = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

/**
 * Merge internal pricing data into a book object returned from the API.
 * Attaches: price, originalPrice, discount, stock, availability.
 * Never modifies the original object — returns a new merged object.
 *
 * @param {object} book - Raw book from toBook() transformer
 * @returns {object} book with pricing fields attached
 */
export const mergePricing = (book) => {
  const record = getPricingById(book.id);

  let price, originalPrice, stock;

  if (record) {
    price         = record.price;
    originalPrice = record.originalPrice;
    stock         = record.stock ?? DEFAULT_STOCK;
  } else {
    // Deterministic fallback by category — stable, not random
    const tier = CATEGORY_TIERS[book.category] || DEFAULT_TIER;
    price         = tier.price;
    originalPrice = tier.originalPrice;
    stock         = DEFAULT_STOCK;
  }

  const discount     = computeDiscount(price, originalPrice);
  const availability = stock > 10 ? 'In Stock'
                     : stock > 0  ? `Only ${stock} left`
                     : 'Out of Stock';

  return {
    ...book,
    price,
    originalPrice,
    discount,
    stock,
    availability,
  };
};
