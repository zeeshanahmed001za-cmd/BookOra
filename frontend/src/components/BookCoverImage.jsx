import { useState, useEffect } from 'react';
import { FALLBACK_COVER, FALLBACK_SVG } from '../services/openLibrary';

/**
 * BookCoverImage — renders an Open Library cover with progressive fallback:
 * 1. Attempts the provided cover URL (lazy-loaded).
 * 2. If it fails, falls back to the Unsplash FALLBACK_COVER image.
 * 3. If that also fails, falls back to the local inline FALLBACK_SVG (guarantees zero broken icons).
 *
 * Shows an embedded shimmer skeleton and fades the image in smoothly upon load to prevent CLS.
 */
const BookCoverImage = ({ src, alt, className = '' }) => {
  const [loaded, setLoaded] = useState(false);
  const [errorCount, setErrorCount] = useState(() => (src ? 0 : 1));

  // Reset loading and error states when src changes
  useEffect(() => {
    setLoaded(false);
    setErrorCount(src ? 0 : 1);
  }, [src]);

  // Determine current image source based on error progression
  let imgSrc = src;
  if (!src) {
    imgSrc = FALLBACK_COVER;
  } else if (errorCount === 1) {
    imgSrc = FALLBACK_COVER;
  } else if (errorCount >= 2) {
    imgSrc = FALLBACK_SVG;
  }

  return (
    <div className="relative w-full h-full bg-bg-elevated overflow-hidden">
      {!loaded && <div className="absolute top-0 left-0 w-full h-full z-[1] shimmer-bg" />}
      <img
        src={imgSrc}
        alt={alt || 'Book cover'}
        className={`w-full h-full object-cover block transition-[opacity,transform] duration-500 ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        loading="lazy"
        draggable="false"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setErrorCount(prev => prev + 1);
          setLoaded(false); // force loading shimmer state for the new fallback image
        }}
      />
    </div>
  );
};

export default BookCoverImage;
