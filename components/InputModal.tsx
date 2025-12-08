import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { t, Language } from '../utils/translations';

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  title: string;
  initialValue: string;
  language: Language;
}

export const InputModal: React.FC<InputModalProps> = ({
  isOpen, onClose, onSave, title, initialValue, language
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(value);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="input-title">
      <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 transform transition-all">
        <h3 id="input-title" className="text-xl font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            type="text"
            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg mb-6 placeholder-slate-400"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label="Team name input"
          />
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={onClose} size="md">
              {t(language, 'cancel')}
            </Button>
            <Button type="submit" variant="primary" size="md">
              {t(language, 'save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};