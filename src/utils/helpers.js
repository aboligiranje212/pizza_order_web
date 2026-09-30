// Helper Utilities for SliceCraft Pizza

// Format price to USD currency
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

// Validate email address format
export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

// Validate phone number format (must be 10 digits or standard international)
export const validatePhone = (phone) => {
  const re = /^\+?[1-9]\d{1,14}$|^[0-9]{10}$/;
  return re.test(String(phone).replace(/[\s()-]/g, ''));
};

// Calculate 18% GST / Sales Tax
export const calculateGST = (subtotal) => {
  return parseFloat((subtotal * 0.18).toFixed(2));
};

// Sleep utility for async checks
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
