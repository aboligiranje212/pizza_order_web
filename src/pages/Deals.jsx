import React, { useState, useEffect } from 'react';
import { FiGift, FiPlus, FiStar, FiHeart } from 'react-icons/fi';
import { api } from '../services/api';
import { PIZZAS } from '../services/mockData';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { formatPrice } from '../utils/helpers';
import Loader from '../components/common/Loader';

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useNotification();

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const response = await api.getDeals();
        setDeals(response.data);
      } catch (err) {
        showToast('Failed to load active deals.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const handleClaimDeal = (deal) => {
    // Traverse items and add to cart
    let addedCount = 0;
    deal.items.forEach((itemId) => {
      const product = PIZZAS.find((p) => p.id === itemId);
      if (product) {
        // Add to cart with default options (regular size, classic crust)
        addToCart(product, 1);
        addedCount++;
      }
    });
    
    if (addedCount > 0) {
      showToast(`Combo Deal "${deal.name}" items added to cart!`, 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 min-h-screen">
      
      {/* Page Header */}
      <div className="mb-10 text-center max-w-xl mx-auto">
        <div className="inline-flex p-3 bg-accent-50 text-accent-500 rounded-2xl mb-3 shadow">
          <FiGift className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
          Special Combo <span className="text-accent-500">Deals</span>
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Hand-curated pizza feasts and sides bundles designed to save you big bucks.
        </p>
      </div>

      {loading ? (
        <Loader text="Gathering fresh deals..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between"
            >
              
              {/* Image banner */}
              <div className="relative h-48 bg-cover bg-center" style={{ backgroundImage: `url(${deal.image})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                <span className="absolute top-4 left-4 bg-accent-500 text-white font-black text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-full shadow">
                  {deal.saving}
                </span>
              </div>

              {/* Deal details */}
              <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                <div>
                  <h3 className="text-xl font-black text-slate-850 dark:text-white tracking-tight leading-snug">
                    {deal.name}
                  </h3>
                  <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed mt-2">
                    {deal.description}
                  </p>
                  
                  {/* Visual listing of combo components */}
                  <div className="mt-4">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase">What's Included:</span>
                    <ul className="mt-2 flex flex-col gap-1 text-xs font-semibold text-slate-600 dark:text-slate-350">
                      {deal.items.map((itemId, idx) => {
                        const product = PIZZAS.find(p => p.id === itemId);
                        return (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
                            {product ? product.name : 'Pizza Slice'}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-700/60 pt-4 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 line-through">{formatPrice(deal.originalPrice)}</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{formatPrice(deal.price)}</span>
                  </div>

                  <button
                    onClick={() => handleClaimDeal(deal)}
                    className="inline-flex items-center gap-1 px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-black rounded-full shadow-lg transition-transform active:scale-95"
                  >
                    <FiPlus /> ADD COMBO
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
