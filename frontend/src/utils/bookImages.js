import alchemist from '../assets/alchemist.jpg';
import atomichabits from '../assets/atomichabits.jpg';
import itendswithus from '../assets/itendswithus.jpg';
import mockingbird from '../assets/mockingbird.jpg';
import pride from '../assets/pride.jpg';
import sapiens from '../assets/sapiens.jpg';
import sayno from '../assets/sayno.jpg';
import surroundediditos from '../assets/surroundediditos.png';
import ugly from '../assets/ugly.jpg';

// Vite-friendly static cover assets registry
export const bookImages = {
  alchemist,
  atomichabits,
  itendswithus,
  mockingbird,
  pride,
  sapiens,
  sayno,
  surroundediditos,
  ugly
};

export const fallbackImage = 'https://images.unsplash.com/photo-1543004218-2bc3500d970c?auto=format&fit=crop&q=80&w=400';

// Helper to normalize strings for comparison (lowercase, strip spaces and non-alphanumeric chars)
export const normalizeString = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};

// Extracts the base filename without extension from a path
const getBaseFilename = (path) => {
  if (!path) return '';
  const parts = path.split('/');
  const fileWithExt = parts[parts.length - 1];
  return fileWithExt.split('.')[0] || '';
};

/**
 * Dynamically resolves a cover image based on filename and title similarity.
 * Returns the resolved physical asset path OR null to explicitly trigger the fallback image.
 * This guarantees zero duplicate cover reuse.
 *
 * @param {string} coverPath - Relative asset path from books.json
 * @param {string} title - Book title
 * @returns {string|null} Resolved asset path or null
 */
export const matchBookCover = (coverPath, title) => {
  const filename = getBaseFilename(coverPath);
  const normFile = normalizeString(filename);
  const normTitle = normalizeString(title);
  
  if (!normFile && !normTitle) return null;

  const keys = Object.keys(bookImages);

  // 1. Direct match on normalized filename
  if (normFile) {
    for (const key of keys) {
      if (normalizeString(key) === normFile) {
        return bookImages[key];
      }
    }
  }

  // 2. Direct match on normalized title
  if (normTitle) {
    for (const key of keys) {
      if (normalizeString(key) === normTitle) {
        return bookImages[key];
      }
    }
  }

  // 3. Substring match on filename
  if (normFile) {
    for (const key of keys) {
      const normKey = normalizeString(key);
      if (normKey.length < 3) continue; // skip very short keys
      if (normFile.includes(normKey) || normKey.includes(normFile)) {
        return bookImages[key];
      }
    }
  }

  // 4. Substring match on title
  if (normTitle) {
    for (const key of keys) {
      const normKey = normalizeString(key);
      if (normKey.length < 3) continue; // skip very short keys
      if (normTitle.includes(normKey) || normKey.includes(normTitle)) {
        return bookImages[key];
      }
    }
  }

  // 5. Intelligent similarity overlap match for slight spelling differences (e.g. "surroundediditos" matching "Surrounded by Idiots")
  let bestMatch = null;
  let highestOverlap = 0;

  for (const key of keys) {
    const normKey = normalizeString(key);
    let commonChars = 0;
    
    // Simple character overlap count
    const keyChars = new Set(normKey.split(''));
    for (const char of normTitle.split('')) {
      if (keyChars.has(char)) {
        commonChars++;
      }
    }
    
    const overlapScore = commonChars / Math.max(normKey.length, normTitle.length);
    if (overlapScore > highestOverlap && overlapScore > 0.55) {
      highestOverlap = overlapScore;
      bestMatch = bookImages[key];
    }
  }

  if (bestMatch) {
    return bestMatch;
  }

  // If no match is physically available, return null to signify missing cover
  return null;
};
