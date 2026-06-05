import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();
const API_BASE_URL = 'http://localhost:5000/api/v1';

export const validatePassword = (password) => {
  if (!password) return 'Password is required.';
  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one digit.';
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain at least one special symbol (e.g. !, @, #, $, %).';
  }
  return '';
};

const formatUser = (userData) => {
  if (!userData) return null;
  return {
    ...userData,
    fullName: userData.fullName || userData.name || '',
    dateJoined: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'October 14, 2024',
    settings: userData.settings || {
      publicProfile: true,
      searchIndexing: false,
      theme: 'dark'
    },
    preferences: userData.preferences || {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      orderUpdates: true,
      newsletter: true
    }
  };
};

const formatOrders = (backendOrders) => {
  if (!backendOrders) return [];
  return backendOrders.map(order => {
    const date = new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const books = (order.items || []).map(item => {
      const b = item.book || {};
      return {
        id: b._id || item._id,
        title: b.title || 'Unknown Title',
        author: b.author || 'Unknown Author',
        price: item.price || b.price || 0,
        coverId: b.coverId || 82563,
        quantity: item.quantity || 1
      };
    });

    return {
      id: order._id,
      date,
      status: order.orderStatus ? (order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)) : 'Processing',
      total: order.totalPrice || 0,
      itemsCount: books.reduce((sum, b) => sum + b.quantity, 0),
      books
    };
  });
};

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('bookora_token'));
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(!!localStorage.getItem('bookora_token'));
  const [notification, setNotification] = useState(null);

  // Load user data on mount if token exists
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('bookora_token');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const userRes = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (userRes.data.status === 'success') {
          setUser(formatUser(userRes.data.data.user));
          setIsAuthenticated(true);

          try {
            const ordersRes = await axios.get(`${API_BASE_URL}/orders/my-orders`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (ordersRes.data.status === 'success') {
              setOrders(formatOrders(ordersRes.data.data.orders));
            }
          } catch (orderErr) {
            console.error('Error fetching orders:', orderErr);
          }
        } else {
          logout();
        }
      } catch (err) {
        console.error('Error fetching user on load:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Clear notification after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showToast = (type, message) => {
    setNotification({ type, message });
  };

  // ─── Authentication Operations ──────────────────────────────────────────────

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        email: email.toLowerCase().trim(),
        password
      });

      if (response.data.status === 'success') {
        const { token, data } = response.data;
        localStorage.setItem('bookora_token', token);
        setIsAuthenticated(true);
        setUser(formatUser(data.user));
        
        try {
          const ordersRes = await axios.get(`${API_BASE_URL}/orders/my-orders`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (ordersRes.data.status === 'success') {
            setOrders(formatOrders(ordersRes.data.data.orders));
          }
        } catch (orderErr) {
          console.error('Error fetching orders:', orderErr);
        }

        showToast('success', 'Logged in successfully! Welcome back.');
        return { success: true };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid credentials. Please try again.';
      showToast('error', errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (fullName, email, username, password, passwordConfirm, phone, shippingAddress) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/users/signup`, {
        name: fullName,
        email: email.toLowerCase().trim(),
        username: username.toLowerCase().trim(),
        password,
        passwordConfirm,
        phone,
        shippingAddress
      });

      if (response.data.status === 'success') {
        const { token, data } = response.data;
        localStorage.setItem('bookora_token', token);
        setIsAuthenticated(true);
        setUser(formatUser(data.user));
        setOrders([]);
        showToast('success', 'Account created successfully! Welcome to Bookora.');
        return { success: true };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create account. Please try again.';
      showToast('error', errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    localStorage.removeItem('bookora_token');
    setIsAuthenticated(false);
    setUser(null);
    setOrders([]);
    setLoading(false);
    showToast('success', 'Logged out successfully. Have a nice day!');
  };

  // ─── Profile Operations ─────────────────────────────────────────────────────

  const updateProfile = async (profileData) => {
    setLoading(true);
    const token = localStorage.getItem('bookora_token');
    if (!token) {
      setLoading(false);
      return { success: false, error: 'Not authenticated' };
    }

    if (!profileData.fullName.trim()) {
      showToast('error', 'Full Name cannot be blank.');
      setLoading(false);
      return { success: false, error: 'Full name required' };
    }
    if (!profileData.email.includes('@')) {
      showToast('error', 'Please enter a valid email address.');
      setLoading(false);
      return { success: false, error: 'Invalid email' };
    }

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/users/updateMe`,
        {
          fullName: profileData.fullName.trim(),
          email: profileData.email.trim(),
          phone: profileData.phone.trim(),
          shippingAddress: profileData.shippingAddress.trim()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.status === 'success') {
        setUser(formatUser(response.data.data.user));
        showToast('success', 'Profile updated successfully.');
        return { success: true };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update profile.';
      showToast('error', errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // ─── Settings Operations ──────────────────────────────────────────────────

  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    const token = localStorage.getItem('bookora_token');
    if (!token) {
      setLoading(false);
      return { success: false, error: 'Not authenticated' };
    }

    if (!currentPassword) {
      showToast('error', 'Current password is required.');
      setLoading(false);
      return { success: false, error: 'Current password empty' };
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      showToast('error', passwordError);
      setLoading(false);
      return { success: false, error: passwordError };
    }

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/users/updateMyPassword`,
        {
          currentPassword,
          password: newPassword,
          passwordConfirm: newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.status === 'success') {
        const { token: newToken, data } = response.data;
        localStorage.setItem('bookora_token', newToken);
        setUser(formatUser(data.user));
        showToast('success', 'Password updated successfully.');
        return { success: true };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update password.';
      showToast('error', errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences) => {
    const token = localStorage.getItem('bookora_token');
    if (!token || !user) return;

    try {
      const updatedPrefs = {
        ...user.preferences,
        ...newPreferences
      };
      
      const response = await axios.patch(
        `${API_BASE_URL}/users/updateMe`,
        { preferences: updatedPrefs },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === 'success') {
        setUser(formatUser(response.data.data.user));
        showToast('success', 'Notification preferences updated.');
      }
    } catch (err) {
      console.error('Error updating preferences:', err);
      showToast('error', 'Failed to update preferences.');
    }
  };

  const updateSettings = async (newSettings) => {
    const token = localStorage.getItem('bookora_token');
    if (!token || !user) return;

    try {
      const updatedSets = {
        ...user.settings,
        ...newSettings
      };
      
      const response = await axios.patch(
        `${API_BASE_URL}/users/updateMe`,
        { settings: updatedSets },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === 'success') {
        setUser(formatUser(response.data.data.user));
        showToast('success', 'Privacy settings updated.');
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      showToast('error', 'Failed to update privacy settings.');
    }
  };

  const getStats = (wishlistLength) => {
    const purchased = orders
      .filter((o) => o.status === 'Delivered')
      .reduce((sum, o) => sum + o.books.reduce((bsum, b) => bsum + b.quantity, 0), 0);

    return {
      booksPurchased: purchased,
      totalOrders: orders.length,
      wishlistCount: wishlistLength,
      currentlyReading: 0
    };
  };

  return (
    <UserContext.Provider
      value={{
        user,
        orders,
        isAuthenticated,
        loading,
        notification,
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
        updatePreferences,
        updateSettings,
        getStats,
        showToast
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
