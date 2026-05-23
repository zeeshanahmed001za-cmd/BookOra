import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, ShoppingBag, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import './Home.css';

// Import Hero Images
import hero1 from '../assets/hero_slide_1.png';
import hero2 from '../assets/hero_slide_2.png';
import hero3 from '../assets/hero_slide_3.png';
import hero4 from '../assets/hero_slide_4.png';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScroll, setShowScroll] = useState(false);

  const slides = [
    {
      id: 1,
      image: hero1,
      title: 'Discover Your Next',
      subtitle: 'Great Adventure',
      desc: 'Explore our curated collection of books from worldwide authors. From timeless classics to modern masterpieces.'
    },
    {
      id: 2,
      image: hero2,
      title: 'Lose Yourself in',
      subtitle: 'Epic Stories',
      desc: 'Immerse yourself in captivating narratives that transport you to different worlds and eras.'
    },
    {
      id: 3,
      image: hero3,
      title: 'The Ultimate',
      subtitle: 'Readers Paradise',
      desc: 'A luxury catalog of bestsellers and hidden gems waiting to be discovered on your bookshelves.'
    },
    {
      id: 4,
      image: hero4,
      title: 'Rare Classics &',
      subtitle: 'Timeless Wisdom',
      desc: 'Curated vintage editions and leather-bound masterpieces for the true bibliophile and collector.'
    }
  ];

  const paginate = (newDirection) => {
    setCurrentSlide((prev) => (prev + newDirection + slides.length) % slides.length);
  };

  const nextSlide = () => paginate(1);
  const prevSlide = () => paginate(-1);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  // Scroll logic for floating button
  useEffect(() => {
    const checkScroll = () => {
      if (window.pageYOffset > 400) setShowScroll(true);
      else setShowScroll(false);
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const bestSellers = [
    { id: 101, title: 'The Midnight Library', author: 'Matt Haig', price: 24.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400' },
    { id: 102, title: 'Project Hail Mary', author: 'Andy Weir', price: 29.99, rating: 4.9, image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=400' },
    { id: 103, title: 'Circe', author: 'Madeline Miller', price: 21.50, rating: 4.7, image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400' },
    { id: 104, title: 'Atomic Habits', author: 'James Clear', price: 18.99, rating: 5.0, image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400' },
  ];

  const newArrivals = [
    { id: 201, title: 'The Silent Patient', author: 'Alex Michaelides', price: 22.00, rating: 4.6, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400' },
    { id: 202, title: 'Educated', author: 'Tara Westover', price: 26.50, rating: 4.8, image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=400' },
    { id: 203, title: 'Becoming', author: 'Michelle Obama', price: 32.00, rating: 4.9, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400' },
    { id: 204, title: 'The Alchemist', author: 'Paulo Coelho', price: 15.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1543004218-2bc3500d970c?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="home-page">
      {/* Hero Slider Section */}
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

        {/* Slider Controls */}
        <button className="slider-arrow left" onClick={prevSlide}><ChevronLeft size={24} /></button>
        <button className="slider-arrow right" onClick={nextSlide}><ChevronRight size={24} /></button>

        <div className="slider-pagination">
          {slides.map((_, index) => (
            <button key={index} className={`pagination-dot ${currentSlide === index ? 'active' : ''}`} onClick={() => setCurrentSlide(index)} />
          ))}
        </div>
      </section>

      {/* Section 2: Best Sellers */}
      <section className="home-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span className="section-tag">Popular Now</span>
              <h2>BEST <span className="gradient-text">SELLERS</span></h2>
            </div>
            <button className="view-all-btn">View All <ArrowRight size={16} /></button>
          </div>
          <div className="books-grid-layout">
            {bestSellers.map((book) => (
              <div key={book.id} className="book-item premium-card">
                <div className="book-media">
                  <img src={book.image} alt={book.title} />
                  <div className="card-actions">
                    <button className="action-circle"><ShoppingBag size={18} /></button>
                  </div>
                </div>
                <div className="book-details">
                  <div className="book-meta">
                    <span className="rating-tag"><Star size={12} fill="currentColor" /> {book.rating}</span>
                    <span className="price-tag">${book.price}</span>
                  </div>
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Shop New Arrivals */}
      <section className="home-section alt-bg">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span className="section-tag">Freshly Added</span>
              <h2>SHOP <span className="gradient-text">NEW ARRIVALS</span></h2>
            </div>
            <button className="view-all-btn">Discover More <ArrowRight size={16} /></button>
          </div>
          <div className="books-grid-layout">
            {newArrivals.map((book) => (
              <div key={book.id} className="book-item premium-card">
                <div className="book-media">
                  <img src={book.image} alt={book.title} />
                  <div className="card-badge">New</div>
                </div>
                <div className="book-details">
                  <div className="book-meta">
                    <span className="rating-tag"><Star size={12} fill="currentColor" /> {book.rating}</span>
                    <span className="price-tag">${book.price}</span>
                  </div>
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Scroll to Top Button */}
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
