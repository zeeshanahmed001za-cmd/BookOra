import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import SubNav from './components/layout/SubNav';
import Home from './pages/Home';
import Books from './pages/Books';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <SubNav />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/auth"  element={<div className="placeholder-page">Auth Page (Coming Soon)</div>} />
            <Route path="/cart"  element={<div className="placeholder-page">Your Cart (Coming Soon)</div>} />
            <Route path="/wishlist" element={<div className="placeholder-page">Wishlist (Coming Soon)</div>} />
            <Route path="/sell"  element={<div className="placeholder-page">Sell Books (Coming Soon)</div>} />
          </Routes>
        </main>

        <footer className="footer glass">
          <div className="footer-content">
            <p>&copy; 2026 Bookora. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
