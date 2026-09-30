import React from 'react';
import { FiAward, FiShield, FiHeart } from 'react-icons/fi';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 min-h-screen">
      
      {/* Brand Intro Block */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-accent-500 font-black tracking-widest text-xs uppercase">Our Story</span>
        <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight mt-1.5 leading-tight">
          Baked with Tradition, Crafted for the <span className="text-accent-500">Modern Crust</span>
        </h1>
        <p className="text-sm text-slate-400 mt-4 leading-relaxed">
          At SliceCraft Pizza, we believe that pizza is more than just comfort food. It is a canvas of local flavors, premium ingredients, and centuries-old stone baking techniques.
        </p>
      </div>

      {/* Grid: Image + Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <img 
          src="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80" 
          alt="Pizza Oven Baking" 
          className="w-full h-80 object-cover rounded-3xl shadow-xl"
        />
        <div className="flex flex-col gap-5 text-sm text-slate-650 dark:text-slate-350">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">The Stone Oven Secret</h2>
          <p className="leading-relaxed">
            Every crust we prepare undergoes a slow 48-hour cold fermentation process, allowing natural yeasts to develop a deep, aromatic flavor profile. We hand-stretch every dough ball to order, avoiding rolling pins that crush the essential air pockets.
          </p>
          <p className="leading-relaxed">
            Our wood-fired and deck-stone ovens run at high temperatures to seal in moisture instantly, charring the crust slightly to deliver that authentic, bubbly wood-oven crunch.
          </p>
        </div>
      </div>

      {/* Grid: Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          { icon: <FiShield />, title: "Farm-to-Box Integrity", text: "We work directly with local dairy herds and organic farmers to procure daily pulls of fresh mozzarella cheese and vine-ripened tomatoes." },
          { icon: <FiAward />, title: "Award Winning Recipes", text: "Our menu features signature combinations designed by award-winning pizzaiolos who balance sweet, acidic, and salty textures." },
          { icon: <FiHeart />, title: "Handcrafted with Passion", text: "Every pizza is tossed, styled, and boxed by hand in our open-view kitchens, allowing you to witness the craftsmanship live." }
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-700/60 flex flex-col gap-4 text-center items-center">
            <div className="w-12 h-12 bg-accent-50 text-accent-500 rounded-2xl flex items-center justify-center shadow">
              {item.icon}
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{item.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
