import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 min-h-[80vh] flex flex-col items-center justify-center text-center">
      
      {/* Pizza illustration missing a slice */}
      <div className="relative w-36 h-36 mb-8 animate-bounce duration-[2000ms]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-cheese-400" fill="currentColor">
          {/* Main Pizza base with slice cut out */}
          <path d="M 50,50 L 50,5 A 45,45 0 1,1 5,50 Z" className="text-cheese-400" />
          {/* Pizza crust rim */}
          <path d="M 50,50 L 50,5 A 45,45 0 1,1 5,50 Z M 50,50 L 50,9 A 41,41 0 1,1 9,50 Z" className="text-orange-600 opacity-60" fillRule="evenodd" />
          
          {/* Pepperoni dots */}
          <circle cx="50" cy="70" r="4.5" fill="#ef4444" />
          <circle cx="30" cy="50" r="4.5" fill="#ef4444" />
          <circle cx="35" cy="72" r="3.5" fill="#ef4444" />
          <circle cx="68" cy="58" r="4.5" fill="#ef4444" />
          <circle cx="50" cy="30" r="4.5" fill="#ef4444" />
          <circle cx="28" cy="30" r="3.5" fill="#ef4444" />
          <circle cx="70" cy="36" r="3.5" fill="#ef4444" />
          
          {/* Olives */}
          <circle cx="58" cy="68" r="2" fill="#1e293b" />
          <circle cx="40" cy="38" r="2" fill="#1e293b" />
          <circle cx="20" cy="62" r="2" fill="#1e293b" />
          
          {/* The missing slice floating off */}
          <path d="M 54,46 L 95,46 A 45,45 0 0,0 54,5 Z" className="text-cheese-450 hover:translate-x-2 hover:-translate-y-2 transition-transform duration-300" fill="#fcd34d" />
          <path d="M 54,46 L 95,46 A 45,45 0 0,0 54,5 Z M 54,46 L 91,46 A 41,41 0 0,0 54,9 Z" fill="#ea580c" fillRule="evenodd" />
          <circle cx="70" cy="22" r="3" fill="#ef4444" />
        </svg>
      </div>

      <span className="text-accent-500 font-black tracking-widest text-xs uppercase">Error 404</span>
      <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight mt-2">
        Oh No! A Slice is <span className="text-accent-500">Missing</span>
      </h1>
      <p className="text-sm text-slate-400 mt-2 max-w-sm">
        We searched all our boxes, but the page you are looking for has already been eaten.
      </p>

      <div className="flex gap-4 mt-8">
        <Link 
          to="/"
          className="px-6 py-2.5 bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow hover:bg-slate-950 transition-colors"
        >
          Go Home
        </Link>
        <Link 
          to="/menu"
          className="px-6 py-2.5 bg-accent-500 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg hover:bg-accent-600 transition-colors"
        >
          Explore Menu
        </Link>
      </div>

    </div>
  );
}
