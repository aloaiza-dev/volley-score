import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { t, Language } from '../utils/translations';
import { useDialogA11y } from '../utils/useDialogA11y';

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, isOpen]);

  useDialogA11y(dialogRef, {
    isOpen,
    onClose,
    initialFocusRef: inputRef,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(value);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/26 p-4 backdrop-blur-sm animate-fade-in dark:bg-slate-950/60 dark:backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="input-title">
      <div ref={dialogRef} tabIndex={-1} className="w-full max-w-sm rounded-[1.8rem] border border-slate-300/80 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.28)] transition-all dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_30px_80px_-36px_rgba(15,23,42,0.8)]">
        <h3 id="input-title" className="font-display mb-4 text-xl font-black uppercase tracking-[0.08em] text-slate-950 dark:text-slate-50">{title}</h3>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            autoFocus
            type="text"
            maxLength={40}
            className="mb-6 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-lg font-extrabold text-slate-900 placeholder-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label={t(language, 'teamNameInput')}
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
