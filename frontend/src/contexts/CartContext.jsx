import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('bookora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bookora_cart', JSON.stringify(cartItems));
    } catch {
      // Silent fail on quota exceeded
    }
  }, [cartItems]);

  const addToCart = (book) => {
    if (!book || !book.id) return;
    setCartItems(prev => {
      const existing = prev.find(item => item.id === book.id);
      if (existing) {
        return prev.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId) => {
    if (!bookId) return;
    setCartItems(prev => prev.filter(item => item.id !== bookId));
  };

  const updateQuantity = (bookId, qty) => {
    if (!bookId) return;
    const q = Math.max(1, Math.floor(qty));
    setCartItems(prev =>
      prev.map(item => item.id === bookId ? { ...item, quantity: q } : item)
    );
  };

  const clearCart = () => setCartItems([]);

  const isInCart = (bookId) => cartItems.some(item => item.id === bookId);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        cartCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
