import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiShoppingCart, FiUser, FiMenu, FiX, FiChevronDown, FiMoon, FiSun, FiLogOut, FiPercent, FiGift } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { PIZZAS } from '../../services/mockData';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode, selectedLocation, setSelectedLocation, searchQuery, setSearchQuery } = useApp();
  
  const navigate = useNavigate();
  const suggestionRef = useRef(null);

  // Monitor scroll for sticky navbar blur effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter menu suggestions for Search box
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = PIZZAS.filter(pizza => 
        pizza.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pizza.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // Close search suggestions click-outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    navigate(`/menu?search=${searchQuery}`);
  };

  const handleSuggestionClick = (pizzaName) => {
    setSearchQuery(pizzaName);
    setShowSuggestions(false);
    navigate(`/menu?search=${pizzaName}`);
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const mockLocations = [
    'Downtown District, Pizza Valley',
    'North Avenue, Bite City',
    'Tech Park Campus, Silicon Town',
    'Greenwood Hills, Crust County'
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'py-3 bg-white/90 dark:bg-slate-900/90 shadow-premium backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50' 
        : 'py-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <svg className="w-9 h-9 text-accent-500 transform hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C11.5 2 11 2.3 10.8 2.8L2.2 18.2C1.9 18.7 1.9 19.3 2.2 19.8C2.5 20.3 3 20.6 3.6 20.6H20.4C21 20.6 21.5 20.3 21.8 19.8C22.1 19.3 22.1 18.7 21.8 18.2L13.2 2.8C13 2.3 12.5 2 12 2ZM12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM16.5 15C15.7 15 15 14.3 15 13.5C15 12.7 15.7 12 16.5 12C17.3 12 18 12.7 18 13.5C18 14.3 17.3 15 16.5 15ZM7.5 15C6.7 15 6 14.3 6 13.5C6 12.7 6.7 12 7.5 12C8.3 12 9 12.7 9 13.5C9 14.3 8.3 15 7.5 15ZM12 17C12.8 17 13.5 17.7 13.5 18.5C13.5 19.3 12.8 20 12 20C11.2 20 10.5 19.3 10.5 18.5C10.5 17.7 11.2 17 12 17Z"/>
            </svg>
            <span className="text-2xl font-black tracking-tight text-primary-800 dark:text-white">
              Slice<span className="text-accent-500">Craft</span>
            </span>
          </Link>

          {/* Location Selector */}
          <div className="relative hidden md:block" ref={suggestionRef}>
            {/* <button 
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              <FiMapPin className="text-accent-500 w-4 h-4 flex-shrink-0" />
              <span className="max-w-[150px] truncate">{selectedLocation}</span>
              <FiChevronDown className="w-4 h-4" />
            </button> */}
            
            {locationDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 z-50">
                <div className="px-3 py-1 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Select Delivery Hub</div>
                {mockLocations.map((loc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setLocationDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-200 block transition-colors"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Box with Suggestions */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xs xl:max-w-md hidden lg:block" ref={suggestionRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search pizzas, sides, desserts..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-850 text-slate-800 dark:text-slate-100 rounded-full border border-transparent focus:border-primary-500 dark:focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all"
              />
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            </div>

            {/* Auto Suggestions Panel */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
                {suggestions.map((pizza) => (
                  <div
                    key={pizza.id}
                    onClick={() => handleSuggestionClick(pizza.name)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  >
                    <img src={pizza.image} alt={pizza.name} className="w-10 h-10 object-cover rounded-lg" />
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{pizza.name}</div>
                      <div className="text-xs text-slate-400 capitalize">{pizza.category} pizza</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/menu" className="font-semibold text-slate-700 dark:text-slate-200 hover:text-accent-500 dark:hover:text-accent-500 transition-colors">Menu</Link>
            <Link to="/deals" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200 hover:text-accent-500 dark:hover:text-accent-500 transition-colors">
              <FiGift className="text-accent-500" />
              Deals
            </Link>
            <Link to="/coupons" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200 hover:text-accent-500 dark:hover:text-accent-500 transition-colors">
              <FiPercent className="text-accent-500" />
              Coupons
            </Link>
            <Link to="/about" className="font-semibold text-slate-700 dark:text-slate-200 hover:text-accent-500 dark:hover:text-accent-500 transition-colors">About</Link>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FiSun className="w-5 h-5 text-amber-400" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {/* Cart Button with Live Badge */}
            <Link 
              to="/cart" 
              className="relative p-2.5 bg-primary-800 hover:bg-primary-900 text-white rounded-full transition-all shadow-md hover:scale-105"
              aria-label="Cart"
            >
              <FiShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent-500 text-white text-[10px] font-black w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-accent-500 text-white font-bold flex items-center justify-center text-sm shadow">
                    {user.name.charAt(0)}
                  </div>
                  <FiChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <div className="text-xs text-slate-400">Signed in as</div>
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{user.name}</div>
                    </div>
                    <Link 
                      to="/profile" 
                      onClick={() => setProfileDropdownOpen(false)}
                      className="px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                    >
                      <FiUser className="w-4 h-4" /> My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                    >
                      <FiLogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <FiUser className="w-4 h-4" /> Sign In
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glassmorphism border-b border-slate-200/50 dark:border-slate-800/50 absolute top-full left-0 right-0 py-4 px-6 flex flex-col gap-4 shadow-xl z-40">
          
          {/* Location Selector Mobile */}
          <div className="flex items-center gap-2 py-2 border-b border-slate-250 dark:border-slate-800">
            <FiMapPin className="text-accent-500 w-5 h-5 flex-shrink-0" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none w-full cursor-pointer"
            >
              <option disabled value="Select Location...">Select Delivery Hub...</option>
              {mockLocations.map((loc, idx) => (
                <option key={idx} value={loc} className="dark:bg-slate-800">{loc}</option>
              ))}
            </select>
          </div>

          {/* Search Box Mobile */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-150 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl outline-none"
            />
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
          </form>

          {/* Links */}
          <div className="flex flex-col gap-2 font-bold text-slate-700 dark:text-slate-200">
            <Link to="/menu" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-accent-500">Menu</Link>
            <Link to="/deals" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-accent-500 flex items-center gap-2"><FiGift /> Deals</Link>
            <Link to="/coupons" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-accent-500 flex items-center gap-2"><FiPercent /> Coupons</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-accent-500">About Us</Link>
            <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-accent-500">FAQ</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-accent-500">Contact Us</Link>
          </div>

          {/* Auth Button Mobile */}
          {user ? (
            <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-4 mt-2">
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent-500 text-white font-bold flex items-center justify-center">{user.name.charAt(0)}</div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="text-rose-500 font-semibold text-sm flex items-center gap-1.5">
                <FiLogOut /> Log Out
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center py-2.5 w-full bg-primary-800 hover:bg-primary-900 text-white font-bold text-sm rounded-xl block shadow-md"
            >
              Sign In / Sign Up
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
