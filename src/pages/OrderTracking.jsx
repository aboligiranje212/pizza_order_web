import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiClock, FiCheck, FiTruck, FiMapPin, FiPhone, FiStar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const STATUS_TIMELINE = [
  { id: 'Placed', label: 'Order Placed', desc: 'We have received your order details.', icon: <FiCheck /> },
  { id: 'Preparing', label: 'Kitchen Preparing', desc: 'Our chefs are hand-tossing your pizza dough.', icon: <span>🍕</span> },
  { id: 'Baking', label: 'Baking in Oven', desc: 'Your slices are baking in our 600° stone oven.', icon: <span>🔥</span> },
  { id: 'Out for Delivery', label: 'Out for Delivery', desc: 'Rider is speeding your hot box to your door.', icon: <FiTruck /> },
  { id: 'Delivered', label: 'Delivered', desc: 'Enjoy your hot artisanal pizza!', icon: <FiMapPin /> }
];

export default function OrderTracking() {
  const { orderId } = useParams();
  const { orderHistory, updateOrderStatus } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [countdown, setCountdown] = useState(30); // 30 minutes estimate

  // Find order from context database
  useEffect(() => {
    const foundOrder = orderHistory.find(o => o.id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
    }
  }, [orderId, orderHistory]);

  // Simulate real-time tracking updates (advances status every 15 seconds)
  useEffect(() => {
    if (!order || order.status === 'Delivered') return;

    const timer = setInterval(() => {
      const currentIdx = STATUS_TIMELINE.findIndex(s => s.id === order.status);
      if (currentIdx > -1 && currentIdx < STATUS_TIMELINE.length - 1) {
        const nextStatus = STATUS_TIMELINE[currentIdx + 1].id;
        updateOrderStatus(orderId, nextStatus);
        
        // Lower countdown estimate
        setCountdown(prev => Math.max(0, prev - 7));
      }
    }, 15000);

    return () => clearInterval(timer);
  }, [order, orderId, updateOrderStatus]);

  // Estimate countdown minute ticking
  useEffect(() => {
    if (countdown <= 0) return;
    const ticker = setInterval(() => {
      setCountdown(c => Math.max(0, c - 1));
    }, 60000); // every minute
    return () => clearInterval(ticker);
  }, [countdown]);

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-black text-slate-800">Order not found</h1>
        <p className="text-slate-400 text-sm mt-1">Order ID might be invalid or expired.</p>
        <Link to="/profile" className="mt-4 px-6 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow">
          Go to Profile
        </Link>
      </div>
    );
  }

  const activeIndex = STATUS_TIMELINE.findIndex(s => s.id === order.status);

  // Fallback rider info if not set
  const rider = order.rider || {
    name: 'Marco Rossi',
    phone: '+1 (555) 987-6543',
    rating: 4.9,
    vehicle: 'Red Electric Scooter (SC-09)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 min-h-screen">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Timeline Progress (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-700/60">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black">Live Tracking</span>
                <h1 className="text-xl font-black text-slate-850 dark:text-white mt-0.5">Order #{order.id}</h1>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <FiClock className="text-accent-500" /> 
                <span>Est. Arrival: <strong className="text-slate-800 dark:text-white">{countdown > 0 ? `${countdown} mins` : 'Arrived!'}</strong></span>
              </div>
            </div>

            {/* Stepper Vertical Timeline */}
            <div className="relative pl-8 flex flex-col gap-8">
              
              {/* Stepper backbone line */}
              <div className="absolute left-[15px] top-4 bottom-4 w-1 bg-slate-100 dark:bg-slate-700 rounded-full">
                <div 
                  className="w-full bg-emerald-500 transition-all duration-500 rounded-full" 
                  style={{ height: `${(activeIndex / (STATUS_TIMELINE.length - 1)) * 100}%` }}
                />
              </div>

              {STATUS_TIMELINE.map((step, idx) => {
                const isPassed = idx < activeIndex;
                const isActive = idx === activeIndex;
                const isFuture = idx > activeIndex;

                return (
                  <div key={step.id} className="relative flex gap-4 items-start">
                    
                    {/* Stepper node circle */}
                    <div className={`absolute -left-8 w-8 h-8 rounded-full border-4 flex items-center justify-center text-xs font-bold transition-all z-10 ${
                      isPassed 
                        ? 'bg-emerald-500 border-emerald-100 dark:border-emerald-950 text-white'
                        : isActive
                          ? 'bg-white border-primary-500 text-primary-600 dark:bg-slate-800 animate-pulse'
                          : 'bg-white border-slate-100 dark:border-slate-705 text-slate-350 dark:bg-slate-800'
                    }`}>
                      {isPassed ? <FiCheck className="w-4 h-4" /> : step.icon}
                    </div>

                    <div className="flex flex-col">
                      <span className={`text-sm font-black ${
                        isFuture ? 'text-slate-355 dark:text-slate-500' : 'text-slate-800 dark:text-white'
                      }`}>
                        {step.label}
                      </span>
                      <p className="text-xs text-slate-400 dark:text-slate-450 mt-1 leading-relaxed">{step.desc}</p>
                    </div>

                  </div>
                );
              })}

            </div>
          </div>
        </div>

        {/* Right Column: Rider Info & Mock map (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Rider profile card */}
          {activeIndex >= 2 && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-700/60 flex items-center gap-4 animate-in fade-in duration-300">
              <img src={rider.avatar} alt={rider.name} className="w-16 h-16 rounded-2xl object-cover shadow" />
              
              <div className="flex-1 text-xs">
                <span className="text-[10px] text-slate-400 dark:text-slate-550 uppercase tracking-widest font-black">Your Delivery Expert</span>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white mt-0.5">{rider.name}</h3>
                <p className="text-slate-400 mt-1">{rider.vehicle}</p>
                <div className="flex items-center gap-1 text-amber-500 mt-1">
                  <FiStar className="fill-amber-500" />
                  <span className="font-bold">{rider.rating} rating</span>
                </div>
              </div>

              <a 
                href={`tel:${rider.phone}`}
                className="p-3 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-500 dark:bg-slate-900 rounded-2xl transition-all"
                title="Call Rider"
              >
                <FiPhone className="w-5 h-5 text-slate-600 dark:text-slate-300 hover:text-emerald-500" />
              </a>
            </div>
          )}

          {/* Mock interactive map placeholder */}
          <div className="bg-slate-100 dark:bg-slate-850 h-72 rounded-3xl shadow-inner border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden flex flex-col justify-center items-center text-center">
            
            {/* Draw simplified SVG map visual grid */}
            <svg className="absolute inset-0 w-full h-full text-slate-200 dark:text-slate-800 opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="currentColor" strokeWidth="0.5" />
              <line x1="30" y1="0" x2="30" y2="100" stroke="currentColor" strokeWidth="0.5" />
              <line x1="70" y1="0" x2="70" y2="100" stroke="currentColor" strokeWidth="0.5" />
              {/* Curved path representing road */}
              <path d="M 10,20 Q 30,30 30,50 T 70,80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
            </svg>

            {/* Central elements */}
            <div className="z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2.5 rounded-full shadow border text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5 justify-center">
                <span className="w-2.5 h-2.5 bg-accent-500 rounded-full animate-ping" />
                GPS Tracking Active
              </span>
            </div>

            {/* Small markers representing shop and home */}
            <div className="absolute top-[20%] left-[10%] z-15 bg-primary-500 text-white text-[9px] font-black p-1 rounded shadow">SHOP</div>
            <div className="absolute bottom-[20%] right-[30%] z-15 bg-accent-500 text-white text-[9px] font-black p-1 rounded shadow animate-bounce">YOU</div>

          </div>

        </div>

      </div>

    </div>
  );
}
