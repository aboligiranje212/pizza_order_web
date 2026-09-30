import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMapPin, FiCreditCard, FiSmartphone, FiDollarSign, FiShoppingBag, FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { formatPrice } from '../utils/helpers';
import { api } from '../services/api';

export default function Checkout() {
  const { cartItems, getTotal, getCartCount, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  // Tab & Form States
  const [deliveryType, setDeliveryType] = useState('delivery'); // 'delivery' | 'takeaway'
  const [selectedAddressId, setSelectedAddressId] = useState(user?.addresses[0]?.id || 'new');
  const [newAddress, setNewAddress] = useState({ name: '', phone: '', line: '', zip: '' });
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi' | 'cod'
  
  // Card Payment States
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
  
  // Success overlay state
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderStep, setOrderStep] = useState(1); // 1: Submitting, 2: Confirmed

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Checkout is empty</h1>
        <Link to="/menu" className="mt-4 px-6 py-2.5 bg-accent-500 text-white font-bold text-xs rounded-full shadow">
          Go to Menu
        </Link>
      </div>
    );
  }

  const handlePlaceOrderSubmit = async (e) => {
    e.preventDefault();

    // Validate delivery address
    if (deliveryType === 'delivery' && selectedAddressId === 'new') {
      if (!newAddress.name || !newAddress.phone || !newAddress.line || !newAddress.zip) {
        showToast('Please fill out all address details.', 'warning');
        return;
      }
    }

    // Validate credit card details if selected
    if (paymentMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc || !cardDetails.name) {
        showToast('Please fill out credit card details.', 'warning');
        return;
      }
    }

    // Start placing order animations
    setIsPlacingOrder(true);
    setOrderStep(1);

    try {
      const addressText = deliveryType === 'takeaway' 
        ? 'Store Pickup - Main Hub'
        : selectedAddressId === 'new'
          ? `${newAddress.line}, Zip: ${newAddress.zip}`
          : user?.addresses.find(a => a.id === selectedAddressId)?.addressLine;

      const orderPayload = {
        items: cartItems,
        total: getTotal(),
        address: addressText,
        paymentMethod: paymentMethod.toUpperCase()
      };

      const response = await api.placeOrder(orderPayload);
      
      // kitchen preparing delay
      setTimeout(() => {
        setOrderStep(2);
        
        // Add to Order History
        const createdOrder = addOrder(response.data);
        
        // Finalize order clearance
        setTimeout(() => {
          setIsPlacingOrder(false);
          clearCart();
          navigate(`/order-tracking/${createdOrder.id}`);
        }, 1500);

      }, 1500);

    } catch (err) {
      setIsPlacingOrder(false);
      showToast('Payment verification failed. Please try again.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 min-h-screen">
      <h1 className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mb-8">Checkout <span className="text-accent-500">Details</span></h1>

      <form onSubmit={handlePlaceOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Details (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Step 1: Delivery Mode */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-700/60">
            <h2 className="font-black text-xs text-slate-750 dark:text-slate-250 uppercase tracking-wider mb-4 flex items-center gap-1.5"><FiMapPin className="text-accent-500" /> Delivery Mode</h2>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`py-3 rounded-2xl font-bold text-xs uppercase tracking-wider border-2 transition-all ${
                  deliveryType === 'delivery'
                    ? 'border-accent-500 bg-accent-50/50 dark:bg-accent-950/20 text-accent-600 dark:text-accent-400'
                    : 'border-slate-100 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-500'
                }`}
              >
                Home Delivery
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('takeaway')}
                className={`py-3 rounded-2xl font-bold text-xs uppercase tracking-wider border-2 transition-all ${
                  deliveryType === 'takeaway'
                    ? 'border-accent-500 bg-accent-50/50 dark:bg-accent-950/20 text-accent-600 dark:text-accent-400'
                    : 'border-slate-100 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-500'
                }`}
              >
                Takeaway / Pickup
              </button>
            </div>

            {deliveryType === 'delivery' && (
              <div className="flex flex-col gap-4">
                {/* Saved User Addresses */}
                {user && user.addresses && user.addresses.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Saved Address:</span>
                    {user.addresses.map((addr) => (
                      <label 
                        key={addr.id}
                        className={`flex items-center gap-3 p-3 border-2 rounded-2xl cursor-pointer transition-colors ${
                          selectedAddressId === addr.id ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/10' : 'border-slate-100 dark:border-slate-750 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="delivery_address"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="accent-primary-500"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-slate-750 dark:text-slate-200">{addr.type}</span>
                          <p className="text-slate-400 mt-0.5">{addr.addressLine}</p>
                        </div>
                      </label>
                    ))}
                    <label 
                      className={`flex items-center gap-3 p-3 border-2 rounded-2xl cursor-pointer transition-colors ${
                        selectedAddressId === 'new' ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/10' : 'border-slate-100 dark:border-slate-750 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery_address"
                        value="new"
                        checked={selectedAddressId === 'new'}
                        onChange={() => setSelectedAddressId('new')}
                        className="accent-primary-500"
                      />
                      <span className="text-xs font-bold text-slate-750 dark:text-slate-200">Ship to a new Address</span>
                    </label>
                  </div>
                )}

                {/* New Address Inputs */}
                {(selectedAddressId === 'new' || !user) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 animate-in fade-in duration-200">
                    <input
                      type="text"
                      placeholder="Receiver Name"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                      className="px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Contact Phone"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Address Line (Street, Flat...)"
                      value={newAddress.line}
                      onChange={(e) => setNewAddress({ ...newAddress, line: e.target.value })}
                      className="sm:col-span-2 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Zipcode / Pin"
                      value={newAddress.zip}
                      onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                      className="px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            {deliveryType === 'takeaway' && (
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center gap-3">
                <span className="p-2 bg-emerald-50 text-emerald-500 rounded-xl"><FiCheckCircle className="w-5 h-5" /></span>
                <div className="text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-100">Ready in 15 Minutes</span>
                  <p className="text-slate-400 mt-0.5">Collect your order directly from our SliceCraft Central Kitchen Hub.</p>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Payment Selector */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-700/60">
            <h2 className="font-black text-xs text-slate-750 dark:text-slate-250 uppercase tracking-wider mb-4 flex items-center gap-1.5"><FiCreditCard className="text-accent-500" /> Payment Method</h2>
            
            <div className="flex gap-2 mb-6">
              {[
                { id: 'card', name: 'Card', icon: <FiCreditCard /> },
                { id: 'upi', name: 'UPI Scan', icon: <FiSmartphone /> },
                { id: 'cod', name: 'Cash (COD)', icon: <FiDollarSign /> }
              ].map((pay) => (
                <button
                  key={pay.id}
                  type="button"
                  onClick={() => setPaymentMethod(pay.id)}
                  className={`flex-1 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider border-2 flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === pay.id
                      ? 'border-primary-500 bg-primary-50/40 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400'
                      : 'border-slate-100 dark:border-slate-750 hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  {pay.icon} {pay.name}
                </button>
              ))}
            </div>

            {/* Credit Card Inputs */}
            {paymentMethod === 'card' && (
              <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  className="px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none"
                />
                <input
                  type="text"
                  placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  className="px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Expiry MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    className="px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none"
                  />
                  <input
                    type="password"
                    maxLength="3"
                    placeholder="CVV / CVC"
                    value={cardDetails.cvc}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                    className="px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none"
                  />
                </div>
              </div>
            )}

            {/* UPI QR scan code */}
            {paymentMethod === 'upi' && (
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 border rounded-2xl gap-3 text-center animate-in fade-in duration-200">
                <div className="w-32 h-32 bg-white dark:bg-slate-800 border-4 border-slate-200 p-2 rounded-xl flex items-center justify-center shadow">
                  {/* Mock QR SVG representation */}
                  <svg className="w-full h-full text-slate-850" viewBox="0 0 100 100">
                    <rect x="0" y="0" width="30" height="30" fill="currentColor"/>
                    <rect x="70" y="0" width="30" height="30" fill="currentColor"/>
                    <rect x="0" y="70" width="30" height="30" fill="currentColor"/>
                    <rect x="10" y="10" width="10" height="10" fill="white"/>
                    <rect x="80" y="10" width="10" height="10" fill="white"/>
                    <rect x="10" y="80" width="10" height="10" fill="white"/>
                    {/* Random noise squares */}
                    <rect x="40" y="20" width="10" height="30" fill="currentColor"/>
                    <rect x="50" y="40" width="20" height="10" fill="currentColor"/>
                    <rect x="30" y="70" width="20" height="20" fill="currentColor"/>
                    <rect x="80" y="80" width="10" height="10" fill="currentColor"/>
                  </svg>
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-100">Scan QR Code via UPI App</span>
                  <p className="text-slate-400 mt-0.5">Authorize the request using GPay, ApplePay, or PhonePe.</p>
                </div>
              </div>
            )}

            {/* Cash on Delivery details */}
            {paymentMethod === 'cod' && (
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center gap-3 animate-in fade-in duration-200">
                <span className="p-2 bg-amber-50 text-amber-500 rounded-xl"><FiDollarSign className="w-5 h-5" /></span>
                <div className="text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-100">Pay on Arrival</span>
                  <p className="text-slate-400 mt-0.5">Please keep correct change ($ Cash or Card swipe) ready for our rider.</p>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Checkout Summary (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-700/60 flex flex-col gap-4">
            <h2 className="font-black text-xs text-slate-750 dark:text-slate-250 tracking-wider uppercase border-b pb-3 flex items-center gap-1.5"><FiShoppingBag className="text-accent-500" /> Order Checkout</h2>
            
            {/* Quick read-only listing of items */}
            <div className="divide-y max-h-[220px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.combinationId} className="py-2.5 flex justify-between items-center text-xs gap-3">
                  <div className="flex gap-2 items-center">
                    <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
                      <span className="text-[10px] text-slate-400 ml-1">x {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-850 dark:text-slate-100">{formatPrice(item.singlePrice * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Total items badge count */}
            <div className="flex justify-between items-center text-xs text-slate-400 pt-1 border-t">
              <span>Total Items</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{getCartCount()} Items</span>
            </div>

            <div className="flex justify-between items-center text-lg font-black text-slate-900 dark:text-white pt-2">
              <span>Amount Due</span>
              <span className="text-accent-500">{formatPrice(getTotal())}</span>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3.5 bg-accent-500 hover:bg-accent-600 text-white font-black text-sm rounded-full shadow-lg hover:scale-102 transition-all uppercase tracking-wider"
            >
              PLACE PIZZA ORDER
            </button>
          </div>
        </div>

      </form>

      {/* Placing Order Fullscreen Overlay Animation */}
      {isPlacingOrder && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/95 flex flex-col items-center justify-center text-center p-6 select-none">
          <div className="max-w-xs flex flex-col items-center">
            
            {orderStep === 1 ? (
              <div className="flex flex-col items-center gap-4">
                <svg className="w-16 h-16 text-accent-500 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" className="opacity-25" />
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                <h3 className="text-white text-xl font-bold">Contacting SliceCraft Kitchen...</h3>
                <p className="text-slate-400 text-xs">Authenticating details and preparing receipt sheets.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-200">
                <div className="p-3 bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/30">
                  <FiCheckCircle className="w-12 h-12" />
                </div>
                <h3 className="text-white text-xl font-bold">Order Confirmed!</h3>
                <p className="text-slate-400 text-xs">Our chefs are tossing your pizza base. Opening real-time tracker...</p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
