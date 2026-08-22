import { useState, useCallback, useRef } from 'react';
import { SearchBar, type SearchBarHandle } from '../components/SearchBar';
import { SearchResults } from '../components/SearchResults';
import { EmptyState } from '../components/EmptyState';
import { AnimatedPage } from '../components/AnimatedPage';
import { KeyboardHints } from '../components/KeyboardHints';
import { useBibleSearch } from '../hooks/useBibleSearch';
import { useDebounce } from '../hooks/useDebounce';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useNavigate } from '@tanstack/react-router';
import { bookToSlug } from '../utils/db';
import { useBookmarkStore } from '../store/bookmarkStore';
import toast from 'react-hot-toast';

const POPULAR_SEARCHES = [
  'John 3:16',
  'Psalm 23',
  'Romans 8:28',
  'Proverbs 3:5',
  'Isaiah 40:31',
];

const VERSE_OF_THE_DAY = [
  { book: 'John', chapter: 3, verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
  { book: 'Psalms', chapter: 23, verse: 1, text: 'The LORD is my shepherd; I shall not want.' },
  { book: 'Romans', chapter: 8, verse: 28, text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.' },
  { book: 'Proverbs', chapter: 3, verse: 5, text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.' },
  { book: 'Isaiah', chapter: 40, verse: 31, text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.' },
  { book: 'Philippians', chapter: 4, verse: 13, text: 'I can do all things through Christ which strengtheneth me.' },
  { book: 'Jeremiah', chapter: 29, verse: 11, text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.' },
  { book: 'Psalms', chapter: 119, verse: 105, text: 'Thy word is a lamp unto my feet, and a light unto my path.' },
  { book: 'Matthew', chapter: 11, verse: 28, text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.' },
  { book: 'Romans', chapter: 12, verse: 2, text: 'And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.' },
];

function getVerseOfTheDay(): typeof VERSE_OF_THE_DAY[number] {
  const today = new Date();
  const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % VERSE_OF_THE_DAY.length;
  return VERSE_OF_THE_DAY[dayIndex];
}

export function SearchPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const { data: results = [], isLoading } = useBibleSearch(searchQuery);
  const searchBarRef = useRef<SearchBarHandle>(null);
  const navigate = useNavigate();
  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  const addBookmark = useBookmarkStore((state) => state.addBookmark);
  const removeBookmark = useBookmarkStore((state) => state.removeBookmark);

  const debouncedSearch = useDebounce((query: string) => {
    setSearchQuery(query);
    setFocusedIndex(-1);
  }, 300);

  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchQuery('');
      setFocusedIndex(-1);
      return;
    }
    debouncedSearch(query);
  }, [debouncedSearch]);

  const handleSuggestedSearch = useCallback((query: string): void => {
    searchBarRef.current?.setValue(query);
    searchBarRef.current?.focus();
    handleSearch(query);
  }, [handleSearch]);

  const handleToggleFocusedBookmark = useCallback((): void => {
    if (focusedIndex < 0 || focusedIndex >= results.length) return;

    const result = results[focusedIndex];
    const reference = `${result.book} ${result.chapter}:${result.verse}`;
    const existingBookmark = bookmarks.find((bookmark) => bookmark.reference === reference);

    if (existingBookmark) {
      removeBookmark(existingBookmark.id);
      toast.success('Bookmark removed');
      return;
    }

    addBookmark(result.text, reference);
    toast.success('Verse bookmarked');
  }, [addBookmark, bookmarks, focusedIndex, removeBookmark, results]);

  const verseOfTheDay = getVerseOfTheDay();

  useKeyboardShortcuts({
    onFocusSearch: () => searchBarRef.current?.focus(),
    onNavigateDown: () => {
      setFocusedIndex((prev) => Math.min(prev + 1, results.length - 1));
    },
    onNavigateUp: () => {
      setFocusedIndex((prev) => Math.max(prev - 1, -1));
    },
    onToggleBookmark: handleToggleFocusedBookmark,
    onEscape: () => {
      setFocusedIndex(-1);
      searchBarRef.current?.focus();
    },
    onOpenResult: () => {
      if (focusedIndex >= 0 && focusedIndex < results.length) {
        const result = results[focusedIndex];
        navigate({
          to: '/read/$book/$chapter',
          params: { book: bookToSlug(result.book), chapter: String(result.chapter) },
        });
      }
    },
  });

  const showEmptyState = !searchQuery && !isLoading;

  return (
    <AnimatedPage>
      <div>
        <section className="text-center py-12 md:py-20">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Search the KJV Bible
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Search by keyword or jump straight to a reference.
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar ref={searchBarRef} onSearch={handleSearch} loading={isLoading} />
          </div>
          <div className="hidden md:flex max-w-xl mx-auto justify-end mt-3">
            <KeyboardHints />
          </div>
        </section>

        <div className="mt-8">
          {showEmptyState && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <p className="text-xs font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider mb-3">
                  Verse of the Day
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                  {verseOfTheDay.text}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  — {verseOfTheDay.book} {verseOfTheDay.chapter}:{verseOfTheDay.verse}
                </p>
              </div>
              <EmptyState
                icon="search"
                title="Start exploring"
                description="Search by reference (e.g., John 3:16) or keywords to find verses."
                chips={POPULAR_SEARCHES.map((search) => ({
                  label: search,
                  onClick: () => handleSuggestedSearch(search),
                }))}
              />
            </div>
          )}

          {(searchQuery || isLoading) && (
            <SearchResults
              results={results}
              loading={isLoading}
              focusedIndex={focusedIndex}
              onBookmarkToggle={() => setFocusedIndex(-1)}
              onSuggestedSearch={handleSuggestedSearch}
            />
          )}
        </div>
      </div>
    </AnimatedPage>
  );
}
