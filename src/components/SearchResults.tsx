import { AnimatePresence, motion } from 'framer-motion';
import { EmptyState } from './EmptyState';
import { VerseCard } from './VerseCard';
import { SkeletonVerseCards } from './SkeletonLoader';
import { easing } from '../utils/animations';
import type { SearchResult } from '../types/bible';

const SUGGESTED_SEARCHES = ['John 3:16', 'love', 'faith'];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: easing.out } },
};

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  className?: string;
  focusedIndex?: number;
  onBookmarkToggle?: () => void;
  onSuggestedSearch?: (query: string) => void;
}

export function SearchResults({
  results,
  loading,
  className = '',
  focusedIndex = -1,
  onBookmarkToggle,
  onSuggestedSearch,
}: SearchResultsProps): JSX.Element {
  if (loading) {
    return <SkeletonVerseCards count={3} />;
  }

  if (results.length === 0) {
    return (
      <EmptyState
        icon="search"
        title="No verses found"
        description="Try searching for a reference or a different keyword."
        chips={onSuggestedSearch
          ? SUGGESTED_SEARCHES.map((search) => ({
            label: search,
            onClick: () => onSuggestedSearch(search),
          }))
          : undefined}
      />
    );
  }

  return (
    <motion.div
      className={`space-y-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence mode="popLayout">
        {results.map((result, index) => (
          <motion.div
            key={`${result.book}-${result.chapter}-${result.verse}`}
            variants={itemVariants}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <VerseCard
              book={result.book}
              chapter={result.chapter}
              verse={result.verse}
              text={result.text}
              isFocused={index === focusedIndex}
              onBookmarkToggle={onBookmarkToggle}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
