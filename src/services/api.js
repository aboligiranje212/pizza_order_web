import axios from 'axios';
import { PIZZAS, DEALS, COUPONS, MOCK_REVIEWS } from './mockData';

// We create a custom axios instance (even though we will mock responses for local operation, 
// this configures the client for production readiness if an API endpoint becomes available later)
const apiInstance = axios.create({
  baseURL: 'https://api.slicecraftpizza-mock.com/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Helper function to simulate network latency (300-600ms)
const delay = (ms = 450) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Menu Services
  async getMenu() {
    await delay();
    return { data: PIZZAS };
  },

  async getPizzaById(id) {
    await delay();
    const pizza = PIZZAS.find(p => p.id === id);
    if (!pizza) {
      throw new Error('Pizza not found');
    }
    return {
      data: {
        ...pizza,
        reviews: MOCK_REVIEWS
      }
    };
  },

  // Deals & Coupons Services
  async getDeals() {
    await delay(300);
    return { data: DEALS };
  },

  async getCoupons() {
    await delay(200);
    return { data: COUPONS };
  },

  // Authentication Services
  async login(email, password) {
    await delay(600);
    // Simple validation rule: passwords must be >= 6 chars
    if (!email.includes('@') || password.length < 6) {
      throw new Error('Invalid email or password (min 6 characters).');
    }
    
    // Simulate user profile response
    const name = email.split('@')[0];
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    return {
      data: {
        token: 'mock-jwt-token-xyz-12345',
        user: {
          id: 'user_99',
          name: capitalizedName,
          email: email,
          phone: '+1 (555) 234-5678',
          addresses: [
            { id: 'addr_1', type: 'Home', addressLine: '123 Cheesy Lane, Pizza Valley', zipcode: '90210' },
            { id: 'addr_2', type: 'Office', addressLine: 'Suite 404, Tech Park, Bite City', zipcode: '10001' }
          ],
          savedCards: [
            { id: 'card_1', brand: 'Visa', last4: '4242', expiry: '12/28' },
            { id: 'card_2', brand: 'Mastercard', last4: '8888', expiry: '06/29' }
          ]
        }
      }
    };
  },

  async register(name, email, password, phone) {
    await delay(600);
    if (!name || !email.includes('@') || password.length < 6 || !phone) {
      throw new Error('Invalid registration data. Please check all fields.');
    }
    return {
      data: {
        token: 'mock-jwt-token-newuser-67890',
        user: {
          id: 'user_' + Math.floor(Math.random() * 1000),
          name,
          email,
          phone,
          addresses: [],
          savedCards: []
        }
      }
    };
  },

  // Checkout and Order Placement
  async placeOrder(orderData) {
    await delay(800);
    const orderId = 'SC-' + Math.floor(100000 + Math.random() * 900000);
    return {
      data: {
        orderId,
        success: true,
        estimatedDeliveryMinutes: 30,
        rider: {
          name: 'Marco Rossi',
          phone: '+1 (555) 987-6543',
          rating: 4.9,
          vehicle: 'Red Electric Scooter (SC-09)',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
        },
        ...orderData
      }
    };
  }
};
