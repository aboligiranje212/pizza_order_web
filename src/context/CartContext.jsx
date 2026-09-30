import React, { createContext, useContext, useState, useEffect } from 'react';
import { SIZES, CRUSTS, TOPPINGS, COUPONS } from '../services/mockData';
import { calculateGST } from '../utils/helpers';
import { useNotification } from './NotificationContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const saved = localStorage.getItem('appliedCoupon');
    return saved ? JSON.parse(saved) : null;
  });

  const { showToast } = useNotification();

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
  }, [appliedCoupon]);

  // Recalculates single item price based on customization
  const calculateItemPrice = (item) => {
    const isPizza = item.category === 'veg' || item.category === 'non-veg';
    if (!isPizza) {
      return item.basePrice;
    }

    const sizeObj = SIZES.find(s => s.id === item.size);
    const crustObj = CRUSTS.find(c => c.id === item.crust);
    
    const sizeMultiplier = sizeObj ? sizeObj.priceMultiplier : 1.0;
    const crustExtra = crustObj ? crustObj.extraPrice : 0.0;
    
    const toppingsTotal = item.toppings.reduce((acc, tId) => {
      const topObj = TOPPINGS.find(t => t.id === tId);
      return acc + (topObj ? topObj.price : 0.0);
    }, 0.0);

    return parseFloat(((item.basePrice * sizeMultiplier) + crustExtra + toppingsTotal).toFixed(2));
  };

  const addToCart = (product, quantity = 1, size = 'regular', crust = 'classic', toppings = []) => {
    // Generate a unique ID based on combinations so we can stack exact same pizza options
    const combinationId = product.id + '_' + size + '_' + crust + '_' + toppings.sort().join('-');

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.combinationId === combinationId);
      
      if (existingIndex > -1) {
        // Upgrade quantity of existing customized item
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        showToast(`Added ${quantity} more ${product.name} to Cart`, 'success');
        return updated;
      } else {
        // Add new customized item
        const newItem = {
          combinationId,
          id: product.id,
          name: product.name,
          category: product.category,
          basePrice: product.basePrice,
          image: product.image,
          size,
          crust,
          toppings,
          quantity,
          isPizza: product.category === 'veg' || product.category === 'non-veg'
        };
        newItem.singlePrice = calculateItemPrice(newItem);
        showToast(`${product.name} added to Cart!`, 'success');
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (combinationId) => {
    setCartItems(prev => {
      const target = prev.find(item => item.combinationId === combinationId);
      if (target) {
        showToast(`${target.name} removed from Cart.`, 'info');
      }
      return prev.filter(item => item.combinationId !== combinationId);
    });
  };

  const updateQuantity = (combinationId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(combinationId);
      return;
    }
    setCartItems(prev => {
      return prev.map(item => {
        if (item.combinationId === combinationId) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const applyCoupon = (code) => {
    const coupon = COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    
    if (!coupon) {
      showToast('Invalid Coupon Code!', 'error');
      return false;
    }

    const sub = getSubtotal();
    if (sub < coupon.minOrder) {
      showToast(`Min order for ${coupon.code} is $${coupon.minOrder}`, 'warning');
      return false;
    }

    setAppliedCoupon(coupon);
    showToast(`Coupon ${coupon.code} Applied Successfully!`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Math functions
  const getSubtotal = () => {
    return parseFloat(cartItems.reduce((acc, item) => acc + (item.singlePrice * item.quantity), 0).toFixed(2));
  };

  const getDiscount = () => {
    if (!appliedCoupon) return 0.0;
    const sub = getSubtotal();
    if (appliedCoupon.discountType === 'percentage') {
      return parseFloat((sub * (appliedCoupon.discountValue / 100)).toFixed(2));
    }
    if (appliedCoupon.discountType === 'fixed') {
      return parseFloat(appliedCoupon.discountValue.toFixed(2));
    }
    return 0.0;
  };

  const getDeliveryFee = () => {
    if (cartItems.length === 0) return 0.0;
    if (appliedCoupon && appliedCoupon.discountType === 'free-delivery') return 0.0;
    // Standard flat delivery fee
    return 3.99;
  };

  const getGST = () => {
    const sub = getSubtotal();
    const disc = getDiscount();
    return calculateGST(Math.max(0, sub - disc));
  };

  const getTotal = () => {
    const sub = getSubtotal();
    const disc = getDiscount();
    const delivery = getDeliveryFee();
    const tax = getGST();
    return parseFloat((sub - disc + delivery + tax).toFixed(2));
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      appliedCoupon,
      addToCart,
      removeFromCart,
      updateQuantity,
      applyCoupon,
      removeCoupon,
      clearCart,
      getSubtotal,
      getDiscount,
      getDeliveryFee,
      getGST,
      getTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
