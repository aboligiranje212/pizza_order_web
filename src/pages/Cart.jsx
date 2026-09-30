import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiPercent, FiChevronRight, FiGift, FiPlusCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { SIZES, CRUSTS, TOPPINGS, PIZZAS } from '../services/mockData';
import { formatPrice } from '../utils/helpers';
import { useNotification } from '../context/NotificationContext';

export default function Cart() {
  const {
    cartItems,
    appliedCoupon,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getDeliveryFee,
    getGST,
    getTotal
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      showToast('Please type a coupon code.', 'warning');
      return;
    }
    const success = applyCoupon(couponCode);
    if (success) {
      setCouponCode('');
    }
  };

  // Upsell Recommendations: recommend sides/drinks/desserts not in cart
  const cartProductIds = cartItems.map(item => item.id);
  const recommendations = PIZZAS.filter(
    p => (p.category === 'sides' || p.category === 'drinks' || p.category === 'desserts') && !cartProductIds.includes(p.id)
  ).slice(0, 4);

  const getCustomizationSummary = (item) => {
    if (!item.isPizza) return '';
    const sizeName = SIZES.find(s => s.id === item.size)?.name.split(' (')[0];
    const crustName = CRUSTS.find(c => c.id === item.crust)?.name;
    const toppingsNames = item.toppings
      .map(tId => TOPPINGS.find(t => t.id === tId)?.name)
      .filter(Boolean)
      .join(', ');
    
    return `${sizeName} | ${crustName} ${toppingsNames ? ` | Extra: ${toppingsNames}` : ''}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 text-slate-300 dark:text-slate-700 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Your Cart is <span className="text-accent-500">Empty</span></h1>
        <p className="text-slate-400 text-sm mt-2 max-w-sm">Looks like you haven't added any pizza slices to your oven yet.</p>
        <Link 
          to="/menu"
          className="mt-6 px-8 py-3 bg-accent-500 hover:bg-accent-600 text-white font-black text-sm rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          EXPLORE MENU NOW
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 min-h-screen">
      <h1 className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mb-8">Shopping <span className="text-accent-500">Cart</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Items (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-700/60 overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {cartItems.map((item) => (
                <div key={item.combinationId} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex gap-4 items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl shadow" />
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-snug">{item.name}</h3>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 leading-relaxed max-w-md">
                        {getCustomizationSummary(item)}
                      </p>
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-450 mt-1.5 block">
                        {formatPrice(item.singlePrice)} each
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-0 pt-4 sm:pt-0">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2.5 p-1 border border-slate-200 dark:border-slate-700 rounded-full">
                      <button
                        onClick={() => updateQuantity(item.combinationId, item.quantity - 1)}
                        className="p-1.5 bg-slate-50 dark:bg-slate-900 hover:bg-slate-150 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-full transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-black text-sm text-slate-800 dark:text-white w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.combinationId, item.quantity + 1)}
                        className="p-1.5 bg-slate-50 dark:bg-slate-900 hover:bg-slate-150 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-full transition-colors"
                        aria-label="Increase quantity"
                      >
                        <FiPlus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Price subtotal */}
                      <span className="font-black text-md text-slate-800 dark:text-white min-w-[70px] text-right">
                        {formatPrice(item.singlePrice * item.quantity)}
                      </span>
                      {/* Trash action */}
                      <button
                        onClick={() => removeFromCart(item.combinationId)}
                        className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 rounded-full transition-colors"
                        aria-label="Remove item"
                      >
                        <FiTrash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Add-ons Slider (Upsell) */}
          {recommendations.length > 0 && (
            <div className="bg-slate-100 dark:bg-slate-850 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
              <h3 className="font-black text-xs text-slate-550 dark:text-slate-300 tracking-wider uppercase mb-4 flex items-center gap-1.5">
                <FiGift className="text-accent-500" /> Complete your Feast?
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {recommendations.map((prod) => (
                  <div key={prod.id} className="bg-white dark:bg-slate-850 rounded-2xl p-3 border border-slate-150 dark:border-slate-800 flex flex-col justify-between shadow-sm">
                    <img src={prod.image} alt={prod.name} className="w-full h-24 object-cover rounded-xl mb-2" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-250 truncate" title={prod.name}>{prod.name}</h4>
                      <span className="text-xs font-black text-slate-900 dark:text-white mt-0.5 block">{formatPrice(prod.basePrice)}</span>
                    </div>
                    <button
                      onClick={() => updateQuantity(prod.id, 1)} // Adds to cart directly via update hook helper (or add to cart)
                      className="mt-2.5 w-full py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-primary-50 hover:text-primary-650 dark:hover:bg-slate-700 text-[10px] font-black text-slate-500 dark:text-slate-350 rounded-lg flex items-center justify-center gap-1 transition-all"
                    >
                      <FiPlusCircle /> ADD
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Summaries (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Coupon Code Input */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-700/60 flex flex-col gap-4">
            <h3 className="font-black text-xs text-slate-750 dark:text-slate-250 tracking-wider uppercase flex items-center gap-1.5"><FiPercent className="text-accent-500" /> Coupons & Offers</h3>
            
            {appliedCoupon ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 p-3 rounded-2xl flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-350">{appliedCoupon.code} Applied</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Coupon terms applied.</span>
                </div>
                <button 
                  onClick={removeCoupon}
                  className="text-xs text-rose-500 font-bold hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon (e.g. SLICECRAFT50)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-accent-500 text-slate-800 dark:text-slate-100"
                />
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-950 dark:bg-slate-700 dark:hover:bg-slate-650 text-white font-black text-xs rounded-xl uppercase tracking-wider transition-colors"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Pricing calculations */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-700/60 flex flex-col gap-4">
            <h3 className="font-black text-xs text-slate-750 dark:text-slate-250 tracking-wider uppercase border-b pb-3">Order Summary</h3>
            
            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between text-slate-550 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-850 dark:text-slate-200">{formatPrice(getSubtotal())}</span>
              </div>
              
              {getDiscount() > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(getDiscount())}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-550 dark:text-slate-400">
                <span>Delivery Charge</span>
                <span className="font-semibold text-slate-850 dark:text-slate-200">
                  {getDeliveryFee() === 0 ? 'FREE' : formatPrice(getDeliveryFee())}
                </span>
              </div>

              <div className="flex justify-between text-slate-550 dark:text-slate-400">
                <span>GST (18% Sales Tax)</span>
                <span className="font-semibold text-slate-850 dark:text-slate-200">{formatPrice(getGST())}</span>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700/60 pt-4 flex justify-between text-lg font-black text-slate-900 dark:text-white">
                <span>Grand Total</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-2 py-3.5 bg-accent-500 hover:bg-accent-600 text-white font-black text-sm rounded-full shadow-lg hover:scale-102 transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider"
            >
              PROCEED TO CHECKOUT <FiChevronRight />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
