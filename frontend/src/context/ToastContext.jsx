import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

const VARIANTS = {
  success: { Icon: FiCheckCircle, ring: 'toast-success' },
  error: { Icon: FiAlertCircle, ring: 'toast-error' },
  info: { Icon: FiInfo, ring: 'toast-info' }
};

let nextId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (message, variant = 'info', duration = 4000) => {
      const id = ++nextId;
      setToasts((list) => [...list, { id, message, variant }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), duration)
      );
      return id;
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      push,
      success: (message, duration) => push(message, 'success', duration),
      error: (message, duration) => push(message, 'error', duration),
      info: (message, duration) => push(message, 'info', duration),
      dismiss
    }),
    [push, dismiss]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}

      <div className="toast-stack" role="region" aria-live="polite" aria-label="Notifications">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const { Icon, ring } = VARIANTS[toast.variant] || VARIANTS.info;
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -16, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className={`toast-card ${ring}`}
                role="status"
              >
                <span className="toast-icon">
                  <Icon />
                </span>
                <p className="toast-message">{toast.message}</p>
                <button
                  type="button"
                  className="toast-close"
                  onClick={() => dismiss(toast.id)}
                  aria-label="Dismiss notification"
                >
                  <FiX />
                </button>
                <motion.span
                  className="toast-timer"
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 4, ease: 'linear' }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

export default ToastContext;