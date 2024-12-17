import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { BookmarksPanel } from './components/BookmarksPanel';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { bibleService } from './services/bibleService';
import type { SearchResult } from './types/bible';

export default function App() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isBookmarksPanelOpen, setIsBookmarksPanelOpen] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const searchResults = await bibleService.searchVerses(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header onOpenBookmarks={() => setIsBookmarksPanelOpen(true)} />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center mb-8">
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-3">
              KJV Bible Verse Search
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 max-w-lg mb-8">
              Search and instantly access any verse from the King James Version Bible
            </p>
            <div className="w-full max-w-2xl">
              <SearchBar onSearch={handleSearch} loading={loading} />
            </div>
          </div>
          <div className="mt-8">
            <SearchResults className="mb-8" results={results} loading={loading} />
          </div>
        </div>
      </main>

      <Footer />

      <BookmarksPanel
        isOpen={isBookmarksPanelOpen}
        onClose={() => setIsBookmarksPanelOpen(false)}
      />
    </div>
  );
}