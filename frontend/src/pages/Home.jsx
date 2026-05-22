import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShoppingBag } from 'lucide-react';
import './Home.css';

const Home = () => {
  const categories = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Children'];
  
  const sampleBooks = [
    { id: 1, title: 'The Midnight Library', author: 'Matt Haig', price: 24.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400' },
    { id: 2, title: 'Project Hail Mary', author: 'Andy Weir', price: 29.99, rating: 4.9, image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=400' },
    { id: 3, title: 'Circe', author: 'Madeline Miller', price: 21.50, rating: 4.7, image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Discover Your Next <br /> 
            <span className="gradient-text">Great Adventure</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explore our curated collection of books from worldwide authors. 
            From timeless classics to modern masterpieces.
          </motion.p>
          <motion.div 
            className="hero-btns"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button className="btn-primary">Browse Collection <ArrowRight size={18} /></button>
            <button className="btn-secondary">Popular Books</button>
          </motion.div>
        </div>
        
        <motion.div 
          className="hero-blob"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
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
