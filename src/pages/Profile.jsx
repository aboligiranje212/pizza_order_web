import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMapPin, FiCreditCard, FiClock, FiLogOut, FiPlus, FiTrash2, FiShoppingBag, FiTruck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { formatPrice } from '../utils/helpers';

export default function Profile() {
  const { user, logout, orderHistory, addAddress, deleteAddress, addSavedCard, deleteSavedCard } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'cards' | 'account'

  // Forms state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressLabel, setAddressLabel] = useState('Home');
  const [addressLine, setAddressLine] = useState('');
  const [addressZip, setAddressZip] = useState('');

  const [showCardForm, setShowCardForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardName, setCardName] = useState('');

  if (!user) {
    // Return login prompt
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Profile is locked</h1>
        <p className="text-slate-400 text-sm mt-1">Please sign in to access address managers and past orders.</p>
        <button
          onClick={() => navigate('/login', { state: { from: '/profile' } })}
          className="mt-6 px-8 py-3 bg-accent-500 text-white font-black text-xs rounded-full shadow"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully.', 'info');
    navigate('/');
  };

  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    if (!addressLine || !addressZip) {
      showToast('Please enter address details.', 'warning');
      return;
    }
    addAddress({
      type: addressLabel,
      addressLine,
      zipcode: addressZip
    });
    showToast('New address saved!', 'success');
    setAddressLine('');
    setAddressZip('');
    setShowAddressForm(false);
  };

  const handleAddCardSubmit = (e) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardName) {
      showToast('Please enter card details.', 'warning');
      return;
    }
    addSavedCard({
      number: cardNumber,
      expiry: cardExpiry,
      name: cardName
    });
    showToast('Payment card saved!', 'success');
    setCardNumber('');
    setCardExpiry('');
    setCardName('');
    setShowCardForm(false);
  };

  const handleReorder = (orderItems) => {
    orderItems.forEach(item => {
      // Re-add product to cart
      addToCart(item, item.quantity, item.size, item.crust, item.toppings);
    });
    showToast('Items added back to cart! Redirecting...', 'success');
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 min-h-screen">
      
      {/* Profile Banner */}
      <div className="bg-primary-800 dark:bg-slate-850 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-700/20">
        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <div className="w-16 h-16 rounded-full bg-accent-500 text-white font-black text-2xl flex items-center justify-center border-4 border-slate-100 shadow">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black">{user.name}</h1>
            <p className="text-slate-300 text-xs mt-1">{user.email} • {user.phone}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-white/10 hover:bg-rose-500 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 backdrop-blur-sm shadow border border-white/10 hover:border-transparent"
        >
          <FiLogOut /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Tabs Navigation (3 cols) */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none">
          {[
            { id: 'orders', label: 'Order History', icon: <FiClock /> },
            { id: 'addresses', label: 'Manage Addresses', icon: <FiMapPin /> },
            { id: 'cards', label: 'Saved Cards', icon: <FiCreditCard /> },
            { id: 'account', label: 'Account Details', icon: <FiUser /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap lg:whitespace-normal ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-slate-700 shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-100 dark:border-slate-700/60'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Side: Tab Panel Content (9 cols) */}
        <div className="lg:col-span-9 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-700/60">
          
          {/* Order History Tab Panel */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-wider border-b pb-3 mb-6 flex items-center gap-1.5"><FiClock className="text-accent-500" /> Order History</h2>
              
              {orderHistory.length === 0 ? (
                <div className="text-center py-12">
                  <FiShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold text-slate-650 dark:text-slate-350">No orders found</p>
                  <p className="text-xs text-slate-400 mt-0.5">Your past orders will appear here once you place them.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {orderHistory.map((order) => (
                    <div key={order.id} className="border border-slate-100 dark:border-slate-750 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                      
                      {/* Upper row */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/65 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-slate-750">
                        <div className="text-xs">
                          <span className="font-black text-slate-800 dark:text-white block">Order #{order.id}</span>
                          <span className="text-slate-400 block mt-0.5">{order.date} at {order.time}</span>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            order.status === 'Delivered' 
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20'
                              : 'bg-blue-50 text-blue-600 dark:bg-blue-950/20'
                          }`}>
                            {order.status}
                          </span>
                          <span className="font-black text-sm text-slate-800 dark:text-white">{formatPrice(order.total)}</span>
                        </div>
                      </div>

                      {/* Items row */}
                      <div className="p-4 flex flex-col gap-3">
                        <div className="divide-y divide-slate-50 dark:divide-slate-700/40">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="py-2 first:pt-0 last:pb-0 flex justify-between text-xs gap-3">
                              <div>
                                <span className="font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
                                <span className="text-slate-450 dark:text-slate-500 ml-1">x{item.quantity}</span>
                              </div>
                              <span className="font-semibold text-slate-650 dark:text-slate-350">{formatPrice(item.singlePrice * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Reorder and tracking buttons */}
                        <div className="flex justify-between items-center gap-3 border-t border-slate-50 dark:border-slate-700/60 pt-4 mt-2">
                          <span className="text-[10px] text-slate-400 truncate max-w-[200px] sm:max-w-none">Address: {order.deliveryAddress}</span>
                          
                          <div className="flex gap-2">
                            {order.status !== 'Delivered' && (
                              <button
                                onClick={() => navigate(`/order-tracking/${order.id}`)}
                                className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-650 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                              >
                                <FiTruck /> Track
                              </button>
                            )}
                            <button
                              onClick={() => handleReorder(order.items)}
                              className="px-3.5 py-1.5 bg-accent-50 hover:bg-accent-100 text-accent-600 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                            >
                              <FiShoppingBag /> Reorder
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Manage Addresses Panel */}
          {activeTab === 'addresses' && (
            <div>
              <div className="flex justify-between items-center border-b pb-3 mb-6">
                <h2 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5"><FiMapPin className="text-accent-500" /> Manage Addresses</h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-950 dark:bg-slate-750 dark:hover:bg-slate-650 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                >
                  <FiPlus /> Add New
                </button>
              </div>

              {/* Form popup sheet */}
              {showAddressForm && (
                <form onSubmit={handleAddAddressSubmit} className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-750 mb-6 flex flex-col gap-4 animate-in fade-in duration-200">
                  <h3 className="font-black text-xs text-slate-750 dark:text-slate-250 uppercase">Address Properties</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex gap-2 bg-white dark:bg-slate-800 border p-1 rounded-xl">
                      {['Home', 'Office', 'Other'].map((label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setAddressLabel(label)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            addressLabel === label ? 'bg-primary-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Zipcode / Pin"
                      value={addressZip}
                      onChange={(e) => setAddressZip(e.target.value)}
                      className="px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border rounded-xl outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Street, house number, details..."
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      className="sm:col-span-2 px-3.5 py-2.5 text-xs bg-white dark:bg-slate-800 border rounded-xl outline-none"
                    />
                  </div>
                  <div className="flex gap-2 self-end">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 text-xs font-bold border rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-accent-500 text-white text-xs font-bold rounded-xl shadow hover:bg-accent-600 transition-colors"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Display List */}
              <div className="flex flex-col gap-3">
                {user.addresses.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No saved addresses. Click Add New to save one.</p>
                ) : (
                  user.addresses.map((addr) => (
                    <div key={addr.id} className="p-4 border rounded-2xl flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                      <div className="text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                          <FiMapPin className="text-accent-500" /> {addr.type}
                        </span>
                        <p className="text-slate-400 mt-1">{addr.addressLine} (Zip: {addr.zipcode})</p>
                      </div>
                      <button
                        onClick={() => {
                          deleteAddress(addr.id);
                          showToast('Address removed.', 'info');
                        }}
                        className="p-2 text-slate-400 hover:text-rose-500 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        title="Delete Address"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Saved Payment Cards Panel */}
          {activeTab === 'cards' && (
            <div>
              <div className="flex justify-between items-center border-b pb-3 mb-6">
                <h2 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5"><FiCreditCard className="text-accent-500" /> Saved Cards</h2>
                <button
                  onClick={() => setShowCardForm(!showCardForm)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-950 dark:bg-slate-750 dark:hover:bg-slate-650 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                >
                  <FiPlus /> Add Card
                </button>
              </div>

              {/* Form popup sheet */}
              {showCardForm && (
                <form onSubmit={handleAddCardSubmit} className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-750 mb-6 flex flex-col gap-4 animate-in fade-in duration-200">
                  <h3 className="font-black text-xs text-slate-750 dark:text-slate-250 uppercase">Card Properties</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border rounded-xl outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border rounded-xl outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Expiry Date (MM/YY)"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border rounded-xl outline-none"
                    />
                  </div>
                  <div className="flex gap-2 self-end">
                    <button
                      type="button"
                      onClick={() => setShowCardForm(false)}
                      className="px-4 py-2 text-xs font-bold border rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-accent-500 text-white text-xs font-bold rounded-xl shadow hover:bg-accent-600 transition-colors"
                    >
                      Save Card
                    </button>
                  </div>
                </form>
              )}

              {/* Display List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.savedCards.length === 0 ? (
                  <p className="text-xs text-slate-400 italic sm:col-span-2">No saved cards. Click Add Card to save one.</p>
                ) : (
                  user.savedCards.map((card) => (
                    <div key={card.id} className="p-4 border rounded-2xl flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-500 font-bold text-sm">
                          {card.brand}
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-100">•••• •••• •••• {card.last4}</span>
                          <p className="text-slate-400 mt-0.5">Expires: {card.expiry}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          deleteSavedCard(card.id);
                          showToast('Card details deleted.', 'info');
                        }}
                        className="p-2 text-slate-400 hover:text-rose-500 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        title="Delete Card"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Account Details Panel */}
          {activeTab === 'account' && (
            <div>
              <h2 className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-wider border-b pb-3 mb-6 flex items-center gap-1.5"><FiUser className="text-accent-500" /> Account Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">Full Name</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">{user.name}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Email Address</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">{user.email}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Contact Phone</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">{user.phone}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Account Status</span>
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 rounded text-xs font-black uppercase tracking-wider">Active User</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
