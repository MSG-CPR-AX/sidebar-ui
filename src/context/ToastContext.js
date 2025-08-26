// context/ToastContext.js
// Provides a simple toast notification system.  Components can call
// `addToast({ type, message })` to display transient messages to the
// user.  Toasts automatically disappear after a few seconds.

import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    setToasts((t) => [...t, { ...toast, id }]);
    // Auto remove after 4 seconds
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-2 right-2 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-3 py-2 rounded shadow-lg text-white text-sm ${
              toast.type === 'error'
                ? 'bg-red-600'
                : toast.type === 'success'
                ? 'bg-green-600'
                : 'bg-gray-800'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}