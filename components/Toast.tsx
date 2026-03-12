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
    <div className="fixed bottom-8 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 justify-center px-6 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/92 px-6 py-3 text-white shadow-[0_24px_50px_-28px_rgba(15,23,42,1)] animate-slide-up dark:border-slate-300 dark:bg-slate-100 dark:text-slate-900">
        <span className="text-xl">ℹ️</span>
        <span className="font-bold text-sm text-center">{message}</span>
      </div>
    </div>
  );
};
