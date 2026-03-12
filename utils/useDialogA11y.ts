import { RefObject, useEffect } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

interface UseDialogA11yOptions {
  isOpen: boolean;
  onClose?: () => void;
  initialFocusRef?: RefObject<HTMLElement | null>;
}

export const useDialogA11y = (
  containerRef: RefObject<HTMLElement | null>,
  { isOpen, onClose, initialFocusRef }: UseDialogA11yOptions
) => {
  useEffect(() => {
    if (!isOpen || !containerRef.current) {
      return;
    }

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const container = containerRef.current;

    const getFocusableElements = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        element => !element.hasAttribute('disabled') && element.tabIndex !== -1
      );

    const focusableElements = getFocusableElements();
    const firstElement = initialFocusRef?.current || focusableElements[0] || container;
    const lastElement = focusableElements[focusableElements.length - 1] || firstElement;

    firstElement.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (activeElement === firstElement || activeElement === container) {
          event.preventDefault();
          lastElement.focus();
        }
        return;
      }

      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [containerRef, initialFocusRef, isOpen, onClose]);
};
