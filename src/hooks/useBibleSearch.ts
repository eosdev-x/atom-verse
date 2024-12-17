import { useState, useCallback } from 'react';
import { bibleService } from '../services/bibleService';
import type { SearchResult } from '../types/bible';
import toast from 'react-hot-toast';

export function useBibleSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchVerses = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Starting search for:', query);
      const searchResults = await bibleService.searchVerses(query);
      console.log('Search completed, results:', searchResults);
      setResults(searchResults);
      
      if (searchResults.length === 0) {
        console.log('No results found');
        toast.error('No verses found. Try a different search.');
      }
    } catch (err) {
      console.error('Search error details:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to search verses: ${errorMessage}`);
      toast.error(`Search failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    loading,
    error,
    searchVerses
  };
}