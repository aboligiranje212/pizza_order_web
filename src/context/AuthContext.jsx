import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderHistory, setOrderHistory] = useState([]);

  // Check if session exists in local storage on load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    const savedOrders = localStorage.getItem('orders');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    
    if (savedOrders) {
      setOrderHistory(JSON.parse(savedOrders));
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.login(email, password);
      const { user: loggedUser, token: sessionToken } = response.data;
      
      setUser(loggedUser);
      setToken(sessionToken);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      localStorage.setItem('token', sessionToken);
      
      // Load user orders from history
      const savedOrders = localStorage.getItem(`orders_${loggedUser.id}`);
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      setOrderHistory(orders);
      localStorage.setItem('orders', JSON.stringify(orders));

      return loggedUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const response = await api.register(name, email, password, phone);
      const { user: newUser, token: sessionToken } = response.data;
      
      setUser(newUser);
      setToken(sessionToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', sessionToken);
      setOrderHistory([]);
      localStorage.setItem('orders', JSON.stringify([]));
      
      return newUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setOrderHistory([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('orders');
  };

  // Address Management
  const addAddress = (address) => {
    if (!user) return;
    const newAddress = {
      id: 'addr_' + Date.now(),
      ...address
    };
    
    const updatedUser = {
      ...user,
      addresses: [...user.addresses, newAddress]
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const deleteAddress = (addressId) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      addresses: user.addresses.filter(addr => addr.id !== addressId)
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Saved Cards Management
  const addSavedCard = (card) => {
    if (!user) return;
    const newCard = {
      id: 'card_' + Date.now(),
      brand: card.number.startsWith('4') ? 'Visa' : 'Mastercard',
      last4: card.number.slice(-4),
      expiry: card.expiry
    };
    
    const updatedUser = {
      ...user,
      savedCards: [...user.savedCards, newCard]
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const deleteSavedCard = (cardId) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      savedCards: user.savedCards.filter(c => c.id !== cardId)
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Order Placement and Sync
  const addOrder = (order) => {
    const newOrder = {
      id: order.orderId,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      items: order.items,
      total: order.total,
      status: 'Placed',
      deliveryAddress: order.address,
      paymentMethod: order.paymentMethod,
      rider: order.rider
    };

    setOrderHistory(prev => {
      const updated = [newOrder, ...prev];
      localStorage.setItem('orders', JSON.stringify(updated));
      if (user) {
        localStorage.setItem(`orders_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
    
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrderHistory(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, status } : o);
      localStorage.setItem('orders', JSON.stringify(updated));
      if (user) {
        localStorage.setItem(`orders_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      addAddress,
      deleteAddress,
      addSavedCard,
      deleteSavedCard,
      orderHistory,
      addOrder,
      updateOrderStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};
