import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { validateEmail, validatePhone } from '../utils/helpers';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const { register, loading } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !password) {
      showToast('Please fill out all fields.', 'warning');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (!validatePhone(phone)) {
      showToast('Please enter a valid phone number.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    try {
      await register(name, email, password, phone);
      showToast('Account registered successfully! Welcome to SliceCraft!', 'success');
      navigate('/profile');
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 pt-32 pb-16 min-h-[80vh] flex flex-col justify-center">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-700/60 flex flex-col gap-6">
        
        {/* Form Header */}
        <div className="text-center">
          <span className="text-accent-500 font-black tracking-widest text-[10px] uppercase">Join SliceCraft</span>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mt-1">Create an <span className="text-accent-500">Account</span></h1>
        </div>

        {/* Registration form */}
        <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
          
          <div className="relative">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-sm outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100"
            />
            <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-sm outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100"
            />
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative">
            <input
              type="tel"
              placeholder="Phone Number (e.g. 5552345678)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-sm outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100"
            />
            <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Create Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-sm outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100"
            />
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-black text-sm rounded-full shadow-lg transition-all uppercase tracking-wider mt-2"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

        </form>

        {/* Redirect sign in */}
        <div className="text-center text-xs text-slate-455">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}
