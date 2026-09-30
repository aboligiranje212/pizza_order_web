import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiInfo } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { validateEmail } from '../utils/helpers';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  
  const { login, loading } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/profile';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast('Please fill out all fields.', 'warning');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    try {
      await login(email, password);
      showToast('Logged in successfully!', 'success');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      showToast(err.message || 'Login failed.', 'error');
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !validateEmail(forgotEmail)) {
      showToast('Please enter a valid email.', 'error');
      return;
    }
    showToast(`Password reset link sent to ${forgotEmail}`, 'success');
    setShowForgotModal(false);
    setForgotEmail('');
  };

  return (
    <div className="max-w-md mx-auto px-6 pt-32 pb-16 min-h-[80vh] flex flex-col justify-center">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-700/60 flex flex-col gap-6">
        
        {/* Form header */}
        <div className="text-center">
          <span className="text-accent-500 font-black tracking-widest text-[10px] uppercase">Welcome Back</span>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mt-1">Sign In to <span className="text-accent-500">SliceCraft</span></h1>
        </div>

        {/* Mock Credential Note */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/60 rounded-2xl flex gap-2.5 items-start">
          <FiInfo className="text-blue-500 flex-shrink-0 w-4.5 h-4.5 mt-0.5" />
          <p className="text-[10px] text-blue-800 dark:text-blue-300 leading-relaxed font-semibold">
            Use any email and a password of at least 6 characters (e.g. <code>guest@example.com</code> / <code>123456</code>) to log in.
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          
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
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border rounded-2xl text-sm outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100"
            />
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Forgot Password trigger */}
          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="text-right text-xs text-primary-500 font-bold hover:underline self-end"
          >
            Forgot Password?
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-black text-sm rounded-full shadow-lg transition-all uppercase tracking-wider mt-2"
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>

        </form>

        {/* Redirect sign up */}
        <div className="text-center text-xs text-slate-450 mt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-500 font-bold hover:underline">
            Register Here
          </Link>
        </div>

      </div>

      {/* Forgot Password modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl w-full max-w-sm shadow-xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center">
              <h3 className="font-black text-lg text-slate-800 dark:text-white">Recover Password</h3>
              <p className="text-xs text-slate-400 mt-1">Enter your registered email address to receive reset links.</p>
            </div>
            
            <form onSubmit={handleForgotSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="E.g. guest@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs outline-none focus:border-accent-500"
              />
              <div className="flex gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 py-2 text-xs font-bold border rounded-xl text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-accent-500 text-white text-xs font-bold rounded-xl shadow"
                >
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
