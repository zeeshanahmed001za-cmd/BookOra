import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, ArrowUp, WifiOff } from 'lucide-react';
import './Home.css';

// Import Hero Images
import hero1 from '../assets/hero_slide_1.png';
import hero2 from '../assets/hero_slide_2.png';
import hero3 from '../assets/hero_slide_3.png';
import hero4 from '../assets/hero_slide_4.png';

// Helper: fetch via Vite proxy (avoids CORS/ad-blocker blocks in dev)
// Falls back to direct URL if proxy fails (e.g. in production)
const fetchGoogleBooks = async (query, maxResults = 20) => {
  const proxyUrl = `/api-google/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
  const directUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;

  // Try proxy first
  try {
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.items)) {
        console.log(`[Google Books] Proxy fetch OK for "${query}" — ${data.items.length} results`);
        return data.items;
      }
    }
    console.warn(`[Google Books] Proxy returned non-OK or empty items for "${query}", trying direct...`);
  } catch (proxyErr) {
    console.warn(`[Google Books] Proxy fetch failed for "${query}":`, proxyErr.message);
  }

  // Try direct URL as second attempt
  const res = await fetch(directUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const data = await res.json();
  if (!data || !Array.isArray(data.items)) throw new Error('Invalid response: no items array');
  console.log(`[Google Books] Direct fetch OK for "${query}" — ${data.items.length} results`);
  return data.items;
};

// Map a Google Books API item to our internal format
const mapGoogleBook = (item, index) => {
  const volumeInfo = item.volumeInfo || {};
  const saleInfo = item.saleInfo || {};

  const title = volumeInfo.title || 'Untitled Book';
  const author = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author';

  // Cover image — always upgrade to HTTPS
  let image = 'https://images.unsplash.com/photo-1543004218-2bc3500d970c?auto=format&fit=crop&q=80&w=400';
  if (volumeInfo.imageLinks) {
    const raw = volumeInfo.imageLinks.thumbnail || volumeInfo.imageLinks.smallThumbnail || '';
    image = raw.startsWith('http://') ? raw.replace('http://', 'https://') : raw || image;
  }

  // Price in Rupees
  let price = 250 + ((title.length + author.length) % 350);
  if (saleInfo.retailPrice?.amount) {
    price = saleInfo.retailPrice.currencyCode === 'INR'
      ? Math.round(saleInfo.retailPrice.amount)
      : Math.round(saleInfo.retailPrice.amount * 83);
  } else if (saleInfo.listPrice?.amount) {
    price = saleInfo.listPrice.currencyCode === 'INR'
      ? Math.round(saleInfo.listPrice.amount)
      : Math.round(saleInfo.listPrice.amount * 83);
  }

  return {
    id: item.id || `google-book-${index}`,
    title,
    author,
    price,
    image,
    description: volumeInfo.description || '',
    categories: volumeInfo.categories || [],
  };
};

// ─── Shimmer Skeleton ──────────────────────────────────────────────────────────
const ShimmerCarousel = () => (
  <div className="carousel-wrapper skeleton">
    <div className="carousel-container">
      <div className="carousel-track">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="book-item shimmer-item">
            <div className="book-cover-container shimmer-bg"></div>
            <div className="book-info">
              <div className="shimmer-line title shimmer-bg"></div>
              <div className="shimmer-line author shimmer-bg"></div>
              <div className="shimmer-line price shimmer-bg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Finite Book Carousel (no tripling, no infinite loop) ─────────────────────
const BookCarousel = ({ books }) => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasMoved = useRef(false);

  const handleArrowScroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.75;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    hasMoved.current = false;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftStart.current = containerRef.current.scrollLeft;
    containerRef.current.style.scrollSnapType = 'none';
    containerRef.current.style.scrollBehavior = 'auto';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 3) hasMoved.current = true;
    containerRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.style.scrollSnapType = 'x mandatory';
      containerRef.current.style.scrollBehavior = 'smooth';
    }
  };

  const handleItemClick = (e) => {
    if (hasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (!books.length) return null;

  return (
    <div className="carousel-wrapper">
      <button className="carousel-arrow left" onClick={() => handleArrowScroll('left')} aria-label="Scroll left">
        <ChevronLeft size={24} />
      </button>
      <button className="carousel-arrow right" onClick={() => handleArrowScroll('right')} aria-label="Scroll right">
        <ChevronRight size={24} />
      </button>

      <div
        className={`carousel-container ${isDragging ? 'dragging' : ''}`}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        <div className="carousel-track">
          {books.map((book, index) => (
            <div
              key={`${book.id}-${index}`}
              className="book-item"
              onClickCapture={handleItemClick}
            >
              <div className="book-cover-container">
                <img
                  src={book.image}
                  alt={book.title}
                  className="book-cover"
                  draggable="false"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1543004218-2bc3500d970c?auto=format&fit=crop&q=80&w=400';
                  }}
                />
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <span className="book-price">₹{book.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Home Component ────────────────────────────────────────────────────────────
const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScroll, setShowScroll] = useState(false);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bsLoading, setBsLoading] = useState(true);
  const [naLoading, setNaLoading] = useState(true);
  const [bsError, setBsError] = useState(null);
  const [naError, setNaError] = useState(null);

  const slides = [
    {
      id: 1,
      image: hero1,
      title: 'Discover Your Next',
      subtitle: 'Great Adventure',
      desc: 'Explore our curated collection of books from worldwide authors. From timeless classics to modern masterpieces.',
    },
    {
      id: 2,
      image: hero2,
      title: 'Lose Yourself in',
      subtitle: 'Epic Stories',
      desc: 'Immerse yourself in captivating narratives that transport you to different worlds and eras.',
    },
    {
      id: 3,
      image: hero3,
      title: 'The Ultimate',
      subtitle: 'Readers Paradise',
      desc: 'A luxury catalog of bestsellers and hidden gems waiting to be discovered on your bookshelves.',
    },
    {
      id: 4,
      image: hero4,
      title: 'Rare Classics &',
      subtitle: 'Timeless Wisdom',
      desc: 'Curated vintage editions and leather-bound masterpieces for the true bibliophile and collector.',
    },
  ];

  const paginate = (dir) => setCurrentSlide((prev) => (prev + dir + slides.length) % slides.length);
  const nextSlide = () => paginate(1);
  const prevSlide = () => paginate(-1);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  // Scroll-to-top button visibility
  useEffect(() => {
    const checkScroll = () => setShowScroll(window.pageYOffset > 400);
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToHero = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // ── Fetch Best Sellers (20 items via proxy) ──────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setBsLoading(true);
      setBsError(null);
      try {
        const items = await fetchGoogleBooks('subject:fiction+bestseller', 20);
        setBestSellers(items.map(mapGoogleBook));
      } catch (err) {
        console.error('[BestSellers] Fetch failed:', err);
        setBsError('Could not load Best Sellers. Check your internet connection and reload.');
      } finally {
        setBsLoading(false);
      }
    };
    load();
  }, []);

  // ── Fetch New Arrivals (20 items via proxy) ──────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setNaLoading(true);
      setNaError(null);
      try {
        const items = await fetchGoogleBooks('subject:fiction&orderBy=newest', 20);
        setNewArrivals(items.map(mapGoogleBook));
      } catch (err) {
        console.error('[NewArrivals] Fetch failed:', err);
        setNaError('Could not load New Arrivals. Check your internet connection and reload.');
      } finally {
        setNaLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="home-page">
      {/* Preload hero images */}
      <div style={{ display: 'none' }}>
        {slides.map((s) => <img key={s.id} src={s.image} alt="preload" />)}
      </div>

      {/* ── Hero Slider ─────────────────────────────────────────────────────── */}
      <section className="hero-slider" id="top">
        <motion.div
          className="hero-track"
          animate={{ x: `-${currentSlide * 25}%` }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, { offset }) => {
            if (offset.x < -100) nextSlide();
            else if (offset.x > 100) prevSlide();
          }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="slide">
              <div className="slide-image-container">
                <img src={slide.image} alt="Hero Banner" className="slide-image" loading="eager" />
                <div className="slide-overlay" />
              </div>
              <div className="hero-content">
                <h1>{slide.title} <br /> <span className="gradient-text">{slide.subtitle}</span></h1>
                <p>{slide.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <button className="slider-arrow left" onClick={prevSlide}><ChevronLeft size={24} /></button>
        <button className="slider-arrow right" onClick={nextSlide}><ChevronRight size={24} /></button>

        <div className="slider-pagination">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`pagination-dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* ── Best Sellers Section ─────────────────────────────────────────────── */}
      <section className="home-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span className="section-tag">Popular Now</span>
              <h2>BestSeller</h2>
            </div>
            <button className="view-all-btn">View All <ArrowRight size={16} /></button>
          </div>

          {bsLoading && <ShimmerCarousel />}

          {!bsLoading && bsError && (
            <div className="carousel-api-error">
              <WifiOff size={28} className="error-icon" />
              <p>{bsError}</p>
              <button
                className="retry-btn"
                onClick={() => {
                  setBsLoading(true);
                  fetchGoogleBooks('subject:fiction+bestseller', 20)
                    .then((items) => setBestSellers(items.map(mapGoogleBook)))
                    .catch((e) => setBsError(e.message))
                    .finally(() => setBsLoading(false));
                }}
              >
                Retry
              </button>
            </div>
          )}

          {!bsLoading && !bsError && <BookCarousel books={bestSellers} />}
        </div>
      </section>

      {/* ── New Arrivals Section ─────────────────────────────────────────────── */}
      <section className="home-section alt-bg">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span className="section-tag">Freshly Added</span>
              <h2>NewArrival</h2>
            </div>
            <button className="view-all-btn">Discover More <ArrowRight size={16} /></button>
          </div>

          {naLoading && <ShimmerCarousel />}

          {!naLoading && naError && (
            <div className="carousel-api-error">
              <WifiOff size={28} className="error-icon" />
              <p>{naError}</p>
              <button
                className="retry-btn"
                onClick={() => {
                  setNaLoading(true);
                  fetchGoogleBooks('subject:fiction&orderBy=newest', 20)
                    .then((items) => setNewArrivals(items.map(mapGoogleBook)))
                    .catch((e) => setNaError(e.message))
                    .finally(() => setNaLoading(false));
                }}
              >
                Retry
              </button>
            </div>
          )}

          {!naLoading && !naError && <BookCarousel books={newArrivals} />}
        </div>
      </section>

      {/* ── Scroll to Top ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            className="scroll-to-top"
            onClick={scrollToHero}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
