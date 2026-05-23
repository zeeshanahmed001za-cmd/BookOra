import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Heart, Filter, ChevronDown, X } from 'lucide-react';
import './Books.css';

const GENRES = ['All', 'Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Children', 'Mystery', 'Romance'];
const SORT_OPTIONS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Top Rated', 'Newest'];

const SAMPLE_BOOKS = [
  { id: 1, title: 'The Midnight Library', author: 'Matt Haig', price: 24.99, rating: 4.8, reviews: 1240, genre: 'Fiction', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400', badge: 'Bestseller' },
  { id: 2, title: 'Project Hail Mary', author: 'Andy Weir', price: 29.99, rating: 4.9, reviews: 980, genre: 'Science', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=400', badge: 'Top Rated' },
  { id: 3, title: 'Circe', author: 'Madeline Miller', price: 21.50, rating: 4.7, reviews: 760, genre: 'Fiction', image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400', badge: null },
  { id: 4, title: 'Sapiens', author: 'Yuval Noah Harari', price: 18.99, rating: 4.6, reviews: 2100, genre: 'History', image: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=400', badge: 'Bestseller' },
  { id: 5, title: 'The Great Alone', author: 'Kristin Hannah', price: 22.00, rating: 4.5, reviews: 540, genre: 'Romance', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400', badge: null },
  { id: 6, title: 'Educated', author: 'Tara Westover', price: 19.99, rating: 4.8, reviews: 1870, genre: 'Biography', image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400', badge: 'New' },
  { id: 7, title: 'The Name of the Wind', author: 'Patrick Rothfuss', price: 27.50, rating: 4.9, reviews: 3200, genre: 'Fiction', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400', badge: 'Top Rated' },
  { id: 8, title: 'Deep Work', author: 'Cal Newport', price: 16.99, rating: 4.7, reviews: 890, genre: 'Non-Fiction', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=400', badge: null },
  { id: 9, title: 'The Silent Patient', author: 'Alex Michaelides', price: 20.00, rating: 4.6, reviews: 1650, genre: 'Mystery', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=400', badge: 'New' },
];

const Stars = ({ rating }) => {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={13}
          fill={s <= Math.round(rating) ? 'currentColor' : 'none'}
          stroke={s <= Math.round(rating) ? 'currentColor' : 'var(--text-dim)'}
        />
      ))}
      <span className="rating-val">{rating}</span>
    </div>
  );
};

const BookCard = ({ book, index }) => {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <motion.div
      className="book-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      layout
    >
      <div className="book-cover">
        <img src={book.image} alt={book.title} loading="lazy" />
        {book.badge && <span className="book-badge">{book.badge}</span>}
        <button
          className={`wishlist-toggle ${wishlisted ? 'active' : ''}`}
          onClick={() => setWishlisted(!wishlisted)}
          title="Add to Wishlist"
        >
          <Heart size={17} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="book-body">
        <span className="book-genre">{book.genre}</span>
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        <Stars rating={book.rating} />
        <span className="book-reviews">({book.reviews.toLocaleString()} reviews)</span>
      </div>

      <div className="book-footer">
        <span className="book-price">${book.price.toFixed(2)}</span>
        <button className="add-cart-btn">
          <ShoppingCart size={15} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

const Books = () => {
  const [activeGenre, setActiveGenre] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  const [showSort, setShowSort] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(50);

  const filtered = SAMPLE_BOOKS.filter(b => activeGenre === 'All' || b.genre === activeGenre)
    .filter(b => b.price <= priceRange);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Top Rated') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="books-page">
      {/* Page Header */}
      <div className="books-header">
        <div>
          <h1>Explore <span className="gradient-text">Books</span></h1>
          <p className="books-subtitle">{sorted.length} books found</p>
        </div>
        <div className="books-controls">
          {/* Filter Toggle */}
          <button className={`filter-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
            <Filter size={17} />
            Filters
            {showFilters && <X size={15} />}
          </button>

          {/* Sort Dropdown */}
          <div className="sort-wrap">
            <button className="sort-btn" onClick={() => setShowSort(!showSort)}>
              Sort: {sortBy}
              <ChevronDown size={16} className={showSort ? 'rotated' : ''} />
            </button>
            <AnimatePresence>
              {showSort && (
                <motion.ul
                  className="sort-dropdown"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {SORT_OPTIONS.map(opt => (
                    <li
                      key={opt}
                      className={opt === sortBy ? 'active' : ''}
                      onClick={() => { setSortBy(opt); setShowSort(false); }}
                    >
                      {opt}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="filter-panel glass"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="filter-section">
              <h4>Max Price: <span className="gradient-text">${priceRange}</span></h4>
              <input
                type="range"
                min={5}
                max={50}
                value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                className="price-range"
              />
              <div className="price-labels"><span>$5</span><span>$50</span></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Genre Tabs */}
      <div className="genre-tabs">
        {GENRES.map(g => (
          <button
            key={g}
            className={`genre-tab ${activeGenre === g ? 'active' : ''}`}
            onClick={() => setActiveGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {sorted.length > 0 ? (
        <motion.div className="books-grid" layout>
          {sorted.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </motion.div>
      ) : (
        <div className="no-results">
          <p>No books match your filters.</p>
          <button onClick={() => { setActiveGenre('All'); setPriceRange(50); }}>Clear Filters</button>
        </div>
      )}
    </div>
  );
};

export default Books;
