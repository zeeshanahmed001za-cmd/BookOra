import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import booksData from '../data/books.json';
import { matchBookCover, fallbackImage } from '../utils/bookImages';
import './Home.css';

// Import Hero Images
import hero1 from '../assets/hero_slide_1.png';
import hero2 from '../assets/hero_slide_2.png';
import hero3 from '../assets/hero_slide_3.png';
import hero4 from '../assets/hero_slide_4.png';

// ─── Book Carousel (finite, no duplication, drag-to-scroll) ───────────────────
const BookCarousel = ({ books }) => {
  const containerRef     = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX           = useRef(0);
  const scrollLeftStart  = useRef(0);
  const hasMoved         = useRef(false);

  const handleArrowScroll = (direction) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction === 'left'
          ? -containerRef.current.clientWidth * 0.75
          :  containerRef.current.clientWidth * 0.75,
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
    <div className="carousel-wrapper">
      <button className="carousel-arrow left"  onClick={() => handleArrowScroll('left')}  aria-label="Scroll left">  <ChevronLeft  size={24} /></button>
      <button className="carousel-arrow right" onClick={() => handleArrowScroll('right')} aria-label="Scroll right"><ChevronRight size={24} /></button>

      <div
        className={`carousel-container ${isDragging ? 'dragging' : ''}`}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        <div className="carousel-track">
          {books.map((book) => (
            <div
              key={book.id}
              className="book-item"
              onClickCapture={handleItemClick}
            >
              <div className="book-cover-container">
                <img
                  src={matchBookCover(book.cover, book.title) || fallbackImage}
                  alt={book.title}
                  className="book-cover"
                  draggable="false"
                  onError={(e) => {
                    e.target.src = fallbackImage;
                  }}
                />
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p  className="book-author">{book.author}</p>
                <span className="book-price">₹{book.price.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Home Component ───────────────────────────────────────────────────────────
const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScroll,   setShowScroll]   = useState(false);
  const navigate = useNavigate();

  // Curated category datasets — strictly filtered with zero duplicates
  const bestSellers = booksData.filter(book => book.isBestseller).slice(0, 15);
  const fictionBooks = booksData.filter(book => book.category === 'Fiction').slice(0, 15);
  const selfHelpBooks = booksData.filter(book => book.category === 'Self Help').slice(0, 15);
  const sciFiBooks = booksData.filter(book => book.category === 'Sci-Fi').slice(0, 15);

  const slides = [
    { id: 1, image: hero1, title: 'Discover Your Next',  subtitle: 'Great Adventure',   desc: 'Explore our curated collection of books from worldwide authors. From timeless classics to modern masterpieces.' },
    { id: 2, image: hero2, title: 'Lose Yourself in',    subtitle: 'Epic Stories',       desc: 'Immerse yourself in captivating narratives that transport you to different worlds and eras.' },
    { id: 3, image: image => hero3, imagePath: hero3, title: 'The Ultimate',         subtitle: 'Readers Paradise',   desc: 'A luxury catalog of bestsellers and hidden gems waiting to be discovered on your bookshelves.' },
    { id: 4, image: image => hero4, imagePath: hero4, title: 'Rare Classics &',     subtitle: 'Timeless Wisdom',    desc: 'Curated vintage editions and leather-bound masterpieces for the true bibliophile and collector.' },
  ];

  const paginate   = (dir) => setCurrentSlide((prev) => (prev + dir + slides.length) % slides.length);
  const nextSlide  = () => paginate(1);
  const prevSlide  = () => paginate(-1);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  // Scroll-to-top button
  useEffect(() => {
    const onScroll = () => {
      setShowScroll(window.pageYOffset > 400);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToHero = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Navigation handlers for Section "View All" buttons
  const navigateToCategory = (category) => {
    navigate(`/books?genre=${encodeURIComponent(category)}`);
  };

  const navigateToBestsellers = () => {
    navigate('/books?badge=Bestseller');
  };

  return (
    <div className="home-page">
      {/* Preload hero images */}
      <div style={{ display: 'none' }}>
        <img src={hero1} alt="preload" />
        <img src={hero2} alt="preload" />
        <img src={hero3} alt="preload" />
        <img src={hero4} alt="preload" />
      </div>

      {/* ── Hero Slider ──────────────────────────────────────────────────────── */}
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
          {slides.map((slide, idx) => (
            <div key={slide.id} className="slide">
              <div className="slide-image-container">
                <img 
                  src={idx === 2 ? hero3 : idx === 3 ? hero4 : slide.image} 
                  alt="Hero Banner" 
                  className="slide-image" 
                  loading="eager" 
                />
                <div className="slide-overlay" />
              </div>
              <div className="hero-content">
                <h1>{slide.title} <br /> <span className="gradient-text">{slide.subtitle}</span></h1>
                <p>{slide.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <button className="slider-arrow left"  onClick={prevSlide}><ChevronLeft  size={24} /></button>
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

      {/* ── Section 1: Best Sellers ─────────────────────────────────────────── */}
      <section className="home-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span className="section-tag">Popular Now</span>
              <h2>Bestsellers</h2>
            </div>
            <button className="view-all-btn" onClick={navigateToBestsellers}>View All <ArrowRight size={16} /></button>
          </div>

          <BookCarousel books={bestSellers} />
        </div>
      </section>

      {/* ── Section 2: Fiction ─────────────────────────────────────────────── */}
      <section className="home-section alt-bg">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span className="section-tag">Top Literary Works</span>
              <h2>Fiction Collection</h2>
            </div>
            <button className="view-all-btn" onClick={() => navigateToCategory('Fiction')}>Browse Fiction <ArrowRight size={16} /></button>
          </div>

          <BookCarousel books={fictionBooks} />
        </div>
      </section>

      {/* ── Section 3: Self Help ───────────────────────────────────────────── */}
      <section className="home-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span className="section-tag">Personal Growth & Habits</span>
              <h2>Self Help Masterpieces</h2>
            </div>
            <button className="view-all-btn" onClick={() => navigateToCategory('Self Help')}>Explore Growth <ArrowRight size={16} /></button>
          </div>

          <BookCarousel books={selfHelpBooks} />
        </div>
      </section>

      {/* ── Section 4: Sci-Fi ──────────────────────────────────────────────── */}
      <section className="home-section alt-bg">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span className="section-tag">Science Fiction & Cosmic Ocean</span>
              <h2>Sci-Fi Selection</h2>
            </div>
            <button className="view-all-btn" onClick={() => navigateToCategory('Sci-Fi')}>Discover Sci-Fi <ArrowRight size={16} /></button>
          </div>

          <BookCarousel books={sciFiBooks} />
        </div>
      </section>

      {/* ── Scroll to Top ─────────────────────────────────────────────────────── */}
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
