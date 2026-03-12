import React, { useRef } from 'react';
import { Button } from './Button';
import { t, Language } from '../utils/translations';
import { useDialogA11y } from '../utils/useDialogA11y';

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useDialogA11y(dialogRef, {
    isOpen,
    onClose,
    initialFocusRef: cancelButtonRef,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/26 p-4 backdrop-blur-sm animate-fade-in dark:bg-slate-950/60 dark:backdrop-blur-md" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
      <div ref={dialogRef} tabIndex={-1} className="w-full max-w-sm rounded-[1.8rem] border border-slate-300/80 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.28)] transition-all dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_30px_80px_-36px_rgba(15,23,42,0.8)]">
        <h3 id="confirm-title" className="font-display mb-3 text-xl font-black uppercase tracking-[0.08em] text-slate-950 dark:text-slate-50">{title}</h3>
        <p className="mb-8 leading-relaxed text-slate-700 dark:text-slate-300">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button ref={cancelButtonRef} variant="secondary" onClick={onClose} size="md">
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
