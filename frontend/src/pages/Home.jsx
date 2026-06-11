import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, ArrowUp, AlertCircle, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import OptimizedBookCover from '../components/OptimizedBookCover';

// Import Hero Images
import hero1 from '../assets/hero_slide_1.png';
import hero2 from '../assets/hero_slide_2.png';
import hero3 from '../assets/hero_slide_3.png';
import hero4 from '../assets/hero_slide_4.png';

// ─── Book Carousel ────────────────────────────────────────────────────────────
const BookCarousel = ({ books }) => {
  const containerRef     = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX           = useRef(0);
  const scrollLeftStart  = useRef(0);
  const hasMoved         = useRef(false);

  const { toggleWishlist, isWishlisted, setSelectedBook } = useWishlist();

  const handleArrowScroll = (direction) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction === 'left'
          ? -containerRef.current.clientWidth * 0.75
          :  containerRef.current.clientWidth * 0.75,
        background: 'smooth',
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
    const x    = e.pageX - containerRef.current.offsetLeft;
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
    if (hasMoved.current) { e.preventDefault(); e.stopPropagation(); }
  };

  if (!books.length) return null;

  return (
    <div className="relative w-full px-10">
      <button className="absolute top-[150px] -translate-y-1/2 w-11 h-11 rounded-full bg-[#1e1e1e]/80 border border-white/15 text-white flex items-center justify-center cursor-pointer z-10 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md hover:bg-accent-primary hover:border-accent-primary hover:scale-110 hover:shadow-[0_0_15px_rgba(162,148,251,0.5)] left-[-12px]" onClick={() => handleArrowScroll('left')} aria-label="Scroll left">
        <ChevronLeft size={24} />
      </button>
      <button className="absolute top-[150px] -translate-y-1/2 w-11 h-11 rounded-full bg-[#1e1e1e]/80 border border-white/15 text-white flex items-center justify-center cursor-pointer z-10 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md hover:bg-accent-primary hover:border-accent-primary hover:scale-110 hover:shadow-[0_0_15px_rgba(162,148,251,0.5)] right-[-12px]" onClick={() => handleArrowScroll('right')} aria-label="Scroll right">
        <ChevronRight size={24} />
      </button>

      <div
        className={`w-full overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory py-2.5 pb-5 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        <div className="flex gap-6 xl:gap-[calc((100%-995px)/4)]">
          {books.map((book, idx) => {
            const wishlisted = isWishlisted(book.id);
            return (
              <div
                key={book.id}
                className="group w-[199px] shrink-0 snap-start flex flex-col bg-none border-none p-0 rounded-none shadow-none transition-transform duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:-translate-y-2 select-none"
                onClickCapture={handleItemClick}
                onClick={() => setSelectedBook(book)}
                style={{ cursor: 'pointer' }}
              >
                <div className="w-[199px] h-[298px] overflow-hidden rounded-lg shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition-all duration-300 bg-[#121212] relative group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.6),_0_0_20px_rgba(162,148,251,0.3)] group-hover:scale-[1.02]">
                  <OptimizedBookCover
                    coverId={book.coverId}
                    src={book.cover}
                    alt={book.title}
                    priority={idx < 3}
                  />
                  {book.isBestseller && (
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider bg-accent-gradient text-white pointer-events-none z-[2] shadow-[0_2px_8px_rgba(0,0,0,0.3)]">Bestseller</span>
                  )}
                  <button
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/75 backdrop-blur-md border border-white/10 flex items-center justify-center text-text-secondary cursor-pointer z-[5] transition-all duration-200 opacity-100 md:opacity-0 md:scale-75 group-hover:opacity-100 group-hover:scale-100 hover:bg-pink-500 hover:text-white hover:border-pink-500 hover:scale-110 hover:shadow-[0_0_12px_rgba(255,77,109,0.4)] ${
                      wishlisted ? 'opacity-100! scale-100! text-pink-500 bg-pink-500/10 border-pink-500/30' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(book);
                    }}
                    aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="text-left p-0 mt-[1.2rem]">
                  <h3 className="text-[1.05rem] font-semibold text-text-primary mb-1 truncate leading-snug">{book.title}</h3>
                  <p  className="text-[0.85rem] text-text-secondary mb-2 truncate">{book.author}</p>
                  <span className="text-[1.1rem] font-bold text-accent-primary block">₹{book.price.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Carousel Shimmer Skeleton ────────────────────────────────────────────────
const CarouselSkeleton = () => (
  <div className="relative w-full px-10">
    <div className="w-full overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory py-2.5 pb-5">
      <div className="flex gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-[199px] shrink-0 snap-start flex flex-col bg-none border-none p-0 rounded-none shadow-none pointer-events-none">
            <div className="w-[199px] h-[298px] overflow-hidden rounded-lg bg-[#151515] relative shimmer-bg" />
            <div className="text-left p-0 mt-[1.2rem]">
              <div className="h-4 rounded bg-[#151515] w-[80%] mb-2 shimmer-bg" />
              <div className="h-3 rounded bg-[#151515] w-[50%] mb-2 shimmer-bg" />
              <div className="h-3.5 rounded bg-[#151515] w-[30%] mb-2 shimmer-bg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Carousel Error Notice ────────────────────────────────────────────────────
const CarouselError = ({ message, onRetry }) => (
  <div className="flex flex-col items-center gap-3.5 p-12 px-8 bg-red-500/4 border border-dashed border-red-500/20 rounded-xl my-2 mb-6 text-center">
    <AlertCircle className="text-red-500/60" size={32} />
    <p className="text-text-secondary text-[0.95rem] max-w-[460px] leading-relaxed m-0">{message}</p>
    <button className="py-2 px-6 rounded-lg border border-accent-primary/30 bg-accent-primary/8 text-accent-primary text-[0.875rem] font-semibold cursor-pointer transition-all duration-250 hover:bg-accent-primary hover:border-accent-primary hover:text-white hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(162,148,251,0.35)]" onClick={onRetry}>Retry Loading</button>
  </div>
);

// ─── Home Component ───────────────────────────────────────────────────────────
const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScroll,   setShowScroll]   = useState(false);
  const navigate = useNavigate();

  // API states
  const [bestSellers, setBestSellers] = useState([]);
  const [fictionBooks, setFictionBooks] = useState([]);
  const [selfHelpBooks, setSelfHelpBooks] = useState([]);
  const [sciFiBooks, setSciFiBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  const slides = [
    { id: 1, image: hero1, title: 'Discover Your Next',  subtitle: 'Great Adventure',   desc: 'Explore our curated collection of books from worldwide authors. From timeless classics to modern masterpieces.' },
    { id: 2, image: hero2, title: 'Lose Yourself in',    subtitle: 'Epic Stories',       desc: 'Immerse yourself in captivating narratives that transport you to different worlds and eras.' },
    { id: 3, image: hero3, imagePath: hero3, title: 'The Ultimate',         subtitle: 'Readers Paradise',   desc: 'A luxury catalog of bestsellers and hidden gems waiting to be discovered on your bookshelves.' },
    { id: 4, image: hero4, imagePath: hero4, title: 'Rare Classics &',     subtitle: 'Timeless Wisdom',    desc: 'Curated vintage editions and leather-bound masterpieces for the true bibliophile and collector.' },
  ];

  const paginate   = (dir) => setCurrentSlide((prev) => (prev + dir + slides.length) % slides.length);
  const nextSlide  = () => paginate(1);
  const prevSlide  = () => paginate(-1);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Scroll-to-top button
  useEffect(() => {
    const onScroll = () => {
      setShowScroll(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch home sections from local Express backend
  useEffect(() => {
    let isMounted = true;

    const fetchHomeBooks = async () => {
      setLoading(true);
      setError(null);

      const fetchSection = async (urlSuffix, setter) => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/books?${urlSuffix}`);
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);
          const data = await res.json();
          const rawBooks = data.data?.books || [];
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
          if (isMounted) {
            setter(normalized);
          }
        } catch (err) {
          console.error(`Error fetching home section '${urlSuffix}':`, err);
        }
      };

      try {
        await Promise.all([
          fetchSection('limit=12&isBestseller=true', setBestSellers),
          fetchSection('limit=12&category=Fiction', setFictionBooks),
          fetchSection('limit=12&category=Self Help', setSelfHelpBooks),
          fetchSection('limit=12&category=Sci-Fi', setSciFiBooks)
        ]);
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching home library data:', err);
          setError('Failed to retrieve book collections. Please check your connection.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHomeBooks();

    return () => {
      isMounted = false;
    };
  }, [retryTrigger]);

  const scrollToHero = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Navigation handlers for Section "View All" buttons
  const navigateToCategory = (category) => {
    navigate(`/books?genre=${encodeURIComponent(category)}`);
  };

  const navigateToBestsellers = () => {
    navigate('/books?badge=Bestseller');
  };

  const handleRetry = () => {
    setRetryTrigger(prev => prev + 1);
  };

  return (
    <div className="w-full">
      {/* Preload hero images */}
      <div style={{ display: 'none' }}>
        <img src={hero1} alt="preload" />
        <img src={hero2} alt="preload" />
        <img src={hero3} alt="preload" />
        <img src={hero4} alt="preload" />
      </div>

      {/* ── Hero Slider ──────────────────────────────────────────────────────── */}
      <section className="h-[300px] md:h-[500px] w-full max-w-[1520px] mx-auto mb-5 relative overflow-hidden bg-bg-card" id="top">
        <motion.div
          className="flex h-full w-[400%] cursor-grab active:cursor-grabbing [will-change:transform] [backface-visibility:hidden] [transform-style:preserve-3d]"
          animate={{ x: `-${currentSlide * 25}%` }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, { offset }) => {
            if (offset.x < -100) nextSlide();
            else if (offset.x > 100) prevSlide();
          }}
        >
          {slides.map((slide, idx) => (
            <div key={slide.id} className="h-full w-1/4 min-w-[25%] shrink-0 flex items-center justify-center relative">
              <div className="absolute inset-0 z-0">
                <img 
                  src={idx === 2 ? hero3 : idx === 3 ? hero4 : slide.image} 
                  alt="Hero Banner" 
                  className="w-full h-full object-cover" 
                  loading="eager" 
                />
                <div className="absolute inset-0 bg-black/40 bg-[radial-gradient(circle,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.8)_100%)] z-[1]" />
              </div>
              <div className="relative z-10 max-w-[900px] text-center px-10">
                <h1 className="text-3xl md:text-[4rem] font-bold leading-tight md:leading-[1.1] mb-5">{slide.title} <br /> <span className="gradient-text">{slide.subtitle}</span></h1>
                <p className="text-base md:text-[1.2rem] text-text-secondary mx-auto mb-6 max-w-[650px]">{slide.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <button className="absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white flex items-center justify-center z-20 transition-all duration-300 hover:bg-accent-primary hover:border-accent-primary hover:scale-110 left-[30px]" onClick={prevSlide}><ChevronLeft size={24} /></button>
        <button className="absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white flex items-center justify-center z-20 transition-all duration-300 hover:bg-accent-primary hover:border-accent-primary hover:scale-110 right-[30px]" onClick={nextSlide}><ChevronRight size={24} /></button>

        <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full cursor-pointer bg-white/20 transition-all duration-300 ${currentSlide === index ? 'w-8 bg-accent-primary' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* ── Section 1: Best Sellers ─────────────────────────────────────────── */}
      <section className="py-10 pb-16 bg-[#0d0d0d]">
        <div className="max-w-[1490px] mx-auto px-5 md:px-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="block text-[0.75rem] font-extrabold uppercase tracking-widest text-accent-primary mb-3">Popular Now</span>
              <h2 className="text-3xl md:text-[2.5rem] font-extrabold tracking-tight text-white">Bestsellers</h2>
            </div>
            <button className="bg-white/3 border border-white/8 py-2.5 px-5 rounded-lg text-white font-semibold text-[0.9rem] flex items-center gap-2.5 cursor-pointer transition-all duration-250 hover:bg-accent-primary hover:border-accent-primary hover:translate-x-1" onClick={navigateToBestsellers}>View All <ArrowRight size={16} /></button>
          </div>

          {bestSellers.length === 0 && loading ? (
            <CarouselSkeleton />
          ) : error && bestSellers.length === 0 ? (
            <CarouselError message={error} onRetry={handleRetry} />
          ) : (
            <BookCarousel books={bestSellers} />
          )}
        </div>
      </section>

      {/* ── Section 2: Fiction ─────────────────────────────────────────────── */}
      <section className="py-10 pb-16 bg-[#0a0a0a]">
        <div className="max-w-[1490px] mx-auto px-5 md:px-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="block text-[0.75rem] font-extrabold uppercase tracking-widest text-accent-primary mb-3">Top Literary Works</span>
              <h2 className="text-3xl md:text-[2.5rem] font-extrabold tracking-tight text-white">Fiction Collection</h2>
            </div>
            <button className="bg-white/3 border border-white/8 py-2.5 px-5 rounded-lg text-white font-semibold text-[0.9rem] flex items-center gap-2.5 cursor-pointer transition-all duration-250 hover:bg-accent-primary hover:border-accent-primary hover:translate-x-1" onClick={() => navigateToCategory('Fiction')}>Browse Fiction <ArrowRight size={16} /></button>
          </div>

          {fictionBooks.length === 0 && loading ? (
            <CarouselSkeleton />
          ) : error && fictionBooks.length === 0 ? (
            <CarouselError message={error} onRetry={handleRetry} />
          ) : (
            <BookCarousel books={fictionBooks} />
          )}
        </div>
      </section>

      {/* ── Section 3: Self Help ───────────────────────────────────────────── */}
      <section className="py-10 pb-16 bg-[#0d0d0d]">
        <div className="max-w-[1490px] mx-auto px-5 md:px-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="block text-[0.75rem] font-extrabold uppercase tracking-widest text-accent-primary mb-3">Personal Growth & Habits</span>
              <h2 className="text-3xl md:text-[2.5rem] font-extrabold tracking-tight text-white">Self Help Masterpieces</h2>
            </div>
            <button className="bg-white/3 border border-white/8 py-2.5 px-5 rounded-lg text-white font-semibold text-[0.9rem] flex items-center gap-2.5 cursor-pointer transition-all duration-250 hover:bg-accent-primary hover:border-accent-primary hover:translate-x-1" onClick={() => navigateToCategory('Self Help')}>Explore Growth <ArrowRight size={16} /></button>
          </div>

          {selfHelpBooks.length === 0 && loading ? (
            <CarouselSkeleton />
          ) : error && selfHelpBooks.length === 0 ? (
            <CarouselError message={error} onRetry={handleRetry} />
          ) : (
            <BookCarousel books={selfHelpBooks} />
          )}
        </div>
      </section>

      {/* ── Section 4: Sci-Fi ──────────────────────────────────────────────── */}
      <section className="py-10 pb-16 bg-[#0a0a0a]">
        <div className="max-w-[1490px] mx-auto px-5 md:px-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="block text-[0.75rem] font-extrabold uppercase tracking-widest text-accent-primary mb-3">Science Fiction & Cosmic Ocean</span>
              <h2 className="text-3xl md:text-[2.5rem] font-extrabold tracking-tight text-white">Sci-Fi Selection</h2>
            </div>
            <button className="bg-white/3 border border-white/8 py-2.5 px-5 rounded-lg text-white font-semibold text-[0.9rem] flex items-center gap-2.5 cursor-pointer transition-all duration-250 hover:bg-accent-primary hover:border-accent-primary hover:translate-x-1" onClick={() => navigateToCategory('Sci-Fi')}>Discover Sci-Fi <ArrowRight size={16} /></button>
          </div>

          {sciFiBooks.length === 0 && loading ? (
            <CarouselSkeleton />
          ) : error && sciFiBooks.length === 0 ? (
            <CarouselError message={error} onRetry={handleRetry} />
          ) : (
            <BookCarousel books={sciFiBooks} />
          )}
        </div>
      </section>

      {/* ── Scroll to Top ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            className="fixed bottom-5 right-5 md:bottom-10 md:right-10 w-12 h-12 md:w-14 md:h-14 bg-accent-primary text-white border border-white/10 rounded-full flex items-center justify-center cursor-pointer z-[999] shadow-[0_8px_30px_rgba(162,148,251,0.4)] backdrop-blur-md hover:bg-[#a294fb]"
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
