import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Location State
  const [selectedLocation, setSelectedLocation] = useState(() => {
    return localStorage.getItem('selectedLocation') || 'Select Location...';
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Recently Viewed State
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem('recentlyViewed');
    return saved ? JSON.parse(saved) : [];
  });

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Sync Dark Mode class to HTML document
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Sync Wishlist to local storage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync Location to local storage
  useEffect(() => {
    localStorage.setItem('selectedLocation', selectedLocation);
  }, [selectedLocation]);

  // Sync Recently Viewed to local storage
  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Add/Remove Wishlist
  const toggleWishlist = (pizzaId) => {
    setWishlist(prev => {
      if (prev.includes(pizzaId)) {
        return prev.filter(id => id !== pizzaId);
      } else {
        return [...prev, pizzaId];
      }
    });
  };

  // Add to recently viewed (maintaining max 5 unique items)
  const addRecentlyViewed = (pizzaId) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== pizzaId);
      return [pizzaId, ...filtered].slice(0, 5);
    });
  };

  return (
    <AppContext.Provider value={{
      darkMode,
      toggleDarkMode,
      selectedLocation,
      setSelectedLocation,
      wishlist,
      toggleWishlist,
      recentlyViewed,
      addRecentlyViewed,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </AppContext.Provider>
  );
};
