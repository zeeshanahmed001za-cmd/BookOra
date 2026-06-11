import React, { useState, useEffect } from 'react';
import { FALLBACK_COVER, FALLBACK_SVG, buildCoverUrl } from '../services/openLibrary';

// Global session cache for loaded image URLs to prevent flashes during navigation
const loadedImageCache = new Set();

/**
 * OptimizedBookCover
 * Renders optimized book cover image with progressive loading, preloading priority,
 * global caching, layout shift protection, and error fallback chains.
 */
const OptimizedBookCover = ({
  coverId = null,
  src = null,
  size = 'M',
  alt = 'Book cover',
  priority = false,
  className = '',
}) => {
  const primaryUrl = coverId ? buildCoverUrl(coverId, size) : src;
  const lowResUrl = coverId ? buildCoverUrl(coverId, 'S') : null;

  const [currentSrc, setCurrentSrc] = useState(primaryUrl || FALLBACK_COVER);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [progLoaded, setProgLoaded] = useState(false);

  // Sync state if source props change
  useEffect(() => {
    const nextUrl = coverId ? buildCoverUrl(coverId, size) : src;
    setCurrentSrc(nextUrl || FALLBACK_COVER);
    setLoading(true);
    setError(false);
    setProgLoaded(false);
  }, [coverId, src, size]);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    if (currentSrc === primaryUrl) {
      setCurrentSrc(FALLBACK_COVER);
    } else if (currentSrc === FALLBACK_COVER) {
      setCurrentSrc(FALLBACK_SVG);
      setError(true);
      setLoading(false);
    } else {
      setError(true);
      setLoading(false);
    }
  };

  const showShimmer = loading && !progLoaded;

  return (
    <div className={`relative w-full h-full bg-bg-elevated overflow-hidden block ${className}`}>
      {/* 1. Shimmer skeleton placeholder */}
      {showShimmer && <div className="absolute top-0 left-0 w-full h-full z-10 shimmer-bg" />}

      {/* 2. Progressive Low-Res blurry image (size S) */}
      {loading && lowResUrl && currentSrc === primaryUrl && (
        <img
          src={lowResUrl}
          alt=""
          className={`absolute top-0 left-0 w-full h-full object-cover blur-[6px] scale-105 transition-opacity duration-250 ease-out z-20 pointer-events-none ${
            progLoaded ? 'opacity-[0.85]' : 'opacity-0'
          }`}
          loading="eager"
          draggable="false"
          onLoad={() => setProgLoaded(true)}
        />
      )}

      {/* 3. Main target image */}
      <img
        src={currentSrc}
        alt={alt}
        className={`absolute top-0 left-0 w-full h-full object-cover z-30 block transition-opacity duration-350 ease-out ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        draggable="false"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

// Memoize component to avoid unnecessary re-renders in large grids and carousels
export default React.memo(OptimizedBookCover);
