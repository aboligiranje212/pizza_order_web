import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-900',
          text: 'text-emerald-800 dark:text-emerald-200',
          icon: <FiCheckCircle className="w-5 h-5 text-emerald-500" />
        };
      case 'error':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-900',
          text: 'text-rose-800 dark:text-rose-200',
          icon: <FiAlertCircle className="w-5 h-5 text-rose-500" />
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-900',
          text: 'text-amber-800 dark:text-amber-200',
          icon: <FiAlertTriangle className="w-5 h-5 text-amber-500" />
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-900',
          text: 'text-blue-800 dark:text-blue-200',
          icon: <FiInfo className="w-5 h-5 text-blue-500" />
        };
    }
  };

  return (
    <NotificationContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const styles = getToastStyles(toast.type);
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.15 } }}
                className={`pointer-events-auto flex items-center p-4 rounded-xl border shadow-lg glassmorphism ${styles.bg} ${styles.text}`}
              >
                <div className="flex-shrink-0 mr-3">{styles.icon}</div>
                <div className="flex-1 text-sm font-medium">{toast.message}</div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 ml-4 hover:opacity-75 transition-opacity"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
