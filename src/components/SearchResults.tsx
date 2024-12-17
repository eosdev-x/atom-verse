import React from 'react';
import { Loader2 } from 'lucide-react';
import { VerseCard } from './VerseCard';
import type { SearchResult } from '../types/bible';

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
}

export function SearchResults({ results, loading }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No verses found. Try searching for a reference (e.g., "John 3:16") or keywords.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {results.map((result, index) => (
        <VerseCard
          key={`${result.book}-${result.chapter}-${result.verse}-${index}`}
          book={result.book}
          chapter={result.chapter}
          verse={result.verse}
          text={result.text}
        />
      ))}
    </div>
  );
}