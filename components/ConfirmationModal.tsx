import React from 'react';
import { Button } from './Button';
import { t, Language } from '../utils/translations';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  language: Language;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen, onClose, onConfirm, title, message, language
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 transform transition-all">
        <h3 id="confirm-title" className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose} size="md">
            {t(language, 'cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm} size="md">
            {t(language, 'confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
};