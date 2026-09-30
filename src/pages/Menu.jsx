import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiSliders, FiHeart, FiStar, FiChevronDown, FiX } from 'react-icons/fi';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import { formatPrice } from '../utils/helpers';
import CustomizationModal from '../components/menu/CustomizationModal';
import Loader from '../components/common/Loader';

const CATEGORIES = [
  { id: 'all', name: 'All Menu' },
  { id: 'veg', name: 'Veg Pizzas' },
  { id: 'non-veg', name: 'Non-Veg Pizzas' },
  { id: 'sides', name: 'Sides & Extras' },
  { id: 'drinks', name: 'Drinks' },
  { id: 'desserts', name: 'Desserts' }
];

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('popular');
  const [vegOnly, setVegOnly] = useState(false);
  const [priceLimit, setPriceLimit] = useState(20);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Customization modal states
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useApp();
  const { showToast } = useNotification();

  // Load menu from mock API on mount
  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const response = await api.getMenu();
        setMenuItems(response.data);
      } catch (err) {
        showToast('Failed to load menu items.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Update local search state if route param changes
  useEffect(() => {
    setSearchVal(searchParams.get('search') || '');
  }, [searchParams]);

  const handleCategorySelect = (categoryId) => {
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      searchParams.set('search', searchVal);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const handleAddClick = (item) => {
    if (item.category === 'veg' || item.category === 'non-veg') {
      setSelectedPizza(item);
      setIsCustomizeOpen(true);
    } else {
      addToCart(item, 1);
    }
  };

  // Filter & Sort Logic
  const getFilteredItems = () => {
    let list = [...menuItems];

    // 1. Filter by Category
    if (activeCategory !== 'all') {
      list = list.filter(item => item.category === activeCategory);
    }

    // 2. Filter by Search Query
    const searchParam = searchParams.get('search') || '';
    if (searchParam) {
      list = list.filter(item => 
        item.name.toLowerCase().includes(searchParam.toLowerCase()) ||
        item.description.toLowerCase().includes(searchParam.toLowerCase())
      );
    }

    // 3. Filter by Veg Toggles
    if (vegOnly) {
      list = list.filter(item => item.isVeg);
    }

    // 4. Filter by Max Price
    list = list.filter(item => item.basePrice <= priceLimit);

    // 5. Sorting
    if (sortBy === 'popular') {
      // Sort items by rating desc, or special flag
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-low') {
      list.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  };

  const filteredItems = getFilteredItems();

  const resetFilters = () => {
    setVegOnly(false);
    setPriceLimit(20);
    setSortBy('popular');
    setSearchVal('');
    searchParams.delete('search');
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 min-h-screen">
      
      {/* Search Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-premium border border-slate-100 dark:border-slate-700/60">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Our Pizza <span className="text-accent-500">Menu</span></h1>
          <p className="text-slate-400 text-xs mt-0.5">Explore delicious original recipes baked daily with love.</p>
        </div>
        
        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search pizzas, sides..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-10 pr-20 py-2.5 bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-accent-500 rounded-full text-sm outline-none transition-colors"
          />
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-450" />
          <button 
            type="submit" 
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-accent-500 text-white font-bold text-xs rounded-full hover:bg-accent-600 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Category Tab Slider */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id)}
            className={`px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider flex-shrink-0 transition-all ${
              activeCategory === cat.id
                ? 'bg-primary-800 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-650 dark:text-slate-200 border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Desktop Filter Panel (Left) */}
        <aside className="w-64 hidden lg:block flex-shrink-0 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-700/60 self-start">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-wider flex items-center gap-1.5">
              <FiSliders /> Filters
            </h2>
            <button onClick={resetFilters} className="text-xs text-accent-500 hover:underline font-bold">Reset</button>
          </div>

          <div className="flex flex-col gap-6">
            {/* Diet Toggles */}
            <div className="border-b border-slate-100 dark:border-slate-700/60 pb-5">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-250 mb-3">Dietary Type</h3>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={vegOnly}
                  onChange={(e) => setVegOnly(e.target.checked)}
                  className="accent-emerald-500 w-4.5 h-4.5 rounded"
                />
                <span className="text-sm font-semibold text-slate-650 dark:text-slate-350">Vegetarian Only</span>
              </label>
            </div>

            {/* Price limits */}
            <div className="border-b border-slate-100 dark:border-slate-700/60 pb-5">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-sm text-slate-700 dark:text-slate-250">Max Price</h3>
                <span className="text-sm font-black text-primary-500">{formatPrice(priceLimit)}</span>
              </div>
              <input 
                type="range"
                min="1.99"
                max="20.00"
                step="0.50"
                value={priceLimit}
                onChange={(e) => setPriceLimit(parseFloat(e.target.value))}
                className="w-full accent-accent-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>$1.99</span>
                <span>$20.00</span>
              </div>
            </div>

            {/* Sorting List */}
            <div>
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-250 mb-3">Sort By</h3>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'popular', name: 'Most Popular' },
                  { id: 'price-low', name: 'Price: Low to High' },
                  { id: 'price-high', name: 'Price: High to Low' },
                  { id: 'rating', name: 'Highest Rated' }
                ].map((s) => (
                  <label key={s.id} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-650 dark:text-slate-350">
                    <input 
                      type="radio"
                      name="sort-by"
                      value={s.id}
                      checked={sortBy === s.id}
                      onChange={() => setSortBy(s.id)}
                      className="accent-primary-500"
                    />
                    <span>{s.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Filters Header & Trigger */}
        <div className="lg:hidden flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60 mb-2">
          <button 
            onClick={() => setShowFiltersMobile(true)}
            className="flex items-center gap-1.5 text-sm font-black text-slate-700 dark:text-slate-200"
          >
            <FiSliders /> Show Filters
          </button>
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400">Sorted by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-xs text-primary-500 border-none outline-none"
            >
              <option value="popular">Popularity</option>
              <option value="price-low">Price: Low-High</option>
              <option value="price-high">Price: High-Low</option>
              <option value="rating">Ratings</option>
            </select>
          </div>
        </div>

        {/* Main Products Grid */}
        <div className="flex-1">
          {loading ? (
            <Loader text="Loading SliceCraft menu items..." />
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl shadow border border-slate-100 dark:border-slate-700/60">
              <p className="text-lg font-bold text-slate-600 dark:text-slate-300">No pizza slices found!</p>
              <p className="text-sm text-slate-400 mt-1">Try relaxing filters or search terms.</p>
              <button 
                onClick={resetFilters} 
                className="mt-4 px-5 py-2.5 bg-accent-500 text-white text-xs font-black rounded-full hover:bg-accent-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    
                    {/* Diet Category Indicator Badge */}
                    {item.isVeg !== undefined && (
                      <span className={`absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow backdrop-blur-sm`}>
                        <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className={item.isVeg ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}>
                          {item.isVeg ? 'VEG' : 'NON-VEG'}
                        </span>
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={() => {
                        toggleWishlist(item.id);
                        showToast(wishlist.includes(item.id) ? 'Removed from wishlist.' : 'Saved to wishlist!', 'success');
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-900/80 hover:bg-white text-slate-700 dark:text-slate-200 rounded-full backdrop-blur-sm transition-all"
                      aria-label="Add to wishlist"
                    >
                      <FiHeart className={`w-4 h-4 ${wishlist.includes(item.id) ? 'fill-accent-500 text-accent-500' : ''}`} />
                    </button>
                  </div>

                  {/* Card Content details */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.category}</span>
                        {item.rating && (
                          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                            <FiStar className="fill-amber-500" />
                            {item.rating}
                          </div>
                        )}
                      </div>

                      <h3 className="font-bold text-md text-slate-800 dark:text-slate-100 group-hover:text-primary-500 transition-colors leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-700/60 mt-auto">
                      <span className="text-lg font-black text-slate-900 dark:text-white">{formatPrice(item.basePrice)}</span>

                      <button
                        onClick={() => handleAddClick(item)}
                        className="px-4.5 py-1.5 bg-primary-800 hover:bg-primary-900 text-white font-bold text-xs rounded-full transition-all shadow active:scale-95 flex items-center gap-1"
                      >
                        ADD +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Pizza Customize Modal */}
      <CustomizationModal
        pizza={selectedPizza}
        isOpen={isCustomizeOpen}
        onClose={() => {
          setIsCustomizeOpen(false);
          setSelectedPizza(null);
        }}
      />

      {/* Mobile Drawer Filters Modal */}
      {showFiltersMobile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm p-6 overflow-y-auto flex flex-col gap-6 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="font-black text-slate-800 dark:text-white uppercase text-sm tracking-wider flex items-center gap-1.5">
                <FiSliders /> Filters
              </h2>
              <button onClick={() => setShowFiltersMobile(false)} className="p-1"><FiX className="w-5 h-5" /></button>
            </div>

            <div className="flex flex-col gap-6">
              {/* Diet Toggles */}
              <div>
                <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 mb-3">Dietary Type</h3>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={vegOnly}
                    onChange={(e) => setVegOnly(e.target.checked)}
                    className="accent-emerald-500 w-4.5 h-4.5 rounded"
                  />
                  <span className="text-sm font-semibold text-slate-650 dark:text-slate-350">Vegetarian Only</span>
                </label>
              </div>

              {/* Price limits */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">Max Price</h3>
                  <span className="text-sm font-black text-primary-500">{formatPrice(priceLimit)}</span>
                </div>
                <input 
                  type="range"
                  min="1.99"
                  max="20.00"
                  step="0.50"
                  value={priceLimit}
                  onChange={(e) => setPriceLimit(parseFloat(e.target.value))}
                  className="w-full accent-accent-500 cursor-pointer"
                />
              </div>

              {/* Sorting List */}
              <div>
                <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 mb-3">Sort By</h3>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'popular', name: 'Most Popular' },
                    { id: 'price-low', name: 'Price: Low to High' },
                    { id: 'price-high', name: 'Price: High to Low' },
                    { id: 'rating', name: 'Highest Rated' }
                  ].map((s) => (
                    <label key={s.id} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-650 dark:text-slate-350">
                      <input 
                        type="radio"
                        name="sort-by-mobile"
                        value={s.id}
                        checked={sortBy === s.id}
                        onChange={() => setSortBy(s.id)}
                        className="accent-primary-500"
                      />
                      <span>{s.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t flex gap-3">
              <button 
                onClick={resetFilters} 
                className="flex-1 py-2.5 rounded-full border text-slate-500 font-bold text-xs uppercase"
              >
                Clear
              </button>
              <button 
                onClick={() => setShowFiltersMobile(false)}
                className="flex-1 py-2.5 bg-accent-500 text-white rounded-full font-bold text-xs uppercase shadow"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
