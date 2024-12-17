import React from 'react';
import { Bookmark, BookOpen } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useBookmarkStore } from '../store/bookmarkStore';

interface HeaderProps {
  onOpenBookmarks: () => void;
}

export function Header({ onOpenBookmarks }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { bookmarks } = useBookmarkStore();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-40">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <BookOpen className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Atom Verse
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              KJV Bible Search
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenBookmarks}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 
                     relative transition-colors duration-200"
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
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 
                     transition-colors duration-200"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}
