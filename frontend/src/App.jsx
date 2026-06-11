import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import SubNav from './components/layout/SubNav';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Books from './pages/Books';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import BookDetailsModal from './components/BookDetailsModal';
import { WishlistProvider } from './contexts/WishlistContext';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <Router>
      <UserProvider>
        <WishlistProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-[#050505]">
              <Navbar />
              <SubNav />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/books" element={<Books />} />
                  <Route path="/auth"  element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/cart"  element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/sell"  element={
                    <div className="flex items-center justify-content-center h-[60vh] text-2xl text-[#606060]">
                      Sell Books (Coming Soon)
                    </div>
                  } />
                </Routes>
              </main>
              <Footer />
              <BookDetailsModal />
            </div>
          </CartProvider>
        </WishlistProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
