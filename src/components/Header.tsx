import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Bookmark, BookOpen, Info, Command } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useBookmarkStore } from '../store/bookmarkStore';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { CommandPalette } from './CommandPalette';

export function Header(): JSX.Element {
  const { theme, toggleTheme } = useTheme();
  const { bookmarks } = useBookmarkStore();
  const { direction, isAtTop } = useScrollDirection();
  const [commandOpen, setCommandOpen] = useState(false);

  const isHidden = direction === 'down' && !isAtTop;

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 md:sticky
                    border-b border-gray-200 dark:border-gray-800
                    ${isAtTop
                      ? 'bg-white dark:bg-gray-900'
                      : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg'
                    }`}
        initial={false}
        animate={{
          y: isHidden ? -100 : 0,
        }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                Atom Verse
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                KJV Bible Search
              </p>
            </div>
          </Link>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setCommandOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg
                         border border-gray-200 dark:border-gray-700
                         text-sm text-gray-500 dark:text-gray-400
                         hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              title="Command palette (⌘K)"
              aria-label="Open command palette"
            >
              <Command className="w-3.5 h-3.5" />
              <span className="text-xs">⌘K</span>
            </button>

            <Link
              to="/bookmarks"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800
                       relative transition-colors duration-200 min-w-[44px] min-h-[44px]
                       flex items-center justify-center"
              title="View bookmarks"
            >
              <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white
                               rounded-full w-5 h-5 text-xs flex items-center justify-center
                               font-medium">
                  {bookmarks.length}
                </span>
              )}
            </Link>
            <Link
              to="/about"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800
                       transition-colors duration-200 min-w-[44px] min-h-[44px]
                       flex items-center justify-center"
              title="About"
            >
              <Info className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800
                       transition-colors duration-200 min-w-[44px] min-h-[44px]
                       flex items-center justify-center"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </motion.header>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
