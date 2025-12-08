import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in px-6 w-full max-w-sm flex justify-center pointer-events-none">
      <div className="bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 pointer-events-auto border border-white/10 dark:border-slate-300">
        <span className="text-xl">ℹ️</span>
        <span className="font-bold text-sm text-center">{message}</span>
      </div>
    </div>
  );
};