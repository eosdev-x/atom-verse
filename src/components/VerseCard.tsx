import { forwardRef } from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Bookmark, Share2, BookmarkCheck, Copy } from 'lucide-react';
import { useBookmarkStore } from '../store/bookmarkStore';
import { bookToSlug } from '../utils/db';
import { easing } from '../utils/animations';
import toast from 'react-hot-toast';

interface VerseCardProps {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  isFocused?: boolean;
  useSerif?: boolean;
  onBookmarkToggle?: () => void;
}

export const VerseCard = forwardRef<HTMLDivElement, VerseCardProps>(
  function VerseCard({ book, chapter, verse, text, isFocused, useSerif = false, onBookmarkToggle }, ref) {
    const reference = `${book} ${chapter}:${verse}`;
    const { bookmarks, addBookmark, removeBookmark } = useBookmarkStore();
    const isBookmarked = bookmarks.some((b) => b.reference === reference);

    const handleShare = async (): Promise<void> => {
      const shareText = `${reference} - ${text}`;

      try {
        if (navigator.share) {
          await navigator.share({ title: reference, text: shareText });
          toast.success('Verse shared successfully');
        } else {
          await navigator.clipboard.writeText(shareText);
          toast.success('Verse copied to clipboard');
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        try {
          await navigator.clipboard.writeText(shareText);
          toast.success('Verse copied to clipboard');
        } catch {
          toast.error('Unable to share or copy verse');
        }
      }
    };

    const toggleBookmark = (): void => {
      if (isBookmarked) {
        const bookmark = bookmarks.find((b) => b.reference === reference);
        if (bookmark) {
          removeBookmark(bookmark.id);
          toast.success(
            (t) => (
              <div className="flex items-center gap-3">
                <span>Bookmark removed</span>
                <motion.button
                  onClick={() => {
                    useBookmarkStore.getState().undoRemove(bookmark.id);
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
        }
      } else {
        addBookmark(text, reference);
        toast.success(
          (t) => (
            <div className="flex items-center gap-3">
              <span>Verse bookmarked</span>
              <motion.button
                onClick={() => {
                  toast.dismiss(t.id);
                }}
                className="px-2 py-1 text-xs font-medium rounded
                           bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                           hover:bg-gray-300 dark:hover:bg-gray-600
                           transition-colors duration-200"
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.1 }}
              >
                View
              </motion.button>
            </div>
          ),
          { duration: 3000 },
        );
      }
      onBookmarkToggle?.();
    };

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
        transition={{ duration: 0.25, ease: easing.out }}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6
                    hover:shadow-lg transition-shadow duration-200
                    ${isFocused
                      ? 'ring-2 ring-blue-500 dark:ring-blue-400 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-900 shadow-lg'
                      : ''}`}
      >
        <Link
          to="/read/$book/$chapter"
          params={{ book: bookToSlug(book), chapter: String(chapter) }}
          className="inline-block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                     focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3
                        hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {reference}
          </h3>
        </Link>
        <p className={`text-gray-700 dark:text-gray-300 mb-4 leading-relaxed ${useSerif ? 'font-serif' : ''}`}>
          {text}
        </p>
        <div className="flex justify-end space-x-3">
          <motion.button
            onClick={toggleBookmark}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
                       transition-colors duration-200 min-w-[44px] min-h-[44px]
                       flex items-center justify-center focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                       dark:focus-visible:ring-offset-gray-900"
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.1 }}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5 text-amber-500" />
            ) : (
              <Bookmark className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </motion.button>
          <motion.button
            onClick={handleShare}
            aria-label={navigator.share ? 'Share verse' : 'Copy verse'}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
                       transition-colors duration-200 min-w-[44px] min-h-[44px]
                       flex items-center justify-center focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                       dark:focus-visible:ring-offset-gray-900"
            title={navigator.share ? 'Share verse' : 'Copy verse'}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.1 }}
          >
            {navigator.share ? (
              <Share2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <Copy className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </motion.button>
        </div>
      </motion.div>
    );
  },
);
