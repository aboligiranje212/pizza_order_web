import React, { useState, useEffect } from 'react';
import { FiX, FiCheck, FiInfo } from 'react-icons/fi';
import { SIZES, CRUSTS, TOPPINGS } from '../../services/mockData';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';

export default function CustomizationModal({ pizza, isOpen, onClose }) {
  if (!isOpen || !pizza) return null;

  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('regular');
  const [selectedCrust, setSelectedCrust] = useState('classic');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [totalPrice, setTotalPrice] = useState(pizza.basePrice);

  // Recalculate price in real-time as customizations shift
  useEffect(() => {
    const sizeObj = SIZES.find(s => s.id === selectedSize);
    const crustObj = CRUSTS.find(c => c.id === selectedCrust);
    
    const multiplier = sizeObj ? sizeObj.priceMultiplier : 1.0;
    const crustPrice = crustObj ? crustObj.extraPrice : 0.0;
    
    const toppingsPrice = selectedToppings.reduce((acc, tId) => {
      const topObj = TOPPINGS.find(t => t.id === tId);
      return acc + (topObj ? topObj.price : 0.0);
    }, 0.0);

    const calculatedPrice = (pizza.basePrice * multiplier) + crustPrice + toppingsPrice;
    setTotalPrice(parseFloat(calculatedPrice.toFixed(2)));
  }, [selectedSize, selectedCrust, selectedToppings, pizza]);

  const handleToppingToggle = (toppingId) => {
    setSelectedToppings(prev => 
      prev.includes(toppingId)
        ? prev.filter(id => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  const handleAddToCart = () => {
    addToCart(pizza, 1, selectedSize, selectedCrust, selectedToppings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header banner */}
        <div className="relative h-48 sm:h-56 bg-cover bg-center" style={{ backgroundImage: `url(${pizza.image})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
            aria-label="Close"
          >
            <FiX className="w-5 h-5" />
          </button>
          <div className="absolute bottom-5 left-6 text-white pr-6">
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${pizza.isVeg ? 'veg-border' : 'nonveg-border'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${pizza.isVeg ? 'veg-dot' : 'nonveg-dot'}`} />
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-350">
                {pizza.isVeg ? 'Veg' : 'Non Veg'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">{pizza.name}</h2>
            <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">{pizza.description}</p>
          </div>
        </div>

        {/* Customization Options */}
        <div className="p-6 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto flex flex-col gap-6">
          
          {/* Size selection */}
          <div>
            <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-3">Choose Size</h3>
            <div className="grid grid-cols-3 gap-3">
              {SIZES.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                    selectedSize === size.id 
                      ? 'border-accent-500 bg-accent-50/50 dark:bg-accent-950/20 text-accent-600 dark:text-accent-400 font-bold' 
                      : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className="text-sm">{size.name.split(' (')[0]}</span>
                  <span className="text-[10px] opacity-75 mt-0.5">{size.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Crust selection */}
          <div>
            <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-3">Choose Crust</h3>
            <div className="flex flex-col gap-2.5">
              {CRUSTS.map((crust) => (
                <label
                  key={crust.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedCrust === crust.id 
                      ? 'border-accent-500 bg-accent-50/30 dark:bg-accent-950/10' 
                      : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="crust" 
                      value={crust.id} 
                      checked={selectedCrust === crust.id}
                      onChange={() => setSelectedCrust(crust.id)}
                      className="accent-accent-500 w-4 h-4"
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

          {/* Toppings selection */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">Extra Toppings</h3>
              <span className="text-xs text-slate-450 dark:text-slate-500 flex items-center gap-1"><FiInfo /> Double charge applies</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {TOPPINGS.map((topping) => {
                const isSelected = selectedToppings.includes(topping.id);
                return (
                  <button
                    key={topping.id}
                    onClick={() => handleToppingToggle(topping.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all text-left ${
                      isSelected 
                        ? 'border-primary-500 bg-primary-50/40 dark:bg-primary-950/10 text-primary-700 dark:text-primary-400 font-bold' 
                        : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-350'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${isSelected ? 'bg-primary-500 border-primary-500 text-white' : 'border-slate-300'}`}>
                        {isSelected && <FiCheck className="w-3 h-3" />}
                      </div>
                      <span className="text-xs">{topping.name}</span>
                    </div>
                    <span className="text-xs font-semibold">{formatPrice(topping.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 dark:text-slate-550 uppercase tracking-wider font-bold">Total price</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{formatPrice(totalPrice)}</span>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleAddToCart}
              className="px-6 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-sm font-black rounded-full shadow-lg transition-transform active:scale-95"
            >
              ADD TO CART
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
