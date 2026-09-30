import React from 'react';

export default function Loader({ text = 'Baking your experience...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
      <div className="relative w-16 h-16 mb-4">
        {/* Animated Pizza Slice Loader */}
        <svg 
          className="w-16 h-16 text-accent-500 animate-spin" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Pizza circle base dashed */}
          <circle cx="12" cy="12" r="10" strokeDasharray="4 4" className="opacity-25" />
          {/* Animated Slice */}
          <path d="M12 2L20.4 18.2C20.7 18.7 20.7 19.3 20.4 19.8C20.1 20.3 19.6 20.6 19 20.6H5C4.4 20.6 3.9 20.3 3.6 19.8C3.3 19.3 3.3 18.7 3.6 18.2L12 2Z" fill="currentColor" className="text-accent-500" />
          {/* Toppings dots in loader slice */}
          <circle cx="12" cy="15" r="1.5" fill="white" />
          <circle cx="14.5" cy="17.5" r="1" fill="white" />
          <circle cx="9.5" cy="17.5" r="1" fill="white" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 animate-pulse">{text}</p>
    </div>
  );
}
