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
  // Construct the primary high-res URL based on coverId or direct src prop
  const highResUrl = coverId ? buildCoverUrl(coverId, size) : src;
  
  // Construct progressive low-res URL if coverId is available (size S is extremely small ~1-2KB)
  const lowResUrl = coverId ? buildCoverUrl(coverId, 'S') : null;

  // Initialize status: if already in cache, skip loading states and show immediately
  const isAlreadyLoaded = highResUrl && loadedImageCache.has(highResUrl);
  
  const [status, setStatus] = useState(() => {
    if (!highResUrl) return 'error'; // Go directly to fallback if no url
    return isAlreadyLoaded ? 'loaded' : 'loading';
  });

  const [progLoaded, setProgLoaded] = useState(false);
  const [fallbackStep, setFallbackStep] = useState(0);

  // Sync state if source URLs change
  useEffect(() => {
    const nextUrl = coverId ? buildCoverUrl(coverId, size) : src;
    if (!nextUrl) {
      setStatus('error');
      setFallbackStep(2); // directly fallback to SVG
    } else if (loadedImageCache.has(nextUrl)) {
      setStatus('loaded');
      setFallbackStep(0);
    } else {
      setStatus('loading');
      setProgLoaded(false);
      setFallbackStep(0);
    }
  }, [coverId, src, size]);

  // Determine current image source based on load state and error progression
  let currentSrc = highResUrl;

  if (status === 'error') {
    if (fallbackStep === 1) {
      currentSrc = FALLBACK_COVER;
    } else {
      currentSrc = FALLBACK_SVG;
    }
  }

  const handleHighResLoad = () => {
    if (highResUrl) {
      loadedImageCache.add(highResUrl);
    }
    setStatus('loaded');
  };

  const handleHighResError = () => {
    if (fallbackStep === 0) {
      setFallbackStep(1);
      setStatus('error');
    } else if (fallbackStep === 1) {
      setFallbackStep(2);
    }
  };

  const showShimmer = status === 'loading' && !progLoaded;

  return (
    <div className={`relative w-full h-full bg-bg-elevated overflow-hidden block ${className}`}>
      {/* 1. Shimmer skeleton placeholder */}
      {showShimmer && <div className="absolute top-0 left-0 w-full h-full z-10 shimmer-bg" />}

      {/* 2. Progressive Low-Res blurry image (size S) */}
      {status === 'loading' && lowResUrl && (
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

      {/* 3. High-Res target image */}
      <img
        src={currentSrc}
        alt={alt}
        className={`absolute top-0 left-0 w-full h-full object-cover z-30 block ${
          status === 'loaded' ? 'opacity-100 animate-fade-cover' : 'opacity-0'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        draggable="false"
        onLoad={handleHighResLoad}
        onError={handleHighResError}
      />
    </div>
  );
};

// Memoize component to avoid unnecessary re-renders in large grids and carousels
export default React.memo(OptimizedBookCover);
