import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('bookora_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading wishlist from localStorage:', e);
      return [];
    }
  });

  const [selectedBook, setSelectedBook] = useState(null);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bookora_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error saving wishlist to localStorage:', e);
    }
  }, [wishlist]);

  const addToWishlist = (book) => {
    if (!book || !book.id) return;
    setWishlist((prev) => {
      // Prevent duplicates
      if (prev.some((item) => item.id === book.id)) return prev;
      return [...prev, book];
    });
  };

  const removeFromWishlist = (bookId) => {
    if (!bookId) return;
    setWishlist((prev) => prev.filter((item) => item.id !== bookId));
  };

  const toggleWishlist = (book) => {
    if (!book || !book.id) return;
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === book.id);
      if (exists) {
        return prev.filter((item) => item.id !== book.id);
      } else {
        return [...prev, book];
      }
    });
  };

  const isWishlisted = (bookId) => {
    if (!bookId) return false;
    return wishlist.some((item) => item.id === bookId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isWishlisted,
        selectedBook,
        setSelectedBook,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
