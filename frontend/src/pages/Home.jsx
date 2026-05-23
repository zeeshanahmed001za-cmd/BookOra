import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import './Home.css';

// Import Hero Images
import hero1 from '../assets/hero_slide_1.png';
import hero2 from '../assets/hero_slide_2.png';
import hero3 from '../assets/hero_slide_3.png';
import hero4 from '../assets/hero_slide_4.png';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

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
    setDirection(newDirection);
    setCurrentSlide((prev) => (prev + newDirection + slides.length) % slides.length);
  };

  const nextSlide = () => paginate(1);
  const prevSlide = () => paginate(-1);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const categories = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Children'];
  
  const sampleBooks = [
    { id: 1, title: 'The Midnight Library', author: 'Matt Haig', price: 24.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400' },
    { id: 2, title: 'Project Hail Mary', author: 'Andy Weir', price: 29.99, rating: 4.9, image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=400' },
    { id: 3, title: 'Circe', author: 'Madeline Miller', price: 21.50, rating: 4.7, image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400' },
  ];

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1 // Keep visible
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 1 // Keep visible
    })
  };

  return (
    <div className="home-page">
      {/* Hero Slider Section */}
      <section className="hero-slider">
        <motion.div 
          className="hero-track"
          animate={{ x: `-${currentSlide * 25}%` }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }} // smooth ease-out, no bounce
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
                <img 
                  src={slide.image} 
                  alt="Hero Banner" 
                  className="slide-image" 
                  loading="eager" 
                  fetchpriority="high"
                />
                <div className="slide-overlay" />
              </div>

              <div className="hero-content">
                <h1>
                  {slide.title} <br /> 
                  <span className="gradient-text">{slide.subtitle}</span>
                </h1>
                <p>{slide.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Slider Controls */}
        <button className="slider-arrow left" onClick={prevSlide} aria-label="Previous slide">
          <ChevronLeft size={24} />
        </button>
        <button className="slider-arrow right" onClick={nextSlide} aria-label="Next slide">
          <ChevronRight size={24} />
        </button>

        {/* Indicators */}
        <div className="slider-pagination">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`pagination-dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Explore <span className="gradient-text">Categories</span></h2>
        </div>
        <div className="categories-grid">
          {categories.map((cat, i) => (
            <motion.div 
              key={cat}
              className="category-card glass"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              {cat}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured <span className="gradient-text">Books</span></h2>
          <button className="view-all">View All <ArrowRight size={16} /></button>
        </div>
        <div className="books-grid">
          {sampleBooks.map((book, i) => (
            <motion.div 
              key={book.id}
              className="book-card premium-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="book-image">
                <img src={book.image} alt={book.title} />
                <button className="wishlist-btn"><ShoppingBag size={18} /></button>
              </div>
              <div className="book-info">
                <div className="book-top">
                  <span className="book-rating"><Star size={14} fill="currentColor" /> {book.rating}</span>
                  <span className="book-price">${book.price}</span>
                </div>
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
