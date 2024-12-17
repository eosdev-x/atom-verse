import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
                transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Sun className="text-yellow-500" size={24} />
      ) : (
        <Moon className="text-gray-700" size={24} />
      )}
    </button>
  );
}