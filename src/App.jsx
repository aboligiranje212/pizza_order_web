import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout and Context Providers
import { NotificationProvider } from './context/NotificationContext';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import RootLayout from './layouts/RootLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Page imports
import Home from './pages/Home';
import Menu from './pages/Menu';
import PizzaDetails from './pages/PizzaDetails';
import Deals from './pages/Deals';
import Coupons from './pages/Coupons';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OrderTracking from './pages/OrderTracking';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <NotificationProvider>
      <AppProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <RootLayout>
                <Routes>
                  {/* Public Pages */}
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/pizza/:id" element={<PizzaDetails />} />
                  <Route path="/deals" element={<Deals />} />
                  <Route path="/coupons" element={<Coupons />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />

                  {/* Protected Pages */}
                  <Route 
                    path="/checkout" 
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />

                  {/* 404 Page */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </RootLayout>
            </Router>
          </CartProvider>
        </AuthProvider>
      </AppProvider>
    </NotificationProvider>
  );
}
