import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiPhone, FiMail, FiMapPin, FiSend } from 'react-icons/fi';
import { useNotification } from '../../context/NotificationContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { showToast } = useNotification();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Subscribed successfully to our newsletter!', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-350 dark:bg-slate-950 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <svg className="w-8 h-8 text-accent-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C11.5 2 11 2.3 10.8 2.8L2.2 18.2C1.9 18.7 1.9 19.3 2.2 19.8C2.5 20.3 3 20.6 3.6 20.6H20.4C21 20.6 21.5 20.3 21.8 19.8C22.1 19.3 22.1 18.7 21.8 18.2L13.2 2.8C13 2.3 12.5 2 12 2ZM12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM16.5 15C15.7 15 15 14.3 15 13.5C15 12.7 15.7 12 16.5 12C17.3 12 18 12.7 18 13.5C18 14.3 17.3 15 16.5 15ZM7.5 15C6.7 15 6 14.3 6 13.5C6 12.7 6.7 12 7.5 12C8.3 12 9 12.7 9 13.5C9 14.3 8.3 15 7.5 15ZM12 17C12.8 17 13.5 17.7 13.5 18.5C13.5 19.3 12.8 20 12 20C11.2 20 10.5 19.3 10.5 18.5C10.5 17.7 11.2 17 12 17Z"/>
              </svg>
              <span className="text-xl font-black text-white tracking-tight">
                Slice<span className="text-accent-500">Craft</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Serving premium, fire-baked artisanal pizzas crafted from local, organic ingredients. Deliciously original, always piping hot.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="p-2 bg-slate-800 hover:bg-accent-500 text-slate-300 hover:text-white rounded-full transition-colors duration-300" aria-label="Facebook">
                <FiFacebook className="w-4.5 h-4.5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-accent-500 text-slate-300 hover:text-white rounded-full transition-colors duration-300" aria-label="Instagram">
                <FiInstagram className="w-4.5 h-4.5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-accent-500 text-slate-300 hover:text-white rounded-full transition-colors duration-300" aria-label="Twitter">
                <FiTwitter className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white text-md font-bold mb-5 tracking-wide uppercase">Quick Links</h3>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li><Link to="/menu" className="hover:text-accent-500 transition-colors">Pizza Menu</Link></li>
              <li><Link to="/deals" className="hover:text-accent-500 transition-colors">Special Combos</Link></li>
              <li><Link to="/coupons" className="hover:text-accent-500 transition-colors">Promo Coupons</Link></li>
              <li><Link to="/profile" className="hover:text-accent-500 transition-colors">Order History</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h3 className="text-white text-md font-bold mb-5 tracking-wide uppercase">Help & Support</h3>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-accent-500 transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-accent-500 transition-colors">Contact Support</Link></li>
              <li><Link to="/faq" className="hover:text-accent-500 transition-colors">Frequently Asked Questions</Link></li>
              <li><a href="#" className="hover:text-accent-500 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white text-md font-bold tracking-wide uppercase">Stay Updated</h3>
            <p className="text-sm text-slate-400">
              Subscribe to unlock $5 off your next slice and receive secret deals.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex mt-1">
              <input
                type="email"
                placeholder="Enter email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none border border-slate-700 focus:border-accent-500 pr-10"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-accent-500 hover:text-white hover:bg-accent-500 rounded-md transition-colors"
                aria-label="Subscribe"
              >
                <FiSend className="w-4 h-4" />
              </button>
            </form>
            <div className="flex flex-col gap-2 mt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2"><FiPhone className="text-accent-500" /> +1 (800) 555-CRUST</div>
              <div className="flex items-center gap-2"><FiMail className="text-accent-500" /> support@slicecraftpizza.com</div>
              <div className="flex items-center gap-2"><FiMapPin className="text-accent-500" /> 123 Pizza Valley, NY 10001</div>
            </div>
          </div>

        </div>

        {/* Lower Footer */}
        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SliceCraft Pizza Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:underline">Cookie Settings</a>
            <span>•</span>
            <a href="#" className="hover:underline">Delivery Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
