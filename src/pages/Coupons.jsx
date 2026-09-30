import React, { useState, useEffect } from 'react';
import { FiPercent, FiCopy, FiCheck } from 'react-icons/fi';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import Loader from '../components/common/Loader';

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');

  const { applyCoupon } = useCart();
  const { showToast } = useNotification();

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const response = await api.getCoupons();
        setCoupons(response.data);
      } catch (err) {
        showToast('Failed to load active coupons.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Code "${code}" copied to clipboard!`, 'info');
    setTimeout(() => setCopiedCode(''), 3000);
  };

  const handleApplyCoupon = (code) => {
    applyCoupon(code);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 min-h-screen">
      
      {/* Page Header */}
      <div className="mb-10 text-center max-w-xl mx-auto">
        <div className="inline-flex p-3 bg-accent-50 text-accent-500 rounded-2xl mb-3 shadow">
          <FiPercent className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
          Active Promo <span className="text-accent-500">Coupons</span>
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Claim these exclusive voucher codes at checkout to unlock tasty discounts.
        </p>
      </div>

      {loading ? (
        <Loader text="Fetching coupon list..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300 flex items-center justify-between gap-6 relative overflow-hidden"
            >
              {/* Semi-circular ticket punch cuts */}
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-700/60" />
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-700/60" />

              <div className="flex-1 flex gap-4 pl-4 items-start">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-950/30 text-primary-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow">
                  <FiPercent className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg text-slate-800 dark:text-white uppercase tracking-wider">{coupon.code}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{coupon.description}</p>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 block">
                    Min Order: ${coupon.minOrder.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pr-4">
                <button
                  onClick={() => handleCopyCode(coupon.code)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    copiedCode === coupon.code
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                  title="Copy Coupon Code"
                >
                  {copiedCode === coupon.code ? <FiCheck /> : <FiCopy />}
                  <span className="hidden sm:inline">{copiedCode === coupon.code ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => handleApplyCoupon(coupon.code)}
                  className="px-4 py-2.5 bg-primary-800 hover:bg-primary-900 text-white font-black text-xs rounded-xl uppercase tracking-wider shadow transition-colors"
                >
                  Apply
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
