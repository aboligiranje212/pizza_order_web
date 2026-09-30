import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { useNotification } from '../context/NotificationContext';
import { validateEmail } from '../utils/helpers';

export default function Contact() {
  const { showToast } = useNotification();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.subject || !form.message) {
      showToast('Please fill out all fields.', 'warning');
      return;
    }

    if (!validateEmail(form.email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    showToast('Your message has been sent. Support will contact you shortly!', 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 min-h-screen">
      
      {/* Page Header */}
      <div className="mb-12 text-center max-w-xl mx-auto">
        <span className="text-accent-500 font-black tracking-widest text-xs uppercase">Get in Touch</span>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mt-1">
          We'd Love to Hear <span className="text-accent-500">From You</span>
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Have an inquiry about large events catering or delivery issues? Drop us a line.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Contact Details (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-700/60 flex flex-col gap-6">
            <h2 className="font-black text-slate-800 dark:text-white text-lg tracking-tight border-b pb-3">Support Lines</h2>
            
            <div className="flex gap-4 items-start text-sm">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl shadow-sm"><FiPhone className="w-5 h-5" /></div>
              <div>
                <span className="font-bold text-slate-750 dark:text-slate-200 block">Phone Support</span>
                <span className="text-slate-450 block mt-1">+1 (800) 555-CRUST</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Toll-free • Mon to Sun: 10AM - 11PM</span>
              </div>
            </div>

            <div className="flex gap-4 items-start text-sm">
              <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl shadow-sm"><FiMail className="w-5 h-5" /></div>
              <div>
                <span className="font-bold text-slate-750 dark:text-slate-200 block">Email Desk</span>
                <span className="text-slate-450 block mt-1">support@slicecraftpizza.com</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Average response delay: Under 4 hours</span>
              </div>
            </div>

            <div className="flex gap-4 items-start text-sm">
              <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl shadow-sm"><FiMapPin className="w-5 h-5" /></div>
              <div>
                <span className="font-bold text-slate-750 dark:text-slate-200 block">Headquarters</span>
                <span className="text-slate-455 block mt-1">123 Pizza Valley, Manhattan, NY 10001</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-700/60">
            <h2 className="font-black text-slate-800 dark:text-white text-lg tracking-tight border-b pb-3 mb-6">Send Message</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Inquiry Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none"
              />
              <textarea
                rows="6"
                placeholder="How can we assist you today? Provide order details if applicable..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none resize-none"
              />

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-black text-xs rounded-full shadow-lg transition-transform active:scale-95 self-end uppercase tracking-wider"
              >
                <FiSend /> Send Message
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
