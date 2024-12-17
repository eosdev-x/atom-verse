import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { VALID_BOOKS } from '../utils/db';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateSuggestions = useCallback((input: string) => {
    if (!input.trim()) {
      return [];
    }

    const normalizedInput = input.toLowerCase();
    const bookSuggestions = VALID_BOOKS.filter(book => 
      book.toLowerCase().includes(normalizedInput)
    );

    // If input contains a number, also suggest chapter numbers
    const bookMatch = input.match(/^(\d?\s*\w+)/i);
    if (bookMatch) {
      const matchingBooks = VALID_BOOKS.filter(book => 
        book.toLowerCase().includes(bookMatch[1].trim().toLowerCase())
      );

      // Add chapter suggestions for matching books
      const chapterSuggestions = matchingBooks.flatMap(book => {
        // For simplicity, suggest up to chapter 5
        return Array.from({ length: 5 }, (_, i) => `${book} ${i + 1}`);
      });

      return [...new Set([...bookSuggestions, ...chapterSuggestions])].slice(0, 5);
    }

    return bookSuggestions.slice(0, 5);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSuggestions(generateSuggestions(newQuery));
    setShowSuggestions(true);
  }, [generateSuggestions]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
    inputRef.current?.focus();
  }, [onSearch]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  }, [query, onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch('');
  }, [onSearch]);

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search by reference (John 3:16) or keywords..."
          className="w-full px-4 py-3 pl-12 pr-10 rounded-lg 
                   border border-gray-300 dark:border-gray-700 
                   bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-gray-100
                   placeholder-gray-500 dark:placeholder-gray-400
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-colors duration-200"
          disabled={loading}
        />
        <Search 
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 
                     ${loading ? 'text-gray-400 animate-pulse' : 'text-gray-400'}`} 
          size={20} 
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2
                     text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                     focus:outline-none"
          >
            <X size={20} />
          </button>
        )}
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 
                     rounded-lg shadow-lg border border-gray-200 dark:border-gray-700
                     max-h-60 overflow-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700
                       text-gray-900 dark:text-gray-100 cursor-pointer
                       first:rounded-t-lg last:rounded-b-lg"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}