import React, { useState } from 'react';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';

const FAQ_DATA = [
  {
    category: "Delivery & Tracking",
    items: [
      { q: "Do you offer contact-free delivery?", a: "Yes. All delivery orders default to contact-free. Our riders will place your hot pizza box at your doorstep, ring the bell, and stand back 6 feet to ensure complete safety." },
      { q: "What are your delivery charges?", a: "We apply a flat delivery fee of $3.99 to help support our electric scooter riders. However, you can unlock free delivery by using our FREESHIP coupon on orders above $10." },
      { q: "How long does it take for my order to arrive?", a: "Most orders arrive within 30-35 minutes. Our live Order Tracking page will show you estimated minutes remaining, as well as the delivery rider's coordinates." }
    ]
  },
  {
    category: "Menu & Customization",
    items: [
      { q: "Can I customize the toppings on any pizza?", a: "Absolutely! You can choose sizes (Regular, Medium, Large), swap out crust styles (Cheese Burst, Wheat Thin, Pan, Hand Tossed), and add custom veggies or meats via our Customization Drawer." },
      { q: "Do you offer gluten-free dough?", a: "Yes. Our Wheat Thin Crust option is a lower-gluten alternative. Please note that while we take high sanitization precautions, our kitchen environment processes wheat flour." },
      { q: "What is your Liquid Cheese Burst crust?", a: "It is our signature crust design. We inject a blanket of hot, liquid mozzarella and cheddar blend between double dough sheets, creating a bubbling cheese volcano inside the outer crust." }
    ]
  },
  {
    category: "Payments & Promos",
    items: [
      { q: "How do I use a coupon code?", a: "Copy the coupon code from our Coupons page, paste it into the Coupon input box on either the Cart page or Checkout details, and click Apply. The discount will reflect instantly." },
      { q: "Which payment options do you support?", a: "We support Debit/Credit Cards (Visa, Mastercard), UPI mobile QR scans, Netbanking, and Cash on Delivery (COD) at your doorstep." }
    ]
  }
];

export default function FAQ() {
  const [openIndexes, setOpenIndexes] = useState({}); // Stores category_index combination as key

  const toggleAccordion = (catIdx, itemIdx) => {
    const key = `${catIdx}_${itemIdx}`;
    setOpenIndexes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pt-28 pb-16 min-h-screen">
      
      {/* Page Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex p-3 bg-accent-50 text-accent-500 rounded-2xl mb-3 shadow">
          <FiHelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mt-1">
          Frequently Asked <span className="text-accent-500">Questions</span>
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Everything you need to know about SliceCraft crusts, speed deliveries, and checkout coupons.
        </p>
      </div>

      {/* FAQ Categories Section */}
      <div className="flex flex-col gap-8">
        {FAQ_DATA.map((cat, catIdx) => (
          <div key={catIdx} className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-700/60">
            <h2 className="font-black text-xs text-slate-750 dark:text-slate-250 uppercase tracking-widest border-b pb-3 mb-4">
              {cat.category}
            </h2>
            
            <div className="flex flex-col gap-2">
              {cat.items.map((item, itemIdx) => {
                const key = `${catIdx}_${itemIdx}`;
                const isOpen = openIndexes[key];

                return (
                  <div key={itemIdx} className="border-b border-slate-50 dark:border-slate-700/40 last:border-none pb-2 last:pb-0">
                    <button
                      onClick={() => toggleAccordion(catIdx, itemIdx)}
                      className="w-full text-left py-3 flex justify-between items-center text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-accent-500 transition-colors gap-4"
                    >
                      <span>{item.q}</span>
                      <FiChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-accent-500' : ''}`} />
                    </button>
                    
                    {/* Collapsible panel with height transition simulation */}
                    <div className={`overflow-hidden transition-all duration-300 max-h-0 ${isOpen ? 'max-h-[160px] pb-3' : ''}`}>
                      <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed font-semibold">
                        {item.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
