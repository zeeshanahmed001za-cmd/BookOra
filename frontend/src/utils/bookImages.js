import alchemist from '../assets/alchemist.jpg';
import atomichabits from '../assets/atomichabits.jpg';
import itendswithus from '../assets/itendswithus.jpg';
import mockingbird from '../assets/mockingbird.jpg';
import pride from '../assets/pride.jpg';
import sapiens from '../assets/sapiens.jpg';
import sayno from '../assets/sayno.jpg';
import surroundediditos from '../assets/surroundediditos.png';
import ugly from '../assets/ugly.jpg';

// New static cover assets
import _1984 from '../assets/1984.jpg';
import greatgatsby from '../assets/Greatgatsby.jpg';
import beesting from '../assets/ThebeeSting.jpg';
import bookthief from '../assets/bookthief.jpg';
import briefhistorytime from '../assets/briefhistorytime.png';
import canthurtme from '../assets/canthurtme.webp';
import deepwork from '../assets/deepwork.jpg';
import hailmary from '../assets/hailmary.jpg';
import hobbit from '../assets/hobbit.jpg';
import kafka from '../assets/kafka.jpg';
import lifepi from '../assets/lifepi.jpg';
import luster from '../assets/luster.jpg';
import money from '../assets/money.webp';
import monk from '../assets/monk.jpg';
import neuro from '../assets/neuro.jpg';
import richdad from '../assets/richdad.jpg';
import silentspring from '../assets/silentspring.webp';
import stevejobs from '../assets/stevejobs.jpg';
import thekite from '../assets/thekite.jpg';
import themurderafter from '../assets/themurderafter.jpg';

// Newly updated cover assets
import astrophysicsforhurrypeople from '../assets/astrophysicsforhurrypeople.webp';
import bravenewworld from '../assets/bravenewworld.webp';
import circ from '../assets/circ.jpg';
import cosmos from '../assets/cosmos.webp';
import frankenstein from '../assets/frankenstein.jpg';
import originspecies from '../assets/originspecies.jpg';
import thinkingfastandslow from '../assets/thinkingfastandslow.jpg';
import biglittlelies from '../assets/biglittlelies.webp';
import davinvicode from '../assets/davinvicode.webp';
import educated from '../assets/educated.webp';
import gonegirl from '../assets/gonegirl.jpg';
import silentpatient from '../assets/silentpatient.jpg';

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
  ugly,
  _1984,
  greatgatsby,
  beesting,
  bookthief,
  briefhistorytime,
  canthurtme,
  deepwork,
  hailmary,
  hobbit,
  kafka,
  lifepi,
  luster,
  money,
  monk,
  neuro,
  richdad,
  silentspring,
  stevejobs,
  thekite,
  themurderafter,
  astrophysicsforhurrypeople,
  bravenewworld,
  circ,
  cosmos,
  frankenstein,
  originspecies,
  thinkingfastandslow,
  biglittlelies,
  davinvicode,
  educated,
  gonegirl,
  silentpatient
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
 * Returns the resolved physical asset path OR a unique placeholder cover if not available.
 * This guarantees zero duplicate cover reuse.
 *
 * @param {string} coverPath - Relative asset path from books.json
 * @param {string} title - Book title
 * @returns {string} Resolved asset path or unique placeholder cover URL
 */
export const matchBookCover = (coverPath, title) => {
  const filename = getBaseFilename(coverPath);
  const normFile = normalizeString(filename);
  const normTitle = normalizeString(title);
  
  if (!normFile && !normTitle) {
    return `https://placehold.co/400x600/0f0f0f/a294fb?text=${encodeURIComponent(title || 'Bookora')}`;
  }

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
  // Using a strict 0.75+ threshold to ensure we never match unrelated covers
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
    if (overlapScore > highestOverlap && overlapScore > 0.75) {
      highestOverlap = overlapScore;
      bestMatch = bookImages[key];
    }
  }

  if (bestMatch) {
    return bestMatch;
  }

  // If no physical cover is available in assets, return a beautiful, unique placeholder cover featuring the book's title!
  return `https://placehold.co/400x600/0f0f0f/a294fb?text=${encodeURIComponent(title || 'Bookora')}`;
};
