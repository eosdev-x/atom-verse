import { useState } from 'react';
import { motion } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';

interface Shortcut {
  keys: string[];
  description: string;
}

const shortcuts: Shortcut[] = [
  { keys: ['/'], description: 'Focus search' },
  { keys: ['J', 'K'], description: 'Navigate results' },
  { keys: ['B'], description: 'Toggle bookmark' },
  { keys: ['Enter'], description: 'Open result' },
  { keys: ['Esc'], description: 'Close / blur' },
  { keys: ['⌘', 'K'], description: 'Command palette' },
];

export function KeyboardHints(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500
                   hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200
                   rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                   focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts"
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.1 }}
      >
        <Keyboard className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Shortcuts</span>
      </motion.button>

      {isOpen && (
        <div
          className="absolute bottom-full right-0 mb-2 w-56 p-3 rounded-lg
                     bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700
                     z-50"
          role="dialog"
          aria-label="Keyboard shortcuts"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Keyboard Shortcuts
            </span>
            <motion.button
              onClick={() => setIsOpen(false)}
              className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                         focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              aria-label="Close shortcuts"
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.1 }}
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </motion.button>
          </div>
          <div className="space-y-1.5">
            {shortcuts.map((shortcut) => (
              <div key={shortcut.description} className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {shortcut.description}
                </span>
                <div className="flex gap-0.5">
                  {shortcut.keys.map((key) => (
                    <kbd
                      key={key}
                      className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5
                                 text-[10px] font-mono font-medium rounded
                                 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300
                                 border border-gray-200 dark:border-gray-600"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
