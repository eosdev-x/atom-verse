import { useState, useCallback, useRef, useEffect, forwardRef, useImperativeHandle, type ChangeEvent, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { VALID_BOOKS } from '../utils/db';
import { easing } from '../utils/animations';

const HERO_SUGGESTIONS = ['love', 'faith', 'John 3:16', 'Psalms 23'];

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

export interface SearchBarHandle {
  focus: () => void;
  setValue: (value: string) => void;
}

export const SearchBar = forwardRef<SearchBarHandle, SearchBarProps>(
  function SearchBar({ onSearch, loading }, ref) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent): void {
        if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
          setShowSuggestions(false);
        }
      }

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const generateSuggestions = useCallback((input: string): string[] => {
      if (!input.trim()) return [];

      const normalizedInput = input.toLowerCase();
      const bookSuggestions = VALID_BOOKS.filter((book) =>
        book.toLowerCase().includes(normalizedInput)
      );
      const bookMatch = input.match(/^(\d?\s*\w+)/i);

      if (!bookMatch) return bookSuggestions.slice(0, 5);

      const matchingBooks = VALID_BOOKS.filter((book) =>
        book.toLowerCase().includes(bookMatch[1].trim().toLowerCase())
      );
      const chapterSuggestions = matchingBooks.flatMap((book) =>
        Array.from({ length: 5 }, (_, index) => `${book} ${index + 1}`)
      );

      return [...new Set([...bookSuggestions, ...chapterSuggestions])].slice(0, 5);
    }, []);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      setValue: (value: string) => {
        setQuery(value);
        setSuggestions(generateSuggestions(value));
        setShowSuggestions(false);
      },
    }), [generateSuggestions]);

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
      const newQuery = event.target.value;
      setQuery(newQuery);
      setSuggestions(generateSuggestions(newQuery));
      setShowSuggestions(true);
    }, [generateSuggestions]);

    const handleSuggestionClick = useCallback((suggestion: string): void => {
      setQuery(suggestion);
      setShowSuggestions(false);
      onSearch(suggestion);
      inputRef.current?.focus();
    }, [onSearch]);

    const handleSubmit = useCallback((event: FormEvent): void => {
      event.preventDefault();
      if (query.trim()) {
        onSearch(query);
        setShowSuggestions(false);
      }
    }, [query, onSearch]);

    const handleClear = useCallback((): void => {
      setQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
      onSearch('');
    }, [onSearch]);

    const handleHeroSuggestionClick = useCallback((suggestion: string): void => {
      setQuery(suggestion);
      setSuggestions([]);
      setShowSuggestions(false);
      onSearch(suggestion);
      inputRef.current?.focus();
    }, [onSearch]);

    return (
      <div className="relative w-full max-w-2xl">
        <form onSubmit={handleSubmit}>
          <motion.div
            animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
            transition={{ duration: 0.2, ease: easing.out }}
            className="relative"
          >
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${loading ? 'text-gray-400 animate-pulse' : 'text-gray-400'}`}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleChange}
              onFocus={() => {
                setShowSuggestions(true);
                setIsFocused(true);
              }}
              onBlur={() => setIsFocused(false)}
              placeholder={'Search by reference, "love your neighbor" or "John 3:16"'}
              className="w-full pl-12 pr-16 py-4 rounded-xl text-base border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         placeholder:text-gray-400 dark:placeholder:text-gray-500
                         shadow-sm focus:shadow-md
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200"
              disabled={loading}
            />
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5
                            px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700
                            text-xs font-mono text-gray-400 dark:text-gray-500">
              /
            </kbd>
            {query && (
              <motion.button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2
                           text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                           focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900
                           min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full"
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.1 }}
              >
                <X size={20} />
              </motion.button>
            )}
          </motion.div>
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg
                       shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto"
          >
            {suggestions.map((suggestion) => (
              <motion.button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700
                           text-gray-900 dark:text-gray-100 cursor-pointer
                           first:rounded-t-lg last:rounded-b-lg min-h-[44px]
                           flex items-center focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-blue-500 focus-visible:ring-inset"
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.1 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {HERO_SUGGESTIONS.map((suggestion) => (
            <motion.button
              key={suggestion}
              type="button"
              onClick={() => handleHeroSuggestionClick(suggestion)}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm
                         border border-gray-200 dark:border-gray-700
                         text-gray-600 dark:text-gray-300
                         hover:border-blue-300 hover:text-blue-600
                         dark:hover:border-blue-700 dark:hover:text-blue-400
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                         focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900
                         transition-colors duration-200"
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.1 }}
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </div>
    );
  },
);
