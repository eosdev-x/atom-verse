import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Trash2 } from 'lucide-react';
import { useBookmarkStore } from '../store/bookmarkStore';
import { EmptyState } from '../components/EmptyState';
import { AnimatedPage } from '../components/AnimatedPage';
import toast from 'react-hot-toast';

export function BookmarksPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const { bookmarks, removeBookmark } = useBookmarkStore();
  const filteredBookmarks = useMemo(() => {
    const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);

    if (searchTerms.length === 0) {
      return bookmarks;
    }

    return bookmarks.filter((bookmark) => {
      const content = `${bookmark.reference} ${bookmark.verse}`.toLowerCase();
      return searchTerms.every((term) => content.includes(term));
    });
  }, [bookmarks, searchQuery]);

  const handleRemove = (bookmarkId: string, reference: string): void => {
    removeBookmark(bookmarkId);
    toast.success(
      (t) => (
        <div className="flex items-center gap-3">
          <span>{reference} removed</span>
          <motion.button
            onClick={() => {
              useBookmarkStore.getState().undoRemove(bookmarkId);
              toast.dismiss(t.id);
              toast.success('Bookmark restored');
            }}
            className="px-2 py-1 text-xs font-medium rounded
                       bg-blue-500 text-white hover:bg-blue-600
                       transition-colors duration-200"
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.1 }}
          >
            Undo
          </motion.button>
        </div>
      ),
      { duration: 5000 },
    );
  };

  return (
    <AnimatedPage>
      <div>
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Bookmarks
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Saved verses are persisted locally in this browser.
            </p>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap pt-1">
            {bookmarks.length} saved
          </span>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border border-gray-200 dark:border-gray-700
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       placeholder:text-gray-400 dark:placeholder:text-gray-500
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       min-h-[44px] transition-colors duration-200"
          />
        </div>

        {filteredBookmarks.length === 0 ? (
          searchQuery ? (
            <EmptyState
              icon="search"
              title="No matching bookmarks"
              description={`No bookmarks match "${searchQuery}". Try a different search term.`}
            />
          ) : (
            <EmptyState
              icon="bookmark"
              title="No bookmarks yet"
              description="Start bookmarking verses to see them here."
              action={{ label: 'Search verses', to: '/' }}
            />
          )
        ) : (
          <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            <AnimatePresence mode="popLayout">
              {filteredBookmarks.map((bookmark) => (
                <motion.article
                  key={bookmark.id}
                  layout
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 relative group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {bookmark.reference}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed pr-10">
                    {bookmark.verse}
                  </p>
                  <motion.button
                    onClick={() => handleRemove(bookmark.id, bookmark.reference)}
                    className="absolute top-4 right-4 p-2 rounded-full
                               hover:bg-red-50 dark:hover:bg-red-950
                               transition-colors duration-200
                               min-w-[44px] min-h-[44px] flex items-center justify-center
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500
                               focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                    title="Remove bookmark"
                    aria-label={`Remove ${bookmark.reference}`}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </motion.button>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
