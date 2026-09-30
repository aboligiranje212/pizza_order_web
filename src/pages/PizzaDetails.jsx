import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiStar, FiHeart, FiMinus, FiPlus, FiShoppingCart, FiInfo } from 'react-icons/fi';
import { api } from '../services/api';
import { SIZES, CRUSTS, TOPPINGS } from '../services/mockData';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import { formatPrice } from '../utils/helpers';
import Loader from '../components/common/Loader';

export default function PizzaDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist, addRecentlyViewed } = useApp();

  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [activeTab, setActiveTab] = useState('ingredients');

  // Customization States
  const [selectedSize, setSelectedSize] = useState('regular');
  const [selectedCrust, setSelectedCrust] = useState('classic');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [singlePrice, setSinglePrice] = useState(0);

  // New review form mockup states
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [localReviews, setLocalReviews] = useState([]);

  // Fetch pizza details
  useEffect(() => {
    const fetchPizza = async () => {
      setLoading(true);
      try {
        const response = await api.getPizzaById(id);
        const data = response.data;
        setPizza(data);
        setActiveImage(data.image);
        setSinglePrice(data.basePrice);
        setLocalReviews(data.reviews || []);
        
        // Add to Recently Viewed list
        addRecentlyViewed(data.id);
      } catch (err) {
        showToast('Pizza not found!', 'error');
        navigate('/menu');
      } finally {
        setLoading(false);
      }
    };
    fetchPizza();
  }, [id]);

  // Dynamic Price Calculator
  useEffect(() => {
    if (!pizza) return;
    const isPizza = pizza.category === 'veg' || pizza.category === 'non-veg';
    if (!isPizza) {
      setSinglePrice(pizza.basePrice);
      return;
    }

    const sizeObj = SIZES.find(s => s.id === selectedSize);
    const crustObj = CRUSTS.find(c => c.id === selectedCrust);
    
    const multiplier = sizeObj ? sizeObj.priceMultiplier : 1.0;
    const crustPrice = crustObj ? crustObj.extraPrice : 0.0;
    
    const toppingsPrice = selectedToppings.reduce((acc, tId) => {
      const topObj = TOPPINGS.find(t => t.id === tId);
      return acc + (topObj ? topObj.price : 0.0);
    }, 0.0);

    const calculatedSingle = (pizza.basePrice * multiplier) + crustPrice + toppingsPrice;
    setSinglePrice(parseFloat(calculatedSingle.toFixed(2)));
  }, [selectedSize, selectedCrust, selectedToppings, pizza]);

  if (loading) {
    return <div className="pt-28"><Loader text="Preparing gourmet view..." /></div>;
  }

  if (!pizza) return null;

  const isPizza = pizza.category === 'veg' || pizza.category === 'non-veg';

  const handleToppingToggle = (toppingId) => {
    setSelectedToppings(prev => 
      prev.includes(toppingId)
        ? prev.filter(t => t !== toppingId)
        : [...prev, toppingId]
    );
  };

  const handleAddToCart = () => {
    addToCart(pizza, quantity, selectedSize, selectedCrust, selectedToppings);
    showToast(`Added ${quantity} x ${pizza.name} to Cart`, 'success');
  };

  const handleAddReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName || !reviewText) {
      showToast('Please fill out all fields.', 'error');
      return;
    }
    const newRev = {
      id: 'rev_' + Date.now(),
      name: reviewName,
      rating: reviewRating,
      date: 'Today',
      comment: reviewText
    };
    setLocalReviews(prev => [newRev, ...prev]);
    showToast('Thank you! Review added successfully.', 'success');
    setReviewName('');
    setReviewText('');
    setReviewRating(5);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      
      {/* Back button */}
      <Link to="/menu" className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-accent-500 mb-6 transition-colors">
        ← Back to Menu
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Images & Info tabs (5 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          {/* Main Showcase Image */}
          <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-3xl shadow border border-slate-100 dark:border-slate-700/60">
            <img 
              src={activeImage} 
              alt={pizza.name} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            {/* Diet Category Indicator */}
            {isPizza && (
              <span className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/90 text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow backdrop-blur-sm">
                <span className={`w-2 h-2 rounded-full ${pizza.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <span className={pizza.isVeg ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}>
                  {pizza.isVeg ? 'VEG' : 'NON-VEG'}
                </span>
              </span>
            )}
            
            {/* Heart Wishlist Toggle */}
            <button
              onClick={() => {
                toggleWishlist(pizza.id);
                showToast(wishlist.includes(pizza.id) ? 'Removed from wishlist.' : 'Saved to wishlist!', 'success');
              }}
              className="absolute top-4 right-4 p-2.5 bg-white dark:bg-slate-900 shadow hover:bg-slate-550 text-slate-750 dark:text-slate-200 rounded-full transition-all"
            >
              <FiHeart className={`w-5 h-5 ${wishlist.includes(pizza.id) ? 'fill-accent-500 text-accent-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnail Gallery (only for Pizza) */}
          {isPizza && pizza.images && pizza.images.length > 1 && (
            <div className="flex gap-4">
              {pizza.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === img ? 'border-accent-500 scale-105' : 'border-slate-200 dark:border-slate-750 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Details tab menu */}
          <div className="mt-4 bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-premium border border-slate-100 dark:border-slate-700/60">
            <div className="flex border-b border-slate-100 dark:border-slate-700 pb-3 mb-5 gap-6">
              {[
                { id: 'ingredients', label: 'Ingredients' },
                { id: 'nutrition', label: 'Nutrition' },
                { id: 'reviews', label: `Reviews (${localReviews.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-1 font-bold text-xs uppercase tracking-wider relative transition-colors ${
                    activeTab === tab.id ? 'text-primary-500' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            {activeTab === 'ingredients' && (
              <div>
                <ul className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-350">
                  {(pizza.ingredients || []).map((ing, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="overflow-hidden border border-slate-100 dark:border-slate-700/60 rounded-xl">
                <table className="w-full text-sm text-left">
                  <tbody>
                    {Object.entries(pizza.nutrition || {}).map(([key, val]) => (
                      <tr key={key} className="border-b border-slate-50 dark:border-slate-700/60 last:border-0 hover:bg-slate-50/50">
                        <td className="px-4 py-2.5 font-bold text-slate-550 capitalize">{key}</td>
                        <td className="px-4 py-2.5 text-slate-650 dark:text-slate-350">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="flex flex-col gap-6">
                
                {/* List of customer reviews */}
                <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
                  {localReviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{rev.name}</span>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <FiStar key={i} className="w-3.5 h-3.5 fill-amber-500" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Add Review Form */}
                <form onSubmit={handleAddReviewSubmit} className="border-t border-slate-100 dark:border-slate-700 pt-4 flex flex-col gap-3">
                  <h4 className="font-black text-xs text-slate-700 dark:text-slate-200 uppercase tracking-wider">Leave a Review</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      placeholder="Your Name..." 
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none"
                    />
                    <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border rounded-xl">
                      <span className="text-xs text-slate-400">Rating:</span>
                      <select 
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="bg-transparent text-xs font-bold text-amber-500 outline-none"
                      >
                        <option value="5" className="dark:bg-slate-800">5 Stars</option>
                        <option value="4" className="dark:bg-slate-800">4 Stars</option>
                        <option value="3" className="dark:bg-slate-800">3 Stars</option>
                        <option value="2" className="dark:bg-slate-800">2 Stars</option>
                        <option value="1" className="dark:bg-slate-800">1 Star</option>
                      </select>
                    </div>
                  </div>
                  <textarea 
                    rows="3"
                    placeholder="Describe your pizza experience..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none resize-none"
                  />
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-primary-850 text-white font-bold text-xs rounded-xl hover:bg-primary-900 self-end transition-colors"
                  >
                    Submit Review
                  </button>
                </form>

              </div>
            )}
          </div>

        </div>

        {/* Right Side: Customization (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{pizza.name}</h1>
            
            <div className="flex items-center gap-4 mt-2">
              {pizza.rating && (
                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full">
                  <FiStar className="fill-amber-500" />
                  {pizza.rating} <span className="text-xs font-semibold text-slate-400">({pizza.reviewsCount} reviews)</span>
                </div>
              )}
              <span className="text-slate-400 capitalize text-sm">{pizza.category} pizza</span>
            </div>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mt-4">
              {pizza.description}
            </p>
          </div>

          {isPizza ? (
            <>
              {/* Sizing options */}
              <div className="border-t border-slate-100 dark:border-slate-700/60 pt-5">
                <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-3">Choose Sizing</h3>
                <div className="grid grid-cols-3 gap-3">
                  {SIZES.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                        selectedSize === size.id 
                          ? 'border-accent-500 bg-accent-50/50 dark:bg-accent-950/20 text-accent-600 dark:text-accent-400 font-bold' 
                          : 'border-slate-100 dark:border-slate-750 hover:bg-slate-50 text-slate-600 dark:text-slate-350'
                      }`}
                    >
                      <span className="text-sm">{size.name.split(' (')[0]}</span>
                      <span className="text-[10px] opacity-75 mt-0.5">{size.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Crust options */}
              <div className="border-t border-slate-100 dark:border-slate-700/60 pt-5">
                <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-3">Choose Crust</h3>
                <div className="flex flex-col gap-2.5">
                  {CRUSTS.map((crust) => (
                    <label
                      key={crust.id}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedCrust === crust.id 
                          ? 'border-accent-500 bg-accent-50/30 dark:bg-accent-950/10' 
                          : 'border-slate-100 dark:border-slate-750 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="crust" 
                          value={crust.id} 
                          checked={selectedCrust === crust.id}
                          onChange={() => setSelectedCrust(crust.id)}
                          className="accent-accent-500 w-4.5 h-4.5"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{crust.name}</span>
                          <span className="text-xs text-slate-400 mt-0.5">{crust.description}</span>
                        </div>
                      </div>
                      {crust.extraPrice > 0 && (
                        <span className="text-xs font-black text-slate-500 dark:text-slate-400">+{formatPrice(crust.extraPrice)}</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Toppings options */}
              <div className="border-t border-slate-100 dark:border-slate-700/60 pt-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">Extra Toppings</h3>
                  <span className="text-xs text-slate-450 flex items-center gap-1"><FiInfo /> Double charge applies</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {TOPPINGS.map((topping) => {
                    const isSelected = selectedToppings.includes(topping.id);
                    return (
                      <button
                        key={topping.id}
                        onClick={() => handleToppingToggle(topping.id)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left ${
                          isSelected 
                            ? 'border-primary-500 bg-primary-50/40 dark:bg-primary-950/10 text-primary-700 dark:text-primary-400 font-bold' 
                            : 'border-slate-100 dark:border-slate-750 hover:bg-slate-50 text-slate-650 dark:text-slate-350'
                        }`}
                      >
                        <span className="text-xs">{topping.name}</span>
                        <span className="text-xs font-semibold">{formatPrice(topping.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 flex items-center gap-3">
              <FiInfo className="text-accent-500 flex-shrink-0 w-5 h-5" />
              <p className="text-xs text-slate-500 leading-relaxed">
                This item is pre-baked to our chef's perfect recipe and does not require size/crust customization. Enjoy!
              </p>
            </div>
          )}

          {/* Pricing & Add to Cart Counter Action Box */}
          <div className="border-t border-slate-100 dark:border-slate-700/60 pt-6 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Quantity</span>
              <div className="flex items-center gap-3.5 p-1.5 border border-slate-200 dark:border-slate-700 rounded-full">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full transition-colors"
                >
                  <FiMinus />
                </button>
                <span className="font-black text-md text-slate-800 dark:text-white w-5 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full transition-colors"
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex flex-col text-right sm:text-left">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Subtotal</span>
                <span className="text-3xl font-black text-slate-900 dark:text-white">{formatPrice(singlePrice * quantity)}</span>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="inline-flex items-center gap-2 px-8 py-3 bg-accent-500 hover:bg-accent-600 text-white font-black text-sm rounded-full shadow-lg transition-transform active:scale-95"
              >
                <FiShoppingCart /> ADD TO CART
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
