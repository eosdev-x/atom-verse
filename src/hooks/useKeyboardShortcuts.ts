import { useEffect, useCallback, useRef } from 'react';

interface KeyboardShortcutHandlers {
  onFocusSearch?: () => void;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  onToggleBookmark?: () => void;
  onOpenResult?: () => void;
  onEscape?: () => void;
  onOpenCommandPalette?: () => void;
}

function isInputElement(element: Element | null): boolean {
  if (!element) return false;
  const tagName = element.tagName.toLowerCase();
  return (
    tagName === 'input'
    || tagName === 'textarea'
    || (element as HTMLElement).contentEditable === 'true'
  );
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers): void {
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const currentHandlers = handlersRef.current;
      const target = event.target as Element;
      const inInput = isInputElement(target);
      const isModKey = event.metaKey || event.ctrlKey;

      if (isModKey && event.key === 'k') {
        event.preventDefault();
        currentHandlers.onOpenCommandPalette?.();
        return;
      }

      if (event.key === 'Escape') {
        currentHandlers.onEscape?.();
        return;
      }

      if (inInput) return;

      switch (event.key) {
        case '/':
          event.preventDefault();
          currentHandlers.onFocusSearch?.();
          break;
        case 'j':
          event.preventDefault();
          currentHandlers.onNavigateDown?.();
          break;
        case 'k':
          event.preventDefault();
          currentHandlers.onNavigateUp?.();
          break;
        case 'b':
          event.preventDefault();
          currentHandlers.onToggleBookmark?.();
          break;
        case 'Enter':
          event.preventDefault();
          currentHandlers.onOpenResult?.();
          break;
      }
    },
    [],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
