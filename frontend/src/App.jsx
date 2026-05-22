import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content main-with-sidebar">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Other routes will go here */}
              <Route path="/auth" element={<div>Auth Page (Coming Soon)</div>} />
              <Route path="/books" element={<div>Books Marketplace (Coming Soon)</div>} />
              <Route path="/cart" element={<div>Your Cart (Coming Soon)</div>} />
            </Routes>
          </main>
          
          <footer className="footer glass">
            <div className="footer-content">
              <p>&copy; 2026 Bookora. Designed for the ultimate reading experience.</p>
            </div>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
