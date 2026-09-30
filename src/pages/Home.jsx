import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiArrowRight, FiShield, FiTruck, FiAward, FiStar, FiHeart } from 'react-icons/fi';
import { PIZZAS } from '../services/mockData';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import { formatPrice } from '../utils/helpers';

const HERO_PROMOS = [
  {
    id: 1,
    title: "Double the Slice, Double the Joy!",
    subtitle: "Buy 1 Get 1 Free on all Medium Pizzas.",
    tagline: "Limited Time Offer • Use Code: SLICECRAFT50",
    cta: "Order BOGO Now",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    link: "/menu"
  },
  {
    id: 2,
    title: "Artisanal Liquid Cheese Burst",
    subtitle: "Upgrade any crust to liquid cheese burst for flat $2.99.",
    tagline: "Creamy, gooey, and piping hot",
    cta: "Explore Crusts",
    image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=1200&q=80",
    link: "/menu"
  },
  {
    id: 3,
    title: "Feast with Friends & Family",
    subtitle: "Feast Combo: 2 Medium Pizzas + Garlic Bread + Cola for $27.99.",
    tagline: "Best value bundle of the day",
    cta: "Claim Feast Combo",
    image: "https://images.unsplash.com/photo-1571066811602-71683a3f680d?auto=format&fit=crop&w=1200&q=80",
    link: "/deals"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useApp();
  const { showToast } = useNotification();

  // Autoplay Hero Slider (every 6 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_PROMOS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % HERO_PROMOS.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + HERO_PROMOS.length) % HERO_PROMOS.length);

  const bestSellers = PIZZAS.filter(p => p.isPopular).slice(0, 4);

  return (
    <div className="pb-16 pt-20">
      
      {/* Hero Section Carousel */}
      <div className="relative h-[420px] md:h-[500px] overflow-hidden bg-slate-900 rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-xl mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center flex items-center"
            style={{ 
              backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.9) 30%, rgba(15, 23, 42, 0.4) 70%, rgba(15, 23, 42, 0.1) 100%), url(${HERO_PROMOS[currentSlide].image})`
            }}
          >
            <div className="max-w-2xl px-8 sm:px-12 lg:px-16 text-white flex flex-col gap-4">
              <motion.span 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-accent-500 font-black tracking-widest text-xs uppercase"
              >
                {HERO_PROMOS[currentSlide].tagline}
              </motion.span>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-glow"
              >
                {HERO_PROMOS[currentSlide].title}
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-md sm:text-lg text-slate-300 leading-relaxed font-medium"
              >
                {HERO_PROMOS[currentSlide].subtitle}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-2"
              >
                <Link
                  to={HERO_PROMOS[currentSlide].link}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-full transition-all shadow-lg hover:scale-105"
                >
                  {HERO_PROMOS[currentSlide].cta} <FiArrowRight />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Nav Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all"
          aria-label="Previous Slide"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all"
          aria-label="Next Slide"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_PROMOS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentSlide ? 'bg-accent-500 w-8' : 'bg-white/40'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Menu Categories Shortcuts */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-8">
          Explore by <span className="text-accent-500">Category</span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Veg Pizzas', count: '5 Items', cat: 'veg', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=300&q=80', color: 'border-emerald-500' },
            { name: 'Non Veg Pizzas', count: '5 Items', cat: 'non-veg', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80', color: 'border-rose-500' },
            { name: 'Sides & Appetizers', count: '2 Items', cat: 'sides', img: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=300&q=80', color: 'border-blue-500' },
            { name: 'Sweet Desserts', count: '2 Items', cat: 'desserts', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=300&q=80', color: 'border-amber-500' }
          ].map((item, idx) => (
            <div 
              key={idx}
              onClick={() => navigate(`/menu?category=${item.cat}`)}
              className={`group relative h-40 rounded-2xl overflow-hidden cursor-pointer shadow-md border-b-4 ${item.color} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.85) 40%, rgba(15, 23, 42, 0.1)), url(${item.img})` }}
              />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                <span className="text-xs text-slate-350">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Sellers Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              Our <span className="text-accent-500">Best Sellers</span>
            </h2>
            <p className="text-sm text-slate-400 dark:text-slate-450 mt-1">Baked fresh, rated top by thousands of foodies.</p>
          </div>
          <Link to="/menu" className="flex items-center gap-1 text-sm font-bold text-primary-500 hover:text-accent-500 transition-colors">
            See All Menu <FiArrowRight />
          </Link>
        </div>

        {/* Pizza Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((pizza) => (
            <div 
              key={pizza.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="relative">
                <Link to={`/pizza/${pizza.id}`}>
                  <img 
                    src={pizza.image} 
                    alt={pizza.name} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </Link>
                
                {/* Popular Badge */}
                <span className="absolute top-3 left-3 bg-accent-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Popular
                </span>

                {/* Wishlist Button */}
                <button
                  onClick={() => {
                    toggleWishlist(pizza.id);
                    showToast(wishlist.includes(pizza.id) ? 'Removed from wishlist.' : 'Saved to wishlist!', 'success');
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-slate-700 dark:bg-slate-900/80 dark:hover:bg-slate-900 dark:text-slate-200 rounded-full backdrop-blur-sm transition-all"
                  aria-label="Add to wishlist"
                >
                  <FiHeart className={`w-4 h-4 ${wishlist.includes(pizza.id) ? 'fill-accent-500 text-accent-500' : ''}`} />
                </button>
              </div>

              {/* Pizza Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    {/* Category Dot */}
                    <div className="flex items-center gap-1.5">
                      <span className={`w-4 h-4 rounded border flex items-center justify-center ${pizza.isVeg ? 'veg-border' : 'nonveg-border'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${pizza.isVeg ? 'veg-dot' : 'nonveg-dot'}`} />
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {pizza.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                    </div>

                    {/* Ratings */}
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                      <FiStar className="fill-amber-500 text-amber-500" />
                      {pizza.rating}
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-primary-500 transition-colors leading-tight">
                    <Link to={`/pizza/${pizza.id}`}>{pizza.name}</Link>
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {pizza.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-700/60 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 dark:text-slate-500">Starting from</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">{formatPrice(pizza.basePrice)}</span>
                  </div>

                  <button
                    onClick={() => addToCart(pizza, 1)}
                    className="px-4.5 py-2 bg-primary-800 hover:bg-primary-900 dark:bg-slate-700 dark:hover:bg-slate-650 text-white font-black text-xs rounded-full transition-all shadow-md active:scale-95"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Value Props Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-24">
        <div className="bg-slate-100 dark:bg-slate-850 rounded-3xl p-8 sm:p-12 border border-slate-200/50 dark:border-slate-800/40 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 bg-white dark:bg-slate-800 text-accent-500 rounded-2xl flex items-center justify-center shadow-md">
              <FiShield className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">100% Quality Ingredients</h3>
            <p className="text-sm text-slate-400 dark:text-slate-400 max-w-xs leading-relaxed">
              We source organic tomatoes, freshly pulled farm cheese, and locally harvested herbs daily.
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 bg-white dark:bg-slate-800 text-accent-500 rounded-2xl flex items-center justify-center shadow-md">
              <FiTruck className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">30-Minute Speed delivery</h3>
            <p className="text-sm text-slate-400 dark:text-slate-400 max-w-xs leading-relaxed">
              Super-fast delivery riders dispatching your pizzas steaming hot straight to your doorstep.
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 bg-white dark:bg-slate-800 text-accent-500 rounded-2xl flex items-center justify-center shadow-md">
              <FiAward className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Chef Special Crusts</h3>
            <p className="text-sm text-slate-400 dark:text-slate-400 max-w-xs leading-relaxed">
              Indulge in our trademark Liquid Cheese Burst, crispy fresh Pan crust, or healthy Wheat Thin crust.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
